import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { motion, smooth } from '../lib/store';
import { rig } from './rig';

const DIR = new THREE.Vector3();
const HERO_NDC_Y = 0.02;
const REST_NDC_Y = -0.5;

/** Converts a viewport NDC point to world space on the plane z = planeZ. */
function ndcToWorld(cam: THREE.Camera, x: number, y: number, planeZ: number, out: THREE.Vector3) {
  const dir = DIR.set(x, y, 0.5).unproject(cam).sub(cam.position).normalize();
  const t = (planeZ - cam.position.z) / dir.z;
  return out.copy(cam.position).addScaledVector(dir, t);
}

/** Owns the camera and computes the scroll-driven composition each frame. */
export function Director() {
  const { camera, size } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ptr = useRef({ x: 0, y: 0 });
  const lastY = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const d = motion.descent;
    const aspect = size.width / size.height;
    rig.systemScale = aspect < 1 ? Math.max(0.5, aspect * 0.95) : Math.min(1.1, 0.8 + aspect * 0.15);
    rig.timeScale = motion.reduced ? 0.15 : 1;

    // Camera: gentle pointer parallax + scroll push.
    const k = motion.reduced ? 0 : 1;
    ptr.current.x += (motion.pointer.x * k - ptr.current.x) * Math.min(1, dt * 2.2);
    ptr.current.y += (motion.pointer.y * k - ptr.current.y) * Math.min(1, dt * 2.2);
    const push = smooth(0, 0.7, d);
    camera.position.set(ptr.current.x * 0.9, 0.6 + ptr.current.y * 0.5, 15 - push * 3.2);
    camera.lookAt(ptr.current.x * 0.25, 0, 0);
    camera.updateMatrixWorld();

    // Sun screen position: descend during pin, then latch onto the Dasha section anchor.
    let ndcY = HERO_NDC_Y + (REST_NDC_Y - HERO_NDC_Y) * smooth(0.12, 1, d);
    if (motion.anchor && d >= 0.999) {
      const r = motion.anchor.getBoundingClientRect();
      const ay = 1 - (2 * (r.top + r.height / 2)) / window.innerHeight;
      ndcY = Math.max(ay, REST_NDC_Y);
    }
    ndcToWorld(camera, 0, ndcY, 0, tmp);
    rig.sun.copy(tmp);
    const vy = (tmp.y - lastY.current) / Math.max(dt, 1e-3);
    lastY.current = tmp.y;
    rig.sunVelocity += (vy - rig.sunVelocity) * Math.min(1, dt * 6);

    rig.sunScale = (1 - 0.38 * smooth(0.1, 1, d)) * Math.min(1, 0.75 + rig.systemScale * 0.25);
    rig.spread = 1 + 1.3 * smooth(0, 0.85, d);
    rig.planetOpacity = 1 - 0.75 * smooth(0.2, 0.9, d);
    rig.orbitTilt = 0.34 - 0.2 * smooth(0.2, 1, d);
    rig.orbitOpacity = 1 - 0.45 * smooth(0.3, 1, d);

    // Horizon rises from below as the final section enters.
    rig.horizon = motion.horizon;
    ndcToWorld(camera, 0, -1.25 + 0.9 * motion.horizon, -10, tmp);
    rig.horizonY = tmp.y;
  });
  return null;
}
