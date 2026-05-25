// Digital Home — Primitives
// Exports: Icon, BtnPrimary, BtnSecondary, BtnIcon, BtnSmall,
//          DhInput, Toggle, Sheet, RoomCard, TaskItem, WeatherPill, SceneBar

const { useState, useEffect, useRef } = React;

// ── Icon ──────────────────────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: { 'stroke-width': '1.75', width: String(size), height: String(size) },
      nodes: [el],
    });
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', color, flexShrink: 0 }} />;
}

// ── Buttons ──────────────────────────────────────────────────────────────────
function BtnPrimary({ children, onClick, style, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '9px 18px', background: '#c4a882', color: '#1a1a1a',
      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
      cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
      opacity: disabled ? 0.5 : 1, flexShrink: 0,
      ...style,
    }}>{children}</button>
  );
}

function BtnSecondary({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '8px 14px', background: '#2b2b2b', color: '#f5f0e8',
      border: '1px solid #333', borderRadius: 8, fontSize: 14, fontWeight: 500,
      cursor: 'pointer', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}

function BtnIcon({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'none', border: '1px solid #333', borderRadius: 8,
      padding: '8px 10px', cursor: 'pointer', color: '#f5f0e8',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function BtnSmall({ children, onClick, ghost }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 10px', fontSize: 12, borderRadius: 8,
      border: ghost ? 'none' : '1px solid #333',
      background: ghost ? 'none' : '#2b2b2b',
      color: ghost ? '#8a7f6e' : '#f5f0e8',
      cursor: 'pointer', fontFamily: 'inherit',
    }}>{children}</button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
function DhInput({ placeholder, value, onChange, type = 'text', autoFocus }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      style={{
        flex: 1, minWidth: 0, padding: '10px 12px',
        border: '1px solid #333', borderRadius: 8,
        background: '#2b2b2b', color: '#f5f0e8',
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
      }}
    />
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span style={{
        position: 'absolute', inset: 0, background: checked ? '#c4a882' : '#3d3d3d',
        borderRadius: 22, transition: 'background 0.2s ease',
      }}>
        <span style={{
          position: 'absolute', left: checked ? 22 : 3, top: 3,
          width: 18, height: 18, background: '#fff', borderRadius: '50%',
          transition: 'left 0.2s ease',
        }} />
      </span>
    </label>
  );
}

// ── Sheet ─────────────────────────────────────────────────────────────────────
function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 90,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '75%',
        background: 'rgba(30,30,30,0.92)',
        backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
        borderTop: '1px solid rgba(196,168,130,0.2)',
        zIndex: 100,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div onClick={onClose} style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'rgba(245,240,232,0.25)',
          margin: '14px auto 0', cursor: 'pointer', flexShrink: 0,
        }} />
        {title && (
          <div style={{
            fontSize: 15, fontWeight: 600, padding: '12px 20px 0',
            color: '#f5f0e8', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>{title}</div>
        )}
        <div style={{
          padding: '14px 20px 28px',
          overflowY: 'auto', flex: 1,
          WebkitOverflowScrolling: 'touch',
        }}>{children}</div>
      </div>
    </>
  );
}

// ── RoomCard ──────────────────────────────────────────────────────────────────
function RoomCard({ icon, name, description, summary, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: '#242424',
        border: '1px solid rgba(196,168,130,0.14)',
        borderTop: `3px solid ${accent}`,
        borderRadius: 16, padding: 18, fontFamily: 'inherit',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.2)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow 0.2s, transform 0.15s',
        color: 'inherit',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, marginBottom: 10,
        background: accent === '#c4a882' ? 'rgba(196,168,130,0.15)' : accent === '#7a9e6b' ? 'rgba(122,158,107,0.15)' : 'rgba(107,143,158,0.15)',
        color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#f5f0e8', marginBottom: 3 }}>{name}</div>
      <div style={{ fontSize: 13, color: '#8a7f6e' }}>{description}</div>
      {summary && <div style={{ marginTop: 8, fontSize: 12, color: accent, fontWeight: 500 }}>{summary}</div>}
    </button>
  );
}

// ── TaskItem ──────────────────────────────────────────────────────────────────
function TaskItem({ text, done, onToggle, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#2b2b2b', border: '1px solid rgba(196,168,130,0.1)',
      borderRadius: 8, padding: '10px 12px', opacity: done ? 0.55 : 1,
    }}>
      <button onClick={onToggle} style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: done ? 'none' : '1.5px solid #c4a882',
        background: done ? '#c4a882' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#1a1a1a',
      }}>
        {done && <Icon name="check" size={12} />}
      </button>
      <span style={{
        flex: 1, fontSize: 14, color: '#f5f0e8',
        textDecoration: done ? 'line-through' : 'none',
      }}>{text}</span>
      <button onClick={onDelete} style={{
        background: 'none', border: 'none', color: '#8a7f6e',
        cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', opacity: 0.6,
      }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

// ── WeatherPill ───────────────────────────────────────────────────────────────
function WeatherPill({ temp, condition, iconName }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#242424', border: '1px solid rgba(196,168,130,0.14)',
      borderRadius: 8, padding: '7px 12px', fontSize: 13, flexShrink: 0,
    }}>
      <Icon name={iconName || 'sun'} size={15} color="#c4a882" />
      <span style={{ fontWeight: 600, color: '#f5f0e8' }}>{temp}</span>
      <span style={{ color: '#8a7f6e', fontSize: 12 }}>{condition}</span>
    </div>
  );
}

// ── SceneBar ──────────────────────────────────────────────────────────────────
function SceneBar({ roomName, roomIcon, roomColor, onBack, onHelp }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px', background: 'linear-gradient(135deg, #242424, #1a1a1a)',
      borderBottom: '1px solid #333', flexShrink: 0,
    }}>
      <BtnIcon onClick={onBack}><Icon name="arrow-left" size={16} /></BtnIcon>
      <div style={{
        flex: 1, fontSize: 15, fontWeight: 600, color: '#f5f0e8',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <Icon name={roomIcon} size={16} color={roomColor} />
        {roomName}
      </div>
      <BtnIcon onClick={onHelp} title="Help"><Icon name="help-circle" size={16} /></BtnIcon>
    </div>
  );
}

Object.assign(window, {
  Icon, BtnPrimary, BtnSecondary, BtnIcon, BtnSmall,
  DhInput, Toggle, Sheet, RoomCard, TaskItem, WeatherPill, SceneBar,
});
