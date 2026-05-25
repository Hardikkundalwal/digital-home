import { useState } from 'react';

function clickHandler(key, fn) { if (fn) fn(key); }

export default function Monitor({ position, onFurnitureClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.04]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('notes', onFurnitureClick); }}
        onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.45, 0.3, 0.015]} />
        <meshStandardMaterial color={hovered ? '#4a4a4a' : '#333'} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.55, 0.01]}>
        <planeGeometry args={[0.4, 0.26]} />
        <meshStandardMaterial color="#88bbff" emissive="#88bbff" emissiveIntensity={0.15} roughness={0.1} />
      </mesh>
    </group>
  );
}
