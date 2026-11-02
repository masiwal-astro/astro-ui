import { ArrowRight } from 'lucide-react';
import { CTA, LOGIN_URL } from '../content/site';

export function FinalCTA() {
  return (
    <section id="begin" className="cta" aria-labelledby="cta-title" data-reveal-group>
      <p className="label label--gold" data-reveal>{CTA.label}</p>
      <h2 id="cta-title" className="display" data-reveal>{CTA.headline[0]}<br /><em>{CTA.headline[1]}</em></h2>
      <p className="body" data-reveal>{CTA.body}</p>
      <div className="cta-actions" data-reveal>
        <a className="btn btn--primary btn--lg" href={LOGIN_URL}>{CTA.primary} <ArrowRight size={16} strokeWidth={1.4} /></a>
        <a className="link-arrow" href={LOGIN_URL}>{CTA.secondary} →</a>
      </div>
    </section>
  );
}
