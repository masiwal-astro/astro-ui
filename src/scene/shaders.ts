import * as THREE from 'three';

/** Shared GLSL: soft round point sprite. */
const pointFrag = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main(){
    vec2 c = gl_PointCoord - 0.5; float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }`;

export interface PointUniforms { [k: string]: THREE.IUniform; uTime: THREE.IUniform<number>; uOpacity: THREE.IUniform<number>; uPixelRatio: THREE.IUniform<number> }

/** Generic stippled-surface material: attributes color, size, phase. */
export function makeStippleMaterial(sizeScale = 1, additive = false) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uPixelRatio: { value: 1 }, uSize: { value: sizeScale }, uTwinkle: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute vec3 color; attribute float size; attribute float phase;
      uniform float uTime, uPixelRatio, uSize, uOpacity, uTwinkle;
      varying vec3 vColor; varying float vAlpha;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = mix(1.0, 0.55 + 0.45 * sin(uTime * (0.6 + phase * 1.7) + phase * 40.0), uTwinkle);
        gl_PointSize = size * uSize * uPixelRatio * (60.0 / -mv.z);
        vColor = color; vAlpha = uOpacity * tw;
      }`,
    fragmentShader: pointFrag,
    transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/** Sun: dense particle sphere with animated surface activity and gold fresnel rim. */
export function makeSunMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uPixelRatio: { value: 1 }, uPulse: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float phase; attribute float shell;
      uniform float uTime, uPixelRatio, uPulse;
      varying vec3 vColor; varying float vAlpha;
      float n3(vec3 p){ return sin(p.x*3.1+uTime*.7)*sin(p.y*2.7-uTime*.5)*sin(p.z*3.3+uTime*.6); }
      void main(){
        vec3 nrm = normalize(position);
        float act = n3(nrm*2.0) + .5*n3(nrm*5.0+1.3);
        float pulse = 1.0 + 0.015*sin(uTime*1.3)*uPulse;
        float fl = shell > 0.5 ? fract(phase * 7.0 + uTime * 0.045) : 0.0;
        vec3 p = position * pulse * (1.0 + fl * 0.75) + nrm * act * 0.035;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_Position = projectionMatrix * mv;
        vec3 vn = normalize(normalMatrix * nrm);
        float rim = 1.0 - abs(dot(vn, normalize(-mv.xyz)));
        vec3 core = vec3(1.0, 0.97, 0.9);
        vec3 gold = vec3(0.91, 0.76, 0.5);
        vColor = mix(core, gold, smoothstep(0.25, 0.95, rim) * 0.9 + shell*0.3);
        float flick = 0.75 + 0.25*sin(uTime*2.0 + phase*60.0);
        vAlpha = (0.14 + act*0.06) * (0.35 + rim*1.1) * flick * (shell > 0.5 ? (1.0 - fl) * 0.45 : 1.0);
        gl_PointSize = (0.9 + phase*1.1 + max(act,0.0)*1.0) * uPixelRatio * (55.0 / -mv.z);
      }`,
    fragmentShader: pointFrag.replace('gl_FragColor = vec4(vColor, a * a * vAlpha);', 'gl_FragColor = vec4(vColor, a * a * vAlpha * uOpacity);').replace('varying float vAlpha;', 'varying float vAlpha; uniform float uOpacity;'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

/** Billboard radial glow (corona / horizon glow). */
export function makeGlowMaterial(color: THREE.ColorRepresentation, falloff = 2.2) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 1 }, uTime: { value: 0 }, uFalloff: { value: falloff } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity, uTime, uFalloff;
      void main(){
        vec2 c = vUv - 0.5; float d = length(c) * 2.0;
        float ang = atan(c.y, c.x);
        float rays = 0.85 + 0.15 * sin(ang*14.0 + uTime*0.3) * sin(ang*5.0 - uTime*0.2);
        float g = pow(max(0.0, 1.0 - d), uFalloff) * rays;
        gl_FragColor = vec4(uColor, g * uOpacity);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}
