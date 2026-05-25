import { useState } from 'react';
import { Text } from '@react-three/drei';

function clickHandler(key, fn) { if (fn) fn(key); }

const COLORS = ['#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828'];

export default function Whiteboard({ position, onFurnitureClick, tasks }) {
  const [hovered, setHovered] = useState(false);
  const displayTasks = (tasks || []).filter((t) => !t.done).slice(0, 5);

  return (
    <group position={position}>
      <mesh castShadow
        onClick={(e) => { e.stopPropagation(); clickHandler('tasks', onFurnitureClick); }}
        onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.6, 0.03]} />
        <meshStandardMaterial color={hovered ? '#f0f0f0' : '#e8e8e8'} roughness={0.4} metalness={0.05} />
      </mesh>
      {displayTasks.map((task, i) => (
        <Text key={task.id || i}
          position={[-0.3, 0.2 - i * 0.1, 0.02]}
          fontSize={0.04}
          color={COLORS[i % COLORS.length]}
          maxWidth={0.7}
          anchorX="left"
          anchorY="top"
        >
          • {task.text}
        </Text>
      ))}
      {displayTasks.length === 0 && (
        <Text position={[0, 0.05, 0.02]} fontSize={0.035} color="#999" maxWidth={0.7} anchorX="center">No tasks yet</Text>
      )}
    </group>
  );
}
