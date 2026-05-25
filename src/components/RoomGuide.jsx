import { useState, useEffect } from 'react';
import { Clock, Pin, BookOpen, Radio, Image, Monitor, ClipboardList, Bed, Lightbulb } from 'lucide-react';

const ROOM_HINTS = {
  study: ['Desk → Tasks', <><Clock size={18} strokeWidth={1.5} /> Clock → Pomodoro</>, <><Pin size={18} strokeWidth={1.5} /> Board → Notes</>, <><BookOpen size={18} strokeWidth={1.5} /> Shelf → Subjects</>, <><Radio size={18} strokeWidth={1.5} /> Radio → Music</>],
  work: ['Desk → Quick links', <><Clock size={18} strokeWidth={1.5} /> Clock → Pomodoro</>, <><Monitor size={18} strokeWidth={1.5} /> Monitor → Notes</>, <><ClipboardList size={18} strokeWidth={1.5} /> Board → Tasks</>],
  'my-room': ['Desk → Tasks', <><Clock size={18} strokeWidth={1.5} /> Clock → Pomodoro</>, <><Bed size={18} strokeWidth={1.5} /> Bed → Wind down</>],
};

export default function RoomGuide({ roomId, onDismiss }) {
  const [visible, setVisible] = useState(true);
  const hints = ROOM_HINTS[roomId];

  useEffect(() => {
    const seen = localStorage.getItem(`dh_room_hint_${roomId}`);
    if (seen) { setVisible(false); onDismiss && onDismiss(); return; }
    const timer = setTimeout(() => {
      setVisible(false);
      localStorage.setItem(`dh_room_hint_${roomId}`, '1');
      onDismiss && onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [roomId, onDismiss]);

  if (!visible || !hints) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(`dh_room_hint_${roomId}`, '1');
    onDismiss && onDismiss();
  };

  return (
    <div className="room-guide" onClick={handleDismiss}>
      <div className="room-guide-handle"><Lightbulb size={18} strokeWidth={1.5} /></div>
      <div className="room-guide-hints">
        {hints.map((h, i) => <span key={i} className="room-guide-hint">{h}</span>)}
      </div>
    </div>
  );
}
