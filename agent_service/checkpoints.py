from __future__ import annotations

import json
from pathlib import Path
from typing import Any

CHECKPOINT_FILE = Path(__file__).resolve().parents[1] / "data" / "agent-state" / "checkpoints.json"


def load_checkpoint(session_id: str) -> dict[str, Any] | None:
    if not CHECKPOINT_FILE.exists():
        return None
    data = json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8"))
    return data.get(session_id)


def save_checkpoint(session_id: str, state: dict[str, Any]) -> None:
    CHECKPOINT_FILE.parent.mkdir(parents=True, exist_ok=True)
    data = json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8")) if CHECKPOINT_FILE.exists() else {}
    data[session_id] = state
    CHECKPOINT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def reset_checkpoint(session_id: str) -> None:
    if not CHECKPOINT_FILE.exists():
        return
    data = json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8"))
    data.pop(session_id, None)
    CHECKPOINT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
