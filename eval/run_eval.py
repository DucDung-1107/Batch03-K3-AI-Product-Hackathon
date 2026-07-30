"""Run the FeynMind golden set through the real ReAct controller.

The eval intentionally disables provider keys so the checked-in fallback path is
deterministic and the result is reproducible offline. It still calls the same
agent entry point used by the FastAPI service: run_react_turn.
"""

from __future__ import annotations

import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.environ.pop("OPENAI_API_KEY", None)
os.environ.pop("OPENROUTER_API_KEY", None)

from agent_service.react_agent import run_react_turn  # noqa: E402


GOLDEN_PATH = ROOT / "eval" / "golden_set.json"
RESULTS_PATH = ROOT / "eval" / "results_latest.csv"
SUMMARY_PATH = ROOT / "eval" / "run_summary_latest.json"


def run_case(case: dict, index: int) -> dict:
    session_id = f"eval-{case['id']}-{index}"
    start = run_react_turn({
        "session_id": session_id,
        "lesson_id": case["lesson_id"],
        "mode": "MANUAL_START",
        "manual_session": True,
        "loop": 0,
        "n_loop": 3,
        "history": [],
    })
    history = [
        {"role": "assistant", "content": start.get("message", "")},
        {"role": "user", "content": case["answer"]},
    ]
    result = run_react_turn({
        "session_id": session_id,
        "lesson_id": case["lesson_id"],
        "mode": "SCHEDULED",
        "manual_session": True,
        "loop": 1,
        "n_loop": 3,
        "history": history,
    })
    actual = result.get("answer_quality")
    passed = actual == case["expected_answer_quality"]
    trace = result.get("tool_trace", [])
    action = trace[-1].get("action", "") if trace else ""
    return {
        "id": case["id"],
        "lesson_id": case["lesson_id"],
        "category": case["category"],
        "expected_answer_quality": case["expected_answer_quality"],
        "actual_answer_quality": actual or "null",
        "action": action,
        "guardrail": bool(result.get("guardrail")),
        "passed": passed,
        "source_ref": case["source_ref"],
        "observed_message": result.get("message", "").replace("\n", " ")[:240],
    }


def main() -> None:
    data = json.loads(GOLDEN_PATH.read_text(encoding="utf-8"))
    rows = [run_case(case, index) for index, case in enumerate(data["cases"], start=1)]
    passed = sum(row["passed"] for row in rows)
    total = len(rows)
    pass_rate = passed / total if total else 0
    summary = {
        "run_at": datetime.now(timezone.utc).isoformat(),
        "golden_set": data["version"],
        "mode": "offline fallback through agent_service.react_agent.run_react_turn",
        "total_cases": total,
        "passed": passed,
        "failed": total - passed,
        "pass_rate": round(pass_rate, 4),
        "quality_bar": data["quality_bar"],
        "quality_bar_passed": pass_rate >= data["quality_bar"]["pass_rate"],
        "failed_cases": [row["id"] for row in rows if not row["passed"]],
    }
    with RESULTS_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    SUMMARY_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
