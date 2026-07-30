import { FIRST_QUESTION_PROMPT, FOLLOW_UP_PROMPT, EVALUATION_PROMPT, TOOL_DEFINITIONS } from './prompts.js';
import { executeTool, getReviewSchedule, readLesson } from './tools.js';

const json = text => { try { return JSON.parse(String(text).replace(/^```json\s*|\s*```$/g, '')); } catch { return null; } };

function localQuestion(lessonId, loop) {
  return { message: loop === 0 ? `Em đã mở ${lessonId}. Câu đầu tiên là: Bài này đang giải quyết vấn đề gì, và thầy/cô sẽ giải thích ý chính bằng một ví dụ đời thường như thế nào?` : `Em đã hiểu sơ bộ phần vừa rồi. Thầy/cô nối giúp em điều đó với một khái niệm khác trong ${lessonId} được không?`, done: false, loop, answer_quality: 'needs_clarification', toolTrace: [{ name: 'read_lesson', status: 'local' }], prompt_stage: loop === 0 ? 'first_question' : 'follow_up' };
}

export async function runFeynmanTurn({ lessonId = 'DAY 1', lessonContext = '', loop = 0, nLoop = 5, history = [], mode = 'SCHEDULED', apiKey = process.env.OPENROUTER_API_KEY, model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini', baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions' }) {
  const currentLoop = loop + (mode === 'SCHEDULED' ? 1 : 0);
  const context = lessonContext || (await readLesson(lessonId)).content;
  if (!apiKey) return currentLoop >= nLoop ? { message: `## Đánh giá sau ${nLoop} lượt\n\n**Mức độ nắm kiến thức:** Tạm hiểu\n\n**Điểm đã hiểu tốt:**\n- Đã thực hành giải thích lại bằng lời của mình.\n\n**Điểm còn cần làm rõ:**\n- Cần bật OpenRouter để agent đánh giá chi tiết từng ý theo file Markdown.\n\n**Nhận xét Feynman:** Phiên local đã chạy đúng tool đọc bài nhưng chưa có model để chấm nội dung.\n\n**Câu hỏi ôn tiếp theo:**\n1. Khái niệm cốt lõi là gì?\n2. Ví dụ đời thường nào minh họa rõ nhất?\n3. Khi nào khái niệm không áp dụng?`, done: true, loop: currentLoop, prompt_stage: 'evaluation', toolTrace: [{ name: 'read_lesson', status: 'local' }] } : localQuestion(lessonId, currentLoop);

  const stagePrompt = currentLoop === 0 ? FIRST_QUESTION_PROMPT : currentLoop >= nLoop ? EVALUATION_PROMPT : FOLLOW_UP_PROMPT;
  const userPrompt = `LESSON_ID: ${lessonId}\nLESSON_CONTEXT:\n${context.slice(0, 24000)}\n\nN_LOOP: ${nLoop}; CURRENT_LOOP: ${currentLoop}; MODE: ${mode}\nHISTORY:\n${history.map(item => `${item.role}: ${item.content}`).join('\n')}\n\n${currentLoop >= nLoop ? 'Hãy đánh giá toàn bộ hội thoại.' : 'Hãy thực hiện đúng một lượt hỏi.'}`;
  const messages = [{ role: 'system', content: stagePrompt }, { role: 'user', content: userPrompt }];
  const toolTrace = [];
  let raw = '';
  for (let round = 0; round < 4; round += 1) {
    const response = await fetch(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, temperature: 0.2, messages, tools: TOOL_DEFINITIONS, tool_choice: round === 0 ? { type: 'function', function: { name: 'read_lesson' } } : 'auto' }) });
    if (!response.ok) throw new Error(`OpenRouter ${response.status}: ${await response.text()}`);
    const result = await response.json();
    const assistant = result.choices?.[0]?.message || {};
    raw = assistant.content || '';
    if (!assistant.tool_calls?.length) break;
    messages.push(assistant);
    for (const call of assistant.tool_calls) {
      const args = JSON.parse(call.function.arguments || '{}');
      const value = await executeTool(call.function.name, args);
      toolTrace.push({ name: call.function.name, args, result: value });
      messages.push({ role: 'tool', tool_call_id: call.id, name: call.function.name, content: JSON.stringify(value) });
    }
  }
  const parsed = json(raw);
  return { ...(parsed || { message: raw, done: currentLoop >= nLoop }), loop: currentLoop, prompt_stage: currentLoop === 0 ? 'first_question' : currentLoop >= nLoop ? 'evaluation' : 'follow_up', toolTrace, local: false };
}

export { FIRST_QUESTION_PROMPT, FOLLOW_UP_PROMPT, EVALUATION_PROMPT, TOOL_DEFINITIONS, getReviewSchedule, readLesson };
