import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContextInstance = createContext(null);

const PRESETS = {
  alpha: { label: 'Alpha', freq: 10, desc: 'Relaxed focus' },
  beta: { label: 'Beta', freq: 18, desc: 'Deep concentration' },
  theta: { label: 'Theta', freq: 6, desc: 'Creative flow' },
};
const BASE_FREQ = 200;

function createWhiteNoiseBuffer(ctx, duration) {
  const len = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function AudioProvider({ children }) {
  // ─── Radio State ──────────────────────────────────────────────────────────
  const [radioStation, setRadioStation] = useState(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioVolume, setRadioVolume] = useState(0.5);
  const radioAudioRef = useRef(null);

  // ─── Ambient State ────────────────────────────────────────────────────────
  const [activeAmbient, setActiveAmbient] = useState(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const ambientCtxRef = useRef(null);
  const ambientSourceRef = useRef(null);
  const ambientGainRef = useRef(null);
  const ambientCrackleRef = useRef(null);

  // ─── Binaural Beats State ──────────────────────────────────────────────────
  const [beatsPlaying, setBeatsPlaying] = useState(false);
  const [beatsPreset, setBeatsPreset] = useState('alpha');
  const [beatsVolume, setBeatsVolume] = useState(0.25);
  const beatsCtxRef = useRef(null);
  const leftOscRef = useRef(null);
  const rightOscRef = useRef(null);
  const leftGainRef = useRef(null);
  const rightGainRef = useRef(null);
  const beatsMergerRef = useRef(null);

  // ─── Pomodoro Timer State (global — survives panel close) ─────────────────
  const [pomodoroWorkMin, setPomodoroWorkMin] = useState(25);
  const [pomodoroBreakMin, setPomodoroBreakMin] = useState(5);
  const [pomodoroMode, setPomodoroMode] = useState('work'); // 'work' | 'break'
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(25 * 60);
  const pomodoroIntervalRef = useRef(null);

  // ─── Radio Controls ──────────────────────────────────────────────────────
  const playRadio = useCallback((station) => {
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      radioAudioRef.current.src = '';
    }
    const audio = new Audio(station.url);
    audio.volume = radioVolume;
    audio.loop = false; // streams aren't looped
    radioAudioRef.current = audio;
    setRadioStation(station);
    setRadioPlaying(true);

    audio.play().catch((err) => {
      console.error('Radio play blocked:', err);
      setRadioPlaying(false);
      setRadioStation(null);
    });

    audio.addEventListener('ended', () => {
      setRadioPlaying(false);
      setRadioStation(null);
    });
  }, [radioVolume]);

  const pauseRadio = useCallback(() => {
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      setRadioPlaying(false);
    }
  }, []);

  const resumeRadio = useCallback(() => {
    if (radioAudioRef.current && radioStation) {
      radioAudioRef.current.play().then(() => {
        setRadioPlaying(true);
      }).catch((err) => {
        console.error('Radio resume blocked:', err);
      });
    }
  }, [radioStation]);

  const stopRadio = useCallback(() => {
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      radioAudioRef.current.src = '';
      radioAudioRef.current = null;
    }
    setRadioStation(null);
    setRadioPlaying(false);
  }, []);

  useEffect(() => {
    if (radioAudioRef.current) {
      radioAudioRef.current.volume = radioVolume;
    }
  }, [radioVolume]);

  // ─── Ambient Controls ─────────────────────────────────────────────────────
  const stopAmbient = useCallback(() => {
    try {
      if (ambientCrackleRef.current) clearInterval(ambientCrackleRef.current);
      ambientSourceRef.current?.stop();
      ambientCtxRef.current?.close();
    } catch (e) {}
    ambientSourceRef.current = null;
    ambientGainRef.current = null;
    ambientCrackleRef.current = null;
    ambientCtxRef.current = null;
    setActiveAmbient(null);
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
    source.connect(filter).connect(ambientGainRef.current).connect(ctx.destination);
    source.start();
    ambientSourceRef.current = source;
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
    source.connect(filter).connect(waveGain).connect(ambientGainRef.current).connect(ctx.destination);
    source.start();
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    lfo.start();
    ambientSourceRef.current = source;
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
    source.connect(filter).connect(ambientGainRef.current).connect(ctx.destination);
    source.start();
    ambientSourceRef.current = source;
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
    ambientCrackleRef.current = id;
  }, []);

  const playForest = useCallback((ctx) => {
    const buffer = createWhiteNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    source.connect(filter).connect(ambientGainRef.current).connect(ctx.destination);
    source.start();
    ambientSourceRef.current = source;
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
    ambientCrackleRef.current = id;
  }, []);

  const PLAYERS = { rain: playRain, ocean: playOcean, fire: playFire, forest: playForest };

  const playAmbient = useCallback(async (id) => {
    if (activeAmbient === id) {
      stopAmbient();
      return;
    }
    stopAmbient();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      ambientCtxRef.current = ctx;
      const g = ctx.createGain();
      g.gain.value = ambientVolume;
      ambientGainRef.current = g;
      PLAYERS[id](ctx);
      setActiveAmbient(id);
    } catch (e) {
      console.error('Ambient audio setup failed:', e);
    }
  }, [activeAmbient, ambientVolume, stopAmbient, playRain, playOcean, playFire, playForest]);

  useEffect(() => {
    if (ambientGainRef.current) {
      ambientGainRef.current.gain.value = ambientVolume;
    }
  }, [ambientVolume]);

  // ─── Binaural Beats Controls ──────────────────────────────────────────────
  const stopBeats = useCallback(() => {
    try {
      leftOscRef.current?.stop();
      rightOscRef.current?.stop();
      beatsCtxRef.current?.close();
    } catch (e) {}
    leftOscRef.current = null;
    rightOscRef.current = null;
    leftGainRef.current = null;
    rightGainRef.current = null;
    beatsMergerRef.current = null;
    beatsCtxRef.current = null;
    setIsPlayingBeats(false);
  }, []);

  const [isPlayingBeats, setIsPlayingBeats] = useState(false);

  const playBeats = useCallback(async (presetId) => {
    stopBeats();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      beatsCtxRef.current = ctx;

      const beatFreq = PRESETS[presetId].freq;
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.value = BASE_FREQ;

      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.value = BASE_FREQ + beatFreq;

      const leftGain = ctx.createGain();
      leftGain.gain.value = beatsVolume;
      const rightGain = ctx.createGain();
      rightGain.gain.value = beatsVolume;

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
      beatsMergerRef.current = merger;

      setBeatsPreset(presetId);
      setIsPlayingBeats(true);
      setBeatsPlaying(true);
    } catch (e) {
      console.error('Binaural beats setup failed:', e);
    }
  }, [beatsVolume, stopBeats]);

  const toggleBeats = useCallback(() => {
    if (beatsPlaying) {
      stopBeats();
      setBeatsPlaying(false);
    } else {
      playBeats(beatsPreset);
    }
  }, [beatsPlaying, beatsPreset, playBeats, stopBeats]);

  useEffect(() => {
    if (!beatsPlaying || !rightOscRef.current) return;
    rightOscRef.current.frequency.value = BASE_FREQ + PRESETS[beatsPreset].freq;
  }, [beatsPreset, beatsPlaying]);

  useEffect(() => {
    if (leftGainRef.current) leftGainRef.current.gain.value = beatsVolume;
    if (rightGainRef.current) rightGainRef.current.gain.value = beatsVolume;
  }, [beatsVolume]);

  // ─── Pomodoro Controls (global — interval never dies) ───────────────────
  const clearPomodoro = useCallback(() => {
    if (pomodoroIntervalRef.current) {
      clearInterval(pomodoroIntervalRef.current);
      pomodoroIntervalRef.current = null;
    }
  }, []);

  const pomodoroStart = useCallback(() => {
    setPomodoroRunning(true);
  }, []);

  const pomodoroPause = useCallback(() => {
    clearPomodoro();
    setPomodoroRunning(false);
  }, [clearPomodoro]);

  const pomodoroReset = useCallback(() => {
    clearPomodoro();
    setPomodoroRunning(false);
    setPomodoroMode('work');
    setPomodoroSecondsLeft(pomodoroWorkMin * 60);
  }, [clearPomodoro, pomodoroWorkMin]);

  // When workMin changes and timer is NOT running, reset seconds to match
  useEffect(() => {
    if (!pomodoroRunning && pomodoroMode === 'work') {
      setPomodoroSecondsLeft(pomodoroWorkMin * 60);
    }
  }, [pomodoroWorkMin]);

  useEffect(() => {
    if (!pomodoroRunning && pomodoroMode === 'break') {
      setPomodoroSecondsLeft(pomodoroBreakMin * 60);
    }
  }, [pomodoroBreakMin]);

  // The ticker — runs at root level, survives panel close
  useEffect(() => {
    if (!pomodoroRunning) return;
    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroSecondsLeft((prev) => {
        if (prev <= 1) {
          clearPomodoro();
          setPomodoroRunning(false);
          setPomodoroMode((m) => {
            const next = m === 'work' ? 'break' : 'work';
            setPomodoroSecondsLeft(
              next === 'work'
                ? pomodoroWorkMin * 60
                : pomodoroBreakMin * 60
            );
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearPomodoro;
  }, [pomodoroRunning, clearPomodoro, pomodoroWorkMin, pomodoroBreakMin]);

  const pomodoroMinutes = Math.floor(pomodoroSecondsLeft / 60);
  const pomodoroSeconds = pomodoroSecondsLeft % 60;
  const pomodoroProgress =
    pomodoroMode === 'work'
      ? 1 - pomodoroSecondsLeft / (pomodoroWorkMin * 60)
      : 1 - pomodoroSecondsLeft / (pomodoroBreakMin * 60);

  // ─── Global Stops ──────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    stopRadio();
    stopAmbient();
    stopBeats();
    pomodoroPause();
  }, [stopRadio, stopAmbient, stopBeats, pomodoroPause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  return (
    <AudioContextInstance.Provider
      value={{
        radioStation,
        radioPlaying,
        radioVolume,
        playRadio,
        pauseRadio,
        resumeRadio,
        stopRadio,
        setRadioVolume,

        activeAmbient,
        ambientVolume,
        playAmbient,
        stopAmbient,
        setAmbientVolume,

        beatsPlaying,
        beatsPreset,
        beatsVolume,
        playBeats,
        stopBeats,
        toggleBeats,
        setBeatsPreset,
        setBeatsVolume,

        // Pomodoro (global persistent timer)
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

        stopAll,
      }}
    >
      {children}
    </AudioContextInstance.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContextInstance);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
