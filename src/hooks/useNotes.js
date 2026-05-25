import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useNotes(roomId) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomId) return;
    const ref = collection(db, 'users', user.uid, 'rooms', roomId, 'notes');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setNotes(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useNotes error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomId]);

  const addNote = async (text) => {
    if (!user || !roomId || !text.trim()) return;
    await addDoc(collection(db, 'users', user.uid, 'rooms', roomId, 'notes'), {
      text: text.trim(),
      createdAt: serverTimestamp()
    });
  };

  const updateNote = async (noteId, text) => {
    if (!text.trim()) return;
    await updateDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'notes', noteId), {
      text: text.trim(),
      updatedAt: serverTimestamp()
    });
  };

  const deleteNote = async (noteId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'notes', noteId));
  };

  return { notes, loading, error, addNote, updateNote, deleteNote };
}
