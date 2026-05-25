import { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, RoundedBox, useGLTF, Loader } from '@react-three/drei';
import * as THREE from 'three';

// ─── GLTF Model Config ────────────────────────────────────────────────
// School model has nested transforms that place it at ~(1, -3.1, 1.8)
// These constants center it at the origin for our scene.
const MODEL_POS = [-1.0, 3.1, -1.8];
const MODEL_SCALE = 1.0;
const MODEL_ROT = [0, 0, 0];

// ─── Camera Config ────────────────────────────────────────────────────

const ISOMETRIC_POS = new THREE.Vector3(8, 8, 8);
const ISOMETRIC_TARGET = new THREE.Vector3(0, 0, 0);

// Camera focus targets — tune these after positioning the model
const ZONE_FOCUS = {
  desk:  { pos: [3, 2.5, 1.5],  target: [0.5, 0.3, 0] },
  board: { pos: [-1, 3, 2],     target: [-0.5, 0.8, -0.5] },
  shelf: { pos: [2, 3, -1],     target: [1.0, 0.8, 1.5] },
};

// ─── Camera Controller ───────────────────────────────────────────────

function CameraController({ targetRef, lookAtRef }) {
  const { camera } = useThree();
  const lastLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    const distSq = camera.position.distanceToSquared(targetRef.current);
    const positionNeedsUpdate = distSq > 0.00001;
    const lookAtNeedsUpdate = !lastLookAt.current.equals(lookAtRef.current);

    if (positionNeedsUpdate || lookAtNeedsUpdate) {
      if (distSq < 0.0001) {
        camera.position.copy(targetRef.current);
      } else {
        camera.position.lerp(targetRef.current, 0.05);
      }
      camera.lookAt(lookAtRef.current);
      lastLookAt.current.copy(lookAtRef.current);
    }
  });

  return null;
}

// ─── School Room Model ────────────────────────────────────────────────

function SchoolRoomModel() {
  const { scene } = useGLTF('/models/isometric_room_school/scene.gltf');

  return (
    <group position={MODEL_POS} scale={MODEL_SCALE} rotation={MODEL_ROT}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Invisible Click Zone ─────────────────────────────────────────────

function ClickZone({ id, position, args, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetY = hovered ? 0.04 : 0;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      visible={false}
      pointerEventsType="all"
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <boxGeometry args={args} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────

function Avatar() {
  const groupRef = useRef();
  const armLRef = useRef();
  const armRRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.01;
    if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * 0.4) * 0.03;
    if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * 0.4 + 0.5) * 0.03;
  });

  const suit = '#1a2430';
  const shirt = '#e8e0d8';
  const skin = '#e8c8a0';

  return (
    <group ref={groupRef} position={[0.5, 0.4, -0.1]}>
      <RoundedBox args={[0.24, 0.2, 0.12]} radius={0.015} position={[0, 0.15, 0]} castShadow>
        <meshPhysicalMaterial color={suit} roughness={0.5} clearcoat={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.22, 0.065]}>
        <planeGeometry args={[0.08, 0.025]} />
        <meshBasicMaterial color={shirt} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshPhysicalMaterial color={skin} roughness={0.3} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.37, 0.015]}>
        <sphereGeometry args={[0.06, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshPhysicalMaterial color="#2a1a1a" roughness={0.8} />
      </mesh>
      <group ref={armLRef} position={[-0.14, 0.18, 0]}>
        <RoundedBox args={[0.04, 0.16, 0.04]} radius={0.005} position={[0, -0.08, 0]}>
          <meshPhysicalMaterial color={suit} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.17, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshPhysicalMaterial color={skin} roughness={0.5} />
        </mesh>
      </group>
      <group ref={armRRef} position={[0.14, 0.18, 0]}>
        <RoundedBox args={[0.04, 0.16, 0.04]} radius={0.005} position={[0, -0.08, 0]}>
          <meshPhysicalMaterial color={suit} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.17, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshPhysicalMaterial color={skin} roughness={0.5} />
        </mesh>
      </group>
      <RoundedBox args={[0.08, 0.08, 0.1]} radius={0.005} position={[-0.06, -0.02, 0.08]}>
        <meshPhysicalMaterial color={suit} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.08, 0.1]} radius={0.005} position={[0.06, -0.02, 0.08]}>
        <meshPhysicalMaterial color={suit} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

// ─── Invisible Floor (background click to reset camera) ───────────────

function Floor({ onClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -10, 0]}
      receiveShadow
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────

function StudyRoomScene({ onFurnitureClick }) {
  const targetRef = useRef(ISOMETRIC_POS.clone());
  const lookAtRef = useRef(ISOMETRIC_TARGET.clone());
  const [activeZone, setActiveZone] = useState(null);

  const handleZoneClick = useCallback((id) => {
    setActiveZone(id);
    const focus = ZONE_FOCUS[id];
    if (focus) {
      targetRef.current.set(...focus.pos);
      lookAtRef.current.set(...focus.target);
    }
    onFurnitureClick?.(id);
  }, [onFurnitureClick]);

  const handleBackgroundClick = useCallback(() => {
    setActiveZone(null);
    targetRef.current.copy(ISOMETRIC_POS);
    lookAtRef.current.copy(ISOMETRIC_TARGET);
  }, []);

  return (
    <>
      <CameraController targetRef={targetRef} lookAtRef={lookAtRef} />
      <Floor onClick={handleBackgroundClick} />
      <SchoolRoomModel />

      {/* Invisible click zones — tune positions/args to match the school model layout */}
      <ClickZone
        id="desk"
        position={[0.5, 0.3, 0]}
        args={[1.2, 0.3, 0.6]}
        onClick={handleZoneClick}
      />
      <ClickZone
        id="board"
        position={[-0.5, 0.8, -0.5]}
        args={[0.8, 0.5, 0.2]}
        onClick={handleZoneClick}
      />
      <ClickZone
        id="shelf"
        position={[1.0, 0.8, 1.5]}
        args={[0.6, 0.6, 0.4]}
        onClick={handleZoneClick}
      />

      <Avatar />
    </>
  );
}

// ─── Public API ───────────────────────────────────────────────────────

export default function InteractiveStudyRoom({ onFurnitureClick }) {
  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative' }}>
      <Suspense fallback={
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e8e0d6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#5a4a3a',
          zIndex: 100
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(90, 74, 58, 0.2)',
            borderTopColor: '#5a4a3a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            LOADING 3D ENVIRONMENT...
          </div>
        </div>
      }>
        <Canvas
          shadows
          camera={{ position: [8, 8, 8], fov: 45, near: 0.1, far: 30 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          onCreated={({ gl, camera }) => {
            camera.lookAt(0, 0, 0);
            gl.setClearColor('#e8e0d6');
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={2.0}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.001}
            shadow-normalBias={0.02}
            shadow-radius={4}
          />
          <Environment preset="city" background blur={0.5} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.35}
            blur={3}
            far={15}
            resolution={1024}
          />
          <StudyRoomScene onFurnitureClick={onFurnitureClick} />
        </Canvas>
        <Loader />
      </Suspense>
    </div>
  );
}
