export const COLORS = {
  skin: '#f0c8a0',
  skinShadow: '#dbb090',
  hair: '#3d2b1f',
  shirt: '#8b6f47',
  pants: '#5a4a3a',
  shoes: '#2b2b2b',
  glow: '#ffffff',
};

export const BODY = {
  pelvis: { pos: [0, 0.78, 0], size: [0.16, 0.06, 0.12] },
  torso: { pos: [0, 0.95, 0], size: [0.2, 0.36, 0.14] },
  neck: { pos: [0, 1.2, 0], radius: 0.03, height: 0.04 },
  head: { pos: [0, 1.36, 0], radius: 0.11 },
  hair: { pos: [0, 1.425, 0.02], radius: 0.095, scale: [0.9, 0.65, 0.9] },
};

export const ARMS = {
  left: {
    shoulder: [-0.145, 1.14, 0],
    upper: { len: 0.18, radius: 0.025 },
    lower: { len: 0.16, radius: 0.022 },
  },
  right: {
    shoulder: [0.145, 1.14, 0],
    upper: { len: 0.18, radius: 0.025 },
    lower: { len: 0.16, radius: 0.022 },
  },
};

export const LEGS = {
  left: {
    hip: [0.05, 0.78, 0],
    upper: { len: 0.3, radius: 0.035 },
    lower: { len: 0.28, radius: 0.03 },
  },
  right: {
    hip: [-0.05, 0.78, 0],
    upper: { len: 0.3, radius: 0.035 },
    lower: { len: 0.28, radius: 0.03 },
  },
};

export const FEET = {
  left: { pos: [0.055, 0.02, 0.035], size: [0.06, 0.04, 0.09] },
  right: { pos: [-0.055, 0.02, 0.035], size: [0.06, 0.04, 0.09] },
};

export const ANIM = {
  idle: {
    breathSpeed: 1.2,
    breathAmount: 0.004,
    shiftSpeed: 0.3,
    shiftAmount: 0.003,
    headTiltSpeed: 0.15,
    headTiltAmount: 0.015,
  },
  walk: {
    stepFreq: 7,
    swingAmount: 0.35,
    bodyBob: 0.012,
    bodyTwist: 0.06,
    armRatio: 0.6,
    speed: 2.0,
    arriveDist: 0.05,
  },
};

export const GLOW = {
  color: '#ffffff',
  opacity: 0.07,
  scale: 1.6,
};
