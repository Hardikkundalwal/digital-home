import { useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Volume2, VolumeX, Pause, Play, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniPlayer() {
  const {
    radioStation,
    radioPlaying,
    radioVolume,
    pauseRadio,
    resumeRadio,
    setVolumeRadio, // Wait, context exposed: setRadioVolume

    activeAmbient,
    ambientVolume,
    playAmbient, // We can toggle it off by playing active again, or stopAmbient()
    stopAmbient,

    beatsPlaying,
    beatsPreset,
    beatsVolume,
    toggleBeats,

    stopAll,
    setRadioVolume,
    setAmbientVolume,
    setBeatsVolume,
  } = useAudio();

  const [muted, setMuted] = useState(false);
  const [prevRadioVol, setPrevRadioVol] = useState(radioVolume);
  const [prevAmbientVol, setPrevAmbientVol] = useState(ambientVolume);
  const [prevBeatsVol, setPrevBeatsVol] = useState(beatsVolume);

  const isPlaying = radioPlaying || !!activeAmbient || beatsPlaying;

  if (!isPlaying) return null;

  let label = '';
  if (radioPlaying && radioStation) {
    label = radioStation.name;
  } else if (activeAmbient) {
    label = activeAmbient.charAt(0).toUpperCase() + activeAmbient.slice(1);
  } else if (beatsPlaying) {
    label = `${beatsPreset.charAt(0).toUpperCase() + beatsPreset.slice(1)} Beats`;
  }

  const toggleMute = () => {
    if (muted) {
      setRadioVolume(prevRadioVol);
      setAmbientVolume(prevAmbientVol);
      setBeatsVolume(prevBeatsVol);
      setMuted(false);
    } else {
      setPrevRadioVol(radioVolume);
      setPrevAmbientVol(ambientVolume);
      setPrevBeatsVol(beatsVolume);
      setRadioVolume(0);
      setAmbientVolume(0);
      setBeatsVolume(0);
      setMuted(true);
    }
  };

  const handlePlaybackToggle = () => {
    if (radioPlaying) {
      pauseRadio();
    } else if (radioStation) {
      resumeRadio();
    } else if (activeAmbient) {
      stopAmbient();
    } else if (beatsPlaying) {
      toggleBeats();
    }
  };

  return (
    <motion.div
      className="mini-player-pill"
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mini-player-wave">
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span className="wave-bar" />
      </div>
      
      <span className="mini-player-label">{label}</span>
      
      <div className="mini-player-sep" />
      
      <button className="mini-player-btn" onClick={handlePlaybackToggle} title="Play / Pause">
        {radioPlaying || beatsPlaying || !!activeAmbient ? (
          <Pause size={13} strokeWidth={1.5} />
        ) : (
          <Play size={13} strokeWidth={1.5} />
        )}
      </button>

      <button className="mini-player-btn" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
        {muted ? (
          <VolumeX size={13} strokeWidth={1.5} className="text-destructive" />
        ) : (
          <Volume2 size={13} strokeWidth={1.5} />
        )}
      </button>

      <button className="mini-player-btn stop-btn" onClick={stopAll} title="Stop all audio">
        <span>Stop</span>
      </button>
    </motion.div>
  );
}
