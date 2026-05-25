import { useCallback } from 'react';
import { useAudio } from '../../../hooks/useAudio';
import { BookOpen, Play, Pause, Undo2, Coffee, Headphones } from 'lucide-react';

export default function PomodoroPanel() {
  const {
    // Pomodoro (global)
    pomodoroMode,
    pomodoroRunning,
    pomodoroMinutes,
    pomodoroSeconds,
    pomodoroProgress,
    pomodoroWorkMin,
    pomodoroBreakMin,
    setPomodoroWorkMin,
    setPomodoroBreakMin,
    pomodoroStart,
    pomodoroPause,
    pomodoroReset,
    // Binaural Beats (already global)
    beatsPlaying,
    beatsPreset,
    beatsVolume,
    playBeats,
    stopBeats,
    setBeatsPreset,
    setBeatsVolume,
  } = useAudio();

  const display = `${String(pomodoroMinutes).padStart(2, '0')}:${String(pomodoroSeconds).padStart(2, '0')}`;

  const handleStart = useCallback(() => {
    pomodoroStart();
    if (!beatsPlaying) playBeats(beatsPreset);
  }, [pomodoroStart, beatsPlaying, playBeats, beatsPreset]);

  const handlePause = useCallback(() => {
    pomodoroPause();
    if (beatsPlaying) stopBeats();
  }, [pomodoroPause, beatsPlaying, stopBeats]);

  const handleReset = useCallback(() => {
    pomodoroReset();
    if (beatsPlaying) stopBeats();
  }, [pomodoroReset, beatsPlaying, stopBeats]);

  const PRESETS = {
    alpha: { label: 'Alpha', freq: 10, desc: 'Relaxed focus' },
    beta: { label: 'Beta', freq: 18, desc: 'Deep concentration' },
    theta: { label: 'Theta', freq: 6, desc: 'Creative flow' },
  };

  return (
    <div className="panel-pomodoro">
      <div className="panel-timer">
        <div className="panel-timer-mode">
          {pomodoroMode === 'work'
            ? <><BookOpen size={18} strokeWidth={1.5} /> Focus</>
            : <><Coffee size={18} strokeWidth={1.5} /> Break</>}
        </div>
        <div className="panel-timer-display">{display}</div>
        <div className="panel-timer-actions">
          {!pomodoroRunning ? (
            <button className="btn-primary" onClick={handleStart}><Play size={18} strokeWidth={1.5} /> Start</button>
          ) : (
            <button className="btn-primary" onClick={handlePause}><Pause size={18} strokeWidth={1.5} /> Pause</button>
          )}
          <button className="btn-secondary" onClick={handleReset}><Undo2 size={16} strokeWidth={1.5} /> Reset</button>
        </div>
      </div>
      <div className="panel-timer-settings">
        <label>Focus <input type="number" min={1} max={60} value={pomodoroWorkMin} onChange={(e) => setPomodoroWorkMin(Number(e.target.value))} /> min</label>
        <label>Break <input type="number" min={1} max={30} value={pomodoroBreakMin} onChange={(e) => setPomodoroBreakMin(Number(e.target.value))} /> min</label>
      </div>
      <div className="panel-beats-toggle">
        <label className="toggle">
          <span style={{ marginRight: '0.5rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Headphones size={16} strokeWidth={1.5} /> Binaural
          </span>
          <input
            type="checkbox"
            checked={beatsPlaying}
            onChange={() => beatsPlaying ? stopBeats() : playBeats(beatsPreset)}
          />
          <span className="toggle-slider" />
        </label>
      </div>
      {beatsPlaying && (
        <div className="panel-beats-presets">
          {Object.entries(PRESETS).map(([key, val]) => (
            <button
              key={key}
              className={`preset-btn ${beatsPreset === key ? 'active' : ''}`}
              onClick={() => setBeatsPreset(key)}
            >
              {val.label}
            </button>
          ))}
          <div className="panel-beats-volume">
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.05}
              value={beatsVolume}
              onChange={(e) => setBeatsVolume(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
