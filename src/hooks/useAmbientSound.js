import { useRef, useState, useCallback, useEffect } from 'react';

function createWhiteNoiseBuffer(ctx, duration) {
  const len = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

const SOUNDS = {
  rain: { label: 'Rain', desc: 'Gentle rainfall' },
  ocean: { label: 'Ocean', desc: 'Crashing waves' },
  fire: { label: 'Fireplace', desc: 'Cozy crackling' },
  forest: { label: 'Forest', desc: 'Birds and breeze' },
};

export { SOUNDS };

export function useAmbientSound() {
  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const filterRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);
  const crackleRef = useRef(null);
  const [active, setActive] = useState(null);
  const [volume, setVolume] = useState(0.3);

  const stop = useCallback(() => {
    try {
      crackleRef.current && clearInterval(crackleRef.current);
      sourceRef.current?.stop();
      lfoRef.current?.stop();
      ctxRef.current?.close();
    } catch {}
    sourceRef.current = null;
    lfoRef.current = null;
    filterRef.current = null;
    gainRef.current = null;
    crackleRef.current = null;
    ctxRef.current = null;
    setActive(null);
  }, []);

  const playRain = useCallback((ctx) => {
    const buffer = createWhiteNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.5;
    source.connect(filter).connect(gainRef.current).connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    filterRef.current = filter;
  }, []);

  const playOcean = useCallback((ctx) => {
    const buffer = createWhiteNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0;
    source.connect(filter).connect(waveGain).connect(gainRef.current).connect(ctx.destination);
    source.start();
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    lfo.start();
    sourceRef.current = source;
    filterRef.current = filter;
    lfoRef.current = lfo;
  }, []);

  const playFire = useCallback((ctx) => {
    const buffer = createWhiteNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 2;
    source.connect(filter).connect(gainRef.current).connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    filterRef.current = filter;
    const id = setInterval(() => {
      try {
        const pop = ctx.createBufferSource();
        const popBuf = createWhiteNoiseBuffer(ctx, 0.05);
        pop.buffer = popBuf;
        const popGain = ctx.createGain();
        popGain.gain.value = Math.random() * 0.3;
        pop.connect(popGain).connect(ctx.destination);
        pop.start();
        popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } catch {}
    }, 200);
    crackleRef.current = id;
  }, []);

  const playForest = useCallback((ctx) => {
    const buffer = createWhiteNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    source.connect(filter).connect(gainRef.current).connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    filterRef.current = filter;
    const id = setInterval(() => {
      try {
        const chirp = ctx.createOscillator();
        chirp.type = 'sine';
        chirp.frequency.value = 2000 + Math.random() * 2000;
        const chirpGain = ctx.createGain();
        chirpGain.gain.value = 0;
        chirpGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        chirp.connect(chirpGain).connect(ctx.destination);
        chirp.start();
        chirp.stop(ctx.currentTime + 0.15);
      } catch {}
    }, 1500);
    crackleRef.current = id;
  }, []);

  const PLAYERS = { rain: playRain, ocean: playOcean, fire: playFire, forest: playForest };

  const play = useCallback(async (id) => {
    if (active === id) { stop(); return; }
    stop();
    try {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      ctxRef.current = ctx;
      const g = ctx.createGain();
      g.gain.value = volume;
      gainRef.current = g;
      PLAYERS[id](ctx);
      setActive(id);
    } catch {}
  }, [active, volume, stop, playRain, playOcean, playFire, playForest]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => () => stop(), [stop]);

  return { active, play, stop, volume, setVolume, sounds: SOUNDS };
}
