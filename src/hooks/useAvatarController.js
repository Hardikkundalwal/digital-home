import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WALK_SPEED = 2.0;
const ARRIVE_DIST = 0.05;

export default function useAvatarController(initialPos) {
  const posRef = useRef(new THREE.Vector3(initialPos[0], initialPos[1], initialPos[2]));
  const targetPos = useRef(null);
  const rotRef = useRef(0);
  const [state, setState] = useState('idle');
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      posRef.current.set(initialPos[0], initialPos[1], initialPos[2]);
      didInit.current = true;
    }
  }, [initialPos]);

  useFrame((_, delta) => {
    if (targetPos.current) {
      const dist = posRef.current.distanceTo(targetPos.current);
      if (dist < ARRIVE_DIST) {
        targetPos.current = null;
        setState('idle');
      } else {
        const dir = new THREE.Vector3().copy(targetPos.current).sub(posRef.current).normalize();
        rotRef.current = Math.atan2(dir.x, dir.z);
        posRef.current.add(dir.multiplyScalar(WALK_SPEED * delta));
        setState('walk');
      }
    }
  });

  const moveTo = (pos) => {
    if (Array.isArray(pos)) {
      targetPos.current = new THREE.Vector3(pos[0], pos[1], pos[2]);
    } else {
      targetPos.current = pos.clone();
    }
  };

  const stop = () => {
    targetPos.current = null;
    setState('idle');
  };

  const isMoving = targetPos.current !== null;

  return { posRef, state, rotRef, moveTo, stop, isMoving };
}
