import { useState, useEffect } from 'react';
import { Radio, Pause, Play, Newspaper, Music, Disc3 } from 'lucide-react';
import GlassRadio from '../../ui/GlassRadio';
import { useAudio } from '../../../hooks/useAudio';

const CURATED = [
  { name: 'BBC World Service', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', genre: 'News' },
  { name: 'Jazz24', url: 'https://jazz24.streamguys1.com/live', genre: 'Jazz' },
  { name: 'Classical KUSC', url: 'https://live7.uscmedia.com/kusc', genre: 'Classical' },
  { name: 'Lo-Fi Girl', url: 'https://lofi.stream.laut.fm/lofi', genre: 'Pop' },
  { name: 'NPR News', url: 'https://npr-ice.streamguys1.com/live.mp3', genre: 'News' },
  { name: 'FluxFM Jazz', url: 'https://streams.fluxfm.de/jazz/aac-64/', genre: 'Jazz' },
  { name: 'FluxFM Techno', url: 'https://streams.fluxfm.de/techno/aac-64/', genre: 'Electronic' },
  { name: 'FluxFM Pop', url: 'https://streams.fluxfm.de/event/aac-64/', genre: 'Pop' },
  { name: 'NPO Radio 4', url: 'https://icecast.omroep.nl/radio4-bb-mp3', genre: 'Classical' },
  { name: 'NPO Radio 1', url: 'https://icecast.omroep.nl/radio1-bb-mp3', genre: 'News' },
];

const GENRES = [...new Set(CURATED.map((s) => s.genre))];

const GENRE_ICONS = {
  News: Newspaper,
  Jazz: Music,
  Classical: Music,
  Pop: Radio,
  Electronic: Disc3,
};

export default function RadioPanel({ onBeatsChange }) {
  const [genre, setGenre] = useState('Jazz');
  const [error, setError] = useState('');
  const {
    radioStation,
    radioPlaying,
    radioVolume,
    playRadio,
    pauseRadio,
    resumeRadio,
    setRadioVolume,
  } = useAudio();

  const stations = CURATED.filter((s) => s.genre === genre);

  const handlePlayStation = (station) => {
    setError('');
    playRadio(station);
    if (onBeatsChange) onBeatsChange(true);
  };

  const togglePlay = () => {
    if (radioPlaying) {
      pauseRadio();
      if (onBeatsChange) onBeatsChange(false);
    } else if (radioStation) {
      resumeRadio();
      if (onBeatsChange) onBeatsChange(true);
    }
  };

  useEffect(() => {
    if (onBeatsChange) {
      onBeatsChange(radioPlaying);
    }
  }, [radioPlaying, onBeatsChange]);

  return (
    <div className="panel-radio">
      <div className="radio-now">
        {radioStation && <div className="radio-tuned"><Radio size={18} strokeWidth={1.5} /> {radioStation.name}</div>}
        {!radioStation && <div className="radio-tuned muted">Pick a station</div>}
      </div>

      <div className="radio-controls">
        <button className="btn-primary radio-play-btn" onClick={togglePlay} disabled={!radioStation}>
          {radioPlaying ? <><Pause size={18} strokeWidth={1.5} /> Pause</> : <><Play size={18} strokeWidth={1.5} /> Play</>}
        </button>
        <div className="radio-volume">
          <input type="range" min={0} max={1} step={0.05} value={radioVolume} onChange={(e) => setRadioVolume(Number(e.target.value))} />
        </div>
      </div>

      {error && <p className="error" style={{ textAlign: 'center' }}>{error}</p>}

      <div className="radio-genres" style={{ justifyContent: 'center' }}>
        <GlassRadio
          options={GENRES.map((g) => ({ value: g, label: g, icon: GENRE_ICONS[g] }))}
          value={genre}
          onChange={(v) => { setGenre(v); setError(''); }}
        />
      </div>

      <div className="radio-stations">
        {stations.map((s) => (
          <button key={s.name} className={`radio-station ${radioStation?.name === s.name ? 'active' : ''}`}
            onClick={() => handlePlayStation(s)}
          >
            <span className="radio-station-name">{s.name}</span>
            <span className="radio-station-country">{s.genre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
