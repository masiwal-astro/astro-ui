import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function AstrologyTools() {
  return (
    <section id="tools" className="section reports" aria-labelledby="tools-title" data-reveal-group>
      <header className="section-head">
        <p className="label" data-reveal>Reports</p>
        <h2 id="tools-title" className="display display--md" data-reveal>Divisional <em>varga</em> charts</h2>
        <p className="body" data-reveal>The Swiss Ephemeris engine computes sidereal longitudes, divisional Varga charts (D1, D9, D10), and dasha balances from the birth details you enter.</p>
      </header>
      <Link className="btn btn--primary" to="/app?panel=chart" data-reveal>Open the chart frame <ArrowRight size={15} strokeWidth={1.5} /></Link>
    </section>
  );
}
