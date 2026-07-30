import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const graphPath = path.join(root, 'data', 'graphs', 'day1.json');

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': 'http://localhost:5173', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  response.end(JSON.stringify(payload));
}

async function readGraph() { return JSON.parse(await readFile(graphPath, 'utf8')); }

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});
  if (request.method === 'GET' && request.url === '/api/graphs/day1') {
    const graph = await readGraph();
    const rootNode = graph.nodes.find(node => node.id === graph.rootId);
    const children = graph.nodes.filter(node => node.parentId === graph.rootId);
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
        const children = graph.nodes.filter(item => item.parentId === nodeId);
        return sendJson(response, 200, { nodeId, accepted: true, feedback: 'Đã lưu lượt tự gọi lại.', totalNodes: graph.nodes.length, children, edges: children.map(item => ({ source: nodeId, target: item.id })) });
      } catch { return sendJson(response, 400, { error: 'Dữ liệu recall không hợp lệ.' }); }
    });
    return;
  }
  sendJson(response, 404, { error: 'Not found' });
});

server.listen(8787, '127.0.0.1', () => console.log('Veuron graph API: http://127.0.0.1:8787'));
