import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Avatar from './Avatar';

/**
 * RemoteAvatar renders another user's avatar based on presence data
 */
export default function RemoteAvatar({ data }) {
  const posRef = useRef(new THREE.Vector3(
    data.position?.[0] ?? 0,
    data.position?.[1] ?? 0,
    data.position?.[2] ?? 0
  ));
  const rotRef = useRef(data.rotationY ?? 0);
  const [state, setState] = useState(data.animationState ?? 'idle');

  useEffect(() => {
    setState(data.animationState ?? 'idle');
  }, [data.animationState]);

  useFrame(() => {
    if (data.position) {
      posRef.current.lerp(
        new THREE.Vector3(data.position[0], data.position[1], data.position[2]),
        0.12
      );
    }
    if (data.rotationY !== undefined) {
      rotRef.current = data.rotationY;
    }
  });

  return (
    <Avatar
      posRef={posRef}
      state={state}
      rotRef={rotRef}
      customization={data.customization}
    />
  );
}
