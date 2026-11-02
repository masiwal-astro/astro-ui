import type { SurfaceStyle } from './geometry';

export interface PlanetSpec {
  name: string; // Navagraha
  a: number; // semi-major axis
  ecc: number; // b / a
  radius: number;
  speed: number; // rad/s orbital
  spin: number; // rad/s axial
  start: number;
  incline: number; // extra orbital incline (rad)
  tint: string;
  style: SurfaceStyle;
  ring?: boolean;
}

/** The eight Navagrahas orbiting SHANI (the ninth, at the centre). Radii follow a gentle geometric progression. */
export const PLANETS: PlanetSpec[] = [
  { name: 'Budha', a: 2.9, ecc: 0.92, radius: 0.16, speed: 0.34, spin: 0.6, start: 0.4, incline: 0.03, tint: '#c9c7c1', style: 'rock' },
  { name: 'Shukra', a: 3.7, ecc: 0.9, radius: 0.24, speed: 0.26, spin: 0.25, start: 2.1, incline: -0.04, tint: '#efe2c4', style: 'pale' },
  { name: 'Chandra', a: 4.6, ecc: 0.88, radius: 0.2, speed: 0.21, spin: 0.15, start: 4.0, incline: 0.06, tint: '#e6e6e3', style: 'pale' },
  { name: 'Surya', a: 5.6, ecc: 0.9, radius: 0.3, speed: 0.17, spin: 0.3, start: 5.3, incline: -0.02, tint: '#e9c98c', style: 'ember' },
  { name: 'Mangala', a: 6.7, ecc: 0.86, radius: 0.22, speed: 0.13, spin: 0.5, start: 1.2, incline: 0.05, tint: '#d8b998', style: 'rock' },
  { name: 'Guru', a: 8.0, ecc: 0.9, radius: 0.5, speed: 0.09, spin: 0.7, start: 3.1, incline: -0.03, tint: '#dcd3c0', style: 'banded', ring: true },
  { name: 'Rahu', a: 9.4, ecc: 0.84, radius: 0.26, speed: 0.065, spin: 0.2, start: 0.1, incline: 0.08, tint: '#8f8a80', style: 'shadow' },
  { name: 'Ketu', a: 9.4, ecc: 0.84, radius: 0.2, speed: 0.065, spin: -0.2, start: Math.PI + 0.1, incline: 0.08, tint: '#a59f93', style: 'shadow' },
];
