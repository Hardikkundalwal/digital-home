import { useState, useCallback, useEffect, useRef } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { useBinauralBeats } from '../hooks/useBinauralBeats';
import Pomodoro from '../components/Pomodoro';
import BinauralControl from '../components/BinauralControl';

export default function WorkPomodoro() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const pomodoro = usePomodoro(workMin, breakMin);
  const beats = useBinauralBeats();
  const prevMode = useRef(pomodoro.mode);

  useEffect(() => {
    if (prevMode.current === 'work' && pomodoro.mode === 'break' && beats.isPlaying) {
      beats.stop();
    }
    prevMode.current = pomodoro.mode;
  }, [pomodoro.mode]);

  const handleStart = useCallback(() => {
    pomodoro.start();
    if (!beats.isPlaying) beats.start();
  }, [pomodoro, beats]);

  const handlePause = useCallback(() => {
    pomodoro.pause();
    if (beats.isPlaying) beats.stop();
  }, [pomodoro, beats]);

  const handleReset = useCallback(() => {
    pomodoro.reset();
    if (beats.isPlaying) beats.stop();
  }, [pomodoro, beats]);

  return (
    <div className="pomodoro-page">
      <Pomodoro
        mode={pomodoro.mode}
        minutes={pomodoro.minutes}
        seconds={pomodoro.seconds}
        running={pomodoro.running}
        progress={pomodoro.progress}
        start={handleStart}
        pause={handlePause}
        reset={handleReset}
      />
      <BinauralControl {...beats} />
      <div className="pomodoro-settings">
        <label>Focus: <input type="number" min={1} max={60} value={workMin} onChange={(e) => setWorkMin(Number(e.target.value))} /> min</label>
        <label>Break: <input type="number" min={1} max={30} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} /> min</label>
      </div>
    </div>
  );
}
