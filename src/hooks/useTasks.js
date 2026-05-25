import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp, where
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useTasks(roomId) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomId) return;
    const ref = collection(db, 'users', user.uid, 'rooms', roomId, 'tasks');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setTasks(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useTasks error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomId]);

  const addTask = async (text) => {
    if (!user || !roomId || !text.trim()) return;
    await addDoc(collection(db, 'users', user.uid, 'rooms', roomId, 'tasks'), {
      text: text.trim(),
      done: false,
      createdAt: serverTimestamp()
    });
  };

  const toggleTask = async (taskId, done) => {
    await updateDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'tasks', taskId), { done: !done });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'tasks', taskId));
  };

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
}
