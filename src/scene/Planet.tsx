import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { planetGeometry } from './geometry';
import { makeStippleMaterial } from './shaders';
import type { PlanetSpec } from './planets';
import { rig } from './rig';

/** One Navagraha: a stippled point-cloud sphere with a dark occluding core, spinning and revolving. */
export function Planet({ spec, quality, index }: { spec: PlanetSpec; quality: number; index: number }) {
  const holder = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const count = Math.max(500, Math.round(spec.radius * 9000 * quality));
  const geom = useMemo(() => planetGeometry(count, spec.radius, new THREE.Color(spec.tint), spec.style, 11 + index * 13), [count, spec, index]);
  const mat = useMemo(() => makeStippleMaterial(0.55), []);
  const core = useMemo(() => new THREE.SphereGeometry(spec.radius * 0.97, 24, 16), [spec.radius]);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#050505', transparent: true }), []);
  const ring = useMemo(() => {
    if (!spec.ring) return null;
    const n = Math.round(2500 * quality); const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = Math.random() * Math.PI * 2, r = spec.radius * (1.5 + Math.random() * 0.7);
      pos[i * 3] = Math.cos(t) * r; pos[i * 3 + 2] = Math.sin(t) * r; pos[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      const v = 0.35 + Math.random() * 0.5; col[i * 3] = v; col[i * 3 + 1] = v * 0.95; col[i * 3 + 2] = v * 0.85; size[i] = 0.5; ph[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1)); g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
    return g;
  }, [spec, quality]);
  useEffect(() => () => { geom.dispose(); mat.dispose(); core.dispose(); coreMat.dispose(); ring?.dispose(); }, [geom, mat, core, coreMat, ring]);
  const angle = useRef(spec.start);

  useFrame(({ clock, gl }, dt) => {
    const ts = rig.timeScale;
    angle.current += Math.min(dt, 0.05) * spec.speed * ts;
    const s = rig.spread;
    holder.current.position.set(Math.cos(angle.current) * spec.a * s, 0, Math.sin(angle.current) * spec.a * spec.ecc * s);
    body.current.rotation.y += Math.min(dt, 0.05) * spec.spin * ts;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    mat.uniforms.uOpacity.value = rig.planetOpacity;
    coreMat.opacity = rig.planetOpacity;
  });

  return (
    <group ref={holder}>
      <group ref={body} rotation={[0.3, 0, 0.15]}>
        <mesh geometry={core} material={coreMat} />
        <points geometry={geom} material={mat} />
        {ring && <points geometry={ring} material={mat} rotation={[0.35, 0, 0]} />}
      </group>
    </group>
  );
}
