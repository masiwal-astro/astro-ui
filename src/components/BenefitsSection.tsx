import { Languages, Layers, Orbit, ShieldCheck } from 'lucide-react';
import { CREDITS_NOTE, WHY } from '../content/site';

const ICONS = { layers: Layers, orbit: Orbit, languages: Languages, shield: ShieldCheck };

export function BenefitsSection() {
  return (
    <section id="why" className="section why" aria-labelledby="why-title" data-reveal-group>
      <header className="section-head section-head--center">
        <p className="label" data-reveal>About · Why Dasha Astro</p>
        <h2 id="why-title" className="display display--md" data-reveal>Grounded in classical texts. <em>Engineered with ephemeris precision.</em></h2>
      </header>
      <div className="why-grid">
        {WHY.map((w) => { const I = ICONS[w.icon]; return (
          <article key={w.title} data-reveal>
            <span className="icon-ring icon-ring--lg"><I size={18} strokeWidth={1.1} /></span>
            <h3>{w.title}</h3><p>{w.text}</p>
          </article>
        ); })}
      </div>
      <p className="credits-note" data-reveal>{CREDITS_NOTE}</p>
    </section>
  );
}
