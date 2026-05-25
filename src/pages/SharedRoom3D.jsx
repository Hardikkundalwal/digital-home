import { useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Room3D from '../components/room3d/Room3D';
import StudyScene from '../components/room3d/StudyScene';
import WorkScene from '../components/room3d/WorkScene';
import MyRoomScene from '../components/room3d/MyRoomScene';
import RoomSheet from '../components/room/RoomSheet';
import SettingsPanel from '../components/room/panels/SettingsPanel';
import { useSharedRoom } from '../hooks/useSharedRoom';
import { usePresence } from '../hooks/usePresence';
import { ArrowLeft, Settings } from 'lucide-react';

const ROOM_CONFIG = {
  study: {
    displayName: 'Study',
    wallColor: '#e8e0d6',
    floorColor: '#c8b898',
    ceilingColor: '#f0e8dd',
    SceneComponent: StudyScene,
  },
  work: {
    displayName: 'Work',
    wallColor: '#d8dde3',
    floorColor: '#b8bec4',
    ceilingColor: '#dde0e4',
    SceneComponent: WorkScene,
  },
  myroom: {
    displayName: 'My Room',
    wallColor: '#ede8e2',
    floorColor: '#c8b898',
    ceilingColor: '#f0e8dd',
    SceneComponent: MyRoomScene,
  },
};

/**
 * SharedRoom3D - 3D room view for shared rooms with multi-avatar support
 * Combines the 3D scene with real-time presence sync
 */
export default function SharedRoom3D() {
  const { code, sceneType = 'study' } = useParams();
  const navigate = useNavigate();
  const { room, members, loading, error } = useSharedRoom(code);
  const { others, error: presenceError } = usePresence(code);
  const [activePanelId, setActivePanelId] = useState(null);

  const config = ROOM_CONFIG[sceneType] || ROOM_CONFIG.study;
  const SceneComponent = config.SceneComponent;

  if (loading) return <div className="loading-screen">...</div>;
  if (!room) return <div className="loading-screen"><p className="muted">Room not found</p></div>;
  if (error) return <div className="loading-screen"><p className="muted">Error: {error.message}</p></div>;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="scene-bar">
        <button className="btn-icon" onClick={() => navigate('/home')}><ArrowLeft size={18} /></button>
        <h1 style={{ flex: 1, fontSize: '1rem' }}>
          {room.name}
          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#8a7f6e' }}>
            ({others?.length || 0} online)
          </span>
        </h1>
        <button className="btn-icon" onClick={() => setActivePanelId('settings')} title="Settings">
          <Settings size={18} />
        </button>
      </div>

      <Suspense fallback={<div className="room-loading">Loading shared room…</div>}>
        <Room3D
          roomId={`shared-${code}`}
          wallColor={config.wallColor}
          floorColor={config.floorColor}
          ceilingColor={config.ceilingColor}
        >
          <SceneComponent roomCode={code} onFurnitureClick={() => {}} />
        </Room3D>
      </Suspense>

      <RoomSheet
        open={!!activePanelId}
        onClose={() => setActivePanelId(null)}
        title={activePanelId === 'settings' ? <><Settings size={18} /> Settings</> : ''}
      >
        {activePanelId === 'settings' && <SettingsPanel />}
      </RoomSheet>
    </div>
  );
}
