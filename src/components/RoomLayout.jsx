import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { ArrowLeft } from 'lucide-react';

export default function RoomLayout({ emoji, defaultTitle, roomId, tabs }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName } = useProfile();
  const currentTab = location.pathname.split('/').pop();
  const title = displayName ? `${displayName}'s ${defaultTitle}` : defaultTitle;

  return (
    <div className="room-page" data-room={roomId}>
      <header className="room-header">
        <button className="btn-icon" onClick={() => navigate('/home')}><ArrowLeft size={18} /></button>
        <h1>{emoji} {title}</h1>
      </header>

      <nav className="room-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`room-tab ${currentTab === tab.path ? 'active' : ''}`}
            onClick={() => navigate(`/room/${roomId}/${tab.path}`)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="room-content" key={currentTab}>
        <Outlet context={{ roomId }} />
      </div>
    </div>
  );
}
