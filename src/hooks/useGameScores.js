import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useGameScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDoc(doc(db, 'users', user.uid, 'gameScores', 'trivia'))
      .then((snap) => {
        setScores(snap.exists() ? snap.data() : { highScore: 0, totalGames: 0, totalScore: 0 });
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error('useGameScores error:', err);
        setLoading(false);
        setError(err);
      });
  }, [user]);

  const saveScore = async (score) => {
    if (!user) return;
    const current = scores || { highScore: 0, totalGames: 0, totalScore: 0 };
    const updated = {
      highScore: Math.max(current.highScore, score),
      totalGames: current.totalGames + 1,
      totalScore: current.totalScore + score,
      lastPlayed: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', user.uid, 'gameScores', 'trivia'), updated, { merge: true });
    setScores(updated);
  };

  return { scores, loading, error, saveScore };
}
