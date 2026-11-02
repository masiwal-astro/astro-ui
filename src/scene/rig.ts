import * as THREE from 'three';
/** Per-frame computed composition shared by scene objects (written by Director, read by children). */
export const rig = {
  sun: new THREE.Vector3(),
  sunScale: 1,
  sunVelocity: 0, // smoothed world-units/sec, negative = descending
  spread: 1,
  planetOpacity: 1,
  orbitTilt: 1.18,
  orbitOpacity: 1,
  systemScale: 1,
  horizonY: -20,
  horizon: 0,
  timeScale: 1,
};
