import { useEffect, useRef, useState } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import AvatarCustomizerPanel from './AvatarCustomizerPanel';
import { X, RefreshCw, ChevronDown } from 'lucide-react';

export default function AvatarCreatorPanel({ onClose }) {
  const { profile, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const iframeRef = useRef(null);

  const avatarUrl = profile?.avatarUrl;

  const handleOpenCreator = () => {
    setIsOpen(true);
  };

  const handleCloseCreator = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = async (event) => {
      if (!event.origin.endsWith('.readyplayer.me')) return;

      if (event.data.source !== 'readyplayer.me') return;

      // When user creates/edits avatar, ReadyPlayer.Me sends the GLB URL
      if (event.data.eventName === 'subscribe' && event.data.avatar) {
        const avatarGlb = event.data.avatar;
        setLoading(true);
        try {
          await updateProfile({ avatarUrl: avatarGlb });
          setLoading(false);
          handleCloseCreator();
          if (onClose) onClose();
        } catch (err) {
          console.error('Failed to save avatar:', err);
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, updateProfile, onClose]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Your avatar</p>
        {avatarUrl ? (
          <div style={{
            width: '120px',
            height: '120px',
            background: 'var(--bg)',
            borderRadius: '8px',
            overflow: 'hidden',
            margin: '0 auto',
            border: '2px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={`${avatarUrl}?quarter=true`} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            background: 'var(--bg)',
            borderRadius: '8px',
            margin: '0 auto',
            border: '2px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8rem'
          }}>
            No avatar
          </div>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleOpenCreator}
        style={{ width: '100%' }}
        disabled={loading}
      >
        {avatarUrl ? 'Edit avatar' : 'Create avatar'}
      </button>

      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            color: 'var(--text)',
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          <ChevronDown size={16} strokeWidth={1.5} style={{ transform: showCustomizer ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          Color customization (legacy)
        </button>
        {showCustomizer && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <AvatarCustomizerPanel />
          </div>
        )}
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Create your avatar</h3>
              <button
                onClick={handleCloseCreator}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '1.2rem'
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <iframe
              ref={iframeRef}
              title="ReadyPlayer.Me Avatar Creator"
              src="https://readyplayer.me/avatar?frameApi"
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '0 0 12px 12px',
                width: '100%'
              }}
              allow="camera; microphone"
            />
          </div>
        </div>
      )}
    </div>
  );
}
