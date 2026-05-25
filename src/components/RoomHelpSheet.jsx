import { Clock, Pin, BookOpen, Radio, Image, Monitor, ClipboardList, Bed } from 'lucide-react';

const ROOM_HELP = {
  study: {
    name: 'Study Room',
    items: [
      { icon: <BookOpen size={18} strokeWidth={1.5} />, label: 'Desk', desc: 'Track study tasks' },
      { icon: <Clock size={18} strokeWidth={1.5} />, label: 'Clock', desc: 'Pomodoro focus timer' },
      { icon: <Pin size={18} strokeWidth={1.5} />, label: 'Board', desc: 'Save notes and ideas' },
      { icon: <BookOpen size={18} strokeWidth={1.5} />, label: 'Shelf', desc: 'Organize subjects' },
      { icon: <Radio size={18} strokeWidth={1.5} />, label: 'Radio', desc: 'Listen to FM radio' },
      { icon: <Image size={18} strokeWidth={1.5} />, label: 'Frame', desc: 'Room settings' },
    ],
  },
  work: {
    name: 'Work Room',
    items: [
      { icon: <BookOpen size={18} strokeWidth={1.5} />, label: 'Desk', desc: 'Quick links and bookmarks' },
      { icon: <Clock size={18} strokeWidth={1.5} />, label: 'Clock', desc: 'Pomodoro focus timer' },
      { icon: <Monitor size={18} strokeWidth={1.5} />, label: 'Monitor', desc: 'Save work notes' },
      { icon: <ClipboardList size={18} strokeWidth={1.5} />, label: 'Board', desc: 'Track work tasks' },
      { icon: <Image size={18} strokeWidth={1.5} />, label: 'Frame', desc: 'Room settings' },
    ],
  },
  'my-room': {
    name: 'My Room',
    items: [
      { icon: <BookOpen size={18} strokeWidth={1.5} />, label: 'Desk', desc: 'Personal tasks' },
      { icon: <Clock size={18} strokeWidth={1.5} />, label: 'Clock', desc: 'Pomodoro focus timer' },
      { icon: <Bed size={18} strokeWidth={1.5} />, label: 'Bed', desc: 'Wind down with ambient sounds' },
      { icon: <Image size={18} strokeWidth={1.5} />, label: 'Frame', desc: 'Room settings' },
    ],
  },
};

export default function RoomHelpSheet({ roomId }) {
  const config = ROOM_HELP[roomId];
  if (!config) return <p className="muted">Help not available for this room.</p>;

  return (
    <div className="help-sheet">
      <p className="help-tip">
        Tap any piece of furniture to open its feature. Tap outside or swipe down to close.
      </p>
      <div className="help-items">
        {config.items.map((item) => (
          <div key={item.label} className="help-item">
            <span className="help-icon">{item.icon}</span>
            <div className="help-info">
              <strong>{item.label}</strong>
              <span className="help-desc">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
