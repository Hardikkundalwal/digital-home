import { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { Palette, RotateCcw, Check } from 'lucide-react';

const AVATAR_COLORS = {
  skin: ['#fdbcb4', '#ffdbac', '#f4a460', '#d2691e', '#8b4513', '#654321'],
  hair: ['#1a1a1a', '#8b7355', '#a0522d', '#daa520', '#ff6347', '#4169e1'],
  outfit: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'],
};

const DEFAULT_AVATAR = {
  skinTone: '#fdbcb4',
  hairColor: '#8b7355',
  outfitColor: '#3498db',
};

/**
 * AvatarCustomizer - Allows users to customize their avatar appearance
 */
export default function AvatarCustomizer() {
  const { profile, updateProfile, loading } = useProfile();
  const [customization, setCustomization] = useState(DEFAULT_AVATAR);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.avatar) {
      setCustomization(profile.avatar);
    }
  }, [profile]);

  const handleColorChange = (type, color) => {
    const updated = { ...customization, [type]: color };
    setCustomization(updated);
  };

  const handleSave = async () => {
    setSaved(false);
    await updateProfile({ avatar: customization });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setCustomization(DEFAULT_AVATAR);
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
        <Palette size={20} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Avatar Customization</h2>
      </div>

      <p style={{ color: '#8a7f6e', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Customize how your avatar appears in shared rooms. Changes sync in real-time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Skin Tone */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
            Skin Tone
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {AVATAR_COLORS.skin.map((color) => (
              <button
                key={`skin-${color}`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: customization.skinTone === color ? '3px solid #333' : '2px solid #ccc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: customization.skinTone === color ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                }}
                onClick={() => handleColorChange('skinTone', color)}
                title="Click to select"
              />
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
            Hair Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {AVATAR_COLORS.hair.map((color) => (
              <button
                key={`hair-${color}`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: customization.hairColor === color ? '3px solid #333' : '2px solid #ccc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: customization.hairColor === color ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                }}
                onClick={() => handleColorChange('hairColor', color)}
                title="Click to select"
              />
            ))}
          </div>
        </div>

        {/* Outfit Color */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
            Outfit Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {AVATAR_COLORS.outfit.map((color) => (
              <button
                key={`outfit-${color}`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: customization.outfitColor === color ? '3px solid #333' : '2px solid #ccc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: customization.outfitColor === color ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                }}
                onClick={() => handleColorChange('outfitColor', color)}
                title="Click to select"
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          background: '#f5f0e8',
          border: '1px solid #ddd',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#8a7f6e', marginBottom: '0.5rem' }}>Preview</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'flex-end', minHeight: '80px' }}>
            {/* Simple avatar preview circles */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: customization.skinTone,
                margin: '0 auto 0.25rem',
              }} />
              <div style={{
                width: 35,
                height: 15,
                borderRadius: '50% 50% 0 0',
                backgroundColor: customization.hairColor,
                margin: '0 auto',
                marginLeft: -2.5,
              }} />
            </div>
            <div style={{
              width: 25,
              height: 50,
              borderRadius: '0.25rem',
              backgroundColor: customization.outfitColor,
            }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {saved ? <><Check size={16} /> Saved</> : 'Save Changes'}
          </button>
          <button
            className="btn-small"
            onClick={handleReset}
            disabled={loading}
            style={{ gap: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
