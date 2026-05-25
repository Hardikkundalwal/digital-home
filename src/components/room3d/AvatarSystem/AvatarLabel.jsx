import { Text } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * AvatarLabel shows the user's name above their avatar
 * Always faces the camera (billboards)
 */
export default function AvatarLabel({ position, name, color }) {
  const labelRef = useRef();

  useFrame(({ camera }) => {
    if (labelRef.current) {
      labelRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position} ref={labelRef}>
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.08}
        color={color || '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.5}
        material={{
          transparent: true,
          depthTest: false,
          depthWrite: false,
          fog: false,
        }}
      >
        {(name || 'User').slice(0, 20)}
      </Text>
    </group>
  );
}
