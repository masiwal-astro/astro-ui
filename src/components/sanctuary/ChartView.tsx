import { useState } from 'react';
import { formatBirthLine } from '../../lib/formatBirth';
import { ExampleMark, PlaceholderNote } from '../Marks';
import { astrology, type BirthProfile, type Varga } from '../../services';
import type { ChartHouse, ChartModel } from '../../services/types';

const VARGA: { id: Varga; label: string }[] = [
  { id: 'D1', label: 'D1 · Rashi' },
  { id: 'D9', label: 'D9 · Navamsha' },
  { id: 'D10', label: 'D10 · Dashamsha' },
];

/** North Indian houses, counted counter-clockwise from the top (lagna). Coordinates are 0–100. */
const NORTH: [number, number][][] = [
  [[50, 0], [75, 25], [50, 50], [25, 25]],
  [[50, 0], [0, 0], [25, 25]],
  [[0, 0], [0, 50], [25, 25]],
  [[0, 50], [25, 25], [50, 50], [25, 75]],
  [[0, 50], [0, 100], [25, 75]],
  [[0, 100], [50, 100], [25, 75]],
  [[50, 100], [25, 75], [50, 50], [75, 75]],
  [[50, 100], [100, 100], [75, 75]],
  [[100, 100], [100, 50], [75, 75]],
  [[100, 50], [75, 25], [50, 50], [75, 75]],
  [[100, 50], [100, 0], [75, 25]],
  [[100, 0], [50, 0], [75, 25]],
];

const SOUTH: Record<string, { column: number; row: number }> = {
  Meena: { column: 1, row: 1 },
  Mesha: { column: 2, row: 1 },
  Vrishabha: { column: 3, row: 1 },
  Mithuna: { column: 4, row: 1 },
  Karka: { column: 4, row: 2 },
  Simha: { column: 4, row: 3 },
  Kanya: { column: 4, row: 4 },
  Tula: { column: 3, row: 4 },
  Vrischika: { column: 2, row: 4 },
  Dhanu: { column: 1, row: 4 },
  Makara: { column: 1, row: 3 },
  Kumbha: { column: 1, row: 2 },
};

const SIGN_MARK: Record<string, string> = {
  Mesha: 'Ar', Vrishabha: 'Ta', Mithuna: 'Ge', Karka: 'Cn', Simha: 'Le', Kanya: 'Vi',
  Tula: 'Li', Vrischika: 'Sc', Dhanu: 'Sg', Makara: 'Cp', Kumbha: 'Aq', Meena: 'Pi',
};

/** Label anchors tuned to sit inside each house, not on the shared edges. */
const NORTH_LABELS: [number, number][] = [
  [150, 78], [58, 36], [34, 78], [78, 150], [34, 222], [58, 264],
  [150, 222], [242, 264], [266, 222], [222, 150], [266, 78], [242, 36],
];

function NorthChart({ model }: { model: ChartModel }) {
  return (
    <svg className="north-chart" viewBox="0 0 300 300" aria-hidden="true">
      <rect x="0.5" y="0.5" width="299" height="299" />
      {NORTH.map((points, index) => {
        const house = model.houses.find((item) => item.house === index + 1);
        const [x, y] = NORTH_LABELS[index];
        const grahas = house?.grahas.map((graha) => graha.short).join(' ') ?? '';
        return (
          <g key={index}>
            <polygon points={points.map(([px, py]) => `${px * 3},${py * 3}`).join(' ')} />
            <text x={x} y={y - 4} textAnchor="middle" fontSize="11">{house?.sign ? (SIGN_MARK[house.sign] ?? String(index + 1)) : String(index + 1)}</text>
            {grahas && <text className="north-graha" x={x} y={y + 12} textAnchor="middle" fontSize="10">{grahas}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function SouthChart({ model }: { model: ChartModel }) {
  return (
    <div className="south-chart" aria-hidden="true">
      {model.signs.map((cell) => {
        const place = SOUTH[cell.sign];
        return (
          <div key={cell.sign} className={cell.lagna ? 'is-lagna' : undefined} style={{ gridColumn: place.column, gridRow: place.row }}>
            <span>{cell.sign}</span>
            <strong>{cell.grahas.map((graha) => graha.short).join(' ') || (cell.lagna ? 'As' : '')}</strong>
          </div>
        );
      })}
      <div className="south-center">
        <span className="label">{model.varga}</span>
        <p>{model.lagnaLabel ?? 'Lagna not computed'}</p>
      </div>
    </div>
  );
}

function HouseTable({ houses, caption }: { houses: ChartHouse[]; caption: string }) {
  return (
    <table className="chart-table">
      <caption>{caption}</caption>
      <thead>
        <tr><th scope="col">House</th><th scope="col">Sign</th><th scope="col">Grahas</th></tr>
      </thead>
      <tbody>
        {houses.map((house) => (
          <tr key={house.house}>
            <th scope="row">{house.house}{house.lagna ? ' · Lagna' : ''}</th>
            <td>{house.sign ?? '—'}</td>
            <td>{house.grahas.length ? house.grahas.map((graha) => `${graha.name}${graha.detail ? ` ${graha.detail}` : ''}`).join(', ') : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ChartView({ profile, onEdit }: { profile: BirthProfile | null; onEdit?: () => void }) {
  const [varga, setVarga] = useState<Varga>('D1');
  const [style, setStyle] = useState<'north' | 'south'>('north');
  if (!profile) {
    return <PlaceholderNote>Add a birth chart in Family Vault to open D1, D9, and D10.</PlaceholderNote>;
  }
  const model = astrology.chart(profile, varga);
  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Natal kundali</p>
          <h2>Charts · {profile.name}</h2>
          <p className="chart-sub">{formatBirthLine(profile)}</p>
        </div>
        <div className="row-actions">
          {onEdit && <button type="button" className="btn btn--ghost" onClick={onEdit}>Edit details</button>}
          {model.example && <ExampleMark />}
        </div>
      </div>
      <div className="segmented" role="tablist" aria-label="Divisional chart">
        {VARGA.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={varga === item.id} onClick={() => setVarga(item.id)}>{item.label}</button>
        ))}
      </div>
      <div className="segmented" role="group" aria-label="Chart style">
        <button type="button" aria-pressed={style === 'north'} onClick={() => setStyle('north')}>North (Diamond)</button>
        <button type="button" aria-pressed={style === 'south'} onClick={() => setStyle('south')}>South (Square)</button>
        <button type="button" onClick={() => window.print()}>Save PDF</button>
      </div>
      <div className="chart-layout chart-print">
        {style === 'north' ? <NorthChart model={model} /> : <SouthChart model={model} />}
        <div>
          {model.lagnaLabel && <p className="lagna-badge"><span className="label">Ascendant (Lagna)</span>{model.lagnaLabel}</p>}
          {model.ayanamsha && <p className="muted">Ayanamsha {model.ayanamsha}</p>}
          <HouseTable houses={model.houses} caption={model.example ? 'Houses and grahas printed in the example' : 'Houses — positions not computed'} />
        </div>
      </div>
      <p className="notice">{model.notice}</p>
    </div>
  );
}
