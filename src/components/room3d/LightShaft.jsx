import * as THREE from 'three';
import { SpotLight } from '@react-three/drei';

export default function LightShaft() {
  return (
    <group>
      <SpotLight
        position={[-1.5, 2.8, -2.5]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.6}
        color="#ffeedd"
        castShadow
        distance={5}
        attenuation={1}
        anglePower={3}
      />
      <mesh position={[-1.4, 1.5, -2.5]} rotation={[0.3, 0.2, -0.1]}>
        <coneGeometry args={[0.15, 1.2, 8]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
