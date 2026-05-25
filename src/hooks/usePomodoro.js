import { useState, useRef, useCallback, useEffect } from 'react';

export function usePomodoro(workMinutes = 25, breakMinutes = 5) {
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    setRunning(false);
    setMode('work');
    setSecondsLeft(workMinutes * 60);
  }, [clear, workMinutes]);

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    clear();
    setRunning(false);
  }, [clear]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          const nextMode = mode === 'work' ? 'break' : 'work';
          setMode(nextMode);
          return nextMode === 'work' ? breakMinutes * 60 : workMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [running, mode, workMinutes, breakMinutes, clear]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = mode === 'work'
    ? 1 - secondsLeft / (workMinutes * 60)
    : 1 - secondsLeft / (breakMinutes * 60);

  return { mode, minutes, seconds, running, progress, start, pause, reset };
}
