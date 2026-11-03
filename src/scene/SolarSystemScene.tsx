import { Canvas } from '@react-three/fiber';
import { MorphField } from './MorphField';

interface Props { quality: number; onReady: () => void; paused: boolean }

/** Fixed full-screen particle field. The old orbiting meshes are not mounted. */
export default function SolarSystemScene({ onReady, paused }: Props) {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.75]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: 38, near: 0.1, far: 80, position: [0, 0, 18] }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.setClearColor('#030303'); requestAnimationFrame(() => requestAnimationFrame(onReady)); }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <MorphField />
    </Canvas>
  );
}
