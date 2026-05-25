// Digital Home — Door (auth + name entry)

const { useState } = React;

function DoorScreen({ onLogin }) {
  const [step, setStep] = useState('auth'); // 'auth' | 'name'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');

  const handleAuth = (e) => { e.preventDefault(); setStep('name'); };
  const handleName = (e) => { e.preventDefault(); if (name.trim()) onLogin(name.trim()); };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#1a1a1a', border: '1px solid #3d3d3d', borderRadius: 8,
    color: '#f5f0e8', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
      background: `
        repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 5px),
        linear-gradient(160deg, #5a3e28 0%, #3d2818 60%, #2a1a0e 100%)
      `,
    }}>
      {/* warm glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 220, height: 90, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(200,160,80,0.3), transparent 70%)',
        animation: 'glowPulse 2.5s ease-in-out infinite',
      }} />

      <div style={{
        background: '#242424', borderRadius: '16px 16px 8px 8px',
        border: '1px solid #3d3d3d', boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)',
        width: '100%', maxWidth: 320, overflow: 'hidden', position: 'relative', zIndex: 1,
      }}>
        {/* header */}
        <div style={{ padding: '24px 28px 0', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Icon name="home" size={30} color="#c4a882" />
          </div>
          <h2 style={{ fontSize: 20, color: '#c4a882', fontWeight: 600, marginBottom: 4 }}>
            {step === 'name' ? 'Almost there!' : mode === 'login' ? 'Welcome back' : 'Create your home'}
          </h2>
          <p style={{ color: '#8a7f6e', fontSize: 13, marginBottom: 16 }}>
            {step === 'name' ? 'What should we call you?' : 'Your digital home awaits.'}
          </p>
          {/* brass divider */}
          <hr style={{
            border: 'none', height: 2, marginBottom: 20, borderRadius: 1,
            background: 'linear-gradient(90deg, transparent, #d4a840, #e8c880, #d4a840, transparent)',
          }} />
        </div>

        {/* body */}
        <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {step === 'auth' ? (
            <>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
                <button type="submit" style={{
                  width: '100%', padding: 12, fontWeight: 700, fontSize: 15,
                  background: 'linear-gradient(135deg, #d4a840, #c49030)',
                  border: 'none', borderRadius: 8, color: '#3d2818',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(196,144,48,0.35)',
                }}>
                  {mode === 'login' ? 'Enter my home' : 'Create my home'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#8a7f6e', marginTop: 4 }}>
                {mode === 'login' ? "Don't have a home? " : 'Already have a home? '}
                <button
                  onClick={() => setMode((m) => m === 'login' ? 'signup' : 'login')}
                  style={{ background: 'none', border: 'none', color: '#c4a882', cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
                >
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </>
          ) : (
            <form onSubmit={handleName} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="Your name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                style={inputStyle}
              />
              <button type="submit" style={{
                width: '100%', padding: 12, fontWeight: 700, fontSize: 15,
                background: 'linear-gradient(135deg, #d4a840, #c49030)',
                border: 'none', borderRadius: 8, color: '#3d2818',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 10px rgba(196,144,48,0.35)',
              }}>
                Enter my home
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DoorScreen });
