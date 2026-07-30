import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd());
const lessonDir = path.join(root, 'data', 'vlearn-pack', 'BÀI GIẢNG');
export const lessonSchedule = [
  { lesson_id: 'DAY 1', learned_at: '2026-07-23' },
  { lesson_id: 'DAY 2', learned_at: '2026-07-24' },
  { lesson_id: 'DAY 3', learned_at: '2026-07-26' },
  { lesson_id: 'DAY 4', learned_at: '2026-07-27' },
  { lesson_id: 'DAY 5', learned_at: '2026-07-28' },
];

export async function readLesson(lessonId) {
  const match = String(lessonId).match(/^DAY ([1-5])$/);
  if (!match) throw new Error('lesson_id không hợp lệ');
  const file = `DAY${match[1]}.md`;
  return { lesson_id: lessonId, file: `data/vlearn-pack/BÀI GIẢNG/${file}`, content: await readFile(path.join(lessonDir, file), 'utf8') };
}

export function getReviewSchedule(todayText = new Date().toISOString().slice(0, 10)) {
  const today = new Date(`${todayText}T00:00:00`);
  return lessonSchedule.flatMap(item => [1, 3, 7, 14, 30].map(days => {
    const due = new Date(`${item.learned_at}T00:00:00`);
    due.setDate(due.getDate() + days);
    return { ...item, review_after_days: days, due_at: due.toISOString().slice(0, 10), due: due <= today };
  })).filter(item => item.due).sort((a, b) => a.due_at.localeCompare(b.due_at));
}

export async function executeTool(name, args) {
  if (name === 'read_lesson') return readLesson(args.lesson_id);
  if (name === 'get_review_schedule') return getReviewSchedule(args.today);
  throw new Error(`Unknown tool: ${name}`);
}
