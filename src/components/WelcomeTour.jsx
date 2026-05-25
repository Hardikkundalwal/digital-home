import { Home, Clock, Pin, BookOpen, Radio, Image, Lightbulb, Users } from 'lucide-react';

export default function WelcomeTour({ onComplete }) {
  return (
    <div className="tour-overlay">
      <div className="tour-modal">
        <h1><Home size={18} strokeWidth={1.5} /> Welcome</h1>
        <p className="tour-sub">Digital Home is your private space.</p>
        <p className="tour-desc">
          Walk into a room, tap the furniture, get things done.
        </p>
        <div className="tour-legend">
          <div className="tour-item">Desk → Your tasks</div>
          <div className="tour-item"><Clock size={18} strokeWidth={1.5} /> Clock → Pomodoro timer</div>
          <div className="tour-item"><Pin size={18} strokeWidth={1.5} /> Board → Notes</div>
          <div className="tour-item"><BookOpen size={18} strokeWidth={1.5} /> Shelf → Subject folders</div>
          <div className="tour-item"><Radio size={18} strokeWidth={1.5} /> Radio → FM music</div>
          <div className="tour-item"><Image size={18} strokeWidth={1.5} /> Frame → Room settings</div>
        </div>
        <div className="tour-tip">
          <Lightbulb size={16} strokeWidth={1.5} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.25rem" }} /> <strong>Tap</strong> any furniture to open its feature.<br />
          <strong>Swipe down</strong> or tap outside to close.
        </div>
        <div className="tour-share">
          <Users size={16} strokeWidth={1.5} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.25rem" }} /> Want to share a room?<br />
          Use <strong>"Create"</strong> under Shared Rooms on your Home page.<br />
          Share the code with a friend.
        </div>
        <button className="btn-primary tour-btn" onClick={onComplete}>
          Let's go
        </button>
      </div>
    </div>
  );
}
