import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface Props { a: number; ecc: number; opacity: number; materialRef?: (m: THREE.LineBasicMaterial) => void; segments?: number }

/** A fine elliptical orbit line with alpha that fades along its far side (vertex colours). */
export function Orbit({ a, ecc, opacity, materialRef, segments = 256 }: Props) {
  const geom = useMemo(() => {
    const pts = new Float32Array((segments + 1) * 3), col = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts[i * 3] = Math.cos(t) * a; pts[i * 3 + 2] = Math.sin(t) * a * ecc;
      const f = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t)); // brighter near side
      col[i * 3] = f; col[i * 3 + 1] = f * 0.97; col[i * 3 + 2] = f * 0.92;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [a, ecc, segments]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }), [opacity]);
  useEffect(() => { materialRef?.(mat); }, [mat, materialRef]);
  useEffect(() => () => { geom.dispose(); mat.dispose(); }, [geom, mat]);
  // eslint-disable-next-line react/no-unknown-property
  return <lineLoop geometry={geom} material={mat} />;
}
