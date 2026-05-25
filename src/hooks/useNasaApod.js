import { useState, useEffect } from 'react';

const CACHE_KEY = 'nasa_apod';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default function useNasaApod() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, value } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setData(value);
          setLoading(false);
          return;
        }
      } catch {}
    }

    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    if (!apiKey) {
      setError('No NASA API key');
      setLoading(false);
      return;
    }

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url) {
          const value = { url: d.url.replace(/^http:/, 'https:'), title: d.title, explanation: d.explanation };
          setData(value);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), value }));
        } else if (d.error) throw new Error(d.error.message);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return { data, loading, error };
}
