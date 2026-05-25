import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, BODY, ARMS, LEGS, FEET, ANIM, GLOW } from './avatarConfig';

export default function Avatar({ posRef, state, rotRef, customization }) {
  const groupRef = useRef();
  const bobRef = useRef();
  const breathRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const glowRef = useRef();
  const time = useRef(0);
  const lastState = useRef('idle');
  const walkPhase = useRef(0);
  const initialized = useRef(false);

  const S = {
    ...COLORS,
    skin: customization?.skinTone || COLORS.skin,
    hair: customization?.hairColor || COLORS.hair,
    shirt: customization?.outfitColor || COLORS.shirt,
    pants: customization?.outfitColor || COLORS.pants,
    shoes: customization?.outfitColor || COLORS.shoes,
  };
  const b = BODY;
  const a = ARMS;
  const l = LEGS;
  const f = FEET;

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;
    const isWalking = state === 'walk';

    if (!initialized.current) {
      if (groupRef.current && posRef.current) {
        groupRef.current.position.copy(posRef.current);
        initialized.current = true;
      }
    }

    if (state !== lastState.current) {
      lastState.current = state;
      if (isWalking) walkPhase.current = 0;
    }

    if (groupRef.current && posRef.current) {
      groupRef.current.position.lerp(posRef.current, 0.08);
    }

    if (rotRef && rotRef.current !== undefined && groupRef.current) {
      groupRef.current.rotation.y = rotRef.current;
    }

    if (isWalking) {
      walkPhase.current += delta * ANIM.walk.stepFreq;
      const s = Math.sin(walkPhase.current);
      const c = Math.cos(walkPhase.current);

      if (bobRef.current) bobRef.current.position.y = Math.abs(s) * ANIM.walk.bodyBob * 2;
      if (breathRef.current) breathRef.current.rotation.z = s * ANIM.walk.bodyTwist;

      if (leftLegRef.current) leftLegRef.current.rotation.x = s * ANIM.walk.swingAmount;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -s * ANIM.walk.swingAmount;
      if (leftArmRef.current) leftArmRef.current.rotation.z = -s * ANIM.walk.swingAmount * ANIM.walk.armRatio;
      if (rightArmRef.current) rightArmRef.current.rotation.z = s * ANIM.walk.swingAmount * ANIM.walk.armRatio;
    } else {
      if (bobRef.current) {
        bobRef.current.position.y = Math.sin(t * ANIM.idle.breathSpeed) * ANIM.idle.breathAmount;
        bobRef.current.position.x = Math.sin(t * ANIM.idle.shiftSpeed) * ANIM.idle.shiftAmount;
      }
      if (breathRef.current) breathRef.current.rotation.z = 0;

      const headTilt = Math.sin(t * ANIM.idle.headTiltSpeed) * ANIM.idle.headTiltAmount;
      if (leftLegRef.current) leftLegRef.current.rotation.x = headTilt * 0.1;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -headTilt * 0.1;
      if (leftArmRef.current) leftArmRef.current.rotation.z = headTilt * 0.2;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -headTilt * 0.2;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = GLOW.opacity + Math.sin(t * 0.8) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bobRef}>
        <group ref={breathRef}>
          {/* Pelvis */}
          <mesh position={b.pelvis.pos} castShadow>
            <boxGeometry args={b.pelvis.size} />
            <meshStandardMaterial color={S.pants} roughness={0.8} />
          </mesh>

          {/* Torso */}
          <mesh position={b.torso.pos} castShadow>
            <boxGeometry args={b.torso.size} />
            <meshStandardMaterial color={S.shirt} roughness={0.7} />
          </mesh>

          {/* Neck */}
          <mesh position={b.neck.pos}>
            <cylinderGeometry args={[b.neck.radius, b.neck.radius, b.neck.height]} />
            <meshStandardMaterial color={S.skin} roughness={0.6} />
          </mesh>

          {/* Head */}
          <mesh position={b.head.pos} castShadow>
            <sphereGeometry args={[b.head.radius, 14, 14]} />
            <meshStandardMaterial color={S.skin} roughness={0.5} />
          </mesh>

          {/* Hair */}
          <mesh position={b.hair.pos} scale={b.hair.scale}>
            <sphereGeometry args={[b.hair.radius, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color={S.hair} roughness={0.9} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.045, 1.375, -0.1]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#fff" roughness={0.1} />
          </mesh>
          <mesh position={[0.045, 1.375, -0.1]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#fff" roughness={0.1} />
          </mesh>
          <mesh position={[-0.045, 1.375, -0.095]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color="#2b1a0e" roughness={0.3} />
          </mesh>
          <mesh position={[0.045, 1.375, -0.095]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color="#2b1a0e" roughness={0.3} />
          </mesh>

          {/* Left arm */}
          <group ref={leftArmRef} position={a.left.shoulder}>
            <mesh position={[0, -a.left.upper.len / 2, 0]}>
              <cylinderGeometry args={[a.left.upper.radius, a.left.upper.radius, a.left.upper.len]} />
              <meshStandardMaterial color={S.shirt} roughness={0.7} />
            </mesh>
            <mesh position={[0, -a.left.upper.len - a.left.lower.len / 2, 0]}>
              <cylinderGeometry args={[a.left.lower.radius, a.left.lower.radius, a.left.lower.len]} />
              <meshStandardMaterial color={S.skin} roughness={0.6} />
            </mesh>
            <mesh position={[0, -a.left.upper.len - a.left.lower.len, 0]}>
              <sphereGeometry args={[0.017, 6, 6]} />
              <meshStandardMaterial color={S.skin} roughness={0.5} />
            </mesh>
          </group>

          {/* Right arm */}
          <group ref={rightArmRef} position={a.right.shoulder}>
            <mesh position={[0, -a.right.upper.len / 2, 0]}>
              <cylinderGeometry args={[a.right.upper.radius, a.right.upper.radius, a.right.upper.len]} />
              <meshStandardMaterial color={S.shirt} roughness={0.7} />
            </mesh>
            <mesh position={[0, -a.right.upper.len - a.right.lower.len / 2, 0]}>
              <cylinderGeometry args={[a.right.lower.radius, a.right.lower.radius, a.right.lower.len]} />
              <meshStandardMaterial color={S.skin} roughness={0.6} />
            </mesh>
            <mesh position={[0, -a.right.upper.len - a.right.lower.len, 0]}>
              <sphereGeometry args={[0.017, 6, 6]} />
              <meshStandardMaterial color={S.skin} roughness={0.5} />
            </mesh>
          </group>

          {/* Left leg */}
          <group ref={leftLegRef} position={l.left.hip}>
            <mesh position={[0, -l.left.upper.len / 2, 0]}>
              <cylinderGeometry args={[l.left.upper.radius, l.left.upper.radius, l.left.upper.len]} />
              <meshStandardMaterial color={S.pants} roughness={0.8} />
            </mesh>
            <mesh position={[0, -l.left.upper.len - l.left.lower.len / 2, 0]}>
              <cylinderGeometry args={[l.left.lower.radius, l.left.lower.radius, l.left.lower.len]} />
              <meshStandardMaterial color={S.pants} roughness={0.8} />
            </mesh>
          </group>

          {/* Right leg */}
          <group ref={rightLegRef} position={l.right.hip}>
            <mesh position={[0, -l.right.upper.len / 2, 0]}>
              <cylinderGeometry args={[l.right.upper.radius, l.right.upper.radius, l.right.upper.len]} />
              <meshStandardMaterial color={S.pants} roughness={0.8} />
            </mesh>
            <mesh position={[0, -l.right.upper.len - l.right.lower.len / 2, 0]}>
              <cylinderGeometry args={[l.right.lower.radius, l.right.lower.radius, l.right.lower.len]} />
              <meshStandardMaterial color={S.pants} roughness={0.8} />
            </mesh>
          </group>

          {/* Feet */}
          <mesh position={f.left.pos}>
            <boxGeometry args={f.left.size} />
            <meshStandardMaterial color={S.shoes} roughness={0.8} />
          </mesh>
          <mesh position={f.right.pos}>
            <boxGeometry args={f.right.size} />
            <meshStandardMaterial color={S.shoes} roughness={0.8} />
          </mesh>
        </group>

        {/* Glow VFX */}
        <mesh ref={glowRef} position={[0, 0.9, 0]} scale={GLOW.scale}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={GLOW.color} transparent opacity={GLOW.opacity} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
