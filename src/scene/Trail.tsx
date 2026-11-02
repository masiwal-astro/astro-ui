import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { makeGlowMaterial, makeStippleMaterial } from './shaders';
import { rig } from './rig';
import { SUN_RADIUS } from './Sun';

const STREAKS = 7;

/** Golden particle wake + vertical light streaks that follow the descending Sun. */
export function Trail({ quality }: { quality: number }) {
  const n = Math.round(900 * quality);
  const state = useMemo(() => ({ life: new Float32Array(n), vel: new Float32Array(n * 3), cursor: 0 }), [n]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3).fill(9999);
    const col = new Float32Array(n * 3), size = new Float32Array(n), ph = new Float32Array(n);
    for (let i = 0; i < n; i++) { const w = Math.random() < 0.7; col[i * 3] = w ? 0.95 : 1; col[i * 3 + 1] = w ? 0.8 : 0.95; col[i * 3 + 2] = w ? 0.55 : 0.88; size[i] = 0.6 + Math.random() * 1.2; ph[i] = Math.random(); }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1));
    g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
    return g;
  }, [n]);
  const mat = useMemo(() => { const m = makeStippleMaterial(1, true); m.uniforms.uTwinkle.value = 0.6; return m; }, []);
  const streakGeom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const streakMat = useMemo(() => {
    const m = makeGlowMaterial('#f1d9a6', 1);
    m.fragmentShader = /* glsl */ `varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity;
      void main(){ float x = 1.0 - abs(vUv.x - 0.5) * 2.0; float y = smoothstep(0.0, 0.15, vUv.y) * pow(1.0 - vUv.y, 1.6);
      gl_FragColor = vec4(uColor, pow(x, 3.0) * y * uOpacity); }`;
    return m;
  }, []);
  const streaks = useRef<THREE.Group>(null!);
  const offsets = useMemo(() => Array.from({ length: STREAKS }, (_, i) => ({ x: (i / (STREAKS - 1) - 0.5) * SUN_RADIUS * 1.5, h: 3 + Math.random() * 5, w: 0.015 + Math.random() * 0.05 })), []);
  useEffect(() => () => { geom.dispose(); mat.dispose(); streakGeom.dispose(); streakMat.dispose(); }, [geom, mat, streakGeom, streakMat]);
  const speedS = useRef(0);

  useFrame(({ clock, gl }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const pos = geom.attributes.position.array as Float32Array;
    const descending = Math.max(0, -rig.sunVelocity);
    speedS.current += (descending - speedS.current) * Math.min(1, dt * 4);
    const spawn = Math.min(40, Math.floor(descending * 6 * quality + (Math.random() < 0.15 ? 1 : 0)));
    const R = SUN_RADIUS * rig.sunScale;
    for (let s = 0; s < spawn; s++) {
      const i = state.cursor; state.cursor = (state.cursor + 1) % n;
      const a = Math.random() * Math.PI * 2, rr = R * (0.6 + Math.random() * 0.45);
      pos[i * 3] = rig.sun.x + Math.cos(a) * rr; pos[i * 3 + 1] = rig.sun.y + Math.abs(Math.sin(a)) * rr * 0.6; pos[i * 3 + 2] = rig.sun.z + (Math.random() - 0.5) * R;
      state.vel[i * 3] = (Math.random() - 0.5) * 0.15; state.vel[i * 3 + 1] = 0.1 + Math.random() * 0.35; state.vel[i * 3 + 2] = 0;
      state.life[i] = 1;
    }
    for (let i = 0; i < n; i++) {
      if (state.life[i] <= 0) continue;
      state.life[i] -= dt * 0.45;
      if (state.life[i] <= 0) { pos[i * 3 + 1] = 9999; continue; }
      pos[i * 3] += state.vel[i * 3] * dt; pos[i * 3 + 1] += state.vel[i * 3 + 1] * dt;
    }
    geom.attributes.position.needsUpdate = true;
    mat.uniforms.uTime.value = clock.elapsedTime; mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    mat.uniforms.uOpacity.value = 0.85;

    const k = Math.min(1, speedS.current * 0.35);
    streakMat.uniforms.uOpacity.value = k * 0.5;
    streaks.current.position.copy(rig.sun);
    streaks.current.visible = k > 0.01;
    streaks.current.children.forEach((c, i) => {
      const o = offsets[i];
      c.scale.set(o.w, o.h * (0.4 + k), 1);
      c.position.set(o.x * rig.sunScale, (o.h * (0.4 + k)) / 2 + R * 0.2, -0.1);
    });
  });

  return (
    <>
      <points geometry={geom} material={mat} frustumCulled={false} />
      <group ref={streaks}>
        {offsets.map((_, i) => <mesh key={i} geometry={streakGeom} material={streakMat} />)}
      </group>
    </>
  );
}
