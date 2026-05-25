// Digital Home — Room screen (3D scene + bottom sheet)

const { useState } = React;

const ROOMS = {
  'my-room': {
    name: "Hadron's Room", icon: 'bed', accent: '#c4a882',
    wallTop: '#1e1510', wallBot: '#0f0c08', floorLine: 0.54,
    glowRgb: '196,168,130',
    furniture: [
      { id: 'tasks',  icon: 'pencil',         label: 'Desk',      x: 32, y: 60 },
      { id: 'notes',  icon: 'clipboard-list', label: 'Shelf',     x: 64, y: 56 },
    ],
  },
  study: {
    name: "Hadron's Study", icon: 'book-open', accent: '#7a9e6b',
    wallTop: '#16191a', wallBot: '#0c0f0c', floorLine: 0.54,
    glowRgb: '122,158,107',
    furniture: [
      { id: 'tasks',    icon: 'pencil',         label: 'Desk',      x: 26, y: 62 },
      { id: 'notes',    icon: 'clipboard-list', label: 'Corkboard', x: 50, y: 56 },
      { id: 'pomodoro', icon: 'timer',           label: 'Clock',     x: 70, y: 62 },
      { id: 'radio',    icon: 'radio',           label: 'Radio',     x: 86, y: 57 },
    ],
  },
  work: {
    name: "Hadron's Work", icon: 'briefcase', accent: '#6b8f9e',
    wallTop: '#141618', wallBot: '#0c0d10', floorLine: 0.54,
    glowRgb: '107,143,158',
    furniture: [
      { id: 'tasks',    icon: 'pencil',         label: 'Desk',   x: 28, y: 62 },
      { id: 'notes',    icon: 'clipboard-list', label: 'Board',  x: 54, y: 56 },
      { id: 'pomodoro', icon: 'timer',          label: 'Timer',  x: 76, y: 62 },
    ],
  },
};

const PANEL_META = {
  tasks:    { label: 'Tasks',    icon: 'pencil' },
  notes:    { label: 'Notes',    icon: 'clipboard-list' },
  pomodoro: { label: 'Timer',    icon: 'timer' },
  radio:    { label: 'FM Radio', icon: 'radio' },
};

function FurnitureBtn({ id, icon, label, x, y, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        background: hov ? `rgba(${accent === '#c4a882' ? '196,168,130' : accent === '#7a9e6b' ? '122,158,107' : '107,143,158'},0.2)` : 'rgba(16,14,12,0.72)',
        border: `1px solid ${hov ? accent : 'rgba(196,168,130,0.22)'}`,
        borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
        fontFamily: 'inherit', transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <Icon name={icon} size={15} color={hov ? accent : '#c4a882'} />
      <span style={{ fontSize: 10, color: '#f5f0e8', fontWeight: 500, letterSpacing: '0.03em' }}>{label}</span>
    </button>
  );
}

function Scene({ cfg, onFurnitureClick }) {
  const fl = cfg.floorLine * 100;
  return (
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(180deg, ${cfg.wallTop} 0%, ${cfg.wallTop} ${fl}%, #0f0c08 ${fl}%, ${cfg.wallBot} 100%)`,
    }}>
      {/* ceiling glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '50%', pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, rgba(${cfg.glowRgb},0.14), transparent 65%)`,
      }} />
      {/* floor warmth */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '25%', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(80,56,30,0.28), transparent 70%)',
      }} />
      {/* perspective floor lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.09 }}>
        <line x1="0" y1={`${fl}%`} x2="50%" y2="36%" stroke="#c4a882" strokeWidth="1" />
        <line x1="100%" y1={`${fl}%`} x2="50%" y2="36%" stroke="#c4a882" strokeWidth="1" />
        <line x1="0" y1="100%" x2="50%" y2="36%" stroke="#c4a882" strokeWidth="0.6" strokeDasharray="5,7" />
        <line x1="100%" y1="100%" x2="50%" y2="36%" stroke="#c4a882" strokeWidth="0.6" strokeDasharray="5,7" />
      </svg>
      {/* avatar silhouette */}
      <div style={{ position: 'absolute', bottom: `${(1 - cfg.floorLine) * 100}%`, left: '46%', opacity: 0.42 }}>
        <svg viewBox="0 0 30 60" width={30} height={60}>
          <circle cx={15} cy={9} r={7} fill="#c4a882" />
          <rect x={8} y={16} width={14} height={24} rx={4} fill="#c4a882" opacity={0.75} />
          <rect x={8} y={40} width={5} height={16} rx={3} fill="#c4a882" opacity={0.65} />
          <rect x={17} y={40} width={5} height={16} rx={3} fill="#c4a882" opacity={0.65} />
        </svg>
      </div>
      {/* furniture buttons */}
      {cfg.furniture.map((f) => (
        <FurnitureBtn key={f.id} {...f} accent={cfg.accent} onClick={onFurnitureClick} />
      ))}
      {/* hint */}
      <div style={{
        position: 'absolute', bottom: 10, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 11, color: '#8a7f6e',
          background: 'rgba(20,18,16,0.75)', borderRadius: 20, padding: '4px 12px',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>Tap furniture to open a panel</span>
      </div>
    </div>
  );
}

function RoomScreen({ room, onBack }) {
  const [activePanel, setActivePanel] = useState(null);
  const cfg = ROOMS[room] || ROOMS['my-room'];

  const CONTENT = {
    tasks:    <TasksPanel roomId={room} />,
    notes:    <NotesPanel />,
    pomodoro: <PomodoroPanel />,
    radio:    <RadioPanel />,
  };

  const sheetTitle = activePanel ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <Icon name={PANEL_META[activePanel].icon} size={14} color={cfg.accent} />
      {PANEL_META[activePanel].label}
    </span>
  ) : null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SceneBar
        roomName={cfg.name}
        roomIcon={cfg.icon}
        roomColor={cfg.accent}
        onBack={onBack}
        onHelp={() => {}}
      />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Scene cfg={cfg} onFurnitureClick={setActivePanel} />
        <Sheet open={!!activePanel} onClose={() => setActivePanel(null)} title={sheetTitle}>
          {activePanel && CONTENT[activePanel]}
        </Sheet>
      </div>
    </div>
  );
}

Object.assign(window, { RoomScreen });
