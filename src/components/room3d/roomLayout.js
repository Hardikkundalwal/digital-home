// Room wall surface positions (wall center ± half thickness)
// Wall centers: left=-3.5, right=3.5, back=-3, thickness=0.15
const S = 0.075;
const GAP = 0.01;

const SURFACE = {
  LEFT:  -3.5 + S,   // -3.425
  RIGHT:  3.5 - S,   //  3.425
  BACK:  -3   + S,   // -2.925
};

// getWallPlacement({ wall, offsetAlong, height, itemDepth, itemWidth, itemHeight })
//
// Returns { position, rotation, dims } for any wall-mounted item.
// - position: [x, y, z] where the item's center should be
// - rotation: [0, ry, 0] Euler rotation so the item faces into the room
// - dims: { w, h, d } — NOT swapped. The rotation handles axis mapping automatically.
//
// For back wall:  ry=0 → item faces +Z into room
// For left wall:  ry=+PI/2 → item faces +X into room (local Z→world +X)
// For right wall: ry=-PI/2 → item faces -X into room (local Z→world -X)
//
// Local X always points along the wall, local Z always points into the room.
// This means args=[width, height, depth] are ALWAYS [along-wall, up, into-room].
// The rotation handles the axis remapping. ✓
//
// Every item's BACK FACE is exactly GAP from the wall surface, regardless of thickness.

export function getWallPlacement({ wall, offsetAlong = 0, height = 0, itemDepth = 0, itemWidth = 0, itemHeight = 0 }) {
  const half = itemDepth / 2;

  let x, z, ry;

  if (wall === 'back') {
    x = offsetAlong;
    z = SURFACE.BACK + GAP + half;
    ry = 0;
  } else if (wall === 'left') {
    x = SURFACE.LEFT + GAP + half;
    z = offsetAlong;
    ry = Math.PI / 2;
  } else { // right
    x = SURFACE.RIGHT - GAP - half;
    z = offsetAlong;
    ry = -Math.PI / 2;
  }

  return {
    position: [x, height, z],
    rotation: [0, ry, 0],
    // dims are ALWAYS [width, height, depth] = [along-wall, up, into-room]
    // The wall rotation handles axis remapping, so no swap needed.
    dims: { w: itemWidth, h: itemHeight, d: itemDepth },
  };
}
