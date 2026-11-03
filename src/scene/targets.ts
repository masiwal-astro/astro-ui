import { rng } from './geometry';

export const SHAPE_COUNT = 7;

function inEllipse(x: number, y: number, cx: number, cy: number, rx: number, ry: number) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function inCapsule(x: number, y: number, x1: number, y1: number, x2: number, y2: number, r: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2));
  const px = x1 + t * dx;
  const py = y1 + t * dy;
  const ex = x - px;
  const ey = y - py;
  return ex * ex + ey * ey <= r * r;
}

/** Open palm facing the camera. Procedural silhouette, not a photograph or a deity. */
export function inPalm(x: number, y: number) {
  if (inEllipse(x, y, 0, -0.28, 0.62, 0.78)) return true;
  if (inCapsule(x, y, -0.48, -0.05, -1.2, 0.62, 0.16)) return true;
  const fingers: [number, number, number, number, number][] = [
    [-0.42, 0.2, -0.46, 1.55, 0.12],
    [-0.14, 0.32, -0.1, 1.9, 0.115],
    [0.14, 0.32, 0.18, 1.82, 0.115],
    [0.4, 0.22, 0.46, 1.42, 0.105],
  ];
  return fingers.some(([x1, y1, x2, y2, r]) => inCapsule(x, y, x1, y1, x2, y2, r));
}

function setAt(buf: Float32Array, i: number, x: number, y: number, z: number) {
  buf[i * 3] = x;
  buf[i * 3 + 1] = y;
  buf[i * 3 + 2] = z;
}

function sunAt(i: number, n: number, rand: () => number): { x: number; y: number; z: number; band: number } {
  const yN = 1 - (i / Math.max(1, n - 1)) * 2;
  const ring = Math.sqrt(Math.max(0, 1 - yN * yN));
  const theta = Math.PI * (3 - Math.sqrt(5)) * i;
  const roll = rand();
  let band = 1;
  let radius = 2.55;
  if (roll < 0.24) {
    band = 0;
    radius = 2.55 * Math.pow(rand(), 0.4) * 0.62;
  } else if (roll > 0.78) {
    band = 2;
    radius = 2.55 * (1.2 + rand() * 0.95);
  } else {
    radius = 2.55 * (0.94 + rand() * 0.08);
  }
  return {
    x: Math.cos(theta) * ring * radius,
    y: yN * radius - 0.65,
    z: Math.sin(theta) * ring * radius,
    band,
  };
}

function orbitAt(i: number, count: number, rand: () => number) {
  const shaniCut = Math.floor(count * 0.07);
  if (i < shaniCut) {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    const rad = 0.55 * Math.cbrt(rand());
    return { x: Math.cos(th) * s * rad, y: u * rad * 0.72, z: Math.sin(th) * s * rad, band: 0 };
  }
  const rest = count - shaniCut;
  const which = Math.min(7, Math.floor(((i - shaniCut) / rest) * 8));
  const radii = [2.35, 3.15, 3.95, 4.85, 5.85, 6.9, 8.05, 8.05];
  const phase0 = [0.2, 1.1, 2.4, 3.5, 4.6, 5.4, 0.4, Math.PI + 0.4][which];
  const local = (i - shaniCut) % Math.max(1, Math.floor(rest / 8));
  const along = local / Math.max(1, Math.floor(rest / 8));
  const onBody = rand() < 0.28;
  const ang = phase0 + (onBody ? (rand() - 0.5) * 0.22 : along * Math.PI * 2);
  const a = radii[which];
  const jitter = onBody ? 0.28 : 0.05;
  return {
    x: Math.cos(ang) * a + (rand() - 0.5) * jitter,
    y: Math.sin(ang) * a * 0.42 + (rand() - 0.5) * jitter * 0.6,
    z: (rand() - 0.5) * 0.2,
    band: 1,
  };
}

function palmAt(rand: () => number) {
  for (let n = 0; n < 48; n += 1) {
    const x = -1.55 + rand() * 2.35;
    const y = -1.4 + rand() * 3.45;
    if (inPalm(x, y)) return [x * 2.45, (y - 0.15) * 2.2, (rand() - 0.5) * 0.08] as const;
  }
  return [0, 0, 0] as const;
}

function kundaliPoints(rand: () => number) {
  const s = 3.35;
  const lines: [number, number, number, number][] = [
    [-s, -s, s, -s], [s, -s, s, s], [s, s, -s, s], [-s, s, -s, -s],
    [-s, -s, s, s], [-s, s, s, -s],
    [0, s, s, 0], [s, 0, 0, -s], [0, -s, -s, 0], [-s, 0, 0, s],
  ];
  let total = 0;
  const lengths = lines.map(([x1, y1, x2, y2]) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    total += len;
    return len;
  });
  let pick = rand() * total;
  let index = 0;
  for (let i = 0; i < lines.length; i += 1) {
    pick -= lengths[i];
    if (pick <= 0) { index = i; break; }
  }
  const [x1, y1, x2, y2] = lines[index];
  const t = rand();
  const j = (rand() - 0.5) * 0.045;
  return [x1 + (x2 - x1) * t + j, y1 + (y2 - y1) * t + (rand() - 0.5) * 0.045, 0] as const;
}

function starAt(rand: () => number) {
  const spread = rand() < 0.94 ? 0 : 1;
  return [
    (rand() - 0.5) * 22,
    (rand() - 0.5) * 13,
    (rand() - 0.5) * 4,
    spread,
  ] as const;
}

function mandalaAt(i: number, count: number) {
  const rings = 6;
  const ring = i % rings;
  const radius = 1.6 + ring * 0.95;
  const ang = (i / count) * Math.PI * 2 * (18 + ring * 3);
  return [Math.cos(ang) * radius, Math.sin(ang) * radius, Math.sin(ang * 2) * 0.08] as const;
}

/** Abstract sun-wheel: hub, ring, and spokes. Not a figure. */
function wheelAt(i: number, count: number, rand: () => number) {
  const slot = i % 14;
  if (slot < 2) {
    const th = rand() * Math.PI * 2;
    const rad = Math.sqrt(rand()) * 0.55;
    return [Math.cos(th) * rad, Math.sin(th) * rad, 0] as const;
  }
  if (slot < 8) {
    const ang = ((i % 12) / 12) * Math.PI * 2;
    const rad = 2.15 + rand() * 0.08;
    return [Math.cos(ang) * rad, Math.sin(ang) * rad, 0] as const;
  }
  const spoke = (i % 12) / 12 * Math.PI * 2;
  const rad = 0.55 + rand() * 1.85;
  return [Math.cos(spoke) * rad, Math.sin(spoke) * rad, 0] as const;
}

export interface ParticleTargets {
  count: number;
  positions: Float32Array[];
  seed: Float32Array;
  band: Float32Array;
}

export function buildTargets(count: number): ParticleTargets {
  const rand = rng(11);
  const positions = Array.from({ length: SHAPE_COUNT }, () => new Float32Array(count * 3));
  const seed = new Float32Array(count);
  const band = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const sun = sunAt(i, count, rand);
    setAt(positions[0], i, sun.x, sun.y, sun.z);
    const orbit = orbitAt(i, count, rand);
    setAt(positions[1], i, orbit.x, orbit.y, orbit.z);
    const palm = palmAt(rand);
    setAt(positions[2], i, palm[0], palm[1], palm[2]);
    const chart = kundaliPoints(rand);
    setAt(positions[3], i, chart[0], chart[1], chart[2]);
    const star = starAt(rand);
    setAt(positions[4], i, star[0], star[1], star[2]);
    const ring = mandalaAt(i, count);
    setAt(positions[5], i, ring[0], ring[1], ring[2]);
    const wheel = wheelAt(i, count, rand);
    setAt(positions[6], i, wheel[0], wheel[1], wheel[2]);
    seed[i] = rand();
    band[i] = i < count * 0.07 ? 0 : sun.band;
  }
  return { count, positions, seed, band };
}

export function particleCount() {
  return window.innerWidth < 760 ? 15000 : 30000;
}
