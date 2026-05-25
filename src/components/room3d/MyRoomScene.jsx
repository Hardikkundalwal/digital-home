import { SmallDesk, Chair, WallClock, PictureFrame } from './Furniture3D';
import Bed from './Bed';
import Plant from './Plant';
import Avatar from './AvatarSystem/Avatar';
import RemoteAvatar from './AvatarSystem/RemoteAvatar';
import AvatarLabel from './AvatarSystem/AvatarLabel';
import TrendingMovie from './TrendingMovie';
import { Rug } from './RoomDetails';
import { getWallPlacement } from './roomLayout';
import useAvatarController from '../../hooks/useAvatarController';
import { usePresence } from '../../hooks/usePresence';
import { useProfile } from '../../hooks/useProfile';
import { useSound } from '../../hooks/useSound';

const AVATAR_START = [0.5, 0.11, 0.7];

const FURNITURE_POSITIONS = {
  bed: [-2.0, 0.11, 0.3],
  tasks: [1.5, 0.11, 0.8],
  pomodoro: [1.0, 0.11, 1.5],
  trivia: [1.5, 0.11, 0.5],
  settings: [0.5, 0.11, 1.0],
};

export default function MyRoomScene({ onFurnitureClick, roomCode }) {
  const { profile } = useProfile();
  const avatar = useAvatarController(AVATAR_START);
  const { others: remoteUsers } = usePresence(roomCode, avatar.posRef, profile?.avatar);
  const { playClick, playFootstep } = useSound();

  const handleClick = (key, pos) => {
    playClick();
    if (onFurnitureClick) onFurnitureClick(key);
    const target = FURNITURE_POSITIONS[key];
    if (target) {
      playFootstep();
      avatar.moveTo(target);
    }
  };

  const clockP = getWallPlacement({ wall: 'back', offsetAlong: 1.0, height: 2.2, itemDepth: 0.48, itemWidth: 0.5, itemHeight: 0.5 });
  const frameP = getWallPlacement({ wall: 'back', offsetAlong: -1.5, height: 2.1, itemDepth: 0.02, itemWidth: 0.35, itemHeight: 0.28 });
  const tvStandP = getWallPlacement({ wall: 'back', offsetAlong: 0.8, height: 0.2, itemDepth: 0.3, itemWidth: 0.65, itemHeight: 0.35 });

  return (
    <>
      <group position={frameP.position} rotation={frameP.rotation}>
        <PictureFrame onFurnitureClick={handleClick} dims={frameP.dims} />
      </group>

      <Rug position={[0.5, 0.01, 0.3]} />
      <Bed position={[-2.5, 0, -0.1]} onFurnitureClick={handleClick} />
      <Plant position={[-1.5, 0, 1.2]} />
      <SmallDesk position={[1.5, 0, 0.3]} onFurnitureClick={handleClick} tone="soft" />
      <Chair position={[1.5, 0, 1.0]} tone="soft" />
      <Avatar posRef={avatar.posRef} state={avatar.state} rotRef={avatar.rotRef} customization={profile?.avatar} />

      {/* Render remote avatars and labels */}
      {roomCode && remoteUsers && remoteUsers.map((user) => (
        <group key={user.id}>
          <RemoteAvatar data={user} />
          <AvatarLabel position={user.position || [0, 0, 0]} name={user.name} color={user.color} />
        </group>
      ))}

      <WallClock position={clockP.position} onFurnitureClick={handleClick} />

      <TrendingMovie position={tvStandP.position} onFurnitureClick={handleClick} />

      <group position={tvStandP.position} rotation={tvStandP.rotation}
        onClick={(e) => { e.stopPropagation(); handleClick('trivia'); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[tvStandP.dims.w, tvStandP.dims.h, tvStandP.dims.d]} />
          <meshPhysicalMaterial color="#2a2a2a" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.32, 0.02]}>
          <boxGeometry args={[0.55, 0.34, 0.015]} />
          <meshStandardMaterial color="#111" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.32, 0.03]}>
          <planeGeometry args={[0.48, 0.28]} />
          <meshStandardMaterial color="#6699ff" emissive="#6699ff" emissiveIntensity={0.2} roughness={0.1} />
        </mesh>
      </group>
    </>
  );
}
