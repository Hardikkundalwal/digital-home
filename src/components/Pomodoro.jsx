import { BookOpen, Coffee, Play, Pause, Undo2 } from 'lucide-react';

export default function Pomodoro({
  mode, minutes, seconds, running, progress,
  start, pause, reset
}) {
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const ringColor = mode === 'work' ? '#8b6f47' : '#7a9e6b';

  return (
    <div className="pomodoro">
      <div className="pomodoro-mode">{mode === 'work' ? <><BookOpen size={18} strokeWidth={1.5} /> Focus</> : <><Coffee size={18} strokeWidth={1.5} /> Break</>}</div>
      <svg className="pomodoro-ring" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#e5dcc8" strokeWidth="8" />
        <circle
          cx="110" cy="110" r={radius}
          fill="none" stroke={ringColor} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
          style={{ transition: 'stroke-dashoffset 0.5s, stroke 0.3s' }}
        />
      </svg>
      <div className="pomodoro-time">{display}</div>
      <div className="pomodoro-actions">
        {!running ? (
          <button className="btn-primary" onClick={start}><Play size={18} strokeWidth={1.5} /> Start</button>
        ) : (
          <button className="btn-primary" onClick={pause}><Pause size={18} strokeWidth={1.5} /> Pause</button>
        )}
        <button className="btn-secondary" onClick={reset}><Undo2 size={16} strokeWidth={1.5} /> Reset</button>
      </div>
    </div>
  );
}
