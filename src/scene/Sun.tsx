import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fibSphere, rng } from './geometry';
import { makeGlowMaterial, makeSunMaterial } from './shaders';
import { rig } from './rig';

export const SUN_RADIUS = 1.55;

/** SHANI — the luminous particle Sun at the centre of the system. */
export function Sun({ quality }: { quality: number }) {
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Points>(null!);
  const corona = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);

  const geom = useMemo(() => {
    const surface = Math.round(6500 * quality), flares = Math.round(2200 * quality), inner = Math.round(500 * quality);
    const n = surface + flares + inner; const r = rng(7);
    const pos = new Float32Array(n * 3), phase = new Float32Array(n), shell = new Float32Array(n);
    pos.set(fibSphere(surface, SUN_RADIUS));
    for (let i = surface; i < n; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      const isFlare = i < surface + flares;
      const rad = isFlare ? SUN_RADIUS * (1.0 + r() * 0.04) : SUN_RADIUS * Math.cbrt(r()) * 0.97;
      pos[i * 3] = Math.cos(th) * s * rad; pos[i * 3 + 1] = u * rad; pos[i * 3 + 2] = Math.sin(th) * s * rad;
      shell[i] = isFlare ? 1 : 0;
    }
    for (let i = 0; i < n; i++) phase[i] = r();
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('shell', new THREE.BufferAttribute(shell, 1));
    return g;
  }, [quality]);
  const mat = useMemo(() => makeSunMaterial(), []);
  const coronaMat = useMemo(() => makeGlowMaterial('#e8c98f', 2.6), []);
  const haloMat = useMemo(() => makeGlowMaterial('#fff3dc', 5.0), []);
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  useEffect(() => () => { geom.dispose(); mat.dispose(); coronaMat.dispose(); haloMat.dispose(); plane.dispose(); }, [geom, mat, coronaMat, haloMat, plane]);

  useFrame(({ clock, gl, camera }, dt) => {
    const t = clock.elapsedTime * rig.timeScale;
    mat.uniforms.uTime.value = t; mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    coronaMat.uniforms.uTime.value = t;
    group.current.position.copy(rig.sun);
    group.current.scale.setScalar(rig.sunScale);
    body.current.rotation.y += dt * 0.05 * rig.timeScale;
    body.current.rotation.z = 0.2;
    const pulse = 1 + Math.sin(t * 1.3) * 0.03;
    corona.current.scale.setScalar(SUN_RADIUS * 5.2 * pulse);
    halo.current.scale.setScalar(SUN_RADIUS * 3.0);
    corona.current.quaternion.copy(camera.quaternion);
    halo.current.quaternion.copy(camera.quaternion);
    coronaMat.uniforms.uOpacity.value = 0.3 + Math.min(0.25, Math.abs(rig.sunVelocity) * 0.05);
    haloMat.uniforms.uOpacity.value = 0.12;
  });

  return (
    <group ref={group}>
      <mesh ref={corona} geometry={plane} material={coronaMat} renderOrder={1} />
      <mesh ref={halo} geometry={plane} material={haloMat} renderOrder={2} />
      <points ref={body} geometry={geom} material={mat} renderOrder={3} frustumCulled={false} />
    </group>
  );
}
