import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// This is the source-of-truth graph. data/graphs/day1.json is only the old
// 12-node prototype and must not be used by the API.
const graphPath = path.join(root, 'src', 'graph', 'day1.json');

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  response.end(JSON.stringify(payload));
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function flattenGraph(source) {
  const nodes = [];
  const edges = [];

  const walk = (item, parentId = null, depth = 0, siblingIndex = 0, siblingCount = 1) => {
    const children = item.children || [];
    const node = {
      id: item.id,
      parentId,
      label: item.label,
      eyebrow: depth === 0 ? 'DAY 1 · CORE' : `D${depth} · BRANCH`,
      caption: item.detail || item.clue || '',
      question: item.clue || `Hãy giải thích lại ý chính của “${item.label}”.`,
      detail: item.detail || '',
      url: item.url || null,
      depth,
      x: 0,
      y: 0,
      width: depth === 0 ? 250 : 225,
      height: depth === 0 ? 112 : 88,
      childrenCount: children.length,
      hasChildren: children.length > 0,
      isLeaf: children.length === 0,
    };

    if (depth === 0) {
      node.x = 425;
      node.y = 245;
    } else if (parentId === source.root.id) {
      const topLevelPositions = [
        // Keep the first six branches inside the canvas safe area. The
        // floating lesson/recall panels live in the corners.
        { x: 35, y: 145 }, { x: 35, y: 365 },
        { x: 300, y: 475 }, { x: 575, y: 475 },
        { x: 700, y: 145 }, { x: 700, y: 365 },
      ];
      Object.assign(node, topLevelPositions[siblingIndex] || topLevelPositions[0]);
    } else {
      const parent = nodes.find(candidate => candidate.id === parentId);
      const direction = parent && parent.x < 550 ? -1 : 1;
      node.x = clamp((parent?.x || 425) + direction * 285, 20, 855);
      node.y = clamp((parent?.y || 245) + (siblingIndex - (siblingCount - 1) / 2) * 125, 20, 515);
    }

    nodes.push(node);
    if (parentId) edges.push({ source: parentId, target: node.id });
    children.forEach((child, index) => walk(child, node.id, depth + 1, index, children.length));
  };

  walk(source.root);
  return { id: 'day1-foundation', title: 'AI & LLM Foundation', rootId: source.root.id, nodes, edges };
}

async function readGraph() { return flattenGraph(JSON.parse(await readFile(graphPath, 'utf8'))); }

function decorateNode(node, graph) {
  const childrenCount = graph.nodes.reduce((count, item) => count + (item.parentId === node.id ? 1 : 0), 0);
  return { ...node, childrenCount, hasChildren: childrenCount > 0, isLeaf: childrenCount === 0 };
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});
  if (request.method === 'GET' && request.url === '/api/graphs/day1') {
    const graph = await readGraph();
    const rootNode = decorateNode(graph.nodes.find(node => node.id === graph.rootId), graph);
    const children = graph.nodes.filter(node => node.parentId === graph.rootId).map(node => decorateNode(node, graph));
    return sendJson(response, 200, { graphId: graph.id, title: graph.title, rootId: graph.rootId, totalNodes: graph.nodes.length, nodes: [rootNode, ...children], edges: children.map(node => ({ source: graph.rootId, target: node.id })) });
  }
  if (request.method === 'POST' && request.url === '/api/graphs/day1/expand') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', async () => {
      try {
        const { nodeId, answer } = JSON.parse(body || '{}');
        if (!nodeId || !answer || !answer.trim()) return sendJson(response, 400, { error: 'Hãy viết câu trả lời trước khi mở rộng graph.' });
        const graph = await readGraph();
        const node = graph.nodes.find(item => item.id === nodeId);
        if (!node) return sendJson(response, 404, { error: 'Không tìm thấy node.' });
        const children = graph.nodes.filter(item => item.parentId === nodeId).map(item => decorateNode(item, graph));
        return sendJson(response, 200, { nodeId, accepted: true, feedback: 'Đã lưu lượt tự gọi lại.', totalNodes: graph.nodes.length, children, isLeaf: children.length === 0, edges: children.map(item => ({ source: nodeId, target: item.id })) });
      } catch { return sendJson(response, 400, { error: 'Dữ liệu recall không hợp lệ.' }); }
    });
    return;
  }
  sendJson(response, 404, { error: 'Not found' });
});

server.listen(8787, '127.0.0.1', () => console.log('Veuron graph API: http://127.0.0.1:8787'));
