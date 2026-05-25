// Digital Home — Panels: Tasks, Notes, Pomodoro, Radio

const { useState, useEffect, useRef } = React;

const SEED_TASKS = {
  'my-room': [
    { id: 1, text: 'Reply to Jenna about Friday plans', done: false },
    { id: 2, text: 'Order new desk lamp', done: false },
    { id: 3, text: 'Buy oat milk on the way home', done: true },
  ],
  study: [
    { id: 1, text: 'Read chapter 4 of Computer Networks', done: false },
    { id: 2, text: 'Submit final paper draft', done: false },
    { id: 3, text: 'Email professor about extension', done: false },
    { id: 4, text: 'Print readings for tomorrow', done: true },
  ],
  work: [
    { id: 1, text: 'Prepare Q2 review presentation', done: false },
    { id: 2, text: 'Send standup notes to team', done: true },
  ],
};

const SEED_NOTES = [
  { id: 1, text: 'Look into MOOC platforms for distributed systems.' },
  { id: 2, text: 'Coffee chat with Tom on Thursday — ask about the new stack.' },
];

const STATIONS = [
  { name: 'Lo-Fi Girl', genre: 'Pop' },
  { name: 'Jazz24', genre: 'Jazz' },
  { name: 'Classical KUSC', genre: 'Classical' },
  { name: 'FluxFM Jazz', genre: 'Jazz' },
  { name: 'BBC World Service', genre: 'News' },
];

// ── Tasks ─────────────────────────────────────────────────────────────────────
function TasksPanel({ roomId }) {
  const [tasks, setTasks] = useState(SEED_TASKS[roomId] || []);
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    setTasks((p) => [...p, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };
  const toggle = (id) => setTasks((p) => p.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <form onSubmit={(e) => { e.preventDefault(); add(); }} style={{ display: 'flex', gap: 8 }}>
        <DhInput placeholder="Add a task…" value={input} onChange={(e) => setInput(e.target.value)} />
        <BtnPrimary onClick={add}>Add</BtnPrimary>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8a7f6e', fontSize: 14, padding: '20px 0' }}>No tasks yet.</p>
        )}
        {tasks.map((t) => (
          <TaskItem key={t.id} text={t.text} done={t.done} onToggle={() => toggle(t.id)} onDelete={() => del(t.id)} />
        ))}
      </div>
    </div>
  );
}

// ── Notes ─────────────────────────────────────────────────────────────────────
function NotesPanel() {
  const [notes, setNotes] = useState(SEED_NOTES);
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    setNotes((p) => [...p, { id: Date.now(), text: input.trim() }]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <form onSubmit={(e) => { e.preventDefault(); add(); }} style={{ display: 'flex', gap: 8 }}>
        <DhInput placeholder="Write a note…" value={input} onChange={(e) => setInput(e.target.value)} />
        <BtnPrimary onClick={add}>Add</BtnPrimary>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notes.map((n) => (
          <div key={n.id} style={{
            background: '#2b2b2b', border: '1px solid rgba(196,168,130,0.12)',
            borderRadius: 8, padding: '10px 14px',
          }}>
            <p style={{ fontSize: 14, color: '#f5f0e8', lineHeight: 1.55 }}>{n.text}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4 }}>
              <BtnSmall ghost onClick={() => setNotes((p) => p.filter((x) => x.id !== n.id))}>
                <Icon name="x" size={12} color="#8a7f6e" />
              </BtnSmall>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pomodoro ──────────────────────────────────────────────────────────────────
function PomodoroPanel() {
  const WORK = 25 * 60, BREAK = 5 * 60;
  const [mode, setMode] = useState('work');
  const [secs, setSecs] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [beats, setBeats] = useState(false);
  const interval = useRef(null);
  const total = mode === 'work' ? WORK : BREAK;

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSecs((s) => {
          if (s <= 1) {
            clearInterval(interval.current);
            setRunning(false);
            const next = mode === 'work' ? 'break' : 'work';
            setMode(next);
            setSecs(next === 'work' ? WORK : BREAK);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [running, mode]);

  const reset = () => { setRunning(false); setSecs(mode === 'work' ? WORK : BREAK); };
  const R = 52, CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - secs / total);
  const ringColor = mode === 'work' ? '#c4a882' : '#7a9e6b';
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 8 }}>
      <div style={{ position: 'relative', width: 132, height: 132 }}>
        <svg viewBox="0 0 132 132" width={132} height={132}>
          <circle cx={66} cy={66} r={R} fill="none" stroke="#333" strokeWidth={6} />
          <circle cx={66} cy={66} r={R} fill="none" stroke={ringColor} strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 66 66)"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: ringColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {mode === 'work' ? 'Focus' : 'Break'}
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#f5f0e8', fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
            {mm}:{ss}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!running
          ? <BtnPrimary onClick={() => setRunning(true)}><Icon name="play" size={14} /> Start</BtnPrimary>
          : <BtnPrimary onClick={() => setRunning(false)}><Icon name="pause" size={14} /> Pause</BtnPrimary>
        }
        <BtnSecondary onClick={reset}><Icon name="undo-2" size={14} /> Reset</BtnSecondary>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#8a7f6e' }}>
        <Icon name="headphones" size={14} color="#8a7f6e" />
        <span>Binaural beats</span>
        <Toggle checked={beats} onChange={() => setBeats((b) => !b)} />
      </div>
    </div>
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────────
function RadioPanel() {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);

  const playStation = (s) => { setCurrent(s); setPlaying(true); };
  const togglePlay = () => current && setPlaying((p) => !p);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* now playing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={togglePlay} style={{
          width: 46, height: 46, borderRadius: '50%',
          background: current ? '#c4a882' : '#333',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: current ? 'pointer' : 'default', flexShrink: 0,
        }}>
          <Icon name={playing ? 'pause' : 'play'} size={18} color={current ? '#1a1a1a' : '#8a7f6e'} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          {current ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0e8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="radio" size={13} color="#c4a882" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.name}</span>
              </div>
              {playing && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 18, marginTop: 5 }}>
                  {[35, 70, 100, 60, 80, 45].map((h, i) => (
                    <div key={i} style={{
                      width: 3, borderRadius: 2, background: '#c4a882', height: `${h}%`,
                      animation: `wv 1s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <span style={{ fontSize: 13, color: '#8a7f6e' }}>Pick a station below</span>
          )}
        </div>
      </div>
      {/* station list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STATIONS.map((s) => (
          <button key={s.name} onClick={() => playStation(s)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px',
            background: current?.name === s.name ? 'rgba(196,168,130,0.1)' : '#2b2b2b',
            border: `1px solid ${current?.name === s.name ? 'rgba(196,168,130,0.4)' : '#333'}`,
            borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', width: '100%',
          }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#f5f0e8' }}>{s.name}</span>
            <span style={{ fontSize: 12, color: '#8a7f6e' }}>{s.genre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TasksPanel, NotesPanel, PomodoroPanel, RadioPanel });
