import { useRef, useState, useCallback, useEffect } from 'react';

const PRESETS = {
  alpha: { label: 'Alpha', freq: 10, desc: 'Relaxed focus' },
  beta: { label: 'Beta', freq: 18, desc: 'Deep concentration' },
  theta: { label: 'Theta', freq: 6, desc: 'Creative flow' },
};

const BASE_FREQ = 200;

export function useBinauralBeats() {
  const ctxRef = useRef(null);
  const leftOscRef = useRef(null);
  const rightOscRef = useRef(null);
  const leftGainRef = useRef(null);
  const rightGainRef = useRef(null);
  const mergerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState('alpha');
  const [volume, setVolume] = useState(0.25);

  const start = useCallback(async () => {
    try {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      ctxRef.current = ctx;

      const beatFreq = PRESETS[preset].freq;
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.value = BASE_FREQ;

      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.value = BASE_FREQ + beatFreq;

      const leftGain = ctx.createGain();
      leftGain.gain.value = volume;
      const rightGain = ctx.createGain();
      rightGain.gain.value = volume;

      const merger = ctx.createChannelMerger(2);
      leftOsc.connect(leftGain);
      leftGain.connect(merger, 0, 0);
      rightOsc.connect(rightGain);
      rightGain.connect(merger, 0, 1);
      merger.connect(ctx.destination);

      leftOsc.start();
      rightOsc.start();

      leftOscRef.current = leftOsc;
      rightOscRef.current = rightOsc;
      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;
      mergerRef.current = merger;

      setIsPlaying(true);
    } catch {}
  }, [preset, volume]);

  const stop = useCallback(() => {
    try {
      leftOscRef.current?.stop();
      rightOscRef.current?.stop();
      ctxRef.current?.close();
    } catch {}
    leftOscRef.current = null;
    rightOscRef.current = null;
    leftGainRef.current = null;
    rightGainRef.current = null;
    mergerRef.current = null;
    ctxRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || !rightOscRef.current) return;
    rightOscRef.current.frequency.value = BASE_FREQ + PRESETS[preset].freq;
  }, [preset, isPlaying]);

  useEffect(() => {
    if (leftGainRef.current) leftGainRef.current.gain.value = volume;
    if (rightGainRef.current) rightGainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { isPlaying, start, stop, preset, setPreset, volume, setVolume, presets: PRESETS };
}
