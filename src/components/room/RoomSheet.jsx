import { useEffect, useRef } from 'react';

export default function RoomSheet({ open, onClose, title, children }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };

  const onTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && sheetRef.current) {
      currentY.current = dy;
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const onTouchEnd = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = '';
      sheetRef.current.style.transform = '';
      if (currentY.current > 100) onClose();
      currentY.current = 0;
    }
  };

  return (
    <>
      <div className={`sheet-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''}`} ref={sheetRef}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        <div className="sheet-handle" onClick={onClose} />
        {title && <h2 className="sheet-title">{title}</h2>}
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
