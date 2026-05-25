import { forwardRef } from 'react';

const Button = forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
  const variants = {
    default: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-small btn-ghost',
  };
  return (
    <button ref={ref} className={`${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;

export function Input({ className = '', ...props }) {
  return <input className={className} {...props} />;
}

export function Sheet({ open, onClose, title, children }) {
  return (
    <>
      <div className={`sheet-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" onClick={onClose} />
        {title && <h2 className="sheet-title">{title}</h2>}
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
