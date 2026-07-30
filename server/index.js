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

function flattenGraph(source, dayId) {
  const nodes = [];
  const edges = [];

  const rawNodes = [];
  const buildHierarchy = (item, parentId = null, depth = 0) => {
    const children = item.children || [];
    const node = {
      id: item.id,
      parentId,
      label: item.label,
      eyebrow: depth === 0 ? `${dayId.toUpperCase().replace('DAY', 'DAY ')} · CORE` : `D${depth} · BRANCH`,
      caption: item.detail || item.clue || '',
      question: item.clue || `Hãy giải thích lại ý chính của “${item.label}”.`,
      detail: item.detail || '',
      url: item.url || null,
      depth,
      width: depth === 0 ? 250 : 225,
      height: depth === 0 ? 112 : 88,
      childrenCount: children.length,
      hasChildren: children.length > 0,
      isLeaf: children.length === 0,
      children: children,
    };
    rawNodes.push(node);
    children.forEach(child => buildHierarchy(child, node.id, depth + 1));
  };
  buildHierarchy(source.root);

  // Compute Y coordinates using post-order leaf positioning
  let nextLeafY = 0;
  const spacingY = 160;
  const nodeYMap = {};

  const layoutNode = (node) => {
    const children = node.children || [];
    if (children.length === 0) {
      nodeYMap[node.id] = nextLeafY * spacingY;
      nextLeafY++;
    } else {
      children.forEach(childItem => {
        const childNode = rawNodes.find(n => n.id === childItem.id);
        if (childNode) layoutNode(childNode);
      });
      const firstChildId = children[0].id;
      const lastChildId = children[children.length - 1].id;
      const firstY = nodeYMap[firstChildId];
      const lastY = nodeYMap[lastChildId];
      nodeYMap[node.id] = (firstY + lastY) / 2;
    }
  };

  const rootNode = rawNodes.find(n => n.id === source.root.id);
  if (rootNode) {
    layoutNode(rootNode);
  }

  // Adjust Y coordinates to center the root node at Y = 250
  const rootY = rootNode ? nodeYMap[rootNode.id] : 0;
  const offsetY = 250 - rootY;

  const spacingX = 320;
  const startX = 60;

  rawNodes.forEach(node => {
    node.x = startX + node.depth * spacingX;
    node.y = (nodeYMap[node.id] || 0) + offsetY;
    delete node.children;
    nodes.push(node);
    if (node.parentId) {
      edges.push({ source: node.parentId, target: node.id });
    }
  });

  return { id: dayId, title: source.title || 'Untitled Map', rootId: source.root.id, nodes, edges };
}

async function readGraph(dayId) {
  const graphPath = path.join(root, 'src', 'graph', `${dayId}.json`);
  return flattenGraph(JSON.parse(await readFile(graphPath, 'utf8')), dayId);
}

function decorateNode(node, graph) {
  const childrenCount = graph.nodes.reduce((count, item) => count + (item.parentId === node.id ? 1 : 0), 0);
  return { ...node, childrenCount, hasChildren: childrenCount > 0, isLeaf: childrenCount === 0 };
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});
  
  const getMatch = request.url.match(/^\/api\/graphs\/(day[1-5])$/);
  const postMatch = request.url.match(/^\/api\/graphs\/(day[1-5])\/expand$/);

  if (request.method === 'GET' && getMatch) {
    const dayId = getMatch[1];
    try {
      const graph = await readGraph(dayId);
      const rootNode = decorateNode(graph.nodes.find(node => node.id === graph.rootId), graph);
      const children = graph.nodes.filter(node => node.parentId === graph.rootId).map(node => decorateNode(node, graph));
      return sendJson(response, 200, { graphId: graph.id, title: graph.title, rootId: graph.rootId, totalNodes: graph.nodes.length, nodes: [rootNode, ...children], edges: children.map(node => ({ source: graph.rootId, target: node.id })) });
    } catch (err) {
      return sendJson(response, 404, { error: `Không tìm thấy sơ đồ cho bài ${dayId}` });
    }
  }

  if (request.method === 'POST' && postMatch) {
    const dayId = postMatch[1];
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', async () => {
      try {
        const { nodeId, answer } = JSON.parse(body || '{}');
        if (!nodeId || !answer || !answer.trim()) return sendJson(response, 400, { error: 'Hãy viết câu trả lời trước khi mở rộng graph.' });
        const graph = await readGraph(dayId);
        const node = graph.nodes.find(item => item.id === nodeId);
        if (!node) return sendJson(response, 404, { error: 'Không tìm thấy node.' });
        const children = graph.nodes.filter(item => item.parentId === nodeId).map(item => decorateNode(item, graph));
        return sendJson(response, 200, { nodeId, accepted: true, feedback: 'Đã lưu lượt tự gọi lại.', totalNodes: graph.nodes.length, children, isLeaf: children.length === 0, edges: children.map(item => ({ source: nodeId, target: item.id })) });
      } catch (err) {
        return sendJson(response, 400, { error: 'Dữ liệu recall không hợp lệ.' });
      }
    });
    return;
  }

  sendJson(response, 404, { error: 'Not found' });
});

server.listen(8787, '127.0.0.1', () => console.log('Veuron graph API: http://127.0.0.1:8787'));
