import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useTasks } from '../hooks/useTasks';
import { useUserSharedRooms, useSharedRoom } from '../hooks/useSharedRoom';
import { auth } from '../firebase';
import { SplineScene } from '../components/ui/spline-scene';
import { SparklesText } from '../components/ui/sparkles-text';
import WeatherWidget from '../components/WeatherWidget';
import DailyQuote from '../components/DailyQuote';
import WelcomeTour from '../components/WelcomeTour';
import SharedRoomCard from '../components/SharedRoomCard';
import { LogOut, Plus, Bed, BookOpen, Briefcase } from 'lucide-react';
import ShaderBackground from '../components/ui/shader-background';
import MiniPlayer from '../components/ui/MiniPlayer';

const ROOMS = [
  { id: 'my-room', path: '/room/my-room', icon: Bed,       label: 'Room',  desc: 'Personal tasks, notes, your space' },
  { id: 'study',   path: '/room/study',   icon: BookOpen,  label: 'Study', desc: 'University tasks, notes, pomodoro' },
  { id: 'work',    path: '/room/work',    icon: Briefcase, label: 'Work',  desc: 'Job tasks, notes, quick links' },
];

function RoomTaskCount({ roomId }) {
  const { tasks } = useTasks(roomId);
  const n = tasks.filter((t) => !t.done).length;
  return <>{n}</>;
}

function HeroRoomItem({ room, name }) {
  const navigate = useNavigate();
  const Icon = room.icon;
  return (
    <button className="home-hero-room-item" onClick={() => navigate(room.path)}>
      <span className="home-hero-room-icon"><Icon size={15} /></span>
      <span className="home-hero-room-name">{name}</span>
      <span className="home-hero-room-count"><RoomTaskCount roomId={room.id} /></span>
      <span className="home-hero-room-arrow">→</span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { displayName, loading: profileLoading, exists, tourCompleted, saveDisplayName, completeTour } = useProfile();
  const { rooms: sharedRooms } = useUserSharedRooms();
  const { createRoom, joinRoom } = useSharedRoom(null);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [mount3d, setMount3d] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMount3d(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await saveDisplayName(nameInput);
    setSaving(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const code = await createRoom(createName);
    if (code) { setCreatedCode(code); setCreateName(''); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinError('');
    const ok = await joinRoom(joinCode.toUpperCase().trim());
    if (ok) { setShowJoin(false); setJoinCode(''); }
    else setJoinError('Room not found. Check the code and try again.');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (profileLoading) {
    return <div className="loading-screen"><span className="loading-dots"><span /><span /><span /></span></div>;
  }

  if (user && !exists) {
    return (
      <div className="dv2-door">
        <motion.div
          className="dv2-door-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dv2-door-brand">
            <div className="dv2-door-emblem"><span className="dv2-door-emblem-inner">DH</span></div>
            <h1 className="dv2-door-title">Welcome home</h1>
            <p className="dv2-door-tagline">What should we call you?</p>
          </div>
          <div className="dv2-door-sep">
            <span className="dv2-door-sep-line" />
            <span className="dv2-door-sep-dot">◆</span>
            <span className="dv2-door-sep-line" />
          </div>
          <form className="dv2-door-form" onSubmit={handleNameSubmit}>
            <div className="dv2-field">
              <label className="dv2-label">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Hardik"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" className="dv2-door-btn" disabled={saving}>
              <span>{saving ? 'Saving…' : 'Enter my home'}</span>
              {!saving && <span className="dv2-btn-arrow">→</span>}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (user && exists && !tourCompleted && displayName) {
    return <WelcomeTour onComplete={completeTour} />;
  }

  return (
    <>
    <ShaderBackground />
    <div className="home">
      <motion.header
        className="home-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <SparklesText
          text={displayName ? `${displayName}'s Home` : 'Digital Home'}
          className="dv2-home-title text-4xl md:text-6xl"
          colors={{ first: '#a8edea', second: '#fed6e3' }}
          sparklesCount={8}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MiniPlayer />
          <button className="dv2-signout" onClick={() => signOut(auth)} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </motion.header>

      <p className="home-date">{today}</p>
      {displayName && <p className="home-greeting">Welcome back, {displayName}</p>}

      <div className="home-widgets">
        <WeatherWidget />
        <DailyQuote />
      </div>

      {/* Hero: room list left, robot right */}
      <motion.div
        className="home-hero-split"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="home-hero-rooms">
          <span className="home-hero-rooms-label">Your Rooms</span>
          {ROOMS.map((room) => (
            <HeroRoomItem
              key={room.id}
              room={room}
              name={displayName ? `${displayName}'s ${room.label}` : room.label}
            />
          ))}
        </div>
        <div className="home-hero-scene">
          {mount3d ? (
            <SplineScene
              scene="/models/scene.splinecode"
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading 3D…</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="home-section">
        <div className="home-section-header">
          <h2>Shared Rooms</h2>
          <div className="home-section-actions">
            {!showCreate && !showJoin && (
              <>
                <button className="btn-small" onClick={() => setShowCreate(true)}><Plus size={12} /> Create</button>
                <button className="btn-small btn-ghost" onClick={() => setShowJoin(true)}>Join</button>
              </>
            )}
          </div>
        </div>

        {showCreate && (
          <div className="shared-form">
            {!createdCode ? (
              <form className="task-form" onSubmit={handleCreate}>
                <input type="text" placeholder="Room name..." value={createName} onChange={(e) => setCreateName(e.target.value)} autoComplete="off" required />
                <button type="submit">Create</button>
                <button type="button" className="btn-small btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              </form>
            ) : (
              <div className="shared-code-display">
                <p>Room created! Share this code:</p>
                <div className="shared-code">{createdCode}</div>
                <button className="btn-small" onClick={() => navigator.clipboard?.writeText(createdCode)}>Copy</button>
                <button className="btn-small btn-ghost" onClick={() => { setShowCreate(false); setCreatedCode(''); }}>Done</button>
              </div>
            )}
          </div>
        )}

        {showJoin && (
          <div className="shared-form">
            <form className="task-form" onSubmit={handleJoin}>
              <input type="text" placeholder="Room code (e.g. OUR-X7K2)" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} autoComplete="off" required />
              <button type="submit">Join</button>
              <button type="button" className="btn-small btn-ghost" onClick={() => { setShowJoin(false); setJoinError(''); }}>Cancel</button>
            </form>
            {joinError && <p className="error">{joinError}</p>}
          </div>
        )}

        <div className="shared-room-list">
          {sharedRooms.length === 0 && (
            <p className="muted" style={{ padding: '1rem 0' }}>No shared rooms yet. Create or join one.</p>
          )}
          {sharedRooms.map((r) => (
            <SharedRoomCard key={r.id} room={r} onClick={() => navigate(`/shared/${r.id}`)} />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
