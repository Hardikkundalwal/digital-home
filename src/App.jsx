import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { useAuth } from './hooks/useAuth';
import { useAudio } from './hooks/useAudio';
import Door from './pages/Door';
import Home from './pages/Home';

const MyRoom = lazy(() => import('./pages/MyRoom'));
const StudyRoom = lazy(() => import('./pages/StudyRoom'));
const WorkRoom = lazy(() => import('./pages/WorkRoom'));
const SharedRoom = lazy(() => import('./pages/SharedRoom'));
const SharedRoom3D = lazy(() => import('./pages/SharedRoom3D'));

function LazyPage({ children }) {
  return <Suspense fallback={<div className="loading-screen"><span className="loading-dots"><span /><span /><span /></span></div>}>{children}</Suspense>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><span className="loading-dots"><span /><span /><span /></span></div>;
  if (!user) return <Navigate to="/door" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><span className="loading-dots"><span /><span /><span /></span></div>;
  if (user) return <Navigate to="/home" replace />;
  return children;
}

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const { user } = useAuth();
  const { stopAll } = useAudio();

  useEffect(() => {
    if (!user) {
      stopAll();
    }
  }, [user, stopAll]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('dh_dark', '1');
  }, []);

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/door" element={<GuestRoute><PageWrap><Door /></PageWrap></GuestRoute>} />
          <Route path="/home" element={<ProtectedRoute><PageWrap><Home /></PageWrap></ProtectedRoute>} />
          <Route path="/room/my-room" element={<ProtectedRoute><PageWrap><LazyPage><MyRoom /></LazyPage></PageWrap></ProtectedRoute>} />
          <Route path="/room/study" element={<ProtectedRoute><PageWrap><LazyPage><StudyRoom /></LazyPage></PageWrap></ProtectedRoute>} />
          <Route path="/room/work" element={<ProtectedRoute><PageWrap><LazyPage><WorkRoom /></LazyPage></PageWrap></ProtectedRoute>} />
          <Route path="/shared/:code" element={<ProtectedRoute><PageWrap><LazyPage><SharedRoom /></LazyPage></PageWrap></ProtectedRoute>} />
          <Route path="/shared-3d/:code/:sceneType?" element={<ProtectedRoute><PageWrap><LazyPage><SharedRoom3D /></LazyPage></PageWrap></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
