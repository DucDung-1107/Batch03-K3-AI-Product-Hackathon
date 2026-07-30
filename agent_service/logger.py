from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

LOG_FILE = Path(__file__).resolve().parents[1] / "data" / "agent-logs" / "feynman-agent.jsonl"


def log_turn(request: dict[str, Any], result: dict[str, Any], error: str | None = None) -> None:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    history = request.get("history", [])
    latest_answer = next((item.get("content", "") for item in reversed(history) if item.get("role") == "user"), "")
    latest_question = next((item.get("content", "") for item in reversed(history) if item.get("role") == "assistant"), result.get("message", ""))
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "session_id": request.get("session_id", "anonymous-session"),
        "lesson_id": request.get("lesson_id"),
        "mode": request.get("mode"),
        "loop": result.get("loop"),
        "n_loop": request.get("n_loop"),
        "prompt_stage": result.get("prompt_stage"),
        "question": latest_question,
        "answer": latest_answer,
        "thinking_summary": result.get("thinking_summary"),
        "answer_quality": result.get("answer_quality"),
        "tool_calls": result.get("tool_trace", []),
        "retention_report": result.get("retention_report"),
        "done": result.get("done", False),
        "error": error,
    }
    with LOG_FILE.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
