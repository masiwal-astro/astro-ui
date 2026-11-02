import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { rng } from './geometry';
import { makeStippleMaterial } from './shaders';
import { motion } from '../lib/store';

interface Props { count: number; depth: [number, number]; spread: number; sizeRange: [number, number]; goldRatio?: number; seed: number }

/** Layered twinkling star / dust field as a single point cloud (one draw call per layer). */
export function StarField({ count, depth, spread, sizeRange, goldRatio = 0.12, seed }: Props) {
  const geom = useMemo(() => {
    const r = rng(seed);
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count), phase = new Float32Array(count);
    const white = new THREE.Color('#e9e7e2'), gold = new THREE.Color('#e3c48f'), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * spread * 1.8; pos[i * 3 + 1] = (r() - 0.5) * spread; pos[i * 3 + 2] = -(depth[0] + r() * (depth[1] - depth[0]));
      c.copy(r() < goldRatio ? gold : white).multiplyScalar(0.45 + r() * 0.55);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      const s = r(); size[i] = sizeRange[0] + Math.pow(s, 4) * (sizeRange[1] - sizeRange[0]); phase[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1));
    g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
    return g;
  }, [count, depth, spread, sizeRange, goldRatio, seed]);
  const mat = useMemo(() => makeStippleMaterial(1, true), []);
  useEffect(() => () => { geom.dispose(); mat.dispose(); }, [geom, mat]);
  useFrame(({ clock, gl }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    mat.uniforms.uTwinkle.value = motion.reduced ? 0 : 1;
  });
  return <points geometry={geom} material={mat} frustumCulled={false} />;
}
