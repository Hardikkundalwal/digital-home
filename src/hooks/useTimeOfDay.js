import { useState, useEffect } from 'react';

function compute() {
  const h = new Date().getHours();
  if (h >= 6 && h < 10) return 'morning';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

export function useTimeOfDay() {
  const [tod, setTod] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setTod(compute()), 60_000);
    return () => clearInterval(id);
  }, []);
  return tod;
}
