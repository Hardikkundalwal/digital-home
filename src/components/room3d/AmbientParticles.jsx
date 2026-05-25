import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 28;

function makeParticles() {
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = Math.random() * 2.4 + 0.1;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    vel[i * 3]     = (Math.random() - 0.5) * 0.0012;
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.0006;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0012;
  }
  return { pos, vel };
}

export default function AmbientParticles({ tod = 'day' }) {
  const { pos, vel } = useMemo(makeParticles, []);
  const pointsRef = useRef();

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);

  useFrame(() => {
    const attr = pointsRef.current?.geometry?.attributes?.position;
    if (!attr) return;
    for (let i = 0; i < COUNT; i++) {
      attr.array[i * 3]     += vel[i * 3];
      attr.array[i * 3 + 1] += vel[i * 3 + 1];
      attr.array[i * 3 + 2] += vel[i * 3 + 2];
      if (Math.abs(attr.array[i * 3]) > 3)     vel[i * 3]     *= -1;
      if (attr.array[i * 3 + 1] > 2.8 || attr.array[i * 3 + 1] < 0.05) vel[i * 3 + 1] *= -1;
      if (Math.abs(attr.array[i * 3 + 2]) > 2.8) vel[i * 3 + 2] *= -1;
    }
    attr.needsUpdate = true;
  });

  // More visible at morning (light rays), dim at night
  const opacity = tod === 'morning' ? 0.55 : tod === 'day' ? 0.3 : tod === 'evening' ? 0.2 : 0.12;

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.012}
        color="#fff8e0"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
