import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { noise3, rng } from './geometry';
import { makeGlowMaterial, makeStippleMaterial } from './shaders';
import { rig } from './rig';

const R = 34;

/** A dark planetary limb made of thousands of points, with a distant warm-white glow behind it. */
export function Horizon({ quality }: { quality: number }) {
  const group = useRef<THREE.Group>(null!);
  const geom = useMemo(() => {
    const n = Math.round(16000 * quality); const r = rng(99);
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // uniform points on the upper cap of a large sphere; reject those too close to the camera
      let x = 0, y = 0, z = 0, a = 0;
      for (let tries = 0; tries < 8; tries++) {
        a = Math.acos(1 - r() * (1 - Math.cos(0.75))); const b = r() * Math.PI * 2;
        x = Math.sin(a) * Math.cos(b) * R; z = Math.sin(a) * Math.sin(b) * R; y = Math.cos(a) * R - R;
        if (z < 9) break;
      }
      const ph2 = a * 0.55 / 0.75;
      const rim = 1 - Math.min(1, ph2 / 0.55);
      const v = (0.18 + 0.5 * Math.abs(noise3(x * 0.05, y * 0.05, z * 0.05, 6, 3))) * (0.35 + rim * 0.9);
      const warm = rim > 0.85 ? 1 : 0;
      col[i * 3] = v * (warm ? 1.25 : 1); col[i * 3 + 1] = v * (warm ? 1.1 : 0.98); col[i * 3 + 2] = v * (warm ? 0.85 : 0.92);
      size[i] = 0.7 + r() * 1.3 + (r() > 0.99 ? 2 : 0); ph[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1)); g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
    return g;
  }, [quality]);
  const mat = useMemo(() => { const m = makeStippleMaterial(1.2, true); m.uniforms.uTwinkle.value = 0.5; return m; }, []);
  const glowMat = useMemo(() => makeGlowMaterial('#fbe9c8', 1.8), []);
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  useEffect(() => () => { geom.dispose(); mat.dispose(); glowMat.dispose(); plane.dispose(); }, [geom, mat, glowMat, plane]);

  useFrame(({ clock, gl }) => {
    const h = rig.horizon;
    group.current.visible = h > 0.001;
    if (!group.current.visible) return;
    group.current.position.set(0, rig.horizonY, -10);
    mat.uniforms.uTime.value = clock.elapsedTime; mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    mat.uniforms.uOpacity.value = h;
    glowMat.uniforms.uOpacity.value = h * 0.55; glowMat.uniforms.uTime.value = clock.elapsedTime * 0.2;
  });

  return (
    <group ref={group}>
      <mesh geometry={plane} material={glowMat} position={[0, 0.5, -9]} scale={[60, 16, 1]} />
      <points geometry={geom} material={mat} frustumCulled={false} />
    </group>
  );
}
