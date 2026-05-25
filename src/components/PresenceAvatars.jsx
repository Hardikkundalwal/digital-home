import { motion, AnimatePresence } from 'framer-motion';

export default function PresenceAvatars({ members }) {
  if (!members || members.length === 0) return null;
  const visible = members.slice(0, 3);
  const extra = members.length - 3;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
      <AnimatePresence>
        {visible.map((m, i) => (
          <motion.div
            key={m.id}
            title={m.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: m.color,
              border: '2px solid var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#fff',
              marginLeft: i > 0 ? -8 : 0,
              boxShadow: `0 0 0 2px ${m.color}44`,
              animation: 'presence-pulse 2s ease-in-out infinite',
            }}
          >
            {m.initial}
          </motion.div>
        ))}
      </AnimatePresence>
      {extra > 0 && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--surface)', border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)',
          marginLeft: -8,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
}
