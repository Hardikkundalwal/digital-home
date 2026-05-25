import { useEffect, useRef } from 'react';

const ROOM_W = 7;   // world x: -3.5 → 3.5
const ROOM_D = 6;   // world z: -3 → 3
const MAP_W = 150;
const MAP_H = 120;

function w2m(x, z) {
  return [
    ((x + 3.5) / ROOM_W) * MAP_W,
    ((z + 3) / ROOM_D) * MAP_H,
  ];
}

const FURNITURE = {
  study: [
    { key: 'tasks',   label: 'Desk',  x: 0,     z: -0.8,  color: '#c4a070' },
    { key: 'radio',   label: 'Radio', x: -0.3,  z: -0.6,  color: '#5a4a3a' },
    { key: 'exams',   label: 'Book',  x: 0.38,  z: -0.58, color: '#e8d4b0' },
    { key: 'folders', label: 'Shelf', x: -3.35, z: -0.5,  color: '#a88458' },
    { key: 'notes',   label: 'Board', x: 3.35,  z: 1.8,   color: '#b8956a' },
    { key: 'pomodoro',label: 'Clock', x: 1.2,   z: -2.9,  color: '#888'    },
  ],
  work: [
    { key: 'tasks',   label: 'Desk',  x: 0,    z: -0.8, color: '#c8c0b8' },
    { key: 'pomodoro',label: 'Clock', x: -1.2, z: -2.9, color: '#888'    },
    { key: 'notes',   label: 'Board', x: 0,    z: -2.9, color: '#b8956a' },
    { key: 'settings',label: 'Frame', x: -3.35,z: 0.5,  color: '#8b6f47' },
  ],
  'my-room': [
    { key: 'bed',     label: 'Bed',  x: -2.5, z: -0.1, color: '#c4a882' },
    { key: 'tasks',   label: 'Desk', x: 1.5,  z: 0.3,  color: '#c4a882' },
    { key: 'trivia',  label: 'TV',   x: 0.8,  z: -2.9, color: '#2a2a2a' },
    { key: 'pomodoro',label: 'Clock',x: 1.0,  z: -2.9, color: '#888'    },
  ],
};

export default function BEVMinimap({ roomId, cameraPosRef, onJump }) {
  const canvasRef = useRef();

  useEffect(() => {
    let rafId;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, MAP_W, MAP_H);

      // background
      ctx.fillStyle = 'rgba(10,12,18,0.9)';
      ctx.fillRect(0, 0, MAP_W, MAP_H);

      // back wall highlight (top edge = back wall in world)
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(2, 2, MAP_W - 4, 10);

      // room border
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(1.5, 1.5, MAP_W - 3, MAP_H - 3);

      // furniture dots
      const list = FURNITURE[roomId] || [];
      list.forEach(({ x, z, color, label }) => {
        const [mx, mz] = w2m(x, z);
        ctx.beginPath();
        ctx.arc(mx, mz, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '6.5px system-ui';
        ctx.fillText(label, mx + 6, mz + 3);
      });

      // camera position (blue dot)
      if (cameraPosRef?.current) {
        const { x, z } = cameraPosRef.current;
        const [cx, cz] = w2m(
          Math.max(-3.5, Math.min(3.5, x)),
          Math.max(-3, Math.min(5, z)),  // camera z can be > 3 (front of scene)
        );
        ctx.beginPath();
        ctx.arc(cx, cz, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#4488ff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [roomId, cameraPosRef]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cz = e.clientY - rect.top;
    const wx = (cx / MAP_W) * ROOM_W - 3.5;
    const wz = (cz / MAP_H) * ROOM_D - 3;

    const list = FURNITURE[roomId] || [];
    let nearest = null, bestDist = Infinity;
    list.forEach((f) => {
      const d = Math.hypot(f.x - wx, f.z - wz);
      if (d < bestDist) { bestDist = d; nearest = f; }
    });
    if (nearest && bestDist < 1.5) {
      // jump OrbitControls target to furniture
      onJump?.(nearest.key, [nearest.x, 1.2, nearest.z]);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
      zIndex: 20,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 6px 28px rgba(0,0,0,0.65)',
      border: '1px solid rgba(255,255,255,0.1)',
      userSelect: 'none',
    }}>
      <div style={{
        padding: '2px 8px',
        background: 'rgba(0,0,0,0.92)',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '7.5px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
      }}>
        bev · click to jump
      </div>
      <canvas
        ref={canvasRef}
        width={MAP_W}
        height={MAP_H}
        onClick={handleClick}
        style={{ display: 'block', cursor: 'crosshair' }}
      />
    </div>
  );
}
