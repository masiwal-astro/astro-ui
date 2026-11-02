import { STEPS } from '../content/site';

export function HowItWorks() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Learn · How a consultation works</p>
        <h2 id="how-title" className="display display--md" data-reveal>No astrological <em>jargon required</em></h2>
      </header>
      <ol className="steps">
        {STEPS.map((s) => (
          <li key={s.n} data-reveal><span className="step-n">{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
    </section>
  );
}
