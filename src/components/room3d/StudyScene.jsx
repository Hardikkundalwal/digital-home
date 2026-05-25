import { Desk, Chair, WallClock, Radio, Bookshelf, PictureFrame } from './Furniture3D';
import Avatar from './AvatarSystem/Avatar';
import RemoteAvatar from './AvatarSystem/RemoteAvatar';
import AvatarLabel from './AvatarSystem/AvatarLabel';
import { Rug } from './RoomDetails';
import { getWallPlacement } from './roomLayout';
import useAvatarController from '../../hooks/useAvatarController';
import { usePresence } from '../../hooks/usePresence';
import { useProfile } from '../../hooks/useProfile';
import { useSound } from '../../hooks/useSound';
const AVATAR_START = [0, 0.11, 0.2];

const FURNITURE_POSITIONS = {
  desk: [0, 0.11, -0.2],
  clock: [1.2, 0.11, 1.5],
  radio: [-0.3, 0.11, 0.5],
  notes: [2.5, 0.11, 1.0],
  folders: [-2.0, 0.11, 1.0],
  pomodoro: [1.2, 0.11, 1.5],
  exams: [0.4, 0.11, -0.1],
};

export default function StudyScene({ onFurnitureClick, beatsActive, roomCode }) {
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

  const clockP = getWallPlacement({ wall: 'back', offsetAlong: 1.2, height: 2.2, itemDepth: 0.48, itemWidth: 0.5, itemHeight: 0.5 });
  const frameP = getWallPlacement({ wall: 'right', offsetAlong: 0.5, height: 1.8, itemDepth: 0.02, itemWidth: 0.35, itemHeight: 0.28 });
  const boardP = getWallPlacement({ wall: 'left', offsetAlong: 0, height: 1.4, itemDepth: 0.04, itemWidth: 0.5, itemHeight: 0.8 });
  const shelfP = getWallPlacement({ wall: 'left', offsetAlong: -0.5, height: 0.45, itemDepth: 0.28, itemWidth: 0.65, itemHeight: 0.9 });
  const corkboardP = getWallPlacement({ wall: 'right', offsetAlong: -1.5, height: 1.8, itemDepth: 0.04, itemWidth: 0.8, itemHeight: 0.6 });

  return (
    <>
      <group position={frameP.position} rotation={frameP.rotation}>
        <PictureFrame onFurnitureClick={handleClick} dims={frameP.dims} />
      </group>

      <Rug position={[0, 0.01, -0.5]} />
      <Desk position={[0, 0, -0.8]} onFurnitureClick={handleClick} tone="warm" />
      <Chair position={[0, 0, 0.2]} tone="warm" />
      <Avatar posRef={avatar.posRef} state={avatar.state} rotRef={avatar.rotRef} customization={profile?.avatar} />

      {roomCode && remoteUsers && remoteUsers.map((user) => (
        <group key={user.id}>
          <RemoteAvatar data={user} />
          <AvatarLabel position={user.position || [0, 0, 0]} name={user.name} color={user.color} />
        </group>
      ))}

      <group position={[0.38, 0.795, -0.58]}
        onClick={(e) => { e.stopPropagation(); handleClick('exams'); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.12, 0.08]} />
          <meshPhysicalMaterial color="#e8d4b0" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.062, 0]}>
          <boxGeometry args={[0.1, 0.004, 0.08]} />
          <meshStandardMaterial color="#c8b090" roughness={0.5} />
        </mesh>
      </group>

      <group position={boardP.position} rotation={boardP.rotation}>
        <mesh>
          <boxGeometry args={[boardP.dims.w, boardP.dims.h, boardP.dims.d]} />
          <meshPhysicalMaterial color="#1a2a1a" roughness={0.8} />
        </mesh>
      </group>

      <group position={shelfP.position} rotation={shelfP.rotation}>
        <Bookshelf onFurnitureClick={handleClick} tone="warm" dims={shelfP.dims} />
      </group>

      <group position={corkboardP.position} rotation={corkboardP.rotation} onClick={(e) => { e.stopPropagation(); handleClick('notes'); }}>
        <mesh>
          <boxGeometry args={[corkboardP.dims.w, corkboardP.dims.h, corkboardP.dims.d]} />
          <meshStandardMaterial color="#b8956a" roughness={0.9} />
        </mesh>
      </group>

      <WallClock position={clockP.position} onFurnitureClick={handleClick} />
      <Radio position={[-0.3, 0.78, -0.6]} onFurnitureClick={handleClick} beatsActive={beatsActive} />
    </>
  );
}
