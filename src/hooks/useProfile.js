import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const ref = doc(db, 'users', user.uid, 'profile', 'main');
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setDisplayName(data.displayName || '');
        setTourCompleted(!!data.tourCompleted);
        setExists(true);
      } else {
        setExists(false);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to fetch user profile:', err);
      setExists(false);
      setLoading(false);
    });
  }, [user]);

  const saveDisplayName = useCallback(async (name) => {
    if (!user || !name.trim()) return;
    const ref = doc(db, 'users', user.uid, 'profile', 'main');
    await setDoc(ref, { displayName: name.trim(), createdAt: serverTimestamp() });
    setDisplayName(name.trim());
    setExists(true);
  }, [user]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'profile', 'main');
    const data = { ...profile, ...updates, updatedAt: serverTimestamp() };
    try {
      await setDoc(ref, data, { merge: true });
      setProfile(data);
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, [user, profile]);

  const completeTour = useCallback(async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'profile', 'main');
    await updateDoc(ref, { tourCompleted: true });
    setTourCompleted(true);
  }, [user]);

  return { profile, displayName, loading, exists, tourCompleted, saveDisplayName, updateProfile, completeTour };
}
