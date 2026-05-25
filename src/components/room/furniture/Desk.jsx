import { Pencil, Lightbulb } from 'lucide-react';

export default function Desk({ onClick, active }) {
  return (
    <button className={`furniture f-desk ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="desk-top" />
      <div className="desk-items">
        <span className="desk-lamp"><Lightbulb size={18} /></span>
        <span className="desk-notepad"><Pencil size={18} /></span>
      </div>
      <div className="desk-label">Desk</div>
    </button>
  );
}
