import { useEffect } from 'react';
import { Headphones } from 'lucide-react';
import { useAudio } from '../../../hooks/useAudio';

const PRESETS = {
  alpha: { label: 'Alpha', freq: 10, desc: 'Relaxed focus' },
  beta: { label: 'Beta', freq: 18, desc: 'Deep concentration' },
  theta: { label: 'Theta', freq: 6, desc: 'Creative flow' },
};

export default function BeatsPanel({ onBeatsChange }) {
  const {
    beatsPlaying,
    beatsPreset,
    beatsVolume,
    playBeats,
    stopBeats,
    toggleBeats,
    setBeatsVolume,
  } = useAudio();

  useEffect(() => {
    if (onBeatsChange) onBeatsChange(beatsPlaying);
  }, [beatsPlaying, onBeatsChange]);

  return (
    <div className="panel-beats">
      <div className="panel-beats-header">
        <span><Headphones size={18} strokeWidth={1.5} /> Binaural Beats</span>
        <label className="toggle">
          <input type="checkbox" checked={beatsPlaying} onChange={toggleBeats} />
          <span className="toggle-slider" />
        </label>
      </div>
      {beatsPlaying && (
        <div className="panel-beats-body">
          <div className="panel-beats-presets">
            {Object.entries(PRESETS).map(([key, val]) => (
              <button key={key} className={`preset-btn ${beatsPreset === key ? 'active' : ''}`} onClick={() => playBeats(key)}>
                {val.label}
                <small>{val.desc}</small>
              </button>
            ))}
          </div>
          <div className="binaural-volume">
            <label>Volume</label>
            <input type="range" min={0} max={0.5} step={0.05} value={beatsVolume} onChange={(e) => setBeatsVolume(Number(e.target.value))} />
          </div>
        </div>
      )}
    </div>
  );
}
