from __future__ import annotations

import json
import os
import asyncio
from pathlib import Path
from typing import Any, Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .logger import LOG_FILE, log_turn
from .prompts import EVALUATION_PROMPT, FIRST_QUESTION_PROMPT, FOLLOW_UP_PROMPT
from .retention_agent import RETENTION_EVALUATOR_PROMPT, fallback_retention_report, last_studied_at, retention_markdown
from .react_agent import run_react_turn
from .tools import TOOL_DEFINITIONS, due_reviews, execute_tool, read_lesson, review_sessions

ROOT = Path(__file__).resolve().parents[1]
GRAPH_PATH = ROOT / "src" / "graph" / "day1.json"
FALLBACK_FIRST_QUESTIONS = {
    "DAY 1": "Em đang hơi lẫn giữa Generative AI và Agentic AI. Thầy/cô giải thích giúp em vì sao Agentic AI không chỉ tạo nội dung mà còn đi theo chuỗi Goal → Plan → Action, bằng một ví dụ đời thường được không?",
    "DAY 2": "Em chưa hiểu vì sao phải tìm đúng vấn đề trước khi xây giải pháp AI. Thầy/cô giải thích Double Diamond giúp em bằng một ví dụ về yêu cầu người dùng ban đầu nhưng vấn đề gốc lại khác được không?",
    "DAY 3": "Em vẫn lẫn giữa LLM Chatbot và Reactive Agent. Thầy/cô giải thích khác nhau ở việc dùng công cụ và vòng lặp quan sát bằng một tình huống thực tế được không?",
    "DAY 4": "Em muốn hiểu RTCF như một công cụ thực hành. Thầy/cô giải thích vì sao một prompt cụ thể về Task và Format thường ổn định hơn prompt nghe có vẻ thông minh nhưng mơ hồ, bằng ví dụ được không?",
    "DAY 5": "Em chưa rõ vì sao một Agent thông minh vẫn có thể thất bại như sản phẩm. Thầy/cô giải thích sự khác nhau giữa ‘build the wrong thing’ và ‘build the thing wrong’ bằng một ví dụ được không?",
}


def load_dotenv() -> None:
    path = ROOT / ".env"
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        if "=" not in raw or raw.lstrip().startswith("#"):
            continue
        key, value = raw.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_dotenv()
app = FastAPI(title="Feynman Student ReAct Agent", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])


class ChatItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class FeynmanRequest(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid4()))
    lesson_id: Literal["DAY 1", "DAY 2", "DAY 3", "DAY 4", "DAY 5"]
    mode: Literal["START", "MANUAL_START", "SCHEDULED"] = "SCHEDULED"
    loop: int = Field(default=0, ge=0)
    n_loop: int = Field(default=5, ge=1, le=20)
    history: list[ChatItem] = Field(default_factory=list)
    now: str | None = Field(default=None, description="ISO datetime; intended for deterministic tests only")
    last_studied_at: str | None = Field(default=None, description="YYYY-MM-DD; defaults to the lesson schedule")
    manual_session: bool = Field(default=False, description="Manual sessions bypass only the time gate.")


def local_result(lesson_id: str, current_loop: int, n_loop: int, now_text: str | None = None, history: list[dict[str, str]] | None = None, last_studied: str | None = None) -> dict[str, Any]:
    lesson = read_lesson(lesson_id)
    trace = [{"name": "read_lesson", "args": {"lesson_id": lesson_id}, "result": {"file": lesson["file"], "chars": len(lesson["content"])}}]
    if current_loop >= n_loop:
        retention_report = fallback_retention_report(lesson_id, last_studied or last_studied_at(lesson_id), now_text, history or [])
        message = f"## Đánh giá sau {n_loop} lượt\n\n**Mức độ nắm kiến thức:** Tạm hiểu\n\n**Điểm đã hiểu tốt:**\n- Đã thực hành giải thích lại kiến thức bằng lời của mình.\n\n**Điểm còn cần làm rõ:**\n- Chưa có model để đối chiếu chính xác câu trả lời với context bài giảng.\n\n**Nhận xét Feynman:** Agent đã đọc đúng {lesson_id}; hãy cấu hình OPENROUTER_API_KEY để nhận đánh giá sâu theo từng ý.\n\n**Câu hỏi ôn tiếp theo:**\n1. Ý chính của bài là gì?\n2. Ví dụ đời thường nào minh họa rõ nhất?\n3. Khái niệm này có giới hạn nào?" + retention_markdown(retention_report)
        return {"message": message, "retention_report": retention_report, "done": True, "loop": current_loop, "prompt_stage": "evaluation", "tool_trace": trace, "thinking_summary": "Đạt giới hạn N_LOOP nên chuyển sang Retention Evaluator."}
    stage = "first_question" if current_loop == 0 else "follow_up"
    question = FALLBACK_FIRST_QUESTIONS[lesson_id] if current_loop == 0 else f"Em muốn hiểu sâu hơn. Thầy/cô nối phần vừa giải thích với một khái niệm khác trong {lesson_id} được không?"
    return {"message": question, "concept": "concept selected from lesson context" if current_loop == 0 else None, "source_evidence": lesson["file"] if current_loop == 0 else None, "question_type": "explain_with_example" if current_loop == 0 else "follow_up", "done": False, "loop": current_loop, "prompt_stage": stage, "answer_quality": "needs_clarification" if current_loop else None, "thinking_summary": "Đã đọc context bài giảng qua tool read_lesson.", "tool_trace": trace}


def provider_turn(system_prompt: str, user_prompt: str, lesson_id: str) -> tuple[str, list[dict[str, Any]]]:
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RuntimeError("Thiếu package openai. Chạy: pip install -r requirements.txt") from exc
    client = OpenAI(api_key=os.environ["OPENROUTER_API_KEY"], base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"))
    messages: list[dict[str, Any]] = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
    trace: list[dict[str, Any]] = []
    for round_index in range(4):
        response = client.chat.completions.create(model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"), temperature=0.2, messages=messages, tools=TOOL_DEFINITIONS, tool_choice={"type": "function", "function": {"name": "read_lesson"}} if round_index == 0 else "auto")
        message = response.choices[0].message
        if not message.tool_calls:
            return message.content or "", trace
        messages.append(message.model_dump(exclude_none=True))
        for call in message.tool_calls:
            args = json.loads(call.function.arguments or "{}")
            # The scheduler chose this exact lesson. The model may decide to
            # call the tool, but it cannot silently switch to another DAY.
            if call.function.name == "read_lesson":
                args = {"lesson_id": lesson_id}
            try:
                result = execute_tool(call.function.name, args)
            except Exception as exc:
                result = {"error": type(exc).__name__, "message": str(exc)}
            trace.append({"name": call.function.name, "args": args, "result": result})
            messages.append({"role": "tool", "tool_call_id": call.id, "content": json.dumps(result, ensure_ascii=False)})
    raise RuntimeError("Agent exceeded 4 tool rounds")


def parse_json(text: str) -> dict[str, Any] | None:
    try:
        return json.loads(text.removeprefix("```json").removesuffix("```").strip())
    except json.JSONDecodeError:
        return None


def run_agent(payload: FeynmanRequest) -> dict[str, Any]:
    current_loop = payload.loop + (1 if payload.mode == "SCHEDULED" else 0)
    due_session = next((item for item in due_reviews(payload.now) if item["lesson_id"] == payload.lesson_id), None)
    if not due_session:
        next_session = next((item for item in review_sessions(payload.now) if item["lesson_id"] == payload.lesson_id and not item["is_due"]), None)
        return {"message": "Chưa đến lịch ôn của bài này, nên em chưa đọc bài giảng để tiết kiệm token.", "waiting_for_schedule": True, "next_due_at": next_session["due_at"] if next_session else None, "done": False, "loop": payload.loop, "prompt_stage": "schedule_gate", "thinking_summary": "Schedule gate chặn trước read_lesson và model call.", "tool_trace": []}
    if not os.getenv("OPENROUTER_API_KEY"):
        return local_result(payload.lesson_id, current_loop, payload.n_loop, payload.now, [item.model_dump() for item in payload.history], payload.last_studied_at)
    stage = "first_question" if current_loop == 0 else "evaluation" if current_loop >= payload.n_loop else "follow_up"
    prompt = {"first_question": FIRST_QUESTION_PROMPT, "follow_up": FOLLOW_UP_PROMPT, "evaluation": EVALUATION_PROMPT}[stage]
    history = "\n".join(f"{item.role}: {item.content}" for item in payload.history[-12:])
    task = "Đặt đúng một câu hỏi mới." if stage != "evaluation" else "Đánh giá toàn bộ phiên theo định dạng được yêu cầu."
    try:
        raw, trace = provider_turn(prompt, f"LESSON_ID: {payload.lesson_id}\nHISTORY:\n{history}\n\n{task}", payload.lesson_id)
    except Exception as exc:
        # Keep the scheduled learning flow usable if a provider key is absent
        # or rejected; the response remains explicitly marked as local.
        fallback = local_result(payload.lesson_id, current_loop, payload.n_loop, payload.now, [item.model_dump() for item in payload.history], payload.last_studied_at)
        fallback["provider_error"] = f"{type(exc).__name__}: {exc}"
        fallback["thinking_summary"] = "Provider không khả dụng; agent dùng fallback cục bộ sau khi schedule gate đã cho phép đọc bài."
        return fallback
    parsed = parse_json(raw)
    result = parsed if parsed is not None else {"message": raw}
    if stage == "evaluation":
        studied = payload.last_studied_at or last_studied_at(payload.lesson_id)
        retention_prompt = f"LAST_STUDIED_AT: {studied}\nNOW: {payload.now or 'current time'}\nDIALOGUE:\n{history}\n\nHãy tạo retention report JSON."
        try:
            retention_raw, retention_trace = provider_turn(RETENTION_EVALUATOR_PROMPT, retention_prompt, payload.lesson_id)
            retention_report = parse_json(retention_raw) or fallback_retention_report(payload.lesson_id, studied, payload.now, [item.model_dump() for item in payload.history])
            result["retention_report"] = retention_report
            result["message"] = f"{result.get('message', '')}{retention_markdown(retention_report)}"
            trace.extend(retention_trace)
        except Exception:
            retention_report = fallback_retention_report(payload.lesson_id, studied, payload.now, [item.model_dump() for item in payload.history])
            result["retention_report"] = retention_report
            result["message"] = f"{result.get('message', '')}{retention_markdown(retention_report)}"
    result.update({"loop": current_loop, "done": stage == "evaluation" or bool(result.get("done")), "prompt_stage": stage, "tool_trace": trace, "local": False})
    return result


def flatten_graph(source: dict[str, Any]) -> dict[str, Any]:
    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, str]] = []
    def walk(item: dict[str, Any], parent_id: str | None = None, depth: int = 0) -> None:
        children = item.get("children", [])
        node = {"id": item["id"], "parentId": parent_id, "label": item["label"], "eyebrow": "DAY 1 · CORE" if depth == 0 else f"D{depth} · BRANCH", "caption": item.get("detail", item.get("clue", "")), "question": item.get("clue", f"Hãy giải thích lại {item['label']}"), "depth": depth, "x": 425 if depth == 0 else 35 + (len(nodes) % 6) * 135, "y": 245 if depth == 0 else 100 + (len(nodes) % 4) * 110, "width": 250 if depth == 0 else 225, "height": 112 if depth == 0 else 88, "childrenCount": len(children), "hasChildren": bool(children), "isLeaf": not children}
        nodes.append(node)
        if parent_id: edges.append({"source": parent_id, "target": node["id"]})
        for child in children: walk(child, node["id"], depth + 1)
    walk(source["root"])
    return {"id": "day1-foundation", "title": "AI & LLM Foundation", "rootId": source["root"]["id"], "nodes": nodes, "edges": edges}


def run_agent(payload: FeynmanRequest) -> dict[str, Any]:
    """Primary ReAct controller: incremental context + checkpoint + retention agent."""
    return run_react_turn(payload.model_dump())


@app.get("/health")
def health() -> dict[str, Any]:
    provider = "openai" if os.getenv("OPENAI_API_KEY") else "openrouter" if os.getenv("OPENROUTER_API_KEY") else None
    return {"ok": True, "provider_configured": bool(provider), "provider": provider, "lesson_directory": str((ROOT / "data" / "vlearn-pack" / "BÀI GIẢNG"))}


@app.get("/api/schedule")
def schedule(now: str | None = None) -> dict[str, Any]:
    return {"review_time": "19:30 Asia/Bangkok", "sessions": due_reviews(now)}


@app.post("/api/feynman")
def feynman(payload: FeynmanRequest) -> dict[str, Any]:
    request = payload.model_dump()
    try:
        result = run_agent(payload)
        log_turn(request, result)
        return result
    except Exception as exc:
        error = {"error": f"{type(exc).__name__}: {exc}"}
        log_turn(request, {"loop": payload.loop, "tool_trace": [], "done": False}, error["error"])
        raise HTTPException(status_code=502, detail=error) from exc


@app.post("/api/feynman/stream")
async def feynman_stream(payload: FeynmanRequest) -> StreamingResponse:
    """SSE UX stream: expose controller status immediately, then progressively render its answer."""
    async def events():
        yield "event: status\ndata: {\"phase\":\"thinking\",\"message\":\"Minh đang đọc checkpoint và chọn bước tiếp theo…\"}\n\n"
        try:
            result = await asyncio.to_thread(run_agent, payload)
            metadata = {key: value for key, value in result.items() if key != "message"}
            yield f"event: meta\ndata: {json.dumps(metadata, ensure_ascii=False)}\n\n"
            message = result.get("message", "")
            for index in range(0, len(message), 14):
                yield f"event: token\ndata: {json.dumps({'text': message[index:index + 14]}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.018)
            log_turn(payload.model_dump(), result)
            yield "event: done\ndata: {}\n\n"
        except Exception as exc:
            yield f"event: error\ndata: {json.dumps({'message': str(exc)}, ensure_ascii=False)}\n\n"
    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.get("/api/agent-log")
def agent_log() -> dict[str, str]:
    return {"file": str(LOG_FILE)}


@app.get("/api/graphs/day1")
def graph_day1() -> dict[str, Any]:
    graph = flatten_graph(json.loads(GRAPH_PATH.read_text(encoding="utf-8")))
    root_id = graph["rootId"]
    visible = [node for node in graph["nodes"] if node["id"] == root_id or node["parentId"] == root_id]
    visible_ids = {node["id"] for node in visible}
    return {**graph, "totalNodes": len(graph["nodes"]), "nodes": visible, "edges": [edge for edge in graph["edges"] if edge["source"] in visible_ids and edge["target"] in visible_ids]}


@app.post("/api/graphs/day1/expand")
def expand_graph(body: dict[str, str]) -> dict[str, Any]:
    answer = body.get("answer", "").strip()
    node_id = body.get("nodeId")
    if not answer or not node_id:
        raise HTTPException(status_code=400, detail="Cần nodeId và câu trả lời.")
    graph = flatten_graph(json.loads(GRAPH_PATH.read_text(encoding="utf-8")))
    children = [node for node in graph["nodes"] if node["parentId"] == node_id]
    return {"nodeId": node_id, "accepted": True, "children": children, "edges": [edge for edge in graph["edges"] if edge["source"] == node_id]}
