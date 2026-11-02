import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CTA } from '../content/site';

export function FinalCTA() {
  return (
    <section id="begin" className="cta" aria-labelledby="cta-title" data-reveal-group>
      <p className="label label--gold" data-reveal>{CTA.label}</p>
      <h2 id="cta-title" className="display" data-reveal>{CTA.headline[0]}<br /><em>{CTA.headline[1]}</em></h2>
      <p className="body" data-reveal>{CTA.body}</p>
      <div className="cta-actions" data-reveal>
        <Link className="btn btn--primary btn--lg" to="/signup">{CTA.primary} <ArrowRight size={16} strokeWidth={1.4} /></Link>
        <Link className="link-arrow" to="/login">{CTA.secondary} →</Link>
        <p className="cta-guarantee">{CTA.guarantee}</p>
      </div>
    </section>
  );
}
