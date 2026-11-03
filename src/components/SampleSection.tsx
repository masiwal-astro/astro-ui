import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ExampleMark } from './Marks';
import { EXAMPLE_DISCLAIMER, PUBLISHED_QUESTION, PUBLISHED_READING } from '../services/exampleData';

const TABS = [
  { id: 'parashari', label: 'Parashari', text: PUBLISHED_READING.parashari },
  { id: 'jaimini', label: 'Jaimini', text: PUBLISHED_READING.jaimini },
  { id: 'kp', label: 'KP', text: PUBLISHED_READING.kp },
  { id: 'guidance', label: 'Guidance', text: PUBLISHED_READING.guidance },
] as const;

export function SampleSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('parashari');
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];
  return (
    <section id="sample" className="section sample" aria-labelledby="sample-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Illustrative sample</p>
        <h2 id="sample-title" className="display display--md" data-reveal>Where the three traditions <em>agree</em></h2>
      </header>
      <article className="sample-sheet" data-reveal>
        <div className="sample-kicker">
          <ExampleMark />
          <p>{EXAMPLE_DISCLAIMER}</p>
        </div>
        <blockquote className="sample-question">“{PUBLISHED_QUESTION}”</blockquote>
        <p className="sample-window"><strong>{PUBLISHED_READING.window}</strong><span>{PUBLISHED_READING.support}</span></p>
        <div className="sample-tabs" role="tablist" aria-label="Traditions in the published example">
          {TABS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}>{item.label}</button>
          ))}
        </div>
        <p className="sample-tab-copy" role="tabpanel">{active.text}</p>
        <Link className="btn btn--primary" to="/signup">Analyze your birth chart <ArrowRight size={15} strokeWidth={1.5} /></Link>
      </article>
    </section>
  );
}
