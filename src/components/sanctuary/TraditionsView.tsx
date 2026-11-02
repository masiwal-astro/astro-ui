import { TRADITIONS } from '../../content/site';

export function TraditionsView() {
  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Guide</p>
          <h2>Astrological traditions in Dasha</h2>
        </div>
      </div>
      <p>Dasha does not rely on a single system. Every inquiry on the live service is verified across three classical traditions.</p>
      <div className="sample-grid">
        {TRADITIONS.map((tradition) => (
          <article key={tradition.id} className="tradition-card">
            <h3>{tradition.badge}</h3>
            <p><strong>Method. </strong>{tradition.method}</p>
            <p><strong>Effect on answers. </strong>{tradition.effect}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
