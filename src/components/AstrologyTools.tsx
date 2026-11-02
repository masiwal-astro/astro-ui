import { ArrowUpRight } from 'lucide-react';
import type { PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../content/site';
import { Glyph } from './Glyph';

function tilt(e: PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  e.currentTarget.style.setProperty('--rx', `${((e.clientX - r.left) / r.width - 0.5) * 30}deg`);
}

export function AstrologyTools() {
  return (
    <section id="tools" className="section tools" aria-labelledby="tools-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Reports · Inside every consultation</p>
        <h2 id="tools-title" className="display display--md" data-reveal>Classical methods, <em>dated windows</em></h2>
        <p className="body" data-reveal>What Dasha computes from your exact birth coordinates — evaluated independently, then synthesized.</p>
      </header>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <Link key={t.title} className="tool-card" to={t.href} onPointerMove={tilt} data-reveal>
            <Glyph kind={t.glyph} />
            <span className="label">{t.tag}</span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
            <span className="tool-arrow" aria-hidden><ArrowUpRight size={16} strokeWidth={1.3} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
