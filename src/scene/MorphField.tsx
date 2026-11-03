import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { motion } from '../lib/store';
import { buildTargets, particleCount } from './targets';

const vertex = /* glsl */ `
  attribute vec3 t0;
  attribute vec3 t1;
  attribute vec3 t2;
  attribute vec3 t3;
  attribute vec3 t4;
  attribute vec3 t5;
  attribute vec3 t6;
  attribute float aSeed;
  attribute float aBand;
  uniform float uMorph;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReduced;
  uniform vec2 uPointer;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float m = clamp(uMorph, 0.0, 6.0);
    float sunMix = 1.0 - smoothstep(0.0, 0.5, m);
    vec3 base = t0;
    if (uReduced < 0.5 && sunMix > 0.001) {
      float n1 = sin(base.y * 1.8 + uTime * 0.55 + aSeed * 18.0);
      float n2 = cos(base.x * 1.6 - uTime * 0.42 + aSeed * 9.0);
      vec3 axis = normalize(base + vec3(0.001, 0.002, 0.0015));
      vec3 tangent = normalize(cross(axis, vec3(0.0, 1.0, 0.15)));
      base += tangent * (n1 * 0.62 + n2 * 0.38) * 0.32 * sunMix;
      if (aBand > 1.5) {
        base += axis * (0.18 + 0.62 * sin(uTime * 0.22 + aSeed * 8.0)) * sunMix;
      }
    }
    vec3 pos = base;
    pos = mix(pos, t1, smoothstep(0.0, 1.0, clamp(m, 0.0, 1.0)));
    pos = mix(pos, t2, smoothstep(1.0, 2.0, clamp(m, 1.0, 2.0)));
    pos = mix(pos, t3, smoothstep(2.0, 3.0, clamp(m, 2.0, 3.0)));
    pos = mix(pos, t4, smoothstep(3.0, 4.0, clamp(m, 3.0, 4.0)));
    pos = mix(pos, t5, smoothstep(4.0, 5.0, clamp(m, 4.0, 5.0)));
    pos = mix(pos, t6, smoothstep(5.0, 6.0, clamp(m, 5.0, 6.0)));
    float spin = 0.0;
    if (uReduced < 0.5) {
      float mandala = smoothstep(4.15, 4.85, m) * (1.0 - smoothstep(5.15, 5.75, m));
      float wheel = smoothstep(5.15, 5.8, m);
      spin = uTime * (0.07 * mandala + 0.045 * wheel);
    }
    float cs = cos(spin);
    float sn = sin(spin);
    pos.xy = mat2(cs, -sn, sn, cs) * pos.xy;
    pos.xy += uPointer * 0.18;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float px = 1.15 + aSeed * 0.7;
    float core = (1.0 - step(0.5, aBand)) * sunMix * 2.15;
    float orbitGlow = (1.0 - step(0.5, aBand)) * smoothstep(0.55, 1.0, m) * (1.0 - smoothstep(1.15, 1.75, m)) * 0.65;
    gl_PointSize = (px + core + orbitGlow) * uPixelRatio;
    vec3 white = vec3(1.0, 0.985, 0.94);
    vec3 gold = vec3(0.95, 0.8, 0.5);
    float warm = sunMix * (0.22 + (1.0 - step(0.5, aBand)) * 0.7);
    float shani = (1.0 - step(0.5, aBand)) * smoothstep(0.45, 0.95, m) * (1.0 - smoothstep(1.2, 1.8, m));
    vColor = mix(white, gold, clamp(warm + shani * 0.85, 0.0, 1.0));
    float alpha = 0.78 + (1.0 - step(0.5, aBand)) * 0.22;
    float onStars = smoothstep(3.2, 3.85, m) * (1.0 - smoothstep(4.15, 4.8, m));
    float keep = step(0.955, fract(sin(aSeed * 91.13) * 43758.5));
    vAlpha = mix(alpha, keep * 0.9, onStars);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.46) discard;
    float edge = smoothstep(0.46, 0.18, d);
    gl_FragColor = vec4(vColor, edge * vAlpha);
  }
`;

/** One GPU particle buffer. Positions lerp in the vertex shader; scroll sets uMorph. */
export function MorphField() {
  const points = useRef<THREE.Points>(null!);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uReduced: { value: motion.reduced ? 1 : 0 },
      uPointer: { value: new THREE.Vector2() },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  const geometry = useMemo(() => {
    const targets = buildTargets(particleCount());
    const geo = new THREE.BufferGeometry();
    targets.positions.forEach((positions, index) => {
      geo.setAttribute(`t${index}`, new THREE.BufferAttribute(positions, 3));
    });
    geo.setAttribute('position', new THREE.BufferAttribute(targets.positions[0].slice(), 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(targets.seed, 1));
    geo.setAttribute('aBand', new THREE.BufferAttribute(targets.band, 1));
    return geo;
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(({ clock, gl }) => {
    const reduced = motion.reduced;
    material.uniforms.uMorph.value = reduced ? 0 : motion.morph;
    material.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime;
    material.uniforms.uReduced.value = reduced ? 1 : 0;
    material.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    const pointer = material.uniforms.uPointer.value as THREE.Vector2;
    pointer.x += (motion.pointer.x - pointer.x) * 0.04;
    pointer.y += (motion.pointer.y - pointer.y) * 0.04;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
