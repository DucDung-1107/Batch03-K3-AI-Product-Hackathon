from __future__ import annotations

from datetime import datetime, time, timedelta
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data" / "vlearn-pack" / "BÀI GIẢNG"
LESSON_SCHEDULE = [
    {"lesson_id": "DAY 1", "learned_at": "2026-07-23"},
    {"lesson_id": "DAY 2", "learned_at": "2026-07-24"},
    {"lesson_id": "DAY 3", "learned_at": "2026-07-26"},
    {"lesson_id": "DAY 4", "learned_at": "2026-07-27"},
    {"lesson_id": "DAY 5", "learned_at": "2026-07-28"},
]
REVIEW_TIME = time(19, 30)
TIMEZONE = ZoneInfo("Asia/Bangkok")

TOOL_DEFINITIONS = [
    {"type": "function", "function": {"name": "read_lesson", "description": "Đọc file Markdown của bài được lên lịch. Luôn gọi tool này trước khi hỏi.", "parameters": {"type": "object", "properties": {"lesson_id": {"type": "string", "enum": ["DAY 1", "DAY 2", "DAY 3", "DAY 4", "DAY 5"]}}, "required": ["lesson_id"], "additionalProperties": False}}},
    {"type": "function", "function": {"name": "get_due_reviews", "description": "Lấy các bài đến hạn ôn theo nhịp 1, 3, 7, 14, 30 ngày.", "parameters": {"type": "object", "properties": {"today": {"type": "string", "description": "YYYY-MM-DD"}}, "required": ["today"], "additionalProperties": False}}},
]


def read_lesson(lesson_id: str) -> dict[str, str]:
    if lesson_id not in {item["lesson_id"] for item in LESSON_SCHEDULE}:
        raise ValueError("lesson_id không hợp lệ")
    filename = f"DAY{lesson_id.split()[-1]}.md"
    path = LESSON_DIR / filename
    return {"lesson_id": lesson_id, "file": str(path), "content": path.read_text(encoding="utf-8")}


def review_sessions(now_text: str | None = None) -> list[dict[str, Any]]:
    now = datetime.fromisoformat(now_text) if now_text else datetime.now(TIMEZONE)
    if now.tzinfo is None:
        now = now.replace(tzinfo=TIMEZONE)
    sessions = []
    for lesson in LESSON_SCHEDULE:
        learned_at = datetime.fromisoformat(lesson["learned_at"]).replace(tzinfo=TIMEZONE)
        for gap in (1, 3, 7, 14, 30):
            due_at = (learned_at + timedelta(days=gap)).replace(hour=REVIEW_TIME.hour, minute=REVIEW_TIME.minute)
            sessions.append({**lesson, "review_after_days": gap, "due_at": due_at.isoformat(), "is_due": due_at <= now})
    return sorted(sessions, key=lambda item: item["due_at"])


def due_reviews(now_text: str | None = None) -> list[dict[str, Any]]:
    return [item for item in review_sessions(now_text) if item["is_due"]]


def execute_tool(name: str, args: dict[str, Any]) -> dict[str, Any]:
    if name == "read_lesson":
        return read_lesson(args["lesson_id"])
    if name == "get_due_reviews":
        return {"sessions": due_reviews(args.get("today"))}
    raise ValueError(f"Unknown tool: {name}")
