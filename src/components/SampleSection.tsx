import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ExampleMark } from './Marks';
import { EXAMPLE_AYANAMSHA, EXAMPLE_BIRTH_LINE, EXAMPLE_DASHA_SUMMARY, EXAMPLE_DISCLAIMER, EXAMPLE_LAGNA, PUBLISHED_QUESTION, PUBLISHED_READING } from '../services/exampleData';

const FACTS = [
  ['Lagna', EXAMPLE_LAGNA],
  ['Surya', '02°26′ Vrischika'],
  ['Chandra', '20°23′ Kumbha'],
  ['Budha', '24°55′ Tula'],
  ['Shukra', '29°47′ Kanya'],
  ['Ayanamsha', EXAMPLE_AYANAMSHA],
];

export function SampleSection() {
  return (
    <section id="sample" className="section sample" aria-labelledby="sample-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Folio II · Three traditions</p>
        <h2 id="sample-title" className="display display--md" data-reveal>See how Dasha <em>synthesizes</em></h2>
        <p className="body" data-reveal>No generic Sun-sign horoscopes. The block below is the fictional reference chart published on dashaastro.com, quoted so you can see the shape of a consultation.</p>
      </header>
      <article className="sample-sheet" data-reveal>
        <div className="sample-kicker">
          <ExampleMark />
          <p>{EXAMPLE_DISCLAIMER}</p>
        </div>
        <p className="sample-birth">{EXAMPLE_BIRTH_LINE}</p>
        <p className="sample-dasha">{EXAMPLE_DASHA_SUMMARY}</p>
        <dl className="fact-row">
          {FACTS.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <p className="sample-omitted">Mangala, Guru, Shani, Rahu, and Ketu are not printed in that sample, so they are not shown here.</p>
        <blockquote className="sample-question">“{PUBLISHED_QUESTION}”</blockquote>
        <div className="sample-window">
          <span className="label label--gold">{PUBLISHED_READING.title} · {PUBLISHED_READING.support}</span>
          <strong>{PUBLISHED_READING.window}</strong>
        </div>
        <div className="sample-grid">
          <article>
            <h3>Parashari · BPHS</h3>
            <p>{PUBLISHED_READING.parashari}</p>
          </article>
          <article>
            <h3>Jaimini · Chara Dasha</h3>
            <p>{PUBLISHED_READING.jaimini}</p>
          </article>
          <article>
            <h3>KP · Sub-lords</h3>
            <p>{PUBLISHED_READING.kp}</p>
          </article>
        </div>
        <p className="sample-guidance"><span className="label">Shastric guidance</span>{PUBLISHED_READING.guidance}</p>
        <Link className="btn btn--primary" to="/signup">Analyze your birth chart <ArrowRight size={15} strokeWidth={1.5} /></Link>
      </article>
    </section>
  );
}
