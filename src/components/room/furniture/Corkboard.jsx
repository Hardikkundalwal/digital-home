import { Pin } from 'lucide-react';

export default function Corkboard({ onClick, active }) {
  return (
    <button className={`furniture f-board ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="board-surface">
        <div className="board-pin" style={{ top: '20%', left: '25%' }}><Pin size={18} /></div>
        <div className="board-pin" style={{ top: '50%', left: '60%' }}><Pin size={18} /></div>
      </div>
    </button>
  );
}
