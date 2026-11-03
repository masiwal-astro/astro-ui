import { Link } from 'react-router-dom';
import { CREDIT_PACKS, CREDITS_NOTE } from '../content/site';

export function PricingSection() {
  return (
    <section id="pricing" className="section pricing" aria-labelledby="pricing-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Folio 03 · Transparent dakshina</p>
        <h2 id="pricing-title" className="display display--md" data-reveal>Consultation <em>credit packs</em></h2>
        <p className="body" data-reveal>{CREDITS_NOTE}</p>
      </header>
      <div className="price-grid">
        {CREDIT_PACKS.map((pack) => (
          <article key={pack.id} className={pack.featured ? 'price-card is-featured' : 'price-card'} data-reveal>
            <span className="label label--gold">{pack.tier}</span>
            <p className="price-amount"><span>₹</span>{pack.priceInr}</p>
            <p className="price-credits">{pack.credits} consultation credits</p>
            <p className="price-per">{pack.perReading}</p>
            <ul>
              {pack.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <Link className={pack.featured ? 'btn btn--primary' : 'btn btn--ghost'} to={`/signup?pack=${pack.id}`}>{pack.cta}</Link>
          </article>
        ))}
      </div>
      <aside className="explainer" data-reveal>
        <h3>What does 1 credit include?</h3>
        <ul>
          <li>Swiss Ephemeris transit generation</li>
          <li>Parashari dasha calculations, Jaimini chara dasha, and KP sub-lord verification</li>
          <li>Follow-up clarifications within the thread</li>
        </ul>
      </aside>
      <p className="credits-line" data-reveal>Credits never expire. No subscription.</p>
    </section>
  );
}
