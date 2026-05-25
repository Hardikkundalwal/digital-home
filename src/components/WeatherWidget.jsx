import { useState, useEffect } from 'react';
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

const API = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current_weather=true&timezone=auto';

const CONDITIONS = {
  0: { icon: <Sun size={18} strokeWidth={1.5} />, label: 'Clear' },
  1: { icon: <Sun size={18} strokeWidth={1.5} />, label: 'Mostly clear' },
  2: { icon: <CloudSun size={18} strokeWidth={1.5} />, label: 'Partly cloudy' },
  3: { icon: <Cloud size={18} strokeWidth={1.5} />, label: 'Overcast' },
  45: { icon: <CloudFog size={18} strokeWidth={1.5} />, label: 'Foggy' },
  48: { icon: <CloudFog size={18} strokeWidth={1.5} />, label: 'Foggy' },
  51: { icon: <CloudDrizzle size={18} strokeWidth={1.5} />, label: 'Drizzle' },
  53: { icon: <CloudDrizzle size={18} strokeWidth={1.5} />, label: 'Drizzle' },
  55: { icon: <CloudDrizzle size={18} strokeWidth={1.5} />, label: 'Drizzle' },
  61: { icon: <CloudRain size={18} strokeWidth={1.5} />, label: 'Rain' },
  63: { icon: <CloudRain size={18} strokeWidth={1.5} />, label: 'Rain' },
  65: { icon: <CloudRain size={18} strokeWidth={1.5} />, label: 'Rain' },
  71: { icon: <CloudSnow size={18} strokeWidth={1.5} />, label: 'Snow' },
  73: { icon: <CloudSnow size={18} strokeWidth={1.5} />, label: 'Snow' },
  75: { icon: <CloudSnow size={18} strokeWidth={1.5} />, label: 'Snow' },
  95: { icon: <CloudLightning size={18} strokeWidth={1.5} />, label: 'Thunder' },
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('dh_weather');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.time < 600000) {
        setWeather(parsed.data);
        return;
      }
    }
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (d.current_weather) {
          setWeather(d.current_weather);
          localStorage.setItem('dh_weather', JSON.stringify({ data: d.current_weather, time: Date.now() }));
        }
      })
      .catch(() => setError(true));
  }, []);

  if (error || !weather) return null;

  const cond = CONDITIONS[weather.weathercode] || { icon: <Sun size={18} strokeWidth={1.5} />, label: 'Fair' };

  return (
    <div className="weather-widget">
      <span className="weather-icon">{cond.icon}</span>
      <span className="weather-temp">{Math.round(weather.temperature)}°C</span>
      <span className="weather-label">{cond.label}</span>
    </div>
  );
}
