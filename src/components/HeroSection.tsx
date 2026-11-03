import { HERO } from '../content/site';
import { DashaSearch } from './DashaSearch';

export function HeroSection() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1 id="hero-title" className="display">{HERO.headline}</h1>
        <p className="hero-sub">{HERO.sub}</p>
        <DashaSearch />
        <p className="hero-support">{HERO.support}</p>
      </div>
      <div className="scroll-cue" aria-hidden><span className="label">Scroll</span><i /></div>
    </section>
  );
}
