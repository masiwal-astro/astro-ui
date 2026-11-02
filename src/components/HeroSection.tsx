import { FEATURES, HERO, NAVAGRAHAS } from '../content/site';
import { DashaSearch } from './DashaSearch';

export function HeroSection() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-edge hero-edge--left" aria-hidden>
        <span className="label">Navagraha</span>
        <ol>{NAVAGRAHAS.map((n, i) => <li key={n}><span>{String(i + 1).padStart(2, '0')}</span>{n}</li>)}</ol>
      </div>
      <div className="hero-edge hero-edge--right" aria-hidden>
        <span className="label">Vedic · Sidereal</span>
        <p>{HERO.traditions}</p>
        <p className="muted">{HERO.sidereal}</p>
      </div>

      <div className="hero-copy">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1 id="hero-title" className="display">{HERO.headline}</h1>
        <p className="hero-sub">{HERO.sub}</p>
        <DashaSearch />
        <p className="hero-support">{HERO.support}</p>
        <ul className="hero-points">
          {FEATURES.map((feature) => <li key={feature.title}><strong>{feature.title}</strong> {feature.text}</li>)}
        </ul>
      </div>

      <div className="scroll-cue" aria-hidden><span className="label">Scroll</span><i /></div>
    </section>
  );
}
