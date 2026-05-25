import { useState } from 'react';

function clickHandler(key, fn) { if (fn) fn(key); }

export default function Bed({ position, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);
  const c = hovered ? '#d4c8b0' : '#c4b8a0';
  const click = (e) => { e.stopPropagation(); clickHandler('bed', onFurnitureClick); };
  const over = () => setHovered(true);
  const out = () => setHovered(false);

  return (
    <group position={position}>
      {/* Full-bed invisible click zone — covers pillow/blanket/headboard */}
      <mesh visible={false} onClick={click} onPointerOver={over} onPointerOut={out}>
        <boxGeometry args={[1.3, 0.7, 1.0]} />
      </mesh>

      <mesh position={[0, 0.15, 0]} castShadow onClick={click} onPointerOver={over} onPointerOut={out}>
        <boxGeometry args={[1.2, 0.12, 0.9]} />
        <meshStandardMaterial color={c} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.8]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, 0.25]}>
        <boxGeometry args={[0.35, 0.05, 0.25]} />
        <meshStandardMaterial color="#fff" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.29, -0.1]}>
        <boxGeometry args={[1.0, 0.03, 0.5]} />
        <meshStandardMaterial color="#7a9e6b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.45, -0.48]} onClick={click} onPointerOver={over} onPointerOut={out}>
        <boxGeometry args={[1.2, 0.5, 0.06]} />
        <meshStandardMaterial color={c} roughness={0.7} />
      </mesh>
    </group>
  );
}
