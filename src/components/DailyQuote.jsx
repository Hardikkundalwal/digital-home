import { useState, useEffect } from 'react';

const API = 'https://api.quotable.io/random?maxLength=100';

export default function DailyQuote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem('dh_quote');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.time < 86400000) {
        setQuote(parsed.data);
        return;
      }
    }
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        const q = { text: d.content, author: d.author };
        setQuote(q);
        localStorage.setItem('dh_quote', JSON.stringify({ data: q, time: Date.now() }));
      })
      .catch(() => {});
  }, []);

  if (!quote) return null;

  return (
    <div className="daily-quote">
      <p className="quote-text">"{quote.text}"</p>
      <p className="quote-author">— {quote.author}</p>
    </div>
  );
}
