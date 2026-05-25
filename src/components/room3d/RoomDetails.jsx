export function Rug({ position, color }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.8, 24]} />
      <meshStandardMaterial color={color || '#c49a6c'} roughness={0.9} />
    </mesh>
  );
}
