import { Desk, Chair, WallClock, PictureFrame } from './Furniture3D';
import { RoundedBox } from '@react-three/drei';
import Monitor from './Monitor';

import Whiteboard from './Whiteboard';
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
  tasks: [0, 0.11, 0.6],
  notes: [0, 0.11, 1.0],
  pomodoro: [-1.2, 0.11, 1.5],
  settings: [2.0, 0.11, 1.0],
};

export default function WorkScene({ onFurnitureClick, tasks, roomCode }) {
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

  const clockP = getWallPlacement({ wall: 'back', offsetAlong: -1.2, height: 2.2, itemDepth: 0.48, itemWidth: 0.5, itemHeight: 0.5 });
  const boardP = getWallPlacement({ wall: 'back', offsetAlong: 0, height: 1.8, itemDepth: 0.03, itemWidth: 0.8, itemHeight: 0.6 });
  const frameP = getWallPlacement({ wall: 'left', offsetAlong: 0.5, height: 1.8, itemDepth: 0.02, itemWidth: 0.35, itemHeight: 0.28 });

  return (
    <>
      <group position={frameP.position} rotation={frameP.rotation}>
        <PictureFrame onFurnitureClick={handleClick} dims={frameP.dims} />
      </group>

      <Rug position={[0, 0.01, -0.3]} />
      <Desk position={[0, 0, -0.8]} onFurnitureClick={handleClick} tone="cool" />
      <Monitor position={[0, 0.45, -0.6]} onFurnitureClick={handleClick} />

      <Chair position={[0, 0, 0.2]} tone="cool" />
      <Avatar posRef={avatar.posRef} state={avatar.state} rotRef={avatar.rotRef} customization={profile?.avatar} />

      {/* Render remote avatars and labels */}
      {roomCode && remoteUsers && remoteUsers.map((user) => (
        <group key={user.id}>
          <RemoteAvatar data={user} />
          <AvatarLabel position={user.position || [0, 0, 0]} name={user.name} color={user.color} />
        </group>
      ))}

      <Whiteboard position={boardP.position} onFurnitureClick={handleClick} tasks={tasks} />
      <WallClock position={clockP.position} onFurnitureClick={handleClick} />
    </>
  );
}
