import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

function generateCode(name) {
  const prefix = (name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'HOM');
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export { generateCode };

export function useSharedRoom(roomCode) {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomCode) { setLoading(false); return; }
    const unsub1 = onSnapshot(
      doc(db, 'sharedRooms', roomCode),
      (snap) => {
        setRoom(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setError(null);
      },
      (err) => {
        console.error('useSharedRoom doc error:', err);
        setError(err);
      }
    );
    const unsub2 = onSnapshot(
      collection(db, 'sharedRooms', roomCode, 'members'),
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setMembers(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useSharedRoom members error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return () => { unsub1(); unsub2(); };
  }, [user, roomCode]);

  const createRoom = useCallback(async (name) => {
    if (!user) return null;
    let code;
    let tries = 0;
    do {
      code = generateCode(name);
      const existing = await getDoc(doc(db, 'sharedRooms', code));
      if (!existing.exists()) break;
      tries++;
    } while (tries < 5);
    if (tries >= 5) throw new Error('Could not generate unique room code');
    await setDoc(doc(db, 'sharedRooms', code), {
      name: name.trim(),
      createdBy: user.uid,
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, 'sharedRooms', code, 'members', user.uid), {
      displayName: user.email,
      joinedAt: serverTimestamp()
    });
    await setDoc(doc(db, 'users', user.uid, 'sharedRoomCodes', code), { joinedAt: serverTimestamp() });
    return code;
  }, [user]);

  const joinRoom = useCallback(async (code) => {
    if (!user) return false;
    const snap = await getDoc(doc(db, 'sharedRooms', code));
    if (!snap.exists()) return false;
    await setDoc(doc(db, 'sharedRooms', code, 'members', user.uid), {
      displayName: user.email,
      joinedAt: serverTimestamp()
    });
    await setDoc(doc(db, 'users', user.uid, 'sharedRoomCodes', code), { joinedAt: serverTimestamp() });
    return true;
  }, [user]);

  const leaveRoom = useCallback(async (code) => {
    if (!user) return;
    await deleteDoc(doc(db, 'sharedRooms', code, 'members', user.uid));
    await deleteDoc(doc(db, 'users', user.uid, 'sharedRoomCodes', code));
  }, [user]);

  return { room, members, loading, error, createRoom, joinRoom, leaveRoom };
}

export function useUserSharedRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { setRooms([]); setLoading(false); return; }
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'sharedRoomCodes'),
      async (snap) => {
        const codes = [];
        snap.forEach((d) => codes.push(d.id));
        const roomDocs = await Promise.all(
          codes.map((c) =>
            getDoc(doc(db, 'sharedRooms', c))
              .then((d) => (d.exists() ? { id: d.id, ...d.data() } : null))
              .catch((err) => {
                console.error(`Failed to get doc for sharedRoom ${c}:`, err);
                return null;
              })
          )
        );
        setRooms(roomDocs.filter(Boolean));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useUserSharedRooms error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user]);

  return { rooms, loading, error };
}
