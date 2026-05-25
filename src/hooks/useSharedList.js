import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useSharedList(roomCode, listName) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomCode || !listName) return;
    const ref = collection(db, 'sharedRooms', roomCode, 'lists', listName, 'items');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setItems(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useSharedList error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomCode, listName]);

  const addItem = async (text, qty = 1) => {
    if (!user || !roomCode || !listName || !text.trim()) return;
    await addDoc(collection(db, 'sharedRooms', roomCode, 'lists', listName, 'items'), {
      text: text.trim(),
      qty: Math.max(1, Number(qty) || 1),
      done: false,
      createdBy: user.uid,
      addedByName: user.displayName || user.email || '',
      createdAt: serverTimestamp(),
    });
  };

  const toggleItem = async (itemId, done) => {
    await updateDoc(doc(db, 'sharedRooms', roomCode, 'lists', listName, 'items', itemId), { done: !done });
  };

  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, 'sharedRooms', roomCode, 'lists', listName, 'items', itemId));
  };

  const clearCompleted = async () => {
    const ref = collection(db, 'sharedRooms', roomCode, 'lists', listName, 'items');
    const snap = await getDocs(query(ref, where('done', '==', true)));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  };

  const updateQty = async (itemId, qty) => {
    await updateDoc(doc(db, 'sharedRooms', roomCode, 'lists', listName, 'items', itemId), { qty: Math.max(1, qty) });
  };

  return { items, loading, error, addItem, toggleItem, deleteItem, clearCompleted, updateQty };
}
