from __future__ import annotations

import json
import os
import re
from datetime import datetime
from typing import Any

from .checkpoints import load_checkpoint, reset_checkpoint, save_checkpoint
from .retention_agent import RETENTION_EVALUATOR_PROMPT, fallback_retention_report, last_studied_at, retention_markdown
from .tools import LESSON_DIR, due_reviews, review_sessions

ACTION_TOOL = [{"type": "function", "function": {"name": "choose_learning_action", "description": "Chọn hành động học tiếp theo dựa trên câu trả lời teacher và context chunk hiện tại.", "parameters": {"type": "object", "properties": {"action": {"type": "string", "enum": ["DEEPEN", "ADVANCE", "REDIRECT"]}, "input_status": {"type": "string", "enum": ["ON_TOPIC", "COUNTER_QUESTION", "OFF_TOPIC", "TOO_SHORT"]}, "answer_quality": {"type": "string", "enum": ["good", "needs_clarification", "incorrect", "not_assessable"]}, "topic": {"type": "string"}, "reasoning_summary": {"type": "string"}}, "required": ["action", "input_status", "answer_quality", "topic", "reasoning_summary"], "additionalProperties": False}}}]

ACTION_PROMPT = """Bạn là bộ điều phối ReAct của Feynman Student Agent.
Bạn chỉ nhận một CURRENT_CONTEXT_CHUNK, không phải toàn bộ bài. Đọc CURRENT_QUESTION, dialogue và đánh giá câu trả lời gần nhất của teacher theo chunk hiện tại.
Trước tiên phải kiểm tra guardrail:
- COUNTER_QUESTION: teacher hỏi ngược lại agent/thay đổi vai, thay vì trả lời CURRENT_QUESTION.
- OFF_TOPIC: nội dung không trả lời CURRENT_QUESTION hoặc không liên quan chunk hiện tại.
- TOO_SHORT: chỉ vài từ, không có giải thích.
Với ba trạng thái trên, bắt buộc action=REDIRECT. Không đánh giá đúng/sai, không đọc context mới và không trả lời câu hỏi ngược của teacher.
Gọi function choose_learning_action:
- DEEPEN nếu teacher sai, mơ hồ, thiếu cơ chế/lập luận/ví dụ; agent phải hỏi xoáy cùng kiến thức và KHÔNG đọc context mới.
- ADVANCE chỉ nếu teacher giải thích đúng, rõ, có đủ ý chính; agent được phép chuyển sang chunk kế tiếp.
reasoning_summary là một câu ngắn nêu bằng chứng, không viết chain-of-thought."""

QUESTION_PROMPT = """Bạn là học sinh Feynman đang hỏi teacher. Chỉ dùng CURRENT_CONTEXT_CHUNK bên dưới.
Đặt đúng MỘT câu hỏi tiếng Việt, xưng em/thầy-cô. Câu hỏi phải kiểm tra giải thích bản chất bằng ngôn ngữ đơn giản và ví dụ/tình huống. Không tóm tắt bài, không hỏi chung chung, không giảng thay teacher.
Nếu ACTION=DEEPEN, hỏi xoáy duy nhất lỗ hổng đang có. Nếu ACTION=ADVANCE, chọn một khái niệm nền tảng trong chunk mới. Tối đa 55 từ."""

FINAL_PROMPT = """Bạn là Feynman Student Agent kết thúc phiên. Chỉ đọc toàn bộ DIALOGUE, không cần đọc thêm bài giảng.
Đánh giá dựa trên bằng chứng trong câu trả lời: điều đã hiểu tốt, lỗ hổng, và 3 câu hỏi ôn tiếp. Đúng định dạng Markdown:
## Đánh giá sau N_LOOP lượt
**Mức độ nắm kiến thức:** ...
**Điểm đã hiểu tốt:**
- ...
**Điểm còn cần làm rõ:**
- ...
**Nhận xét Feynman:** ...
**Câu hỏi ôn tiếp theo:**
1. ...
2. ...
3. ..."""


def read_lesson_chunk(lesson_id: str, cursor: int = 0, budget: int = 1800) -> dict[str, Any]:
    filename = f"DAY{lesson_id.split()[-1]}.md"
    text = (LESSON_DIR / filename).read_text(encoding="utf-8")
    cursor = max(0, min(cursor, len(text)))
    end = min(len(text), cursor + budget)
    # Prefer a paragraph boundary so chunks retain a coherent unit of meaning.
    boundary = text.rfind("\n\n", cursor, end)
    if boundary > cursor + 500:
        end = boundary
    content = text[cursor:end].strip()
    return {"lesson_id": lesson_id, "cursor": cursor, "next_cursor": end, "content": content, "done": end >= len(text), "file": str(LESSON_DIR / filename)}


def _provider_configured() -> bool:
    return bool(os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY"))


def _model_name() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini") if os.getenv("OPENAI_API_KEY") else os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")


def _client() -> Any:
    from openai import OpenAI
    if os.getenv("OPENAI_API_KEY"):
        return OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    return OpenAI(api_key=os.environ["OPENROUTER_API_KEY"], base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"))


def _model_action(history: list[dict[str, str]], chunk: str) -> dict[str, str]:
    latest = next((item["content"] for item in reversed(history) if item["role"] == "user"), "")
    current_question = next((item["content"] for item in reversed(history) if item["role"] == "assistant"), "")
    if not _provider_configured():
        if "?" in latest or len(latest.split()) < 5:
            return {"action": "REDIRECT", "input_status": "COUNTER_QUESTION" if "?" in latest else "TOO_SHORT", "answer_quality": "not_assessable", "topic": "current chunk", "reasoning_summary": "Cần câu trả lời trực tiếp cho câu hỏi hiện tại trước khi tiếp tục."}
        quality = "good" if len(latest.split()) >= 24 and any(token in latest.lower() for token in ("vì", "do", "nên", "ví dụ")) else "needs_clarification"
        return {"action": "ADVANCE" if quality == "good" else "DEEPEN", "input_status": "ON_TOPIC", "answer_quality": quality, "topic": "current chunk", "reasoning_summary": "Fallback đánh giá độ đầy đủ của lời giải thích và ví dụ."}
    try:
        response = _client().chat.completions.create(model=_model_name(), temperature=0.1, messages=[{"role": "system", "content": ACTION_PROMPT}, {"role": "user", "content": f"CURRENT_QUESTION:\n{current_question}\n\nCURRENT_CONTEXT_CHUNK:\n{chunk}\n\nDIALOGUE:\n{json.dumps(history, ensure_ascii=False)}"}], tools=ACTION_TOOL, tool_choice={"type": "function", "function": {"name": "choose_learning_action"}})
        call = response.choices[0].message.tool_calls[0]
        return json.loads(call.function.arguments)
    except Exception:
        quality = "good" if len(latest.split()) >= 24 and any(token in latest.lower() for token in ("vì", "do", "nên", "ví dụ")) else "needs_clarification"
        if "?" in latest or len(latest.split()) < 5:
            return {"action": "REDIRECT", "input_status": "COUNTER_QUESTION" if "?" in latest else "TOO_SHORT", "answer_quality": "not_assessable", "topic": "current chunk", "reasoning_summary": "Cần câu trả lời trực tiếp cho câu hỏi hiện tại trước khi tiếp tục."}
        return {"action": "ADVANCE" if quality == "good" else "DEEPEN", "input_status": "ON_TOPIC", "answer_quality": quality, "topic": "current chunk", "reasoning_summary": "Provider không khả dụng; fallback đánh giá độ đầy đủ của lời giải thích và ví dụ."}


def _model_question(action: str, chunk: str, hint: str) -> str:
    if action == "REDIRECT":
        return "Em xin phép giữ vai học sinh nhé. Thầy/cô hãy trả lời trực tiếp câu hỏi ngay phía trên bằng lời của mình; sau đó em sẽ đánh giá và hỏi tiếp." 
    if not _provider_configured():
        if action == "DEEPEN":
            return "Em vẫn chưa thấy rõ vì sao ý thầy/cô vừa nói dẫn đến kết luận đó. Thầy/cô nối hai bước ấy lại bằng một ví dụ cụ thể được không?"
        first_line = next((line for line in chunk.splitlines() if line.strip()), "phần kiến thức này")
        return f"Em vừa đọc phần “{first_line[:70]}”. Thầy/cô giải thích giúp em ý này bằng lời đơn giản và một ví dụ đời thường được không?"
    try:
        response = _client().chat.completions.create(model=_model_name(), temperature=0.25, messages=[{"role": "system", "content": QUESTION_PROMPT}, {"role": "user", "content": f"ACTION={action}\nHINT={hint}\nCURRENT_CONTEXT_CHUNK:\n{chunk}"}])
        return response.choices[0].message.content or "Thầy/cô giải thích giúp em phần này bằng ví dụ được không?"
    except Exception:
        if action == "DEEPEN":
            return "Em vẫn chưa thấy rõ vì sao ý thầy/cô vừa nói dẫn đến kết luận đó. Thầy/cô nối hai bước ấy lại bằng một ví dụ cụ thể được không?"
        first_line = next((line for line in chunk.splitlines() if line.strip()), "phần kiến thức này")
        return f"Em vừa đọc phần “{first_line[:70]}”. Thầy/cô giải thích giúp em ý này bằng lời đơn giản và một ví dụ đời thường được không?"


def _final_evaluation(history: list[dict[str, str]], n_loop: int, lesson_id: str, now: str | None, studied: str) -> tuple[str, dict[str, Any]]:
    report = fallback_retention_report(lesson_id, studied, now, history)
    if _provider_configured():
        try:
            response = _client().chat.completions.create(model=_model_name(), temperature=0.1, messages=[{"role": "system", "content": FINAL_PROMPT}, {"role": "user", "content": f"N_LOOP={n_loop}\nDIALOGUE:\n{json.dumps(history, ensure_ascii=False)}"}])
            base = response.choices[0].message.content or ""
            retention = _client().chat.completions.create(model=_model_name(), temperature=0.1, messages=[{"role": "system", "content": RETENTION_EVALUATOR_PROMPT}, {"role": "user", "content": f"LAST_STUDIED_AT={studied}\nNOW={now}\nDIALOGUE:\n{json.dumps(history, ensure_ascii=False)}"}])
            report = json.loads((retention.choices[0].message.content or "{}").replace("```json", "").replace("```", "").strip())
            return f"{base}{retention_markdown(report)}", report
        except Exception:
            pass
    base = f"## Đánh giá sau {n_loop} lượt\n\n**Mức độ nắm kiến thức:** {report['memory_level']}\n\n**Điểm đã hiểu tốt:**\n- {report['strong_concepts'][0] if report['strong_concepts'] else 'Chưa đủ evidence.'}\n\n**Điểm còn cần làm rõ:**\n- {report['forgotten_or_fragile_concepts'][0]['concept']}\n\n**Nhận xét Feynman:** Đánh giá dựa trên dialogue hiện có.\n\n**Câu hỏi ôn tiếp theo:**\n1. Giải thích lại ý chính bằng ví dụ.\n2. Nêu cơ chế hoặc quan hệ nhân quả.\n3. So sánh với khái niệm gần nhất."
    return f"{base}{retention_markdown(report)}", report


def run_react_turn(payload: dict[str, Any]) -> dict[str, Any]:
    lesson_id, session_id = payload["lesson_id"], payload["session_id"]
    mode, loop, n_loop = payload.get("mode", "SCHEDULED"), payload.get("loop", 0), payload.get("n_loop", 5)
    history = payload.get("history", [])
    now = payload.get("now")
    current_loop = loop + (1 if mode == "SCHEDULED" else 0)
    manual_session = bool(payload.get("manual_session")) or mode == "MANUAL_START"
    due = next((item for item in due_reviews(now) if item["lesson_id"] == lesson_id), None)
    if not due and not manual_session:
        next_due = next((item for item in review_sessions(now) if item["lesson_id"] == lesson_id and not item["is_due"]), None)
        return {"message": "Chưa đến lịch ôn, em sẽ không đọc bài giảng hoặc gọi model để tiết kiệm token.", "waiting_for_schedule": True, "next_due_at": next_due["due_at"] if next_due else None, "done": False, "loop": loop, "prompt_stage": "schedule_gate", "tool_trace": []}

    studied = payload.get("last_studied_at") or last_studied_at(lesson_id)
    if current_loop >= n_loop:
        message, retention = _final_evaluation(history, n_loop, lesson_id, now, studied)
        return {"message": message, "retention_report": retention, "done": True, "loop": current_loop, "prompt_stage": "retention_evaluation", "tool_trace": [{"type": "THINK", "summary": "N_LOOP reached; evaluate dialogue without reading more lesson context."}]}

    if mode in {"START", "MANUAL_START"}:
        reset_checkpoint(session_id)
    state = load_checkpoint(session_id)
    trace: list[dict[str, Any]] = []
    if not state or state.get("lesson_id") != lesson_id:
        chunk = read_lesson_chunk(lesson_id, 0)
        state = {"lesson_id": lesson_id, "cursor": chunk["cursor"], "next_cursor": chunk["next_cursor"], "chunk": chunk["content"], "completed_topics": []}
        trace.append({"type": "ACTION", "name": "read_lesson_chunk", "cursor": 0, "next_cursor": chunk["next_cursor"], "chars": len(chunk["content"])})
        action = {"action": "ADVANCE", "answer_quality": None, "topic": "first chunk", "reasoning_summary": "Start session: read only the first context chunk."}
    else:
        action = _model_action(history, state["chunk"])
        trace.append({"type": "THINK", "name": "choose_learning_action", **action})
        if action["action"] == "ADVANCE" and state["next_cursor"] > state["cursor"]:
            state["completed_topics"].append(action.get("topic", "current chunk"))
            chunk = read_lesson_chunk(lesson_id, state["next_cursor"])
            state.update({"cursor": chunk["cursor"], "next_cursor": chunk["next_cursor"], "chunk": chunk["content"]})
            trace.append({"type": "ACTION", "name": "read_lesson_chunk", "cursor": chunk["cursor"], "next_cursor": chunk["next_cursor"], "chars": len(chunk["content"])})

    question = _model_question(action["action"], state["chunk"], action.get("reasoning_summary", ""))
    save_checkpoint(session_id, state)
    guardrail = None
    if action.get("action") == "REDIRECT":
        input_status = action.get("input_status", "OFF_TOPIC")
        guardrail = {"code": input_status, "message": "Câu trả lời chưa bám đúng câu hỏi hiện tại. Agent giữ nguyên kiến thức và chờ bạn trả lời lại."}
    return {"message": question, "done": False, "loop": current_loop, "prompt_stage": "feynman_question", "answer_quality": action.get("answer_quality"), "thinking_summary": action.get("reasoning_summary"), "guardrail": guardrail, "checkpoint": {"cursor": state["cursor"], "next_cursor": state["next_cursor"], "completed_topics": state["completed_topics"]}, "tool_trace": trace}
