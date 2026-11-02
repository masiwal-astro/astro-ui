import { useState } from 'react';
import { FAQ } from '../content/site';

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Questions</p>
        <h2 id="faq-title" className="display display--md" data-reveal>Frequently asked</h2>
        <p className="body" data-reveal>Everything published about Dasha Astro consultations and chart readings.</p>
      </header>
      <div className="faq-list">
        {FAQ.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.q} className="faq-item" data-reveal>
              <h3>
                <button type="button" aria-expanded={expanded} aria-controls={`faq-panel-${index}`} id={`faq-button-${index}`} onClick={() => setOpen(expanded ? null : index)}>
                  <span>{item.q}</span>
                  <i aria-hidden>{expanded ? '–' : '+'}</i>
                </button>
              </h3>
              <div id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-button-${index}`} hidden={!expanded}>
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
