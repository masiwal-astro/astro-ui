import { useState } from 'react';
import { PlaceholderNote } from '../Marks';
import { auth, astrology, type BirthProfile } from '../../services';
import type { Uncertainty } from '../../services/types';

const EMPTY = [
  { event: '', year: '' },
  { event: '', year: '' },
];

export function RectifyView({ profile, onDone }: { profile: BirthProfile | null; onDone?: () => void }) {
  const [uncertainty, setUncertainty] = useState<Uncertainty>(profile?.uncertaintyMinutes ?? 15);
  const [phase, setPhase] = useState<'ready' | 'questions' | 'result'>('ready');
  const [milestones, setMilestones] = useState(EMPTY);
  const [result, setResult] = useState('');
  const [applyTime, setApplyTime] = useState(profile?.time ?? '');

  const prepare = () => setPhase('questions');

  const finish = () => {
    if (!profile) return;
    const outcome = astrology.rectify({ profileId: profile.id, uncertaintyMinutes: uncertainty, milestones });
    if (!profile.example) {
      try {
        auth.updateProfile(profile.id, { uncertaintyMinutes: uncertainty });
      } catch { /* guest preview has no account */ }
    }
    setResult(`${outcome.headline}. ${outcome.detail}`);
    setPhase('result');
  };

  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Astro-calibration</p>
          <h2>Birth time rectification</h2>
        </div>
      </div>
      <p>Answer 2 quick milestone questions to calibrate the planetary rising degree. Tattva Shodhana, Kunda, and D9 Navamsha boundary checks are the live service’s method. This preview keeps the form and does not calculate a minute.</p>
      <label className="field" htmlFor="btr-window">
        <span>Uncertainty window</span>
        <select id="btr-window" value={uncertainty} onChange={(event) => setUncertainty(Number(event.target.value) as Uncertainty)}>
          <option value={15}>±15 mins (Standard)</option>
          <option value={30}>±30 mins (Half-hour)</option>
          <option value={60}>±60 mins (Hour window)</option>
        </select>
      </label>
      {phase === 'ready' && <button type="button" className="btn btn--primary" onClick={prepare} disabled={!profile}>Prepare questions</button>}
      {phase === 'questions' && (
        <form className="stack" onSubmit={(event) => { event.preventDefault(); finish(); }}>
          <p className="notice" role="status">Scanning planetary boundaries & generating questions… This preview stops there. No questions were calculated. These fields are the answer controls a connected service would label from Lagna and Navamsha boundaries.</p>
          {milestones.map((milestone, index) => (
            <fieldset key={index} className="milestone">
              <legend>Milestone {index + 1} of 2</legend>
              <label className="field">
                <span>Life event</span>
                <input value={milestone.event} onChange={(event) => setMilestones((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, event: event.target.value } : item))} />
              </label>
              <label className="field">
                <span>Year</span>
                <input inputMode="numeric" value={milestone.year} onChange={(event) => setMilestones((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, year: event.target.value } : item))} />
              </label>
            </fieldset>
          ))}
          <div className="row-actions">
            <button type="button" className="btn btn--ghost" onClick={finish}>Keep original time</button>
            <button type="submit" className="btn btn--primary">Calibrate stars</button>
          </div>
        </form>
      )}
      {phase === 'result' && (
        <div role="status" className="stack">
          <p className="notice">{result}</p>
          <PlaceholderNote>No minute was calculated. The time below is only written if you apply it.</PlaceholderNote>
          {profile && !profile.example && (
            <label className="field" htmlFor="btr-apply-time">
              <span>Time to keep</span>
              <input id="btr-apply-time" type="text" inputMode="numeric" placeholder="HH:MM" value={applyTime} onChange={(event) => setApplyTime(event.target.value)} />
            </label>
          )}
          <div className="row-actions">
            {profile && !profile.example && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(applyTime)) return;
                  auth.updateProfile(profile.id, { time: applyTime, timeUnknown: false });
                  setResult(`Wrote ${applyTime} on ${profile.name}'s chart. This was not an ephemeris result.`);
                }}
              >
                Apply this time to {profile.name}&apos;s chart
              </button>
            )}
            {onDone && <button type="button" className="btn btn--ghost" onClick={onDone}>Enter sanctuary</button>}
          </div>
        </div>
      )}
    </div>
  );
}
