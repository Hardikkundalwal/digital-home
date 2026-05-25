export default function GlassRadio({ options, value, onChange, className }) {
  const idx = options.findIndex((o) => o.value === value);

  return (
    <div className={`glass-radio-group ${className || ''}`}>
      {options.map((opt, i) => (
        <input
          key={opt.value}
          type="radio"
          name="glass-radio"
          id={`gr-${opt.value}`}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
      ))}
      {options.map((opt) => (
        <label key={opt.value} htmlFor={`gr-${opt.value}`}>
          {opt.icon && <opt.icon size={14} />}
          {opt.label}
        </label>
      ))}
      <div
        className="glass-glider"
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${(idx === -1 ? 0 : idx) * 100}%)`,
        }}
      />
    </div>
  );
}
