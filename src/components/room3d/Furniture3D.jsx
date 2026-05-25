import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

function clickHandler(targetKey, onFurnitureClick) {
  if (onFurnitureClick) onFurnitureClick(targetKey);
}

const TONES = {
  warm: { desk: '#a88458', deskHover: '#c4a070', leg: '#5a4a3a', chair: '#7a5f3c', shelf: '#a88458' },
  cool: { desk: '#c8c0b8', deskHover: '#d8d0c8', leg: '#888',    chair: '#999',    shelf: '#c8c0b8' },
  soft: { desk: '#c4a882', deskHover: '#d4b892', leg: '#7a6a5a', chair: '#8a7a6a', shelf: '#c4a882' },
};

// Invisible expanded hit zone that fires before cursor reaches object (pre-hover)
function PreHoverZone({ args, onEnter, onLeave }) {
  return (
    <mesh visible={false} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <boxGeometry args={args} />
    </mesh>
  );
}

// ─── Desk ────────────────────────────────────────────────────────────────────

export function Desk({ position, tone, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const t = TONES[tone] || TONES.warm;
  const c = hovered ? t.deskHover : t.desk;
  const emissive = pre && !hovered ? '#4a3010' : '#000000';

  return (
    <group position={position}>
      <PreHoverZone args={[2.2, 0.4, 1.4]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />
      <RoundedBox position={[0, 0.75, 0]} args={[1.2, 0.08, 0.6]} radius={0.02} castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('tasks', onFurnitureClick); }}
        onPointerOver={() => { setHovered(true); setPre(false); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.1} envMapIntensity={0.3} emissive={emissive} emissiveIntensity={0.6} />
      </RoundedBox>
      {[[-0.5, 0.37, -0.22], [0.5, 0.37, -0.22], [-0.5, 0.37, 0.22], [0.5, 0.37, 0.22]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.75]} />
          <meshStandardMaterial color={t.leg} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── SmallDesk ───────────────────────────────────────────────────────────────

export function SmallDesk({ position, tone, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const t = TONES[tone] || TONES.soft;
  const c = hovered ? t.deskHover : t.desk;
  const emissive = pre && !hovered ? '#3a2808' : '#000000';

  return (
    <group position={position}>
      <PreHoverZone args={[1.8, 0.35, 1.2]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />
      <RoundedBox position={[0, 0.7, 0]} args={[0.9, 0.06, 0.5]} radius={0.015} castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('tasks', onFurnitureClick); }}
        onPointerOver={() => { setHovered(true); setPre(false); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.1} envMapIntensity={0.3} emissive={emissive} emissiveIntensity={0.6} />
      </RoundedBox>
      {[[-0.4, 0.35, -0.18], [0.4, 0.35, -0.18], [-0.4, 0.35, 0.18], [0.4, 0.35, 0.18]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.7]} />
          <meshStandardMaterial color={t.leg} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Chair ───────────────────────────────────────────────────────────────────

export function Chair({ position, tone }) {
  const t = TONES[tone] || TONES.warm;
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={t.chair} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, -0.22]} castShadow>
        <boxGeometry args={[0.45, 0.28, 0.05]} />
        <meshStandardMaterial color={t.chair} roughness={0.8} />
      </mesh>
      {[[-0.18, 0.22, -0.18], [0.18, 0.22, -0.18], [-0.18, 0.22, 0.18], [0.18, 0.22, 0.18]].map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.025, 0.025, 0.45]} />
          <meshStandardMaterial color={t.leg} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── WallClock ───────────────────────────────────────────────────────────────

export function WallClock({ position, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const groupRef  = useRef();
  const hourRef   = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useFrame(() => {
    const now = new Date();
    const h  = now.getHours() % 12;
    const m  = now.getMinutes();
    const s  = now.getSeconds();
    const ms = now.getMilliseconds();
    if (hourRef.current)   hourRef.current.rotation.z   = -(h + m / 60) * (Math.PI / 6);
    if (minuteRef.current) minuteRef.current.rotation.z = -(m + s / 60) * (Math.PI / 30);
    if (secondRef.current) secondRef.current.rotation.z = -(s + ms / 1000) * (Math.PI / 30);
  });

  const ringColor = hovered ? '#b8956a' : pre ? '#b09870' : '#a08060';

  return (
    <group position={position} ref={groupRef}
      onClick={(e) => { e.stopPropagation(); clickHandler('pomodoro', onFurnitureClick); }}
      onPointerOver={() => { setHovered(true); setPre(false); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pre-hover zone */}
      <PreHoverZone args={[0.8, 0.8, 0.3]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />

      {/* Invisible tap zone */}
      <mesh position={[0, 0, 0]} visible={false} pointerEventsType="all">
        <circleGeometry args={[0.45, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh castShadow>
        <torusGeometry args={[0.24, 0.035, 12, 24]} />
        <meshPhysicalMaterial color={ringColor} roughness={0.5} clearcoat={0.05} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <circleGeometry args={[0.21, 28]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => i).map((i) => {
        const angle  = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const isMain = i % 3 === 0;
        const r = isMain ? 0.17 : 0.18;
        const w = isMain ? 0.025 : 0.012;
        const h = isMain ? 0.035 : 0.02;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.035]}>
            <boxGeometry args={[w, h, 0.005]} />
            <meshStandardMaterial color="#2b2b2b" roughness={0.5} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.045]}>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.05} metalness={0.1} envMapIntensity={0.6} />
      </mesh>
      <group ref={hourRef}><mesh position={[0, 0.05, 0.04]}><boxGeometry args={[0.04, 0.1, 0.005]} /><meshStandardMaterial color="#2b2b2b" roughness={0.5} /></mesh></group>
      <group ref={minuteRef}><mesh position={[0, 0.07, 0.04]}><boxGeometry args={[0.018, 0.14, 0.005]} /><meshStandardMaterial color="#2b2b2b" roughness={0.5} /></mesh></group>
      <group ref={secondRef}><mesh position={[0, 0.08, 0.04]}><boxGeometry args={[0.004, 0.16, 0.004]} /><meshStandardMaterial color="#c0392b" roughness={0.3} /></mesh></group>
      <mesh position={[0, 0, 0.04]}><circleGeometry args={[0.012, 12]} /><meshStandardMaterial color="#2b2b2b" /></mesh>
    </group>
  );
}

// ─── Radio ───────────────────────────────────────────────────────────────────

export function Radio({ position, onFurnitureClick, beatsActive }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const glowRef = useRef();
  const time    = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    if (beatsActive && glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.15 + Math.sin(time.current * 4) * 0.1;
    } else if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0;
    }
  });

  const bodyColor = hovered ? '#5a4a3a' : pre ? '#4a3a2a' : '#3d3328';

  return (
    <group position={position}>
      <PreHoverZone args={[0.6, 0.4, 0.4]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />
      <mesh castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('radio', onFurnitureClick); }}
        onPointerOver={() => { setHovered(true); setPre(false); }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.28, 0.16, 0.14]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.4} metalness={0.25} envMapIntensity={0.5} />
      </mesh>
      <mesh position={[0.09, 0.04, 0.08]}><circleGeometry args={[0.045, 8]} /><meshStandardMaterial color="#2a221a" roughness={0.7} /></mesh>
      <mesh position={[-0.06, 0.04, 0.08]}><circleGeometry args={[0.045, 8]} /><meshStandardMaterial color="#2a221a" roughness={0.7} /></mesh>
      <mesh ref={glowRef} position={[0.09, -0.03, 0.08]}>
        <cylinderGeometry args={[0.022, 0.022, 0.02]} />
        <meshStandardMaterial color="#c4a882" roughness={0.3} metalness={0.4} emissive="#ff8844" emissiveIntensity={0} />
      </mesh>
    </group>
  );
}

// ─── Bookshelf ───────────────────────────────────────────────────────────────

export function Bookshelf({ position, onFurnitureClick, tone, dims }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const t = TONES[tone] || TONES.warm;
  const d = dims || { w: 0.65, h: 0.9, d: 0.28 };
  const emissive = pre && !hovered ? '#2a1a00' : '#000000';

  return (
    <group position={position}>
      <PreHoverZone args={[d.w * 1.8, d.h * 1.3, d.d * 2]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />
      <RoundedBox args={[d.w, d.h, d.d]} radius={0.03} castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('folders', onFurnitureClick); }}
        onPointerOver={() => { setHovered(true); setPre(false); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={hovered ? '#c4a070' : t.shelf}
          roughness={0.6} clearcoat={0.05} envMapIntensity={0.2}
          emissive={emissive} emissiveIntensity={0.5}
        />
      </RoundedBox>
    </group>
  );
}

// ─── Corkboard ───────────────────────────────────────────────────────────────

export function Corkboard({ position, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('notes', onFurnitureClick); }}
        onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.6, 0.04]} />
        <meshStandardMaterial color={hovered ? '#c8a878' : '#b8956a'} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── PictureFrame ─────────────────────────────────────────────────────────────

export function PictureFrame({ position, onFurnitureClick, dims }) {
  const [hovered, setHovered] = useState(false);
  const [pre, setPre]         = useState(false);
  const d = dims || { w: 0.35, h: 0.28, d: 0.02 };
  const emissive = pre && !hovered ? '#1a0d00' : '#000000';

  return (
    <group position={position}>
      <PreHoverZone args={[d.w * 2, d.h * 2, 0.3]} onEnter={() => setPre(true)} onLeave={() => setPre(false)} />
      <mesh castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('settings', onFurnitureClick); }}
        onPointerOver={() => { setHovered(true); setPre(false); }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[d.w, d.h, d.d]} />
        <meshPhysicalMaterial
          color={hovered ? '#c4a070' : '#8b6f47'}
          roughness={0.4} clearcoat={0.1} envMapIntensity={0.2}
          emissive={emissive} emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[0.3, 0.23]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.8} />
      </mesh>
    </group>
  );
}
