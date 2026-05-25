import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useGitHub from '../../hooks/useGitHub';

/**
 * GitHubMonitor - Shows GitHub contribution chart on the monitor screen
 */
export default function GitHubMonitor({ position, onFurnitureClick }) {
  const { imageUrl, loading, error } = useGitHub();
  const [texture, setTexture] = useState(null);
  const { gl } = useThree();

  useEffect(() => {
    if (!imageUrl) return;
    let active = true;
    let loadedTexture = null;
    const loader = new THREE.TextureLoader(gl);
    loader.load(imageUrl, (t) => {
      if (active) {
        setTexture(t);
        loadedTexture = t;
      } else {
        t.dispose();
      }
    });
    return () => {
      active = false;
      if (loadedTexture) loadedTexture.dispose();
    };
  }, [imageUrl, gl]);

  if (!texture) return null;

  return (
    <mesh position={position || [0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); if (onFurnitureClick) onFurnitureClick('notes'); }}
    >
      <planeGeometry args={[0.38, 0.24]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
