import * as THREE from 'three';

/** Deterministic PRNG so geometry is stable between renders/sessions. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Cheap 3D value-noise built from sines (CPU, generation-time only). */
export function noise3(x: number, y: number, z: number, f: number, seed: number) {
  return (Math.sin(x * f + seed) * Math.cos(y * f * 1.3 - seed) + Math.sin(z * f * 0.9 + seed * 2) * Math.cos(x * f * 0.7)) * 0.5;
}

/** Fibonacci sphere points. */
export function fibSphere(n: number, r = 1) {
  const pos = new Float32Array(n * 3); const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; const rad = Math.sqrt(1 - y * y); const th = ga * i;
    pos[i * 3] = Math.cos(th) * rad * r; pos[i * 3 + 1] = y * r; pos[i * 3 + 2] = Math.sin(th) * rad * r;
  }
  return pos;
}

export type SurfaceStyle = 'rock' | 'banded' | 'pale' | 'shadow' | 'ember';

/** Procedural stippled planet surface as a point cloud. */
export function planetGeometry(count: number, radius: number, tint: THREE.Color, style: SurfaceStyle, seed: number) {
  const base = fibSphere(count, radius);
  const r = rng(seed);
  const col = new Float32Array(count * 3), size = new Float32Array(count), phase = new Float32Array(count);
  const dark = new THREE.Color('#1a1916'); const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const x = base[i * 3] / radius, y = base[i * 3 + 1] / radius, z = base[i * 3 + 2] / radius;
    // jitter for stipple
    base[i * 3] += (r() - 0.5) * radius * 0.04; base[i * 3 + 1] += (r() - 0.5) * radius * 0.04; base[i * 3 + 2] += (r() - 0.5) * radius * 0.04;
    let v: number;
    switch (style) {
      case 'banded': v = 0.5 + 0.5 * Math.sin(y * 14 + noise3(x, y, z, 3, seed) * 2.2); break;
      case 'pale': v = 0.65 + 0.35 * noise3(x, y, z, 4.5, seed) - (noise3(x, y, z, 9, seed + 3) > 0.35 ? 0.5 : 0); break;
      case 'shadow': v = 0.12 + 0.25 * Math.abs(noise3(x, y, z, 6, seed)); break;
      case 'ember': v = 0.45 + 0.55 * Math.max(0, noise3(x, y, z, 5, seed)); break;
      default: v = 0.35 + 0.65 * Math.abs(noise3(x, y, z, 4, seed) + 0.5 * noise3(x, y, z, 11, seed + 7));
    }
    v = Math.min(1, Math.max(0, v));
    const spark = r() > 0.985 ? 1 : 0; // tiny luminous points
    c.copy(dark).lerp(tint, v); if (spark) c.set('#fff6e0');
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    size[i] = (0.55 + v * 0.7) * (spark ? 1.8 : 1); phase[i] = r();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(base, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('size', new THREE.BufferAttribute(size, 1));
  g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
  return g;
}
