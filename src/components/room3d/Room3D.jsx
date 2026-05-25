import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import LightShaft from './LightShaft';
import BEVMinimap from './BEVMinimap';
import MotionTrail from './MotionTrail';
import AmbientParticles from './AmbientParticles';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';

const ROOM_LIGHTING = {
  study: {
    ambient: 0.12,
    dirColor: '#ffddbb',
    dirIntensity: 0.6,
    warmPoint: { intensity: 0.3, color: '#ffd4a0' },
    coolPoint: { intensity: 0.1, color: '#88bbff' },
    env: 'forest',
  },
  work: {
    ambient: 0.14,
    dirColor: '#ddeeff',
    dirIntensity: 0.6,
    warmPoint: { intensity: 0.15, color: '#ffe0c0' },
    coolPoint: { intensity: 0.25, color: '#aaccee' },
    env: 'city',
  },
  'my-room': {
    ambient: 0.12,
    dirColor: '#ffeee0',
    dirIntensity: 0.55,
    warmPoint: { intensity: 0.25, color: '#ffd4a0' },
    coolPoint: { intensity: 0.1, color: '#88bbff' },
    env: 'apartment',
  },
};

// ─── Reads camera world position into a ref each frame ───────────────────────

function CameraReader({ posRef }) {
  const { camera } = useThree();
  useFrame(() => {
    posRef.current = { x: camera.position.x, z: camera.position.z };
  });
  return null;
}

// ─── Smoothly moves OrbitControls target to jumpRef value ────────────────────

const _jumpTarget = new THREE.Vector3();

function CameraJumper({ jumpRef, controlsRef }) {
  useFrame(() => {
    if (!jumpRef.current || !controlsRef.current) return;
    _jumpTarget.set(...jumpRef.current);
    controlsRef.current.target.lerp(_jumpTarget, 0.08);
    controlsRef.current.update();
    if (controlsRef.current.target.distanceTo(_jumpTarget) < 0.06) {
      controlsRef.current.target.copy(_jumpTarget);
      controlsRef.current.update();
      jumpRef.current = null;
    }
  });
  return null;
}

// ─── Dynamic fill light that intensifies when camera is close ────────────────

const _wakePos = new THREE.Vector3();

function RoomWakeup() {
  const lightRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;
    const dist = camera.position.length();
    // closer camera → more intimate warm fill
    lightRef.current.intensity = Math.max(0, 0.4 - dist * 0.045);
    _wakePos.set(camera.position.x * 0.35, 1.6, camera.position.z * 0.35);
    lightRef.current.position.lerp(_wakePos, 0.06);
  });

  return <pointLight ref={lightRef} color="#ffeedd" intensity={0} distance={5} />;
}

// ─── Parallax: shifts background decor with camera azimuth ───────────────────

function ParallaxBg({ children }) {
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Shift group slightly opposite to camera x position
    groupRef.current.position.x = -camera.position.x * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Room shell + lighting ────────────────────────────────────────────────────

function Room({ roomId, wallColor, floorColor, ceilingColor, tod, hideShell, children }) {
  const lighting = ROOM_LIGHTING[roomId] || ROOM_LIGHTING.study;
  const ambientScale = tod === 'night' ? 0.55 : tod === 'evening' ? 0.8 : 1.0;
  const dirScale    = tod === 'night' ? 0.25 : tod === 'evening' ? 0.7  : 1.0;
  const dirColor    = tod === 'night' ? '#556688' : tod === 'evening' ? '#ffbb88' : lighting.dirColor;

  const ambientIntensity = hideShell ? 1.5 : lighting.ambient * ambientScale;
  const dirIntensity = hideShell ? 2.0 : lighting.dirIntensity * dirScale;
  const dirPosition = hideShell ? [5, 10, 5] : [3, 5, 2];

  return (
    <group>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={dirPosition}
        intensity={dirIntensity}
        color={dirColor}
        castShadow
        shadow-bias={-0.001}
        shadow-normalBias={0.02}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-2, 3, 0]} intensity={lighting.coolPoint.intensity} color={lighting.coolPoint.color} />
      <pointLight position={[0.8, 1.2, -0.5]} intensity={lighting.warmPoint.intensity} color={lighting.warmPoint.color} />

      <RoomWakeup />
      <AmbientParticles tod={tod} />
      <MotionTrail />

      {!hideShell && (
        <>
          {/* Walls */}
          <ParallaxBg>
            <mesh position={[0, 1.5, -3]} receiveShadow>
              <boxGeometry args={[7, 3, 0.15]} />
              <meshStandardMaterial color={wallColor} roughness={0.75} />
            </mesh>
          </ParallaxBg>
          <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[6, 3, 0.15]} />
            <meshStandardMaterial color={wallColor} roughness={0.75} />
          </mesh>
          <mesh position={[3.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[6, 3, 0.15]} />
            <meshStandardMaterial color={wallColor} roughness={0.75} />
          </mesh>

          {/* Ceiling */}
          <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[7, 6]} />
            <meshStandardMaterial color={ceilingColor || '#f5f0e8'} roughness={0.95} />
          </mesh>

          {/* Reflective floor */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[7, 6]} />
            <meshStandardMaterial color={floorColor} roughness={0.85} />
          </mesh>

          {/* Baseboards */}
          <mesh position={[-3.43, 0.05, 0]}><boxGeometry args={[0.04, 0.1, 6]} /><meshStandardMaterial color="#f0ece4" roughness={0.7} /></mesh>
          <mesh position={[3.43, 0.05, 0]}><boxGeometry args={[0.04, 0.1, 6]} /><meshStandardMaterial color="#f0ece4" roughness={0.7} /></mesh>
          <mesh position={[0, 0.05, -2.93]}><boxGeometry args={[7, 0.1, 0.04]} /><meshStandardMaterial color="#f0ece4" roughness={0.7} /></mesh>
        </>
      )}

      <LightShaft />
      <Environment preset={lighting.env} background blur={0.8} />
      {children}
    </group>
  );
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function getCameraZ() {
  if (typeof window === 'undefined') return 5;
  const w = window.innerWidth;
  if (w < 480) return 7.5;
  if (w < 768) return 6.5;
  return 5;
}

function getFov() {
  if (typeof window === 'undefined') return 50;
  return window.innerWidth < 768 ? 75 : 50;
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    let timeoutId;
    let resizePending = false;

    const update = () => {
      const targetZ = getCameraZ();
      const targetFov = getFov();
      if (camera.position.z !== targetZ || camera.fov !== targetFov) {
        camera.position.z = targetZ;
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
    };

    // Run initial update on mount
    update();

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!resizePending) {
          resizePending = true;
          requestAnimationFrame(() => {
            update();
            resizePending = false;
          });
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [camera]);
  return null;
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function Room3D({ roomId, wallColor, floorColor, ceilingColor, hideShell = false, children }) {
  const controlsRef   = useRef();
  const cameraPosRef  = useRef({ x: 0, z: getCameraZ() });
  const cameraJumpRef = useRef(null);
  const [cameraPos]   = useState(() => [0, 1.8, getCameraZ()]);
  const tod = useTimeOfDay();

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Canvas
        camera={{ position: cameraPos, fov: getFov() }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        shadows
        style={{ flex: 1, background: '#1a1a1a' }}
      >
        <CameraReader   posRef={cameraPosRef} />
        <CameraJumper   jumpRef={cameraJumpRef} controlsRef={controlsRef} />
        <CameraController />
        <Room
          roomId={roomId}
          wallColor={wallColor}
          floorColor={floorColor}
          ceilingColor={ceilingColor}
          tod={tod}
          hideShell={hideShell}
        >
          {children}
        </Room>
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableDamping
          dampingFactor={0.1}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0.2}
          minDistance={2}
          maxDistance={12}
          target={[0, 1.2, 0]}
        />
    </Canvas>

      <BEVMinimap
        roomId={roomId}
        cameraPosRef={cameraPosRef}
        onJump={(_, targetPos) => { cameraJumpRef.current = targetPos; }}
      />
    </div>
  );
}
