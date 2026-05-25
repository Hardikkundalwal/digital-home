import { useState, useEffect } from 'react';

const CACHE_KEY = 'github_contrib';
const CACHE_DURATION = 6 * 60 * 60 * 1000;

export default function useGitHub() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = import.meta.env.VITE_GITHUB_USER;
    if (!username) {
      setError('No GitHub username configured');
      setLoading(false);
      return;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, value } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setImageUrl(value);
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Use ghchart API to get SVG contribution image
    const url = `https://ghchart.rshah.org/${username}`;
    setImageUrl(url);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), value: url }));
    setLoading(false);
  }, []);

  return { imageUrl, loading, error };
}
