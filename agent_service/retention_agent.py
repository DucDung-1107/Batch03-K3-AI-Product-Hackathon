from __future__ import annotations

from datetime import datetime
from typing import Any

from .tools import LESSON_SCHEDULE

RETENTION_EVALUATOR_PROMPT = """Bạn là Retention Evaluator Agent, một agent độc lập đánh giá mức độ quên kiến thức.
Bạn nhận được LESSON_CONTEXT từ tool read_lesson, toàn bộ DIALOGUE giữa học sinh AI và teacher, cùng LAST_STUDIED_AT/NOW.

Nhiệm vụ:
1. Chỉ ra những khái niệm teacher đã giải thích chính xác và có lập luận.
2. Suy ra những khái niệm có dấu hiệu bị quên: trả lời thiếu cơ chế, lẫn khái niệm, chỉ lặp lại từ khóa, hoặc không đưa được ví dụ. Không bịa lỗi nếu dialogue không có bằng chứng.
3. Liên hệ mức độ chắc chắn với số ngày từ lần học gần nhất, nhưng không coi thời gian là bằng chứng duy nhất.
4. Đưa khuyến nghị ôn theo active recall cụ thể.

Không tiết lộ chain-of-thought. Trả về JSON hợp lệ:
{"memory_level":"Chưa chắc|Tạm hiểu|Khá chắc|Rất chắc", "days_since_study":number, "strong_concepts":["..."], "forgotten_or_fragile_concepts":[{"concept":"...", "evidence":"..."}], "recommendations":["...", "...", "..."], "summary":"..."}."""


def last_studied_at(lesson_id: str) -> str:
    return next(item["learned_at"] for item in LESSON_SCHEDULE if item["lesson_id"] == lesson_id)


def fallback_retention_report(lesson_id: str, last_studied: str, now_text: str | None, history: list[dict[str, str]]) -> dict[str, Any]:
    now = datetime.fromisoformat(now_text) if now_text else datetime.now()
    studied = datetime.fromisoformat(last_studied)
    days = max(0, (now.date() - studied.date()).days)
    answers = [item for item in history if item.get("role") == "user"]
    return {
        "memory_level": "Tạm hiểu" if answers else "Chưa chắc",
        "days_since_study": days,
        "strong_concepts": ["Teacher đã tham gia giải thích lại kiến thức."] if answers else [],
        "forgotten_or_fragile_concepts": [{"concept": "Các phần chưa được teacher giải thích trong dialogue", "evidence": "Không có đủ phản hồi để xác nhận mức độ nắm kiến thức."}],
        "recommendations": ["Ôn lại bằng một ví dụ đời thường.", "Trả lời lại các câu hỏi còn thiếu cơ chế hoặc quan hệ nhân quả.", "Lập lịch active recall cho phiên tiếp theo."],
        "summary": f"Đã {days} ngày từ lần học {lesson_id}; báo cáo local không thay thế đánh giá theo ngữ nghĩa của model.",
    }


def retention_markdown(report: dict[str, Any]) -> str:
    fragile = report.get("forgotten_or_fragile_concepts", [])
    fragile_lines = "\n".join(f"- {item.get('concept', '')}: {item.get('evidence', '')}" for item in fragile) or "- Chưa đủ bằng chứng để kết luận."
    recommendations = "\n".join(f"{index}. {item}" for index, item in enumerate(report.get("recommendations", []), 1))
    return f"\n\n**Retention Evaluator (sau {report.get('days_since_study', 0)} ngày):** {report.get('memory_level', 'Tạm hiểu')}\n\n**Dấu hiệu cần ôn lại:**\n{fragile_lines}\n\n**Khuyến nghị retention:**\n{recommendations}"
