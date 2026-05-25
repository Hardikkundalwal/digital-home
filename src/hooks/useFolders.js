import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useFolders(roomId) {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomId) return;
    const ref = collection(db, 'users', user.uid, 'rooms', roomId, 'folders');
    const q = query(ref, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setFolders(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useFolders error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomId]);

  const addFolder = async (name) => {
    if (!user || !roomId || !name.trim()) return;
    await addDoc(collection(db, 'users', user.uid, 'rooms', roomId, 'folders'), {
      name: name.trim(),
      createdAt: serverTimestamp()
    });
  };

  const deleteFolder = async (folderId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'folders', folderId));
  };

  return { folders, loading, error, addFolder, deleteFolder };
}
