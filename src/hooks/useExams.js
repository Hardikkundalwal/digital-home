import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const ref = collection(db, 'users', user.uid, 'exams');
    const q = query(ref, orderBy('examDate', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setExams(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useExams error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user]);

  const addExam = async ({ title, subject, examDate, notes }) => {
    if (!user || !title?.trim() || !subject?.trim() || !examDate) return;
    await addDoc(collection(db, 'users', user.uid, 'exams'), {
      title: title.trim(),
      subject: subject.trim(),
      examDate,
      notes: notes?.trim() || '',
      createdAt: serverTimestamp(),
    });
  };

  const deleteExam = async (examId) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'exams', examId));
  };

  const updateExam = async (examId, data) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'exams', examId), data);
  };

  return { exams, loading, error, addExam, deleteExam, updateExam };
}
