import { useState, useRef, useEffect } from 'react';
import { useAudio } from '../../../hooks/useAudio';
import { Bed, Moon, Wind, Clock, CloudRain, Waves, Flame, Trees } from 'lucide-react';

const SOUNDS = {
  rain: { label: 'Rain', desc: 'Gentle rainfall' },
  ocean: { label: 'Ocean', desc: 'Crashing waves' },
  fire: { label: 'Fireplace', desc: 'Cozy crackling' },
  forest: { label: 'Forest', desc: 'Birds and breeze' },
};

function BreathingExercise() {
  const [phase, setPhase] = useState('idle'); // idle | inhale | hold | exhale
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  const startBreathing = () => {
    let steps = ['inhale', 'hold', 'exhale'];
    let durations = { inhale: 4, hold: 7, exhale: 8 };
    let stepIndex = 0;
    let counter = 0;

    const tick = () => {
      const currentStep = steps[stepIndex % 3];
      setPhase(currentStep);
      setCount(durations[currentStep] - counter);
      counter++;
      if (counter > durations[currentStep]) {
        counter = 0;
        stepIndex++;
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
  };

  const stopBreathing = () => {
    clearInterval(timerRef.current);
    setPhase('idle');
    setCount(0);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="breathing-section">
      <div className="breathing-header">
        <span><Wind size={16} strokeWidth={1.5} /> 4-7-8 breathing</span>
        {phase === 'idle' ? (
          <button className="btn-small" onClick={startBreathing}>Start</button>
        ) : (
          <button className="btn-small btn-ghost" onClick={stopBreathing}>Stop</button>
        )}
      </div>
      {phase !== 'idle' && (
        <div className="breathing-ring-container">
          <svg className="breathing-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5dcc8" strokeWidth="4" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#8b6f47" strokeWidth="4"
              strokeDasharray={`${(count / (phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8)) * 264}`}
              strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.3s' }}
            />
          </svg>
          <div className="breathing-center">
            <div className="breathing-phase">{phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}</div>
            <div className="breathing-count">{count}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function NapTimer({ onStart, onStop, isActive, timeLeft, preset }) {
  return (
    <div className="nap-section">
      <div className="nap-header">
        <span><Clock size={16} strokeWidth={1.5} /> Quick nap</span>
        {!isActive ? (
          <div className="nap-presets">
            {[10, 20, 30].map((m) => (
              <button key={m} className={`btn-small ${preset === m ? '' : 'btn-ghost'}`} onClick={() => onStart(m)}>{m} min</button>
            ))}
          </div>
        ) : (
          <button className="btn-small btn-ghost" onClick={onStop}>Cancel</button>
        )}
      </div>
      {isActive && (
        <div className="nap-timer">
          <span className="nap-time">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      )}
    </div>
  );
}

export default function BedPanel() {
  const {
    activeAmbient,
    ambientVolume,
    playAmbient,
    stopAmbient,
    setAmbientVolume,
  } = useAudio();

  const [sleepTimer, setSleepTimer] = useState(null);
  const [napActive, setNapActive] = useState(false);
  const [napTimeLeft, setNapTimeLeft] = useState(0);
  const [napPreset, setNapPreset] = useState(10);
  const napRef = useRef(null);

  const startNap = (minutes) => {
    setNapPreset(minutes);
    setNapActive(true);
    setNapTimeLeft(minutes * 60);
    napRef.current = setInterval(() => {
      setNapTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(napRef.current);
          setNapActive(false);
          // play alarm tone
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.frequency.value = 800;
            const g = ctx.createGain();
            g.gain.value = 0.3;
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
            osc.connect(g).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1);
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopNap = () => {
    clearInterval(napRef.current);
    setNapActive(false);
    setNapTimeLeft(0);
  };

  useEffect(() => () => clearInterval(napRef.current), []);

  const startSleepTimer = (minutes) => {
    setSleepTimer(minutes);
    if (minutes === null) return;
    setTimeout(() => {
      stopAmbient();
      setSleepTimer(null);
    }, minutes * 60 * 1000);
  };

  return (
    <div className="panel-bed">
      <h3 style={{ marginBottom: "0.25rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><Bed size={18} strokeWidth={1.5} /> Wind down</h3>
      <p className="muted" style={{ textAlign: 'left', padding: '0 0 0.75rem', fontSize: '0.8rem' }}>
        Fall asleep faster. Pick a sound, set a timer.
      </p>

      {/* Sleep timer */}
      <div className="bed-section">
        <div className="bed-section-header">
          <span><Moon size={18} strokeWidth={1.5} /> Sleep timer</span>
          {sleepTimer === null ? (
            <div className="bed-timer-presets">
              {[[15, '15m'], [30, '30m'], [60, '1h'], [null, '∞']].map(([m, label]) => (
                <button key={label} className="btn-small btn-ghost" onClick={() => startSleepTimer(m)}>{label}</button>
              ))}
            </div>
          ) : (
            <button className="btn-small btn-ghost" onClick={() => { setSleepTimer(null); stopAmbient(); }}>Clear</button>
          )}
        </div>
      </div>

      {/* Ambient sounds */}
      <div className="bed-sounds">
        {Object.entries(SOUNDS).map(([id, s]) => {
          const Icon = { rain: CloudRain, ocean: Waves, fire: Flame, forest: Trees }[id];
          return (
            <button key={id} className={`preset-btn ${activeAmbient === id ? 'active' : ''}`} onClick={() => playAmbient(id)}>
              {Icon && <Icon size={16} strokeWidth={1.5} />} {s.label}
            </button>
          );
        })}
      </div>
      {activeAmbient && (
        <div className="radio-volume" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          <input type="range" min={0} max={1} step={0.05} value={ambientVolume} onChange={(e) => setAmbientVolume(Number(e.target.value))} />
        </div>
      )}

      {/* Breathing exercise */}
      <BreathingExercise />

      {/* Quick nap */}
      <NapTimer onStart={startNap} onStop={stopNap} isActive={napActive} timeLeft={napTimeLeft} preset={napPreset} />
    </div>
  );
}
