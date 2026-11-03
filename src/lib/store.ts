/** Mutable, non-reactive state shared between DOM (GSAP/ScrollTrigger) and the R3F render loop. */
export const motion = {
  /** 0→1 while the hero is pinned: camera push, planets spread, sun begins descent. */
  descent: 0,
  /** 0–6 scrubbed particle shape. 0 sun, 1 navagraha, 2 palm, 3 kundali, 4 stars, 5 mandala, 6 sun-wheel. */
  morph: 0,
  /** 0→1 as the final horizon section enters. */
  horizon: 0,
  pointer: { x: 0, y: 0 },
  /** element in the Dasha section the Sun settles into */
  anchor: null as HTMLElement | null,
  reduced: false,
  quality: 1,
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

/** Adaptive particle multiplier from device hints. */
export function detectQuality(): number {
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  let q = 1;
  if (w < 768) q *= 0.55;
  if (cores <= 4) q *= 0.75;
  if (mem <= 4) q *= 0.75;
  return Math.max(0.3, Math.min(1, q));
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
