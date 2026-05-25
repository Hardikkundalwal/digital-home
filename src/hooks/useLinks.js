import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useLinks(roomId) {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomId) return;
    const ref = collection(db, 'users', user.uid, 'rooms', roomId, 'links');
    const q = query(ref, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setLinks(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useLinks error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomId]);

  const addLink = async (name, url) => {
    if (!user || !roomId || !name.trim() || !url.trim()) return;
    const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    await addDoc(collection(db, 'users', user.uid, 'rooms', roomId, 'links'), {
      name: name.trim(),
      url: cleanUrl,
      createdAt: serverTimestamp()
    });
  };

  const deleteLink = async (linkId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'links', linkId));
  };

  return { links, loading, error, addLink, deleteLink };
}
