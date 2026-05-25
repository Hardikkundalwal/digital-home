import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useNasaApod from '../../hooks/useNasaApod';

/**
 * NasaPicture - Renders NASA APOD image on a PictureFrame
 * Uses manual TextureLoader to avoid Suspense issues
 */
export default function NasaPicture({ position, onFurnitureClick, dims }) {
  const { data, loading, error } = useNasaApod();
  const [texture, setTexture] = useState(null);
  const { gl } = useThree();

  useEffect(() => {
    if (!data?.url) return;
    let active = true;
    let loadedTexture = null;
    const loader = new THREE.TextureLoader(gl);
    loader.load(data.url, (t) => {
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
  }, [data, gl]);

  if (!texture) return null;

  const d = dims || { w: 0.35, h: 0.28, d: 0.02 };

  return (
    <mesh position={position || [0, 0, 0.02]}
      onClick={(e) => { e.stopPropagation(); if (onFurnitureClick) onFurnitureClick('settings'); }}
    >
      <planeGeometry args={[d.w * 0.85, d.h * 0.85]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
