import { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { Settings, Check, Moon, Sun } from 'lucide-react';

export default function SettingsPanel() {
  const { displayName, saveDisplayName } = useProfile();
  const [name, setName] = useState(displayName);
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('dh_dark', next ? '1' : '0');
  };

  const handleSave = async () => {
    await saveDisplayName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="panel-settings">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}><Settings size={18} strokeWidth={1.5} /> Room settings</h3>
      <div className="settings-field">
        <label>Your name</label>
        <div className="task-form">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          <button onClick={handleSave}>{saved ? <><Check size={16} strokeWidth={1.5} /> Saved</> : 'Save'}</button>
        </div>
      </div>
      <div className="settings-field" style={{ marginTop: '1rem' }}>
        <label>Appearance</label>
        <div className="task-form" style={{ marginTop: '0.35rem' }}>
          <button className={`btn-small ${!dark ? 'btn-ghost' : ''}`} onClick={toggleDark} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {dark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />} {dark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
      {displayName && (
        <p className="muted" style={{ textAlign: 'left', padding: '0.5rem 0 0' }}>
          Rooms will show as "{displayName}'s Home", "{displayName}'s Study", etc.
        </p>
      )}
    </div>
  );
}
