import type { Tool } from '../content/site';

/** Minimal celestial line illustrations for the tool cards (SVG, animated via CSS). */
export function Glyph({ kind }: { kind: Tool['glyph'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 0.8 } as const;
  return (
    <svg viewBox="0 0 120 120" className="glyph" aria-hidden>
      <g className="glyph-spin" {...common}>
        {kind === 'rings' && (<>
          <ellipse cx="60" cy="60" rx="50" ry="18" opacity=".5" /><ellipse cx="60" cy="60" rx="36" ry="13" opacity=".7" /><ellipse cx="60" cy="60" rx="22" ry="8" />
          <circle cx="110" cy="60" r="2.5" fill="currentColor" /><circle cx="38" cy="47" r="1.8" fill="currentColor" />
        </>)}
        {kind === 'nested' && (<>
          <circle cx="60" cy="60" r="48" opacity=".35" /><circle cx="60" cy="60" r="34" opacity=".6" /><circle cx="60" cy="60" r="20" />
          <path d="M60 12 A48 48 0 0 1 108 60" strokeWidth="1.6" className="gold" /><path d="M60 26 A34 34 0 0 1 94 60" strokeWidth="1.6" className="gold" /><path d="M60 40 A20 20 0 0 1 80 60" strokeWidth="1.6" className="gold" />
        </>)}
        {kind === 'chara' && (<>
          <rect x="18" y="18" width="84" height="84" opacity=".5" /><path d="M18 18 L102 102 M102 18 L18 102" opacity=".5" /><rect x="39" y="39" width="42" height="42" transform="rotate(45 60 60)" />
          <circle cx="60" cy="30" r="2.5" fill="currentColor" />
        </>)}
        {kind === 'cusp' && (<>
          <circle cx="60" cy="60" r="46" opacity=".5" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={60 + Math.cos(a) * 30} y1={60 + Math.sin(a) * 30} x2={60 + Math.cos(a) * 46} y2={60 + Math.sin(a) * 46} opacity={i % 3 ? 0.4 : 1} />; })}
          <circle cx="60" cy="60" r="30" /><circle cx="106" cy="60" r="2.5" fill="currentColor" />
        </>)}
        {kind === 'varga' && (<>
          <rect x="16" y="40" width="40" height="40" opacity=".5" /><rect x="40" y="40" width="40" height="40" opacity=".75" /><rect x="64" y="40" width="40" height="40" />
          <text x="36" y="34" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">D1</text><text x="60" y="34" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">D9</text><text x="84" y="34" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">D10</text>
        </>)}
        {kind === 'btr' && (<>
          <circle cx="60" cy="60" r="44" opacity=".5" />
          {Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2; const l = i % 5 ? 40 : 35; return <line key={i} x1={60 + Math.cos(a) * l} y1={60 + Math.sin(a) * l} x2={60 + Math.cos(a) * 44} y2={60 + Math.sin(a) * 44} opacity=".6" />; })}
          <line x1="60" y1="60" x2="60" y2="26" className="gold" strokeWidth="1.4" /><line x1="60" y1="60" x2="82" y2="66" strokeWidth="1.2" /><circle cx="60" cy="60" r="2" fill="currentColor" />
        </>)}
      </g>
    </svg>
  );
}
