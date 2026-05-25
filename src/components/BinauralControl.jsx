import { Headphones } from 'lucide-react';

export default function BinauralControl({ isPlaying, start, stop, preset, setPreset, volume, setVolume, presets }) {
  return (
    <div className="binaural-control">
      <div className="binaural-header">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Headphones size={18} strokeWidth={1.5} /> Binaural beats</span>
        <label className="toggle">
          <input type="checkbox" checked={isPlaying} onChange={isPlaying ? stop : start} />
          <span className="toggle-slider" />
        </label>
      </div>
      {isPlaying && (
        <div className="binaural-settings">
          <div className="binaural-presets">
            {Object.entries(presets).map(([key, val]) => (
              <button
                key={key}
                className={`preset-btn ${preset === key ? 'active' : ''}`}
                onClick={() => setPreset(key)}
              >
                {val.label}
                <small>{val.desc}</small>
              </button>
            ))}
          </div>
          <div className="binaural-volume">
            <label>Volume</label>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
