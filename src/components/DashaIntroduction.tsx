import { Clock, Layers, Orbit, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { INTRO } from '../content/site';
import { motion } from '../lib/store';

const ICONS = { clock: Clock, layers: Layers, orbit: Orbit, users: Users };

export function DashaIntroduction() {
  const anchor = useRef<HTMLDivElement>(null);
  useEffect(() => { motion.anchor = anchor.current; return () => { motion.anchor = null; }; }, []);
  return (
    <section id="dasha" className="intro" aria-labelledby="intro-title" data-reveal-group>
      <div className="intro-left">
        <p className="label" data-reveal>{INTRO.label}</p>
        <h2 id="intro-title" className="display display--md" data-reveal>{INTRO.headline[0]}<br /><em>{INTRO.headline[1]}</em></h2>
        {INTRO.body.map((p) => <p key={p.slice(0, 12)} className="body" data-reveal>{p}</p>)}
      </div>
      <div className="intro-center" ref={anchor} aria-hidden>
        <div className="intro-halo"><i /><i /><i /></div>
        <span className="intro-tag label">Shani</span>
      </div>
      <ul className="intro-right">
        {INTRO.points.map((p) => { const I = ICONS[p.icon]; return (
          <li key={p.label} data-reveal>
            <span className="icon-ring"><I size={15} strokeWidth={1.2} /></span>
            <div><span className="label">{p.label}</span><p>{p.text}</p></div>
          </li>
        ); })}
      </ul>
    </section>
  );
}
