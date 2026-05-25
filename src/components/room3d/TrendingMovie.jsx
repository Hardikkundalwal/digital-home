import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useTrendingMovie from '../../hooks/useTrendingMovie';

/**
 * TrendingMovie - Shows trending movie poster on TV stand
 */
export default function TrendingMovie({ position, onFurnitureClick }) {
  const { movie, loading, error } = useTrendingMovie();
  const [texture, setTexture] = useState(null);
  const { gl } = useThree();

  useEffect(() => {
    if (!movie?.posterUrl) return;
    let active = true;
    let loadedTexture = null;
    const loader = new THREE.TextureLoader(gl);
    loader.load(movie.posterUrl, (t) => {
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
  }, [movie, gl]);

  if (!texture) return null;

  return (
    <group position={position || [0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); if (onFurnitureClick) onFurnitureClick('trivia'); }}
    >
      <mesh position={[0, 0.32, 0.025]}>
        <planeGeometry args={[0.4, 0.26]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <Text position={[0, 0.14, 0.025]} fontSize={0.04} color="#fff" anchorX="center" maxWidth={0.5} material={{ depthTest: false }}>
        {movie?.title}
      </Text>
    </group>
  );
}
