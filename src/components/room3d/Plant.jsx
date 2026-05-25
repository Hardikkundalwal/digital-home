import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const LEAF_POSITIONS = [
  [0.06, 0.3, 0], [-0.05, 0.33, 0.03], [0.04, 0.37, -0.02], [-0.03, 0.28, -0.04],
];
const LEAF_ROTS = LEAF_POSITIONS.map(() => [
  Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5,
]);

export default function Plant({ position, scale = 1 }) {
  const groupRef = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const t = useRef(phase);

  useFrame((_, delta) => {
    t.current += delta;
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(t.current * 0.7) * 0.018;
    groupRef.current.rotation.x = Math.sin(t.current * 0.5 + 1.2) * 0.01;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} ref={groupRef}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.12]} />
        <meshStandardMaterial color="#a08060" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.02]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.18]} />
        <meshStandardMaterial color="#4a7a3a" roughness={0.8} />
      </mesh>
      {LEAF_POSITIONS.map((p, i) => (
        <mesh key={i} position={p} rotation={LEAF_ROTS[i]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#5a9e4a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
