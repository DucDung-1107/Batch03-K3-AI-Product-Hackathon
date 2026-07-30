import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './styles-extra.css';
import './styles-content.css';
import './styles-graph.css';
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
const API_ORIGIN = typeof window === 'undefined' ? 'http://127.0.0.1:8787' : `${window.location.protocol}//${window.location.hostname}:8787`;
const formatDate = date => new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(date);
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };

function Header({ view, setView }) {
  return <header className="topbar"><button className="brand" onClick={() => setView('learning')}>Veu<span>Ron</span></button><nav><button className={view === 'learning' ? 'active' : ''} onClick={() => setView('learning')}>Học tập</button><button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>Lịch ôn</button><button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}>Thư viện</button></nav><button className="avatar" aria-label="Hồ sơ">✦</button></header>;
}

function TopicCard({ topic, selected, onSelect }) {
  return <button className={`topic-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(topic)}><span className="topic-number">{topic.tag}</span><h3>{topic.title}</h3><p>{topic.description}</p><span className="topic-arrow">↗</span></button>;
}

function RecallModal({ node, step, onClose, onUnlock }) {
  const [answer, setAnswer] = useState('');
  if (!node) return null;
  const submit = () => { if (answer.trim()) onUnlock(answer); };
  return <div className="modal" role="dialog" aria-modal="true"><div className="prompt-card"><div className="prompt-step">RECALL PROMPT / 0{step}</div><h2>{node.question}</h2><p>Đừng mở tài liệu vội. Hãy tự gọi lại điều bạn nhớ, viết vài ý ngắn trước, rồi Veuron mới mở nhánh tiếp theo.</p><textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Viết điều bạn nhớ được…" autoFocus /><div className="modal-actions"><button className="button secondary" onClick={onClose}>Để sau</button><button className="button primary" disabled={!answer.trim()} onClick={submit}>Mở nhánh tiếp →</button></div></div></div>;
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

  const nodeYMap = {};
  let nextLeafY = 0;
  const spacingY = 120;
  const spacingX = 320;
  const startX = 60;

  const layoutNode = (node) => {
    const children = childrenMap[node.id] || [];
    if (children.length === 0) {
      nodeYMap[node.id] = nextLeafY * spacingY;
      nextLeafY++;
    } else {
      children.forEach(child => layoutNode(child));
      const firstY = nodeYMap[children[0].id];
      const lastY = nodeYMap[children[children.length - 1].id];
      nodeYMap[node.id] = (firstY + lastY) / 2;
    }
  };

  layoutNode(rootNode);

  nodes.forEach(node => {
    if (nodeYMap[node.id] === undefined) {
      nodeYMap[node.id] = nextLeafY * spacingY;
      nextLeafY++;
    }
  });

  const rootY = nodeYMap[rootNode.id] || 0;
  const offsetY = 250 - rootY;

  const positions = {};
  nodes.forEach(node => {
    positions[node.id] = {
      x: startX + node.depth * spacingX,
      y: nodeYMap[node.id] + offsetY,
      width: node.width || (node.depth === 0 ? 250 : 225),
      height: node.height || (node.depth === 0 ? 112 : 88)
    };
  });
  return positions;
};

function MindMap({ topic, graph, onNodeClick }) {
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef(null);
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  const nodeMap = Object.fromEntries(nodes.map(node => [node.id, node]));
  const [localPositions, setLocalPositions] = useState({});
  const suppressClick = useRef(false);
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
  const clamp = value => Math.min(1.55, Math.max(.65, value));
  const zoom = amount => setViewport(current => ({ ...current, scale: clamp(current.scale + amount) }));
  const reset = () => setViewport({ x: 0, y: 0, scale: 1 });
  const onPointerDown = event => { if (event.target.closest('.graph-node, .graph-controls')) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { type: 'canvas', pointerX: event.clientX, pointerY: event.clientY, x: viewport.x, y: viewport.y }; };
  const onNodePointerDown = (event, node) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); const position = localPositions[node.id] || node; drag.current = { type: 'node', nodeId: node.id, pointerX: event.clientX, pointerY: event.clientY, x: position.x, y: position.y, moved: false }; };
  const onPointerMove = event => { if (!drag.current) return; const current = drag.current; const dx = event.clientX - current.pointerX; const dy = event.clientY - current.pointerY; if (current.type === 'node') { if (Math.abs(dx) + Math.abs(dy) > 4) current.moved = true; setLocalPositions(positions => ({ ...positions, [current.nodeId]: { ...positions[current.nodeId], x: current.x + dx / viewport.scale, y: current.y + dy / viewport.scale, dragged: true } })); } else setViewport(view => ({ ...view, x: current.x + dx, y: current.y + dy })); };
  const stopDrag = () => { if (drag.current?.type === 'node' && drag.current.moved) suppressClick.current = true; drag.current = null; };
  const onWheel = event => { zoom(event.deltaY > 0 ? -.08 : .08); };
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
  const orbX = rootPos ? rootPos.x + rootPos.width / 2 : 185;
  const orbY = rootPos ? rootPos.y + rootPos.height / 2 : 306;
  return <div className="map-card map-card-full"><div className="map-header"><div><div className="eyebrow">{topic.id} / NEURAL MAP</div><h2>Kéo node, phóng to và tự mở rộng ý</h2></div><div className="map-header-right"><div className="progress">{nodes.length} / {graph?.totalNodes || nodes.length} node hiện</div><div className="graph-controls"><button onClick={() => zoom(-.12)} aria-label="Thu nhỏ">−</button><span>{Math.round(viewport.scale * 100)}%</span><button onClick={() => zoom(.12)} aria-label="Phóng to">+</button><button onClick={reset} aria-label="Đặt lại graph">↺</button></div></div></div><div className="map-canvas graph-canvas graph-canvas-full" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onWheel={onWheel}><div className="graph-stage" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}><svg className="graph-edges" viewBox="0 0 1100 620" aria-hidden="true">{edges.map(edge => { const source = nodeMap[edge.source]; const target = nodeMap[edge.target]; return source && target ? <path key={`${edge.source}-${edge.target}`} className="edge edge-live" d={pathFor(source, target)} /> : null; })}<circle className="edge-orb" cx={orbX} cy={orbY} r="5" /></svg>{nodes.map((node, index) => { const position = positionOf(node); const isLeaf = node.isLeaf ?? !node.hasChildren; return <button key={node.id} className={`graph-node ${node.id === graph.rootId ? 'core' : `branch branch-${index % 3 + 1}`} ${isLeaf ? 'leaf' : 'expandable'} ${drag.current?.nodeId === node.id ? 'dragging' : ''}`} style={{ left: position.x, top: position.y, width: position.width, minHeight: position.height }} onPointerDown={event => onNodePointerDown(event, node)} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onNodeClick(node); }}><span className="node-eyebrow">{node.eyebrow}</span><span className="node-title">{node.label}</span><span className="node-caption">{node.caption}</span><span className="node-pulse" /></button>; })}</div><div className="graph-hint"><span>✥</span>Nhấn giữ node để kéo · kéo nền để pan · lăn chuột để zoom</div></div></div>;
}

function RecallPartner({ lecture }) {
  const [answer, setAnswer] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: '“Thầy ơi, vì sao một prompt có context tốt lại cho câu trả lời đáng tin hơn?”' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

function LearningView({ activeTopic, setActiveTopic, graph, onNodeClick }) {
  const dueLecture = lectures.find(lecture => lecture.learnedAt) || lectures[0];
  const displayTopic = activeTopic || { id: 'ALL LESSONS', tag: '00 / OVERVIEW', title: 'TẤT CẢ BÀI GIẢNG', description: 'Toàn bộ lộ trình 5 bài học', node: '5 bài giảng trong lộ trình' };
  return <main id="learning"><section className="hero"><div><div className="eyebrow">LEARNING SPACE / 05</div><h1>Học sâu hơn.<br />Nhớ lâu hơn.</h1></div><div className="hero-copy"><p>Biến kiến thức phức tạp thành những nhánh tư duy nhỏ — rồi tự gọi lại chúng bằng đối thoại.</p><div className="day-progress">{Array.from({ length: 7 }, (_, i) => <span className={i < 3 ? 'active' : ''} key={i} />)}</div></div></section><section className="lesson-picker"><div><div className="eyebrow">CHỌN BÀI HỌC</div><strong>{displayTopic.title}</strong><span>{activeTopic ? displayTopic.description : 'Xem tổng quan toàn bộ 5 bài trong lộ trình'}</span></div><label className="lesson-select"><span>Đang học</span><select value={activeTopic?.id || 'ALL'} onChange={e => setActiveTopic(e.target.value === 'ALL' ? null : topics.find(topic => topic.id === e.target.value))}><option value="ALL">Tất cả bài giảng</option>{topics.map(topic => <option key={topic.id} value={topic.id}>{topic.id} · {topic.title}</option>)}</select></label></section><section className="workspace"><MindMap topic={displayTopic} graph={graph} onNodeClick={onNodeClick} /><RecallPartner lecture={dueLecture} /></section></main>;
}

function LibraryView({ orderedLectures, moveLecture, selectedId, setSelectedId }) {
  const [query, setQuery] = useState('');
  const visible = orderedLectures.filter(lecture => `${lecture.title} ${lecture.tag} ${lecture.summary}`.toLowerCase().includes(query.toLowerCase()));
  const selected = orderedLectures.find(lecture => lecture.id === selectedId) || visible[0];
  return <main className="page-main" id="library"><div className="page-heading"><div><div className="eyebrow">LIBRARY / 05 BÀI GIẢNG</div><h1>Kho kiến thức<br /><em>đã nộp.</em></h1></div><p>Mỗi thanh là một bài giảng thật trong thư mục BÀI GIẢNG. Sắp xếp thứ tự học, mở ra để đọc nội dung và xem lịch ôn tự động.</p></div><div className="library-toolbar"><div className="library-count"><strong>{orderedLectures.length}</strong><span>bài giảng trong lộ trình</span></div><label className="search-box">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm bài giảng…" /></label></div><div className="library-layout"><section className="lecture-list">{visible.map((lecture, index) => <article className={`lecture-row ${selected?.id === lecture.id ? 'selected' : ''}`} key={lecture.id} onClick={() => setSelectedId(lecture.id)}><div className="lecture-index">{String(index + 1).padStart(2, '0')}</div><div className="lecture-main"><div className="lecture-meta"><span>{lecture.tag}</span><span>{lecture.duration}</span></div><h3>{lecture.title}</h3><p>{lecture.summary}</p><div className="lecture-status">{lecture.learnedAt ? <><i className="status-dot done" />Đã học · {formatDate(new Date(lecture.learnedAt))}</> : <><i className="status-dot next" />Sắp học theo lộ trình</>}</div></div><div className="row-controls"><button onClick={e => { e.stopPropagation(); moveLecture(index, -1); }} disabled={index === 0} aria-label="Đưa lên">↑</button><button onClick={e => { e.stopPropagation(); moveLecture(index, 1); }} disabled={index === visible.length - 1} aria-label="Đưa xuống">↓</button><span>↗</span></div></article>)}</section>{selected && <aside className="lecture-detail"><div className="detail-kicker">{selected.id} / BÀI GIẢNG</div><h2>{selected.title}</h2><div className="detail-info"><span>{selected.day}</span><span>{selected.duration}</span><span>{selected.tag}</span></div><div className="detail-rule" /><p className="detail-summary">{selected.summary}</p><div className="text-label">NỘI DUNG BÀI GIẢNG</div><p className="lecture-text">{selected.content}</p><div className="source-file">⌁ {selected.file}<span>đã đọc từ data pack</span></div></aside>}</div><div className="library-tip"><span>✦</span><div><strong>Gợi ý học thông minh</strong><p>Đọc lướt nội dung trước, sau đó đóng tài liệu và để Minh hỏi lại. Việc tự gọi lại giúp biến “đã xem” thành “đã nhớ”.</p></div></div></main>;
}

function ReviewView({ orderedLectures }) {
  const [reminder, setReminder] = useState(true);
  const base = new Date('2026-07-28T19:30:00');
  const schedule = orderedLectures.flatMap((lecture, index) => spacing.map((gap, reviewIndex) => ({ lecture, reviewIndex, date: addDays(new Date(lecture.learnedAt || addDays(base, index)), gap) }))).sort((a, b) => a.date - b.date);
  const today = new Date('2026-07-30T12:00:00');
  const due = schedule.filter(item => item.date <= today).slice(0, 3);
  return <main className="page-main" id="review"><div className="page-heading"><div><div className="eyebrow">REVIEW ENGINE / SPACED RECALL</div><h1>Lịch ôn<br /><em>tự chạy.</em></h1></div><p>Lịch lấy đúng 5 bài trong Thư viện và ngày học thực tế. Mỗi bài quay lại theo nhịp 1 · 3 · 7 · 14 · 30 ngày để Minh chủ động hỏi bạn.</p></div><section className="review-overview"><div className="next-review"><div className="eyebrow">HÔM NAY · {formatDate(today)}</div><h2>{due.length ? `${due.length} lượt recall đang chờ` : 'Bạn đã hoàn thành lịch hôm nay'}</h2><p>{due.length ? `Minh sẽ bắt đầu bằng bài “${due[0].lecture.title}”.` : 'Lịch mới sẽ tự xuất hiện sau bài học tiếp theo.'}</p><button className="button primary" onClick={() => setReminder(value => !value)}>{reminder ? '✓ AI đang nhắc lúc 19:30' : 'Bật AI chủ động nhắc'}</button></div><div className="method-card"><span className="method-icon">↗</span><div><strong>Nhịp giãn cách mặc định</strong><p>Ngày học → +1 → +3 → +7 → +14 → +30 ngày</p><small>Dùng các lần active recall ở khoảng cách tăng dần; nếu trả lời sai, có thể đưa bài về phiên gần hơn.</small></div></div></section><div className="review-section-head"><div><div className="eyebrow">YOUR TIMELINE</div><h2>Dòng thời gian ghi nhớ</h2></div><span>{schedule.length} phiên đã lên lịch</span></div><section className="timeline">{schedule.slice(0, 14).map((item, index) => <article className={`timeline-item ${item.date <= today ? 'due' : ''}`} key={`${item.lecture.id}-${item.reviewIndex}`}><div className="timeline-date"><strong>{formatDate(item.date)}</strong><span>{item.date <= today ? 'CẦN ÔN' : `LẦN ${item.reviewIndex + 1}`}</span></div><div className="timeline-connector"><i /></div><div className="timeline-content"><span>{item.lecture.id} · {item.lecture.tag}</span><h3>{item.lecture.title}</h3><p>{item.reviewIndex === 0 ? 'Recall nhanh: nói lại ý chính trong 60 giây.' : item.reviewIndex === 1 ? 'Giải thích lại bằng ví dụ của chính bạn.' : 'Kết nối bài này với một bài đã học trước.'}</p></div><button className="ask-button">Minh hỏi →</button></article>)}</section><div className="science-note">Lịch này là prototype dựa trên nguyên tắc học ngắt quãng, không phải khuyến nghị y khoa hay bảo đảm cho mọi người học. <a href="https://www.learningscientists.org/blog/2018/7/5-1" target="_blank" rel="noreferrer">Đọc cơ sở thiết kế ↗</a></div></main>;
}

function App() {
  const [view, setView] = useState('learning');
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [graph, setGraph] = useState({ nodes: [], edges: [], totalNodes: 0, rootId: null });
  const [selectedNode, setSelectedNode] = useState(null);
  const [orderedLectures, setOrderedLectures] = useState(lectures);
  const [selectedLectureId, setSelectedLectureId] = useState(lectures[0].id);
  useEffect(() => { fetch(`${API_ORIGIN}/api/graphs/day1`).then(response => { if (!response.ok) throw new Error(`Graph API ${response.status}`); return response.json(); }).then(setGraph).catch(() => setGraph({ nodes: [], edges: [], totalNodes: 0, rootId: null })); }, []);
  const openNode = node => {
    // Leaf nodes are endpoints: clicking them intentionally does nothing.
    // Every node with children must pass through recall before its branch is revealed.
    if (node.hasChildren || node.childrenCount > 0) setSelectedNode(node);
  };
  const submitRecall = async answer => { const response = await fetch(`${API_ORIGIN}/api/graphs/day1/expand`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nodeId: selectedNode.id, answer }) }); const result = await response.json(); if (!response.ok) return; setGraph(current => ({ ...current, nodes: [...current.nodes, ...result.children.filter(child => !current.nodes.some(node => node.id === child.id))], edges: [...current.edges, ...result.edges.filter(edge => !current.edges.some(item => item.source === edge.source && item.target === edge.target))] })); setSelectedNode(null); };
  const moveLecture = (index, direction) => setOrderedLectures(items => { const next = [...items]; const target = index + direction; if (target < 0 || target >= next.length) return items; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const page = view === 'library' ? <LibraryView orderedLectures={orderedLectures} moveLecture={moveLecture} selectedId={selectedLectureId} setSelectedId={setSelectedLectureId} /> : view === 'review' ? <ReviewView orderedLectures={orderedLectures} /> : <LearningView activeTopic={activeTopic} setActiveTopic={setActiveTopic} graph={graph} onNodeClick={openNode} />;
  return (
    <>
      <Header view={view} setView={setView} />
      {page}
      <RecallModal node={selectedNode} step={selectedNode ? selectedNode.eyebrow : '01'} onClose={() => setSelectedNode(null)} onUnlock={submitRecall} />
      
      <nav className="bottom-nav">
        <button className={view === 'learning' ? 'active' : ''} onClick={() => setView('learning')}>
          <span className="nav-icon">🧠</span>
          <span className="nav-label">Học tập</span>
        </button>
        <button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>
          <span className="nav-icon">📅</span>
          <span className="nav-label">Lịch ôn</span>
        </button>
        <button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">Thư viện</span>
        </button>
      </nav>
    </>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
