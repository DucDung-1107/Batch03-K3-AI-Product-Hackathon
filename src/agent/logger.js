import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const logDir = path.resolve(process.cwd(), 'data', 'agent-logs');
const logFile = path.join(logDir, 'feynman-agent.jsonl');

export async function logAgentTurn({ sessionId, request, result, error = null }) {
  await mkdir(logDir, { recursive: true });
  const history = Array.isArray(request.history) ? request.history : [];
  const latestAnswer = [...history].reverse().find(item => item.role === 'user')?.content || '';
  const latestQuestion = [...history].reverse().find(item => item.role === 'assistant')?.content || '';
  const record = {
    timestamp: new Date().toISOString(),
    session_id: sessionId || request.sessionId || 'anonymous-session',
    lesson_id: request.lessonId || 'DAY 1',
    mode: request.mode || 'SCHEDULED',
    loop: result?.loop ?? request.loop ?? 0,
    n_loop: request.nLoop || 5,
    prompt_stage: result?.prompt_stage || null,
    question: latestQuestion || result?.message || '',
    answer: latestAnswer,
    thinking_summary: result?.thinking_summary || result?.reasoning_summary || null,
    answer_quality: result?.answer_quality || null,
    covered_topic: result?.covered_topic || null,
    next_topic: result?.next_topic || null,
    tool_calls: result?.toolTrace || [],
    done: Boolean(result?.done),
    error: error ? String(error.message || error) : null,
  };
  await appendFile(logFile, `${JSON.stringify(record)}\n`, 'utf8');
  return logFile;
}

export { logFile };
