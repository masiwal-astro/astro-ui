import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { Director } from './Director';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { Orbit } from './Orbit';
import { StarField } from './StarField';
import { Trail } from './Trail';
import { Horizon } from './Horizon';
import { PLANETS } from './planets';
import { rig } from './rig';

const EXTRA_RINGS = [{ a: 2.2, ecc: 0.95, o: 0.22 }, { a: 10.8, ecc: 0.86, o: 0.12 }, { a: 12.4, ecc: 0.85, o: 0.07 }];

function System({ quality }: { quality: number }) {
  const group = useRef<THREE.Group>(null!);
  const rings = useRef<THREE.Group>(null!);
  const mats = useRef<{ m: THREE.LineBasicMaterial; base: number }[]>([]);
  const register = useCallback((base: number) => (m: THREE.LineBasicMaterial) => { if (!mats.current.find((x) => x.m === m)) mats.current.push({ m, base }); }, []);
  useFrame(() => {
    group.current.position.copy(rig.sun);
    group.current.rotation.set(rig.orbitTilt, 0, 0.14);
    group.current.scale.setScalar(rig.systemScale);
    rings.current.scale.set(rig.spread, 1, rig.spread);
    mats.current.forEach(({ m, base }) => { m.opacity = base * rig.orbitOpacity; });
  });
  return (
    <group ref={group}>
      <group ref={rings}>
        {PLANETS.filter((p) => p.name !== 'Ketu').map((p, i) => (
          <Orbit key={p.name} a={p.a} ecc={p.ecc} opacity={0.2 - i * 0.015} materialRef={register(0.2 - i * 0.015)} />
        ))}
        {EXTRA_RINGS.map((r) => <Orbit key={r.a} a={r.a} ecc={r.ecc} opacity={r.o} materialRef={register(r.o)} />)}
      </group>
      {PLANETS.map((p, i) => <Planet key={p.name} spec={p} index={i} quality={quality} />)}
    </group>
  );
}

interface Props { quality: number; onReady: () => void; paused: boolean }

/** Full-viewport, fixed WebGL layer. Never receives pointer events (handled on window). */
export default function SolarSystemScene({ quality: initialQ, onReady, paused }: Props) {
  const [dpr, setDpr] = useState<number>(Math.min(window.devicePixelRatio, initialQ < 0.7 ? 1.5 : 1.75));
  const q = initialQ;
  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: 42, near: 0.1, far: 300, position: [0, 0.6, 15] }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.setClearColor('#030303'); requestAnimationFrame(() => requestAnimationFrame(onReady)); }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.75, d - 0.35))} onIncline={() => setDpr((d) => Math.min(window.devicePixelRatio, 1.75, d + 0.25))} />
      <AdaptiveDpr pixelated={false} />
      <Director />
      <StarField count={Math.round(4200 * q)} depth={[25, 90]} spread={110} sizeRange={[0.8, 3.6]} seed={1} />
      <StarField count={Math.round(700 * q)} depth={[-4, 20]} spread={36} sizeRange={[0.5, 1.6]} goldRatio={0.35} seed={2} />
      <System quality={q} />
      <Sun quality={q} />
      <Trail quality={q} />
      <Horizon quality={q} />
    </Canvas>
  );
}
