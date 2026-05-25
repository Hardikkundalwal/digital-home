import { useState, useEffect } from 'react';

const CACHE_KEY = 'tmdb_trending';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default function useTrendingMovie() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, value } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setMovie(value);
          setLoading(false);
          return;
        }
      } catch {}
    }

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setError('No TMDB API key');
      setLoading(false);
      return;
    }

    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.results && d.results.length > 0) {
          const top = d.results[0];
          const value = {
            title: top.title,
            rating: top.vote_average,
            posterUrl: top.poster_path
              ? `https://image.tmdb.org/t/p/w500${top.poster_path}`
              : null,
          };
          setMovie(value);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), value }));
        }
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return { movie, loading, error };
}
