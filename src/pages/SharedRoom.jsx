import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSharedRoom } from '../hooks/useSharedRoom';
import { useSharedList } from '../hooks/useSharedList';
import { usePresence } from '../hooks/usePresence';
import { useAuth } from '../hooks/useAuth';
import PresenceAvatars from '../components/PresenceAvatars';
import { ShoppingCart, Target, Wifi, ArrowLeft, X, Undo2, Trash2, ChevronLeft, ChevronRight, Circle, Check, Lightbulb, Sparkles } from 'lucide-react';

// ─── Shopping Mode ────────────────────────────────────────────────────────────
function ShoppingMode({ items, onToggle, onExit }) {
  const [index, setIndex] = useState(0);
  const undone = items.filter((i) => !i.done);
  const current = undone[index] || null;
  const [dragX, setDragX] = useState(0);

  const handleTouchStart = (e) => setDragX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - dragX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) {
      if (current) onToggle(current.id, current.done);
      setIndex((i) => Math.min(i, undone.length - 2));
    } else {
      setIndex((i) => Math.min(i + 1, undone.length - 1));
    }
  };

  if (!current) {
    return (
      <div className="shopping-mode">
        <button className="shopping-exit" onClick={onExit}><X size={20} strokeWidth={1.5} /> Exit</button>
        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>All done! <Sparkles size={18} strokeWidth={1.5} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "0.25rem" }} className="text-accent" /></p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={onExit}>Back to list</button>
      </div>
    );
  }

  return (
    <div className="shopping-mode" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button className="shopping-exit" onClick={onExit}><X size={20} /> Exit</button>
      <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{index + 1} of {undone.length} remaining</p>
      <p style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3, padding: '0 1rem' }}>
        {current.text}{current.qty > 1 ? ` ×${current.qty}` : ''}
      </p>
      {current.addedByName && (
        <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Added by {current.addedByName}</p>
      )}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
        <button className="btn-small" onClick={() => setIndex((i) => Math.min(i + 1, undone.length - 1))}>
          <ChevronRight size={16} strokeWidth={1.5} /> Skip
        </button>
        <button className="btn-primary" onClick={() => { onToggle(current.id, current.done); setIndex((i) => Math.max(0, Math.min(i, undone.length - 2))); }}>
          <Check size={16} strokeWidth={1.5} style={{ marginRight: "0.25rem" }} /> In cart
        </button>
      </div>
      <p className="muted" style={{ fontSize: '0.75rem', marginTop: '1.5rem' }}>Swipe left = in cart · Swipe right = skip</p>
    </div>
  );
}

// ─── Shared List ──────────────────────────────────────────────────────────────
function getNameColor(name) {
  const colors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8', '#4db6ac'];
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h + name.charCodeAt(i)) % colors.length;
  return colors[h];
}

function SharedList({ roomCode, listName }) {
  const { items, loading, addItem, toggleItem, deleteItem, clearCompleted } = useSharedList(roomCode, listName);
  const [text, setText] = useState('');
  const [qty, setQty] = useState(1);
  const [shopping, setShopping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addItem(text, qty);
    setText('');
    setQty(1);
  };

  const remaining = items.filter((i) => !i.done).length;
  const hasCompleted = items.some((i) => i.done);

  if (shopping) {
    return <ShoppingMode items={items} onToggle={toggleItem} onExit={() => setShopping(false)} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.85rem' }} className="muted">
          {remaining} item{remaining !== 1 ? 's' : ''} remaining
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {hasCompleted && (
            <button className="btn-small" onClick={clearCompleted} title="Clear completed">
              <Trash2 size={14} strokeWidth={1.5} /> Clear done
            </button>
          )}
          {listName === 'grocery' && remaining > 0 && (
            <button className="btn-small" onClick={() => setShopping(true)}>
              <ShoppingCart size={14} strokeWidth={1.5} style={{ marginRight: "0.25rem" }} /> Shop
            </button>
          )}
        </div>
      </div>

      <form className="task-form" onSubmit={handleSubmit} style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder={`Add to ${listName}…`} value={text}
          onChange={(e) => setText(e.target.value)} autoComplete="off" style={{ flex: 1, minWidth: 0 }} />
        <input type="number" min="1" max="99" value={qty} onChange={(e) => setQty(Number(e.target.value))}
          style={{ width: '3rem', textAlign: 'center' }} title="Quantity" />
        <button type="submit">Add</button>
      </form>

      <div className="task-list">
        {loading && <p className="muted">Loading…</p>}
        {!loading && items.length === 0 && <p className="muted">Nothing here yet.</p>}
        {items.map((item) => {
          const initial = (item.addedByName || '?').charAt(0).toUpperCase();
          const color = getNameColor(item.addedByName);
          return (
            <div key={item.id} className={`task-item ${item.done ? 'done' : ''}`}>
              <button className="task-toggle" onClick={() => toggleItem(item.id, item.done)}>
                {item.done ? <Undo2 size={16} strokeWidth={1.5} /> : <Circle size={16} strokeWidth={1.5} />}
              </button>
              <span className="task-text">
                {item.text}{item.qty > 1 ? ` ×${item.qty}` : ''}
              </span>
              {item.addedByName && (
                <span title={item.addedByName} style={{
                  width: 20, height: 20, borderRadius: '50%', background: color,
                  color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{initial}</span>
              )}
              <button className="task-delete" onClick={() => deleteItem(item.id)}><X size={16} strokeWidth={1.5} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'grocery', label: <><ShoppingCart size={18} strokeWidth={1.5} /> Grocery</> },
  { key: 'activities', label: <><Target size={18} strokeWidth={1.5} /> Activities</> },
];

export default function SharedRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { room, members, loading } = useSharedRoom(code);
  const { others } = usePresence(code);
  const [tab, setTab] = useState('grocery');

  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!room) return <div className="loading-screen"><p className="muted">Room not found</p></div>;

  return (
    <div className="room-page">
      <header className="room-header" style={{ marginBottom: '0.5rem' }}>
        <button className="btn-icon" onClick={() => navigate('/home')}><ArrowLeft size={18} strokeWidth={1.5} /></button>
        <h1 style={{ fontSize: '1.1rem', flex: 1 }}><Wifi size={18} strokeWidth={1.5} /> {room.name}</h1>
        <PresenceAvatars members={others} />
      </header>
      <p style={{ color: '#8a7f6e', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        Code: {code} · {members.length} member{members.length !== 1 ? 's' : ''}
        {others.length > 0 && <span style={{ marginLeft: '0.5rem', color: '#22c55e' }}>· {others.length} online</span>}
      </p>
      <p className="muted" style={{ textAlign: 'left', padding: '0 0 0.5rem', fontSize: '0.8rem' }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><Lightbulb size={16} strokeWidth={1.5} /> Add items that sync in real-time with everyone in this room.</span>
      </p>
      <nav className="room-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`room-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="room-content" key={tab}>
        {tab === 'grocery' && <SharedList roomCode={code} listName="grocery" />}
        {tab === 'activities' && <SharedList roomCode={code} listName="activities" />}
      </div>
    </div>
  );
}
