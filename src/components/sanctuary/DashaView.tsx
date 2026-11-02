import { ExampleMark, PlaceholderNote } from '../Marks';
import { astrology, type BirthProfile } from '../../services';
import type { DashaNode } from '../../services/types';

function fraction(startIso: string, endIso: string) {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T23:59:59`).getTime();
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
}

function inside(node: DashaNode) {
  if (!node.startIso || !node.endIso) return false;
  const now = Date.now();
  return now >= new Date(`${node.startIso}T00:00:00`).getTime() && now <= new Date(`${node.endIso}T23:59:59`).getTime();
}

function NodeView({ node }: { node: DashaNode }) {
  const current = inside(node);
  const progress = node.startIso && node.endIso ? fraction(node.startIso, node.endIso) : null;
  return (
    <li className={current ? 'is-current' : undefined}>
      <div className="dasha-node">
        <div>
          <span className="label">{node.level}{current ? ' · date falls in this window' : ''}</span>
          <h3>{node.lord}</h3>
          <p>{node.note}</p>
        </div>
        <time>{node.start && node.end ? `${node.start} – ${node.end}` : 'Bounds not in the sample'}</time>
      </div>
      {progress !== null && (
        <div className="dasha-bar" role="img" aria-label={`${Math.round(progress * 100)} percent across the published range`}>
          <i style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {node.children.length > 0 && (
        <ol>{node.children.map((child) => <NodeView key={`${child.level}-${child.lord}-${child.start}`} node={child} />)}</ol>
      )}
    </li>
  );
}

export function DashaView({ profile }: { profile: BirthProfile | null }) {
  if (!profile) return <PlaceholderNote>Add a birth chart to open the Vimshottari timeline.</PlaceholderNote>;
  const model = astrology.dasha(profile);
  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Parashari · Vimshottari</p>
          <h2>{model.summary}</h2>
        </div>
        {model.example && <ExampleMark />}
      </div>
      {model.tree ? (
        <ol className="dasha-tree"><NodeView node={model.tree} /></ol>
      ) : (
        <div className="empty-levels" aria-hidden="false">
          <p>Mahadasha</p>
          <p>Antardasha</p>
          <p>Pratyantar</p>
        </div>
      )}
      <p className="notice">{model.notice}{model.example ? ' A bar, when shown, measures today’s date across the printed month or day range. It is not an ephemeris fraction.' : ''}</p>
    </div>
  );
}

export function DashaRibbon({ profile }: { profile: BirthProfile | null }) {
  if (!profile) return <p className="ribbon-empty">Dasha: add a chart</p>;
  const model = astrology.dasha(profile);
  const antar = model.tree?.children[0];
  const pratya = antar?.children[0];
  const progress = antar?.startIso && antar.endIso ? fraction(antar.startIso, antar.endIso) : 0.5;
  return (
    <div className="dasha-ribbon">
      <div>
        <span className="dasha-dot" aria-hidden />
        <strong>{model.available && model.tree ? `Dasha: ${model.tree.lord} MD` : 'Dasha: not computed'}</strong>
        {antar && <span>{antar.lord} AD{antar.start && antar.end ? ` · ${antar.start} – ${antar.end}` : ''}</span>}
        {pratya && <span>{pratya.lord} PD{pratya.start && pratya.end ? ` · ${pratya.start} – ${pratya.end}` : ''}</span>}
      </div>
      {model.available && (
        <div className="dasha-bar" role="img" aria-label="Position inside the published Venus antardasha month range">
          <i style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  );
}
