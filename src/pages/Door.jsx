import { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Orb from '../components/ui/3d-orb';

export default function Door() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\s*\(auth\/[^)]+\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dv2-door relative">
      <Orb />
      <motion.div
        className="dv2-door-panel relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="dv2-door-brand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="dv2-door-emblem">
            <span className="dv2-door-emblem-inner">DH</span>
          </div>
          <h1 className="dv2-door-title">Digital Home</h1>
          <p className="dv2-door-tagline">
            {isRegister ? 'Create your private space' : 'Your private space awaits'}
          </p>
        </motion.div>

        <div className="dv2-door-sep">
          <span className="dv2-door-sep-line" />
          <span className="dv2-door-sep-dot">◆</span>
          <span className="dv2-door-sep-line" />
        </div>

        <motion.form
          className="dv2-door-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="dv2-field">
            <label className="dv2-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="dv2-field">
            <label className="dv2-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="minimum 6 characters"
            />
          </div>

          {error && (
            <motion.p
              className="dv2-door-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="dv2-door-btn"
            disabled={loading}
            whileHover={!loading ? { scale: 1.012 } : {}}
            whileTap={!loading ? { scale: 0.988 } : {}}
          >
            <span>{loading ? 'Please wait…' : (isRegister ? 'Create Home' : 'Enter Home')}</span>
            {!loading && <span className="dv2-btn-arrow">→</span>}
          </motion.button>
        </motion.form>

        <p className="dv2-door-toggle">
          {isRegister ? 'Already have a home?' : 'New here?'}{' '}
          <button
            type="button"
            className="dv2-door-link"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
