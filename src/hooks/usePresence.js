import { useEffect, useState, useRef } from 'react';
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

const COLORS = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8', '#4db6ac'];

function getColor(uid) {
  return COLORS[uid.charCodeAt(0) % COLORS.length];
}

function getInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

export function usePresence(roomCode, avatar, customization) {
  const { user } = useAuth();
  const [presenceList, setPresenceList] = useState([]);
  const [error, setError] = useState(null);
  const avatarRef = useRef(avatar);
  const customizationRef = useRef(customization);
  const updateIntervalRef = useRef(null);

  avatarRef.current = avatar;
  customizationRef.current = customization;

  useEffect(() => {
    if (!user || !roomCode) return;

    const name = user.displayName || user.email || 'Guest';
    const presenceRef = doc(db, 'sharedRooms', roomCode, 'presence', user.uid);

    setDoc(presenceRef, {
      name,
      initial: getInitial(name),
      color: getColor(user.uid),
      position: [0, 0, 0],
      animationState: 'idle',
      rotationY: 0,
      customization: customizationRef.current || null,
      lastSeen: serverTimestamp(),
    });

    if (avatarRef.current) {
      const intervalId = setInterval(() => {
        if (!avatarRef.current) {
          clearInterval(intervalId);
          updateIntervalRef.current = null;
          return;
        }
        const pos = avatarRef.current?.posRef?.current;
        if (pos) {
          updateDoc(presenceRef, {
            position: [pos.x, pos.y, pos.z],
            animationState: avatarRef.current?.state || 'idle',
            rotationY: avatarRef.current?.rotRef?.current || 0,
            customization: customizationRef.current || null,
            lastSeen: serverTimestamp(),
          }).catch((err) => console.warn('Position update failed:', err));
        }
      }, 1000);
      updateIntervalRef.current = intervalId;
    }

    const unsub = onSnapshot(
      collection(db, 'sharedRooms', roomCode, 'presence'),
      (snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setPresenceList(list);
        setError(null);
      },
      (err) => {
        console.error('usePresence error:', err);
        setError(err);
      }
    );

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      deleteDoc(presenceRef).catch((err) => console.warn('Delete presence failed:', err));
      unsub();
    };
  }, [user, roomCode]);

  const others = presenceList.filter((p) => p.id !== user?.uid);
  return { presenceList, others, error };
}
