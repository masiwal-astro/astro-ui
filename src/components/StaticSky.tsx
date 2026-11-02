/** Lightweight SVG fallback when WebGL is unavailable. */
export function StaticSky() {
  const stars = Array.from({ length: 160 }, (_, i) => ({ x: (i * 73.13) % 100, y: (i * 41.7) % 100, r: ((i * 7) % 10) / 10 + 0.2 }));
  return (
    <div className="static-sky" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs><radialGradient id="sg"><stop offset="0" stopColor="#fff8ea" /><stop offset=".35" stopColor="#ecd3a0" stopOpacity=".7" /><stop offset="1" stopColor="#ecd3a0" stopOpacity="0" /></radialGradient></defs>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.12} fill="#ddd" opacity={0.3 + s.r * 0.4} />)}
        {[14, 20, 27, 34, 42].map((r, i) => <ellipse key={r} cx="50" cy="50" rx={r} ry={r * 0.28} fill="none" stroke="#bbb" strokeWidth=".08" opacity={0.5 - i * 0.07} />)}
        <circle cx="50" cy="50" r="14" fill="url(#sg)" /><circle cx="50" cy="50" r="5" fill="#fbf2df" />
      </svg>
    </div>
  );
}
