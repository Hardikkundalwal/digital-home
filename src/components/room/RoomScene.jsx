import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { ArrowLeft, DoorOpen } from 'lucide-react';

export default function RoomScene({ roomId, emoji, title, children, wallClass }) {
  const navigate = useNavigate();

  return (
    <div className="room-scene">
      <header className="scene-header">
        <button className="btn-icon" onClick={() => navigate('/home')}><ArrowLeft size={18} /></button>
        <h1>{emoji} {title}</h1>
        <button className="btn-icon" onClick={() => signOut(auth)} title="Leave home"><DoorOpen size={18} /></button>
      </header>
      <div className={`scene-room ${wallClass || ''}`}>
        <div className="room-wall">
          <div className="wall-content">
            {children}
          </div>
        </div>
        <div className="room-floor" />
      </div>
    </div>
  );
}
