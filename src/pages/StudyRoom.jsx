import { useState, Suspense } from 'react';
import Room3D from '../components/room3d/Room3D';
import StudyScene from '../components/room3d/StudyScene';
import RoomSheet from '../components/room/RoomSheet';
import TasksPanel from '../components/room/panels/TasksPanel';
import NotesPanel from '../components/room/panels/NotesPanel';
import PomodoroPanel from '../components/room/panels/PomodoroPanel';
import FoldersPanel from '../components/room/panels/FoldersPanel';
import RadioPanel from '../components/room/panels/RadioPanel';
import SettingsPanel from '../components/room/panels/SettingsPanel';
import ExamsPanel from '../components/room/panels/ExamsPanel';
import AvatarCreatorPanel from '../components/room/panels/AvatarCreatorPanel';
import RoomGuide from '../components/RoomGuide';
import RoomHelpSheet from '../components/RoomHelpSheet';
import { useSound } from '../hooks/useSound';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Pencil, ClipboardList, Timer, Radio, Settings, HelpCircle, ArrowLeft, Calendar, User, X } from 'lucide-react';
import MiniPlayer from '../components/ui/MiniPlayer';

const ROOM = 'study';
const PANEL_META = {
  tasks: { title: <><Pencil size={18} strokeWidth={1.5} /> Tasks</>, roomId: ROOM },
  notes: { title: <><ClipboardList size={18} strokeWidth={1.5} /> Notes</>, roomId: ROOM },
  pomodoro: { title: <><Timer size={18} strokeWidth={1.5} /> Timer</>, roomId: null },
  folders: { title: <><BookOpen size={18} strokeWidth={1.5} /> Subjects</>, roomId: ROOM },
  radio: { title: <><Radio size={18} strokeWidth={1.5} /> FM radio</>, roomId: null },
  exams: { title: <><Calendar size={18} strokeWidth={1.5} /> Exams</>, roomId: null },
  settings: { title: <><Settings size={18} strokeWidth={1.5} /> Settings</>, roomId: null },
  help: { title: <><HelpCircle size={18} strokeWidth={1.5} /> Help</>, roomId: null },
  desk: { title: <><Pencil size={18} strokeWidth={1.5} /> Tasks</>, roomId: ROOM },
  board: { title: <><ClipboardList size={18} strokeWidth={1.5} /> Notes</>, roomId: ROOM },
  shelf: { title: <><Settings size={18} strokeWidth={1.5} /> Settings</>, roomId: null },
};

export default function StudyRoom() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [beatsActive, setBeatsActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [guideDone, setGuideDone] = useState(false);

  const { playPanelOpen } = useSound();

  const handleFurnitureClick = (panelId) => {
    playPanelOpen();
    setActive(panelId);
  };

  const handleClose = () => {
    setActive(null);
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="scene-bar">
        <button className="btn-icon" onClick={() => navigate('/home')}><ArrowLeft size={18} strokeWidth={1.5} /></button>
        <h1 style={{ flex: 1 }}><BookOpen size={16} strokeWidth={1.5} /> Study</h1>
        <MiniPlayer />
        <button className="btn-icon" onClick={() => setShowAvatar(true)} title="Avatar"><User size={18} strokeWidth={1.5} /></button>
        <button className="btn-icon" onClick={() => setShowHelp(true)} title="Help"><HelpCircle size={18} strokeWidth={1.5} /></button>
      </div>
      {!guideDone && <RoomGuide roomId={ROOM} onDismiss={() => setGuideDone(true)} />}
      <Suspense fallback={<div className="room-loading">Loading room…</div>}>
        <Room3D roomId={ROOM} wallColor="#e8e0d6" floorColor="#c8b898" ceilingColor="#f0e8dd">
          <StudyScene onFurnitureClick={handleFurnitureClick} beatsActive={beatsActive} roomCode={ROOM} />
        </Room3D>
      </Suspense>
      <RoomSheet open={!!active || showHelp} onClose={() => { handleClose(); setShowHelp(false); }} title={showHelp ? <><HelpCircle size={18} strokeWidth={1.5} /> Help</> : (active ? PANEL_META[active]?.title : '')}>
        {showHelp && <RoomHelpSheet roomId={ROOM} />}
        {!showHelp && active === 'tasks' && <TasksPanel roomId={ROOM} />}
        {!showHelp && active === 'notes' && <NotesPanel roomId={ROOM} />}
        {!showHelp && active === 'pomodoro' && <PomodoroPanel />}
        {!showHelp && active === 'folders' && <FoldersPanel roomId={ROOM} />}
        {!showHelp && active === 'radio' && <RadioPanel onBeatsChange={setBeatsActive} />}
        {!showHelp && active === 'exams' && <ExamsPanel />}
        {!showHelp && active === 'settings' && <SettingsPanel />}
        {!showHelp && (active === 'desk' || active === 'tasks') && <TasksPanel roomId={ROOM} />}
        {!showHelp && (active === 'board' || active === 'notes') && <NotesPanel roomId={ROOM} />}
        {!showHelp && active === 'shelf' && <SettingsPanel />}
      </RoomSheet>
      {showAvatar && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            padding: '2rem',
            boxShadow: 'var(--shadow-2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Avatar</h2>
              <button onClick={() => setShowAvatar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} strokeWidth={1.5} /></button>
            </div>
            <AvatarCreatorPanel onClose={() => setShowAvatar(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
