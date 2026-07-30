import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './styles-extra.css';
import './styles-content.css';
import './styles-graph.css';
import './styles-layout.css';
import day1Text from '../data/vlearn-pack/BÀI GIẢNG/DAY1.md?raw';
import day2Text from '../data/vlearn-pack/BÀI GIẢNG/DAY2.md?raw';
import day3Text from '../data/vlearn-pack/BÀI GIẢNG/DAY3.md?raw';
import day4Text from '../data/vlearn-pack/BÀI GIẢNG/DAY4.md?raw';
import day5Text from '../data/vlearn-pack/BÀI GIẢNG/DAY5.md?raw';

const lectures = [
  { id: 'DAY 1', file: 'BÀI GIẢNG/DAY1.md', title: 'AI & LLM Foundation', day: 'Ngày 1 · nền tảng', tag: 'PRIMARY AI', duration: 'Nội dung chuyên sâu', learnedAt: '2026-07-23', summary: 'Từ Machine Learning đến Agentic AI; đi qua AI taxonomy, kiến trúc LLM, Transformer, token economy và các giới hạn bẩm sinh.', content: day1Text, node: 'AI & LLM là gì?' },
  { id: 'DAY 2', file: 'BÀI GIẢNG/DAY2.md', title: 'AI Product: từ yêu cầu đến Problem Statement', day: 'Ngày 2 · tư duy sản phẩm', tag: 'AI PRODUCT', duration: 'Từ yêu cầu đến PS', learnedAt: '2026-07-24', summary: 'Kết hợp AI Engineering, Product Thinking và Design Thinking để khám phá đúng vấn đề, viết Problem Statement và thẩm định ứng dụng AI.', content: day2Text, node: 'Problem Statement tốt là gì?' },
  { id: 'DAY 3', file: 'BÀI GIẢNG/DAY3.md', title: 'Agentic AI & Design Pattern ReAct', day: 'Ngày 3 · agent system', tag: 'REACT AGENT', duration: 'Agent · ReAct', learnedAt: '2026-07-26', summary: 'Phân biệt Rule-based Bot, LLM Chatbot, Reactive Agent và Autonomous Agent; thiết kế vòng lặp ReAct cho agent biết suy luận và dùng tool.', content: day3Text, node: 'Agent ReAct hoạt động ra sao?' },
  { id: 'DAY 4', file: 'BÀI GIẢNG/DAY4.md', title: 'Prompt Engineering & Tool Calling', day: 'Ngày 4 · kỹ thuật ứng dụng', tag: 'PROMPT ENGINEERING', duration: 'Prompt · tools', learnedAt: '2026-07-27', summary: 'Thiết kế prompt như một interface giữa ý định con người và hành vi model; thực hành RTCF, prompt iteration, sampling và tool calling.', content: day4Text, node: 'Prompt tốt cần gì?' },
  { id: 'DAY 5', file: 'BÀI GIẢNG/DAY5.md', title: 'AI Product Thinking & Requirements', day: 'Ngày 5 · đặc tả sản phẩm', tag: 'PRODUCT THINKING', duration: 'PRD · Risk', learnedAt: '2026-07-28', summary: 'Chuyển nhu cầu người dùng thành yêu cầu kỹ thuật đo lường được; xây PRD, Risk Register và quản trị Responsible AI.', content: day5Text, node: 'AI Product có giá trị gì?' },
];

const topics = lectures.map((lecture, index) => ({ id: lecture.id, tag: `${String(index + 1).padStart(2, '0')} / ${lecture.tag}`, title: lecture.title, description: lecture.summary, node: lecture.node }));
const spacing = [1, 3, 7, 14, 30];
const GRAPH_API_ORIGIN = typeof window === 'undefined' ? 'http://127.0.0.1:8000' : `${window.location.protocol}//${window.location.hostname}:8000`;
const AGENT_ORIGIN = GRAPH_API_ORIGIN;
const API_ORIGIN = AGENT_ORIGIN;
const formatDate = date => new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(date);
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };

const MascotAvatar = () => (
  <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="18" fill="#edf7e7" />
    <circle cx="18" cy="20" r="11" fill="#79ad7c" />
    <circle cx="12" cy="21" r="2" fill="#a4db8b" />
    <circle cx="24" cy="21" r="2" fill="#a4db8b" />
    <circle cx="14" cy="18" r="1.5" fill="#ffffff" />
    <circle cx="22" cy="18" r="1.5" fill="#ffffff" />
    <path d="M16 22C16.5 23 19.5 23 20 22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 12.5L18 9.5L25 12.5L18 15.5L11 12.5Z" fill="#115631" />
    <path d="M18 14V17" stroke="#115631" strokeWidth="1.5" />
    <path d="M25 12.5V15" stroke="#115631" strokeWidth="1.5" />
    <circle cx="25" cy="15" r="1" fill="#115631" />
  </svg>
);

function Sidebar({ view, setView, onMouseEnterHocTap, onMouseLeaveHocTap }) {
  return (
    <aside className="app-sidebar">
      <button className="sidebar-brand" onClick={() => setView('learning')}>
        <span className="avatar" style={{ display: 'grid', placeItems: 'center', pointerEvents: 'none', width: '32px', height: '32px', fontSize: '15px' }}>✦</span>
        <span>Veu<span className="brand-highlight">Ron</span></span>
      </button>
      <nav className="sidebar-nav">
        <button
          className={view === 'learning' ? 'active' : ''}
          onClick={() => setView('learning')}
          onMouseEnter={onMouseEnterHocTap}
          onMouseLeave={onMouseLeaveHocTap}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          <span>Học tập</span>
        </button>
        <button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          <span>Lịch ôn</span>
        </button>
        <button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          <span>Thư viện</span>
        </button>
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line)', opacity: 0.6, fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
        <div>VEURON OS v1.2.0</div>
        <div style={{ marginTop: '3px' }}>Active Workspace</div>
      </div>
    </aside>
  );
}

function Dashboard({ view, graph, recallEnabled, setRecallEnabled, viewport, zoom, reset, orderedLectures, fitView }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRealtimeDate = (date) => {
    const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekday = weekdays[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `HÔM NAY · ${weekday.toUpperCase()}, ${day}/${month} ${hours}:${minutes}:${seconds}`;
  };

  const nodesCount = graph?.nodes?.length || 0;
  const totalNodesCount = graph?.totalNodes || nodesCount;

  return (
    <header className="dashboard-bar">
      <div className="dashboard-left">
        {view === 'learning' && (
          <div className="dashboard-tools">
            {/* Nhóm Thông tin */}
            <div className="tool-group info-group">
              <span className="info-text">{nodesCount} / {totalNodesCount} node hiện</span>
            </div>

            {/* Nhóm Filter/Toggle */}
            <div className="tool-group toggle-group">
              <span className="toggle-label">Trả lời câu hỏi:</span>
              <button
                className={`switch ${recallEnabled ? 'on' : 'off'}`}
                onClick={() => setRecallEnabled(!recallEnabled)}
                aria-label="Bật tắt yêu cầu trả lời trước khi mở nhánh mới"
              >
                <span className="slider" />
              </button>
              <span className={`switch-status ${recallEnabled ? 'on' : 'off'}`}>{recallEnabled ? 'CÓ' : 'KHÔNG'}</span>
            </div>

            {/* Nhóm Zoom & Định vị */}
            <div className="tool-group zoom-group">
              <button className="tool-btn" onClick={() => zoom(-0.1)} title="Thu nhỏ" aria-label="Thu nhỏ">−</button>
              <span className="zoom-text">{Math.round((viewport?.scale || 1) * 100)}%</span>
              <button className="tool-btn" onClick={() => zoom(0.1)} title="Phóng to" aria-label="Phóng to">+</button>
              <div className="tool-divider" />
              <button className="tool-btn reset-btn" onClick={reset} title="Đặt lại Mindmap như ban đầu" aria-label="Đặt lại graph">↺</button>
            </div>
          </div>
        )}
        {view === 'review' && (
          <div className="dashboard-stats-row">
            <span className="stat-badge">3 lượt recall đang chờ ôn tập</span>
          </div>
        )}
        {view === 'library' && (
          <div className="dashboard-stats-row">
            <span className="stat-badge">{orderedLectures.length} bài giảng trong lộ trình</span>
          </div>
        )}
      </div>
      <div className="dashboard-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatRealtimeDate(now)}
      </div>
    </header>
  );
}

function TopicCard({ topic, selected, onSelect }) {
  return <button className={`topic-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(topic)}><span className="topic-number">{topic.tag}</span><h3>{topic.title}</h3><p>{topic.description}</p><span className="topic-arrow">↗</span></button>;
}

function RecallModal({ node, step, onClose, onUnlock }) {
  const [answer, setAnswer] = useState('');
  useEffect(() => {
    setAnswer('');
  }, [node?.id]);
  if (!node) return null;
  const submit = () => { if (answer.trim()) onUnlock(answer); };
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="prompt-card">
        <div className="prompt-step">RECALL PROMPT / 0{step}</div>
        <h2>{node.question}</h2>
        <p>Đừng mở tài liệu vội. Hãy tự gọi lại điều bạn nhớ, viết vài ý ngắn trước, rồi Veuron mới mở nhánh tiếp theo.</p>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Viết điều bạn nhớ được…"
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>Để sau</button>
          <button className="button primary" disabled={!answer.trim()} onClick={submit}>Mở nhánh tiếp →</button>
        </div>
      </div>
    </div>
  );
}

const computeHorizontalLayout = (nodes, rootId) => {
  if (!nodes || nodes.length === 0) return {};
  const rootNode = nodes.find(n => !n.parentId || n.id === rootId) || nodes[0];
  const childrenMap = {};
  nodes.forEach(node => {
    if (node.parentId) {
      if (!childrenMap[node.parentId]) childrenMap[node.parentId] = [];
      childrenMap[node.parentId].push(node);
    }
  });

  const nodeHeight = (node) => {
    return node.depth === 0 ? 180 : 150;
  };

  const gap = 24; // Vertical spacing gap between siblings

  // First pass: compute subtree heights bottom-up
  const subtreeHeights = {};
  const computeHeight = (node) => {
    const children = childrenMap[node.id] || [];
    const selfHeight = nodeHeight(node);
    if (children.length === 0) {
      subtreeHeights[node.id] = selfHeight;
    } else {
      children.forEach(child => computeHeight(child));
      const childrenSum = children.reduce((sum, child) => sum + (subtreeHeights[child.id] || 88), 0);
      const childrenGaps = (children.length - 1) * gap;
      subtreeHeights[node.id] = Math.max(selfHeight, childrenSum + childrenGaps);
    }
  };
  computeHeight(rootNode);

  // Fallback heights for disconnected nodes
  nodes.forEach(node => {
    if (subtreeHeights[node.id] === undefined) {
      subtreeHeights[node.id] = nodeHeight(node);
    }
  });

  const nodeYMap = {};
  const layoutNode = (node, startY) => {
    const children = childrenMap[node.id] || [];
    const selfHeight = nodeHeight(node);

    if (children.length === 0) {
      nodeYMap[node.id] = startY + (subtreeHeights[node.id] - selfHeight) / 2;
    } else {
      let currentY = startY;
      children.forEach(child => {
        layoutNode(child, currentY);
        currentY += subtreeHeights[child.id] + gap;
      });
      const firstChildY = nodeYMap[children[0].id];
      const lastChildY = nodeYMap[children[children.length - 1].id];
      nodeYMap[node.id] = (firstChildY + lastChildY) / 2;
    }
  };
  layoutNode(rootNode, 0);

  // Layout disconnected nodes
  let nextDisconnectedY = (subtreeHeights[rootNode.id] || 0) + gap;
  nodes.forEach(node => {
    if (nodeYMap[node.id] === undefined) {
      nodeYMap[node.id] = nextDisconnectedY;
      nextDisconnectedY += nodeHeight(node) + gap;
    }
  });

  const offsetY = 230 - (nodeYMap[rootNode.id] || 0);

  const spacingX = 380;
  const startX = 60;
  const positions = {};
  nodes.forEach(node => {
    positions[node.id] = {
      x: startX + node.depth * spacingX,
      y: nodeYMap[node.id] + offsetY,
      width: node.depth === 0 ? 280 : 225,
      height: nodeHeight(node)
    };
  });
  return positions;
};

function MindMap({ topic, graph, onNodeClick, recallEnabled, setRecallEnabled, viewport, setViewport, zoom, reset, resetTrigger, fitViewTrigger, panelMode, panelSize }) {
  const drag = useRef(null);
  const canvasRef = useRef(null);
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  const nodeMap = Object.fromEntries(nodes.map(node => [node.id, node]));
  const [localPositions, setLocalPositions] = useState({});
  const suppressClick = useRef(false);

  const nodesRef = useRef(nodes);
  const graphRef = useRef(graph);
  const localPositionsRef = useRef(localPositions);
  const panelModeRef = useRef(panelMode);
  const panelSizeRef = useRef(panelSize);

  useEffect(() => {
    nodesRef.current = nodes;
    graphRef.current = graph;
    localPositionsRef.current = localPositions;
    panelModeRef.current = panelMode;
    panelSizeRef.current = panelSize;
  }, [nodes, graph, localPositions, panelMode, panelSize]);

  // Reset all dragged offsets and return viewport back to initial 50% fit on reset
  useEffect(() => {
    if (resetTrigger > 0) {
      setLocalPositions({});
      requestAnimationFrame(() => {
        autoFit(0.5);
      });
    }
  }, [resetTrigger]);

  const autoFit = (forcedScale) => {
    const canvas = canvasRef.current;
    if (!canvas || nodesRef.current.length === 0) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    if (canvasWidth < 100 || canvasHeight < 100) return;

    const computed = computeHorizontalLayout(nodesRef.current, graphRef.current?.rootId);

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodesRef.current.forEach(node => {
      const pos = (localPositionsRef.current[node.id] && localPositionsRef.current[node.id].dragged)
        ? localPositionsRef.current[node.id]
        : computed[node.id] || { x: node.x, y: node.y, width: node.width || 225, height: node.height || 150 };
      const w = pos.width || 225;
      const h = pos.height || 150;

      if (pos.x < minX) minX = pos.x;
      if (pos.x + w > maxX) maxX = pos.x + w;
      if (pos.y < minY) minY = pos.y;
      if (pos.y + h > maxY) maxY = pos.y + h;
    });

    if (minX === Infinity) return;

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    const paddingLeft = 60;
    const paddingRight = panelModeRef.current !== 'minimized' ? panelSizeRef.current.width + 50 : 60;
    const paddingTop = 60;
    const paddingBottom = 60;

    const scaleX = (canvasWidth - paddingLeft - paddingRight) / graphWidth;
    const scaleY = (canvasHeight - paddingTop - paddingBottom) / graphHeight;

    let fitScale = (forcedScale !== null && forcedScale !== undefined)
      ? forcedScale
      : Math.min(scaleX, scaleY);

    // Clamp fitScale strictly between 0.5 (50%) and 1.5 (150%)
    fitScale = Math.max(0.5, Math.min(1.5, fitScale));

    // Left-aligned X viewport (so Core Node is at far left), vertically centered Y viewport
    const viewportX = paddingLeft - minX * fitScale;
    const viewportY = (canvasHeight - graphHeight * fitScale) / 2 - minY * fitScale - 70;

    setViewport({ x: viewportX, y: viewportY, scale: fitScale });
  };

  // Run autoFit on day/rootId changes and when fitViewTrigger changes (with requestAnimationFrame to ensure correct client measurements)
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      autoFit(0.5);
    });
    return () => cancelAnimationFrame(handle);
  }, [graph?.rootId, fitViewTrigger]);

  // Run autoFit on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        autoFit(0.5);
      });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const computed = computeHorizontalLayout(nodes, graph?.rootId);
    setLocalPositions(current => {
      const updated = {};
      nodes.forEach(node => {
        updated[node.id] = current[node.id] && current[node.id].dragged
          ? current[node.id]
          : computed[node.id] || { x: node.x, y: node.y, width: node.width, height: node.height };
      });
      return updated;
    });
  }, [graph, nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = event => {
      event.preventDefault();
      if (event.ctrlKey) {
        // Pinch-to-zoom gesture on macOS trackpad / Ctrl + Wheel
        zoom(-event.deltaY * 0.015);
      } else {
        // Two-finger swipe/scroll to pan the canvas
        setViewport(current => ({
          ...current,
          x: current.x - event.deltaX,
          y: current.y - event.deltaY
        }));
      }
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [setViewport, zoom]);

  const onPointerDown = event => {
    if (event.target.closest('.graph-node, .graph-controls, .tool-group')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { type: 'canvas', pointerX: event.clientX, pointerY: event.clientY, x: viewport.x, y: viewport.y };
  };
  const onNodePointerDown = (event, node) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); const position = localPositions[node.id] || node; drag.current = { type: 'node', nodeId: node.id, pointerX: event.clientX, pointerY: event.clientY, x: position.x, y: position.y, moved: false }; };
  const onPointerMove = event => {
    if (!drag.current) return;
    const current = drag.current;
    const dx = event.clientX - current.pointerX;
    const dy = event.clientY - current.pointerY;
    if (current.type === 'node') {
      if (Math.abs(dx) + Math.abs(dy) > 4) current.moved = true;
      setLocalPositions(positions => ({
        ...positions,
        [current.nodeId]: {
          ...positions[current.nodeId],
          x: current.x + dx / viewport.scale,
          y: current.y + dy / viewport.scale,
          dragged: true
        }
      }));
    } else {
      setViewport(view => ({ ...view, x: current.x + dx, y: current.y + dy }));
    }
  };
  const stopDrag = () => { if (drag.current?.type === 'node' && drag.current.moved) suppressClick.current = true; drag.current = null; };
  const positionOf = node => localPositions[node.id] || node;
  const pathFor = (source, target) => {
    const sourcePosition = positionOf(source);
    const targetPosition = positionOf(target);
    const sx = sourcePosition.x + sourcePosition.width;
    const sy = sourcePosition.y + sourcePosition.height / 2;
    const tx = targetPosition.x;
    const ty = targetPosition.y + targetPosition.height / 2;
    const bend = Math.max(40, (tx - sx) * 0.45);
    return `M${sx} ${sy} C${sx + bend} ${sy}, ${tx - bend} ${ty}, ${tx} ${ty}`;
  };
  const rootNode = nodes.find(n => n.id === graph?.rootId);
  const rootPos = rootNode ? positionOf(rootNode) : null;
  const orbX = rootPos && typeof rootPos.width === 'number' ? rootPos.x + rootPos.width / 2 : 185;
  const orbY = rootPos && typeof rootPos.height === 'number' ? rootPos.y + rootPos.height / 2 : 306;
  return <div className="map-card map-card-full"><div className="map-header"><div><div className="eyebrow">{topic.id} / NEURAL MAP</div><h2>Kéo node, phóng to và tự mở rộng ý</h2></div><div className="map-header-right"><div className="progress">{nodes.length} / {graph?.totalNodes || nodes.length} node hiện</div><div className="recall-toggle-row"><span className="toggle-label">BẮT BUỘC RECALL</span><button className={`switch ${recallEnabled ? 'on' : 'off'}`} onClick={() => setRecallEnabled(!recallEnabled)} aria-label="Bật tắt yêu cầu trả lời trước khi mở nhánh mới"><span className="slider" /><span className="switch-text">{recallEnabled ? 'ON' : 'OFF'}</span></button></div><div className="graph-controls"><button onClick={() => zoom(-0.1)} aria-label="Thu nhỏ">−</button><span>{Math.round(viewport.scale * 100)}%</span><button onClick={() => zoom(0.1)} aria-label="Phóng to">+</button><button onClick={reset} aria-label="Đặt lại graph">↺</button></div></div></div><div ref={canvasRef} className="map-canvas graph-canvas graph-canvas-full" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}><div className="graph-stage" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}><svg className="graph-edges" viewBox="0 0 1100 620" aria-hidden="true">{edges.map(edge => { const source = nodeMap[edge.source]; const target = nodeMap[edge.target]; return source && target ? <path key={`${edge.source}-${edge.target}`} className="edge edge-live" d={pathFor(source, target)} /> : null; })}<circle className="edge-orb" cx={orbX} cy={orbY} r="5" /></svg>{nodes.map((node, index) => { const position = positionOf(node); const isLeaf = node.isLeaf ?? !node.hasChildren; return <button key={node.id} className={`graph-node ${node.id === graph.rootId ? 'core' : `branch branch-${index % 3 + 1}`} ${isLeaf ? 'leaf' : 'expandable'} ${drag.current?.nodeId === node.id ? 'dragging' : ''}`} style={{ left: position.x, top: position.y, width: position.width, minHeight: position.height, borderLeft: node.id === graph.rootId ? undefined : '4px solid ' + ['#4ade80', '#3b82f6', '#ec4899', '#f59e0b', '#a855f7', '#14b8a6'][index % 6] }} onPointerDown={event => onNodePointerDown(event, node)} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onNodeClick(node); }}><span className="node-eyebrow">{node.eyebrow}</span><span className="node-title">{node.label}</span><span className="node-caption">{node.caption}</span><span className="node-pulse" /></button>; })}</div></div></div>;
}

function LegacyRecallPartner({ lecture }) {
  const [answer, setAnswer] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialQuestion = lecture.id === 'DAY 1'
      ? '“Thầy ơi, vì sao một prompt có context tốt lại cho câu trả lời đáng tin hơn?”'
      : `“Thầy ơi, thầy có thể giải thích sơ bộ cốt lõi của bài học ${lecture.title} không?”`;
    setMessages([
      { id: Date.now(), sender: 'ai', text: initialQuestion }
    ]);
  }, [lecture?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const submit = () => {
    if (!answer.trim()) return;
    const userAnswer = answer;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userAnswer }]);
    setAnswer('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: `“Em hiểu rồi. Vậy em tóm tắt bài ${lecture.id} bằng một ví dụ thực tế nhé?”` }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  if (isMinimized) {
    return (
      <button className="student-card-minimized" onClick={() => setIsMinimized(false)} aria-label="Mở rộng chatbot">
        <div className="bot-face">◕‿◕</div>
        <div className="minimized-text">
          <strong>Minh · Học sinh AI</strong>
          <span>Đang hỏi: {lecture.id}</span>
        </div>
        <span className="expand-icon">↖</span>
      </button>
    );
  }

  return (
    <aside className="student-card">
      <div className="student-top">
        <span className="eyebrow">RECALL PARTNER</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="student-badge">HỌC SINH AI</span>
          <button className="minimize-button" onClick={() => setIsMinimized(true)} aria-label="Thu nhỏ">
            −
          </button>
        </div>
      </div>
      <div className="bot">
        <div className="bot-face">◕‿◕</div>
        <div>
          <h3>Minh, học sinh của bạn</h3>
          <p>Đang hỏi lại: {lecture.title}</p>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user' : ''}`}>
            {msg.sender === 'ai' && <div className="chat-avatar">◕‿◕</div>}
            <div className={`bubble ${msg.sender === 'user' ? 'user' : ''}`}>{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message-row">
            <div className="chat-avatar">◕‿◕</div>
            <div className="bubble typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <textarea className="answer" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Gõ lời giải thích của bạn ở đây…" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
      <button className="send-button" onClick={submit} disabled={!answer.trim() || isTyping}>Gửi câu trả lời →</button>
      <div className="review-note">
        <span className="calendar">+ 3 NGÀY</span>
        <div>
          <strong>Phiên ôn kế tiếp</strong>
          <p>3 câu hỏi · phản hồi &amp; gợi ý cá nhân</p>
        </div>
      </div>
    </aside>
  );
}

function RecallPartner({ lecture, setActiveTopic, panelMode, setPanelMode, panelSize, setPanelSize, onCompleteRecall }) {
  const [selectedLessonId, setSelectedLessonId] = useState(lecture?.id || 'DAY 1');
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loop, setLoop] = useState(0);
  const [nLoop, setNLoop] = useState(3);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState('Chọn bài giảng, rồi bắt đầu phiên Feynman chủ động.');
  const [guardrail, setGuardrail] = useState(null);
  const [answerQuality, setAnswerQuality] = useState(null);
  const resizeRef = useRef(null);
  const sessionId = useRef(`manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const selectedLecture = lectures.find(item => item.id === selectedLessonId) || lectures[0];

  const resetSession = (lessonId = selectedLessonId) => {
    sessionId.current = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSelectedLessonId(lessonId); setMessages([]); setAnswer(''); setLoop(0); setStarted(false); setDone(false); setGuardrail(null); setAnswerQuality(null);
    setStatus('Sẵn sàng bắt đầu phiên học chủ động.');
    const matchingTopic = topics.find(t => t.id === lessonId);
    if (matchingTopic && setActiveTopic) {
      setActiveTopic(matchingTopic);
    }
  };

  useEffect(() => {
    if (lecture?.id && lecture.id !== selectedLessonId) {
      sessionId.current = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setSelectedLessonId(lecture.id); setMessages([]); setAnswer(''); setLoop(0); setStarted(false); setDone(false); setGuardrail(null); setAnswerQuality(null);
      setStatus('Sẵn sàng bắt đầu phiên học chủ động.');
    }
  }, [lecture?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const callAgent = async (mode, userAnswer = '') => {
    setIsTyping(true);
    const nextMessages = userAnswer ? [...messages, { id: Date.now(), sender: 'user', text: userAnswer }] : messages;
    if (userAnswer) setMessages(nextMessages);
    setAnswer('');
    setGuardrail(null);
    const agentMessageId = Date.now() + 1;
    setMessages(current => [...current, { id: agentMessageId, sender: 'ai', text: '' }]);
    try {
      const history = nextMessages.map(item => ({ role: item.sender === 'ai' ? 'assistant' : 'user', content: item.text }));
      const response = await fetch(`${AGENT_ORIGIN}/api/feynman/stream`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId.current, lesson_id: selectedLessonId, mode, manual_session: true, loop, n_loop: nLoop, history })
      });
      if (!response.ok || !response.body) throw new Error('Không thể kết nối luồng agent');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let assistantText = ''; let result = {};
      const consumeEvent = raw => {
        const lines = raw.split('\n'); const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim(); const dataLine = lines.find(line => line.startsWith('data:'))?.slice(5).trim();
        if (!event || !dataLine) return;
        const data = JSON.parse(dataLine);
        if (event === 'status') setStatus(data.message);
        if (event === 'meta') { result = data; setAnswerQuality(data.answer_quality || null); }
        if (event === 'token') { assistantText += data.text; setMessages(current => current.map(message => message.id === agentMessageId ? { ...message, text: assistantText } : message)); }
        if (event === 'error') throw new Error(data.message || 'Agent stream failed');
      };
      while (true) { const { value, done: streamDone } = await reader.read(); if (streamDone) break; buffer += decoder.decode(value, { stream: true }); const blocks = buffer.split('\n\n'); buffer = blocks.pop() || ''; blocks.forEach(consumeEvent); }
      setLoop(result.loop ?? loop); setStarted(true); setDone(Boolean(result.done));
      if (result.done && onCompleteRecall) {
        onCompleteRecall(selectedLessonId);
      }
      setStatus(result.done ? 'Agent đã hoàn tất đánh giá retention.' : result.thinking_summary || 'Agent đã chọn câu hỏi tiếp theo.');
      setGuardrail(result.guardrail || null);
    } catch (error) { setStatus(`Lỗi kết nối agent: ${error.message}`); }
    finally { setIsTyping(false); }
  };

  const start = () => callAgent('MANUAL_START');
  const submit = () => {
    const text = answer.trim();
    if (!text || isTyping || done) return;
    if (text.endsWith('?') && text.split(/\s+/).length < 25) {
      setGuardrail({ code: 'COUNTER_QUESTION', message: 'Minh đang cần thầy/cô trả lời câu hỏi hiện tại. Hãy giải thích lại bằng lời của mình trước nhé.' });
      inputRef.current?.focus();
      return;
    }
    callAgent('SCHEDULED', text);
  };

  if (panelMode === 'minimized') return <button className="student-card-minimized" onClick={() => setPanelMode('compact')}><div className="bot-face" style={{ background: 'none', width: '32px', height: '32px' }}><MascotAvatar /></div><div className="minimized-text"><strong>Minh · Học sinh AI</strong><span>{started ? `Đang học ${selectedLessonId}` : 'Sẵn sàng bắt đầu'}</span></div><span className="expand-icon">↗</span></button>;
  const startResize = event => {
    event.preventDefault();
    event.stopPropagation();
    resizeRef.current = { x: event.clientX, y: event.clientY, ...panelSize };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const resizePanel = event => {
    const start = resizeRef.current;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const changeX = -deltaX;
    const changeY = -deltaY;
    let scale = 1;
    if (Math.abs(changeX) / start.width > Math.abs(changeY) / start.height) {
      scale = (start.width + changeX) / start.width;
    } else {
      scale = (start.height + changeY) / start.height;
    }
    let newWidth = Math.round(start.width * scale);
    let newHeight = Math.round(start.height * scale);
    const ratio = 300 / 533;
    const maxScreenHeight = window.innerHeight - 120;
    const limitHeight = Math.min(760, maxScreenHeight);
    if (newHeight > limitHeight) {
      newHeight = limitHeight;
      newWidth = Math.round(limitHeight * ratio);
    }
    if (newWidth < 300 || newHeight < 533) {
      newWidth = 300;
      newHeight = 533;
    }
    setPanelSize({ width: newWidth, height: newHeight });
  };
  const stopResize = () => { resizeRef.current = null; };

  return <aside className={`student-card agent-chat-card ${panelMode === 'expanded' ? 'panel-expanded' : ''}`} style={{ '--panel-width': `${panelSize.width}px`, '--panel-height': `${panelSize.height}px` }} onPointerMove={resizePanel} onPointerUp={stopResize} onPointerCancel={stopResize}>
    <div className="resize-handle" onPointerDown={startResize} aria-label="Kéo để đổi kích thước chatbot" title="Kéo để đổi kích thước" />
    <div className="student-top"><span className="eyebrow">FEYNMAN REACT AGENT</span><div className="agent-window-controls"><span className="student-badge">MANUAL SESSION</span><button onClick={() => setPanelMode('minimized')} aria-label="Thu nhỏ chatbot">−</button></div></div>
    <div className="bot">
      <div className="bot-face" style={{ background: 'none', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MascotAvatar />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3>Minh, học sinh của bạn</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }}>
            {selectedLecture.title} · {loop}/{nLoop}
          </p>
          {started && (
            <button
              onClick={() => resetSession(selectedLessonId)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--green)',
                fontSize: '9px',
                fontWeight: 'bold',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '2px 0',
                outline: 'none'
              }}
              title="Nhấn để đổi bài học khác"
            >
              Đổi bài ↩
            </button>
          )}
        </div>
      </div>
    </div>
    {!started && <div className="agent-setup"><div className="agent-intro"><span>1 · Chọn bài</span><span>2 · Tự giải thích</span><span>3 · Nhận đánh giá</span></div><strong>Hôm nay thầy/cô muốn Minh hỏi về bài nào?</strong><p>Minh sẽ đọc từng đoạn nhỏ, hỏi một ý tại một thời điểm và chỉ chuyển tiếp khi phần hiện tại đã đủ chắc.</p><div className="lesson-mcq">{lectures.map(item => <button key={item.id} className={selectedLessonId === item.id ? 'selected' : ''} onClick={() => resetSession(item.id)}>{item.id.replace('DAY ', 'Bài ')}</button>)}</div><label className="loop-choice">Số lượt đối thoại <select value={nLoop} onChange={event => setNLoop(Number(event.target.value))}><option value="3">3 lượt</option><option value="5">5 lượt</option><option value="7">7 lượt</option></select></label><button className="send-button" onClick={start} disabled={isTyping}>Bắt đầu phiên {selectedLessonId} →</button></div>}
    {started && (
      <div className="chat-messages">
        {messages.filter(msg => msg.text !== '').map(msg => (
          <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="chat-avatar" style={{ background: 'none', width: '32px', height: '32px' }}>
                <MascotAvatar />
              </div>
            )}
            <div className={`bubble ${msg.sender === 'user' ? 'user' : ''}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (messages.length === 0 || messages[messages.length - 1].sender !== 'ai' || messages[messages.length - 1].text === '') && (
          <div className="chat-message-row">
            <div className="chat-avatar" style={{ background: 'none', width: '32px', height: '32px' }}>
              <MascotAvatar />
            </div>
            <div className="bubble typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    )}
    {started && guardrail && <div className="guardrail-card" role="alert"><strong>Giữ đúng nhịp học</strong><p>{guardrail.message}</p><button onClick={() => { setGuardrail(null); inputRef.current?.focus(); }}>Trả lời lại câu hỏi ↑</button></div>}
    {started && !done && <><label className="answer-label">Trả lời đúng câu hỏi của Minh bằng cách giải thích và ví dụ</label><textarea ref={inputRef} className="answer" value={answer} onChange={event => { setAnswer(event.target.value); if (guardrail) setGuardrail(null); }} placeholder="Ví dụ: Khái niệm này hoạt động như… vì…" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} /><button className="send-button" onClick={submit} disabled={!answer.trim() || isTyping}>Gửi để Minh đánh giá →</button></>}
    {started && answerQuality && <div className={`quality-chip quality-${answerQuality}`}><span>{answerQuality === 'good' ? '✓' : answerQuality === 'needs_clarification' ? '!' : '·'}</span>{answerQuality === 'good' ? 'Minh đánh giá: Đã hiểu tốt' : answerQuality === 'needs_clarification' ? 'Minh đánh giá: Cần giải thích thêm' : 'Minh chưa đủ căn cứ để đánh giá'}</div>}
    {done && <button className="send-button" onClick={() => resetSession(selectedLessonId)}>Phiên học mới ↻</button>}
    <div className="review-note"><span className="calendar">REACT</span><div><strong>{status}</strong><p>Manual session bỏ qua giờ nhắc, nhưng vẫn giữ checkpoint và N_LOOP.</p></div></div>
  </aside>;
}

function LearningView({ activeTopic, setActiveTopic, graph, onNodeClick, recallEnabled, setRecallEnabled, viewport, setViewport, zoom, reset, resetTrigger, fitViewTrigger, onCompleteRecall }) {
  const [panelMode, setPanelMode] = useState('compact');
  const [panelSize, setPanelSize] = useState({ width: 300, height: 533 });
  const dueLecture = lectures.find(lecture => lecture.learnedAt) || lectures[0];
  const currentLecture = lectures.find(l => l.id === activeTopic?.id) || dueLecture;
  const displayTopic = activeTopic || { id: 'ALL LESSONS', tag: '00 / OVERVIEW', title: 'TẤT CẢ BÀI GIẢNG', description: 'Toàn bộ lộ trình 5 bài học', node: '5 bài giảng trong lộ trình' };

  return (
    <div className="learning-workspace">
      <main id="learning" className="mindmap-container">
        <MindMap
          topic={displayTopic}
          graph={graph}
          onNodeClick={onNodeClick}
          recallEnabled={recallEnabled}
          setRecallEnabled={setRecallEnabled}
          viewport={viewport}
          setViewport={setViewport}
          zoom={zoom}
          reset={reset}
          resetTrigger={resetTrigger}
          fitViewTrigger={fitViewTrigger}
          panelMode={panelMode}
          panelSize={panelSize}
        />
        <RecallPartner
          lecture={currentLecture}
          setActiveTopic={setActiveTopic}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          panelSize={panelSize}
          setPanelSize={setPanelSize}
          onCompleteRecall={onCompleteRecall}
        />
      </main>
    </div>
  );
}

function LibraryView({ orderedLectures, moveLecture, selectedId, setSelectedId }) {
  const [query, setQuery] = useState('');
  const visible = orderedLectures.filter(lecture => `${lecture.title} ${lecture.tag} ${lecture.summary}`.toLowerCase().includes(query.toLowerCase()));
  const selected = orderedLectures.find(lecture => lecture.id === selectedId) || visible[0];
  return <main className="page-main" id="library"><div className="page-heading"><div><div className="eyebrow">LIBRARY / 05 BÀI GIẢNG</div><h1>Kho kiến thức<br /><em>đã nộp.</em></h1></div><p>Mỗi thanh là một bài giảng thật trong thư mục BÀI GIẢNG. Sắp xếp thứ tự học, mở ra để đọc nội dung và xem lịch ôn tự động.</p></div><div className="library-toolbar"><div className="library-count"><strong>{orderedLectures.length}</strong><span>bài giảng trong lộ trình</span></div><label className="search-box">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm bài giảng…" /></label></div><div className="library-layout"><section className="lecture-list">{visible.map((lecture, index) => <article className={`lecture-row ${selected?.id === lecture.id ? 'selected' : ''}`} key={lecture.id} onClick={() => setSelectedId(lecture.id)}><div className="lecture-index">{String(index + 1).padStart(2, '0')}</div><div className="lecture-main"><div className="lecture-meta"><span>{lecture.tag}</span><span>{lecture.duration}</span></div><h3>{lecture.title}</h3><p>{lecture.summary}</p><div className="lecture-status">{lecture.learnedAt ? <><i className="status-dot done" />Đã học · {formatDate(new Date(lecture.learnedAt))}</> : <><i className="status-dot next" />Sắp học theo lộ trình</>}</div></div><div className="row-controls"><button onClick={e => { e.stopPropagation(); moveLecture(index, -1); }} disabled={index === 0} aria-label="Đưa lên">↑</button><button onClick={e => { e.stopPropagation(); moveLecture(index, 1); }} disabled={index === visible.length - 1} aria-label="Đưa xuống">↓</button><span>↗</span></div></article>)}</section>{selected && <aside className="lecture-detail"><div className="detail-kicker">{selected.id} / BÀI GIẢNG</div><h2>{selected.title}</h2><div className="detail-info"><span>{selected.day}</span><span>{selected.duration}</span><span>{selected.tag}</span></div><div className="detail-rule" /><p className="detail-summary">{selected.summary}</p><div className="text-label">NỘI DUNG BÀI GIẢNG</div><p className="lecture-text">{selected.content}</p><div className="source-file">⌁ {selected.file}<span>đã đọc từ data pack</span></div></aside>}</div><div className="library-tip"><span>✦</span><div><strong>Gợi ý học thông minh</strong><p>Đọc lướt nội dung trước, sau đó đóng tài liệu và để Minh hỏi lại. Việc tự gọi lại giúp biến “đã xem” thành “đã nhớ”.</p></div></div></main>;
}

function ReviewView({ orderedLectures, onStartRecall, completedReviews = [] }) {
  const [reminder, setReminder] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRealtimeDate = (date) => {
    const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekday = weekdays[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `HÔM NAY · ${weekday.toUpperCase()}, ${day}/${month} ${hours}:${minutes}:${seconds}`;
  };

  const base = new Date('2026-07-28T19:30:00');
  const schedule = orderedLectures.flatMap((lecture, index) => spacing.map((gap, reviewIndex) => ({ lecture, reviewIndex, date: addDays(new Date(lecture.learnedAt || addDays(base, index)), gap) }))).sort((a, b) => a.date - b.date);
  const today = new Date('2026-07-30T12:00:00');
  const due = schedule.filter(item => item.date <= today).slice(0, 3);
  return <main className="page-main" id="review"><div className="page-heading"><div><div className="eyebrow">REVIEW ENGINE / SPACED RECALL</div><h1>Lịch ôn<br /><em>tự chạy.</em></h1></div><p>Lịch lấy đúng 5 bài trong Thư viện và ngày học thực tế. Mỗi bài quay lại theo nhịp 1 · 3 · 7 · 14 · 30 ngày để Minh chủ động hỏi bạn.</p></div><section className="review-overview"><div className="next-review"><div className="eyebrow" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatRealtimeDate(now)}</div><h2>{due.length ? `${due.length} lượt recall đang chờ` : 'Bạn đã hoàn thành lịch hôm nay'}</h2><p>{due.length ? `Minh sẽ bắt đầu bằng bài “${due[0].lecture.title}”.` : 'Lịch mới sẽ tự xuất hiện sau bài học tiếp theo.'}</p><button className="button primary" onClick={() => setReminder(value => !value)}>{reminder ? '✓ AI đang nhắc lúc 19:30' : 'Bật AI chủ động nhắc'}</button></div><div className="method-card"><span className="method-icon">↗</span><div><strong>Nhịp giãn cách mặc định</strong><p>Ngày học → +1 → +3 → +7 → +14 → +30 ngày</p><small>Dùng các lần active recall ở khoảng cách tăng dần; nếu trả lời sai, có thể đưa bài về phiên gần hơn.</small></div></div></section><div className="review-section-head"><div><div className="eyebrow">YOUR TIMELINE</div><h2>Dòng thời gian ghi nhớ</h2></div><span>{schedule.length} phiên đã lên lịch</span></div><section className="timeline">{schedule.slice(0, 14).map((item, index) => {
  const isCompleted = completedReviews.includes(item.lecture.id) || item.date <= new Date('2026-07-30T23:59:59');
  return <article className={`timeline-item ${item.date <= today && !isCompleted ? 'due' : ''} ${isCompleted ? 'completed' : ''}`} key={`${item.lecture.id}-${item.reviewIndex}`}><div className="timeline-date"><strong>{formatDate(item.date)}</strong><span>{isCompleted ? 'ĐÃ ÔN TẬP' : (item.date <= today ? 'CẦN ÔN TẬP' : `LẦN ${item.reviewIndex + 1}`)}</span></div><div className="timeline-connector"><i /></div><div className="timeline-content"><span>{item.lecture.id} · {item.lecture.tag}</span><h3>{item.lecture.title}</h3><p>{item.reviewIndex === 0 ? 'Recall nhanh: nói lại ý chính trong 60 giây.' : item.reviewIndex === 1 ? 'Giải thích lại bằng ví dụ của chính bạn.' : 'Kết nối bài này với một bài đã học trước.'}</p></div><button className={`ask-button ${isCompleted ? 'completed' : ''}`} onClick={() => !isCompleted && onStartRecall && onStartRecall(item.lecture)} disabled={isCompleted}>{isCompleted ? 'Đã ôn tập ✓' : 'Minh hỏi →'}</button></article>})}</section><div className="science-note">Lịch này là prototype dựa trên nguyên tắc học ngắt quãng, không phải khuyến nghị y khoa hay bảo đảm cho mọi người học. <a href="https://www.learningscientists.org/blog/2018/7/5-1" target="_blank" rel="noreferrer">Đọc cơ sở thiết kế ↗</a></div></main>;
}

function App() {
  const [view, setView] = useState('learning');
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [graph, setGraph] = useState({ nodes: [], edges: [], totalNodes: 0, rootId: null });
  const [selectedNode, setSelectedNode] = useState(null);
  const [orderedLectures, setOrderedLectures] = useState(lectures);
  const [selectedLectureId, setSelectedLectureId] = useState(lectures[0].id);
  const [recallEnabled, setRecallEnabled] = useState(true);
  const [completedReviews, setCompletedReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('completedReviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCompleteRecall = (lessonId) => {
    setCompletedReviews(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      try {
        localStorage.setItem('completedReviews', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Lifted viewport state and zoom helpers for global dashboard controls
  const [viewport, setViewport] = useState({ x: 18, y: 93, scale: 0.5 });
  const [resetTrigger, setResetTrigger] = useState(0);
  const clamp = value => Math.min(1.5, Math.max(0.5, value));
  const zoom = amount => setViewport(current => ({ ...current, scale: clamp(current.scale + amount) }));
  const reset = () => setResetTrigger(curr => curr + 1);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const triggerFitView = () => setFitViewTrigger(curr => curr + 1);

  const [showDayPicker, setShowDayPicker] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnterHocTap = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowDayPicker(true);
  };

  const handleMouseLeaveHocTap = () => {
    hoverTimer.current = setTimeout(() => {
      setShowDayPicker(false);
    }, 250);
  };

  const handleMouseEnterPanel = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleMouseLeavePanel = () => {
    setShowDayPicker(false);
  };

  const getDayId = topic => {
    return topic ? topic.id.toLowerCase().replace(' ', '') : 'day1';
  };

  useEffect(() => {
    const dayId = getDayId(activeTopic);
    fetch(`${GRAPH_API_ORIGIN}/api/graphs/${dayId}`)
      .then(response => {
        if (!response.ok) throw new Error(`Graph API ${response.status}`);
        return response.json();
      })
      .then(setGraph)
      .catch(() => setGraph({ nodes: [], edges: [], totalNodes: 0, rootId: null }));
  }, [activeTopic, resetTrigger]);

  const openNode = async node => {
    if (node.hasChildren || node.childrenCount > 0) {
      if (recallEnabled) {
        setSelectedNode(node);
      } else {
        await submitRecall('Auto-unlock', node);
      }
    }
  };

  const submitRecall = async (answer, nodeOverride) => {
    const targetNode = nodeOverride || selectedNode;
    if (!targetNode) return;
    const dayId = getDayId(activeTopic);
    const response = await fetch(`${GRAPH_API_ORIGIN}/api/graphs/${dayId}/expand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId: targetNode.id, answer })
    });
    const result = await response.json();
    if (!response.ok) return;
    setGraph(current => ({
      ...current,
      nodes: [...current.nodes, ...result.children.filter(child => !current.nodes.some(node => node.id === child.id))],
      edges: [...current.edges, ...result.edges.filter(edge => !current.edges.some(item => item.source === edge.source && item.target === edge.target))]
    }));
    setSelectedNode(null);
  };

  const moveLecture = (index, direction) => setOrderedLectures(items => { const next = [...items]; const target = index + direction; if (target < 0 || target >= next.length) return items;[next[index], next[target]] = [next[target], next[index]]; return next; });

  const handleStartRecall = (lecture) => {
    const matchedTopic = topics.find(t => t.id === lecture.id);
    if (matchedTopic) {
      setActiveTopic(matchedTopic);
    }
    setView('learning');
  };

  const page = view === 'library'
    ? <LibraryView orderedLectures={orderedLectures} moveLecture={moveLecture} selectedId={selectedLectureId} setSelectedId={setSelectedLectureId} />
    : view === 'review'
      ? <ReviewView orderedLectures={orderedLectures} onStartRecall={handleStartRecall} completedReviews={completedReviews} />
      : <LearningView
        activeTopic={activeTopic}
        setActiveTopic={setActiveTopic}
        graph={graph}
        onNodeClick={openNode}
        recallEnabled={recallEnabled}
        setRecallEnabled={setRecallEnabled}
        viewport={viewport}
        setViewport={setViewport}
        zoom={zoom}
        reset={reset}
        resetTrigger={resetTrigger}
        fitViewTrigger={fitViewTrigger}
        onCompleteRecall={handleCompleteRecall}
      />;

  return (
    <div className="app-layout">
      <Sidebar
        view={view}
        setView={setView}
        onMouseEnterHocTap={handleMouseEnterHocTap}
        onMouseLeaveHocTap={handleMouseLeaveHocTap}
      />
      {showDayPicker && (
        <aside
          className="day-picker-panel flyout"
          onMouseEnter={handleMouseEnterPanel}
          onMouseLeave={handleMouseLeavePanel}
        >
          <div className="day-picker-header">BÀI HỌC LỘ TRÌNH</div>
          <div className="day-picker-list">

            {topics.map(topic => (
              <button
                key={topic.id}
                className={`day-picker-item ${activeTopic?.id === topic.id ? 'active' : ''}`}
                onClick={() => { setActiveTopic(topic); setShowDayPicker(false); }}
              >
                <span className="day-badge">{topic.id.replace('DAY ', 'D')}</span>
                <div className="day-info">
                  <strong>{topic.id}</strong>
                  <span>{topic.title}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      )}
      <div className="main-content">
        <Dashboard
          view={view}
          graph={graph}
          recallEnabled={recallEnabled}
          setRecallEnabled={setRecallEnabled}
          viewport={viewport}
          zoom={zoom}
          reset={reset}
          orderedLectures={orderedLectures}
          fitView={triggerFitView}
        />
        <div className="view-container">
          {page}
        </div>
      </div>
      <RecallModal node={selectedNode} step={selectedNode ? selectedNode.eyebrow : '01'} onClose={() => setSelectedNode(null)} onUnlock={submitRecall} />

      <nav className="bottom-nav">
        <button className={view === 'learning' ? 'active' : ''} onClick={() => setView('learning')}>
          <span className="nav-icon"> </span>
          <span className="nav-label">Học tập</span>
        </button>
        <button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>
          <span className="nav-icon"> </span>
          <span className="nav-label">Lịch ôn</span>
        </button>
        <button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}>
          <span className="nav-icon"> </span>
          <span className="nav-label">Thư viện</span>
        </button>
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
