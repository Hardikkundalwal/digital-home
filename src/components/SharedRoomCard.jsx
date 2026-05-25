import { Wifi, ArrowRight } from 'lucide-react';

export default function SharedRoomCard({ room, onClick }) {
  return (
    <button className="shared-room-card" onClick={onClick}>
      <span className="shared-room-icon"><Wifi size={18} strokeWidth={1.5} /></span>
      <div className="shared-room-info">
        <h3>{room.name}</h3>
        <p className="shared-room-code">{room.id}</p>
      </div>
      <span className="shared-room-arrow"><ArrowRight size={18} strokeWidth={1.5} /></span>
    </button>
  );
}
