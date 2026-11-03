import { ArrowRight } from 'lucide-react';
import type { PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { INTRO, STEPS, TOOLS, WHY } from '../content/site';
import { Glyph } from './Glyph';

function tilt(event: PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

export function DashaIntroduction() {
  return (
    <section id="dasha" className="section dasha-block" aria-labelledby="intro-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>{INTRO.label}</p>
        <h2 id="intro-title" className="display display--md" data-reveal>{INTRO.headline[0]} <em>{INTRO.headline[1]}</em></h2>
        <p className="body" data-reveal>{INTRO.body[0]}</p>
      </header>
      <div className="tool-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.title} className="tool-card" to={tool.href} onPointerMove={tilt} data-reveal>
            <Glyph kind={tool.glyph} />
            <span className="label">{tool.tag}</span>
            <h3>{tool.title}</h3>
            <p>{tool.text}</p>
            <span className="tool-arrow" aria-hidden><ArrowRight size={16} strokeWidth={1.5} /></span>
          </Link>
        ))}
      </div>
      <ul className="why-grid why-grid--inline">
        {WHY.map((item) => (
          <li key={item.title} data-reveal>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
      <ol className="how-row">
        {STEPS.map((step) => (
          <li key={step.n} data-reveal>
            <span className="step-n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
