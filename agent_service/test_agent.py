import os

os.environ.pop("OPENROUTER_API_KEY", None)  # deterministic offline agent test
os.environ.pop("OPENAI_API_KEY", None)

from agent_service import app as app_module
from agent_service.app import FeynmanRequest, run_agent
from agent_service.tools import read_lesson, due_reviews

app_module.os.environ.pop("OPENROUTER_API_KEY", None)
app_module.os.environ.pop("OPENAI_API_KEY", None)

lesson = read_lesson("DAY 1")
assert lesson["content"], "DAY1.md must provide agent context"
session_id = "react-agent-test"
blocked = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="START", loop=0, n_loop=3, now="2026-07-23T10:00:00+07:00"))
assert blocked["waiting_for_schedule"] is True and blocked["tool_trace"] == []
first = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="START", loop=0, n_loop=3, now="2026-07-24T20:00:00+07:00"))
assert first["prompt_stage"] == "feynman_question" and first["tool_trace"][0]["name"] == "read_lesson_chunk"
deepen = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="SCHEDULED", loop=0, n_loop=3, now="2026-07-24T20:00:00+07:00", history=[{"role": "assistant", "content": first["message"]}, {"role": "user", "content": "Em chưa hiểu phần này vì nó còn khó với em."}]))
assert deepen["tool_trace"][0]["action"] == "DEEPEN" and len(deepen["tool_trace"]) == 1
redirect = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="SCHEDULED", loop=0, n_loop=3, now="2026-07-24T20:00:00+07:00", history=[{"role": "assistant", "content": first["message"]}, {"role": "user", "content": "Em la ai vay?"}]))
assert redirect["tool_trace"][0]["action"] == "REDIRECT" and redirect["guardrail"]["code"] == "COUNTER_QUESTION" and len(redirect["tool_trace"]) == 1
advance = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="SCHEDULED", loop=1, n_loop=3, now="2026-07-24T20:00:00+07:00", history=[{"role": "user", "content": "Vì Agentic AI không chỉ trả lời mà còn lập kế hoạch, hành động và quan sát kết quả; ví dụ như trợ lý tự tìm tài liệu rồi gửi báo cáo."}]))
assert advance["tool_trace"][0]["action"] == "ADVANCE" and advance["tool_trace"][1]["name"] == "read_lesson_chunk"
final = run_agent(FeynmanRequest(session_id=session_id, lesson_id="DAY 1", mode="SCHEDULED", loop=2, n_loop=3, now="2026-07-31T20:00:00+07:00", history=[{"role": "user", "content": "Agentic AI tự lập kế hoạch và gọi tool."}]))
assert final["done"] is True and final["prompt_stage"] == "retention_evaluation"
assert final["retention_report"]["days_since_study"] == 8
assert due_reviews("2026-07-30T20:00:00+07:00"), "schedule should return due sessions"
print("PASS: schedule gate, DEEPEN/REDIRECT without reading, ADVANCE with next chunk, and retention evaluation")
