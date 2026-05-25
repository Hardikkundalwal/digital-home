import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const N = 60;
const MIN_MOVE = 0.04;

export default function MotionTrail() {
  const trail = useRef([]);
  const lineRef = useRef();

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  useFrame(({ camera }) => {
    const t = trail.current;
    const last = t[t.length - 1];
    if (!last || camera.position.distanceTo(last) > MIN_MOVE) {
      t.push(camera.position.clone());
      if (t.length > N) t.shift();
    }

    const attr = geo.attributes.position;
    for (let i = 0; i < t.length; i++) {
      const p = t[i];
      attr.array[i * 3]     = p.x;
      attr.array[i * 3 + 1] = p.y - 0.15;
      attr.array[i * 3 + 2] = p.z;
    }
    attr.needsUpdate = true;
    geo.setDrawRange(0, t.length);
  });

  return (
    <line ref={lineRef} geometry={geo}>
      <lineBasicMaterial color="#6699ff" transparent opacity={0.09} depthWrite={false} />
    </line>
  );
}
