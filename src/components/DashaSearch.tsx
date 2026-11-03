import { createPortal } from 'react-dom';
import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { QUESTION_CHIPS } from '../content/site';
import { useAccount } from '../lib/useAccount';
import { savePending } from '../services/pending';

interface Details { date: string; time: string; unknownTime: boolean; place: string; question: string }
type Status = 'idle' | 'open' | 'ready';
const EMPTY: Details = { date: '', time: '', unknownTime: false, place: '', question: '' };

export function composeHandoff(d: Details) {
  const time = d.unknownTime || !d.time ? 'time unknown / approximate' : d.time;
  const question = d.question.trim() || 'What does my current Mahadasha indicate?';
  return `Birth details — Date: ${d.date}, Time: ${time}, Place: ${d.place.trim()}. Question: ${question}`;
}

/** Birth-details search. Saves a local draft and continues into signup or the vault. It does not compute a chart. */
export function DashaSearch() {
  const navigate = useNavigate();
  const account = useAccount();
  const [status, setStatus] = useState<Status>('idle');
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const id = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { if (status === 'open') firstField.current?.focus(); }, [status]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && status !== 'idle') setStatus('idle'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status]);

  const set = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!details.date) next.date = 'Enter your date of birth';
    else if (details.date > today) next.date = 'Date of birth cannot be in the future';
    if (!details.unknownTime && !details.time) next.time = 'Enter a time, or mark it as unknown';
    else if (!details.unknownTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(details.time)) next.time = 'Use 24-hour time as HH:MM, for example 08:30';
    if (details.place.trim().length < 2) next.place = 'Enter your birthplace (city)';
    setErrors(next);
    if (Object.keys(next).length) return;
    savePending(details);
    setStatus('ready');
  };

  const continueTo = () => {
    if (account) navigate('/app?panel=vault&prefill=1');
    else navigate('/signup');
  };

  return (
    <div className="search" data-status={status}>
      <button type="button" className="search-pill" onClick={() => setStatus('open')} aria-haspopup="dialog" aria-expanded={status !== 'idle'} aria-label="Find my Dasha">
        <span className="search-placeholder">Find my Dasha</span>
        <span className="search-go" aria-hidden><ArrowRight size={18} strokeWidth={1.4} /></span>
      </button>

      {status !== 'idle' && createPortal(
        <div className="search-overlay" data-lenis-prevent onClick={(event) => { if (event.target === event.currentTarget) setStatus('idle'); }}>
          {status === 'open' && (
            <form className="search-panel glass" onSubmit={submit} noValidate role="dialog" aria-label="Birth details" aria-describedby={`${id}-note`}>
              <div className="search-head">
                <span className="label">Birth coordinates</span>
                <button type="button" className="icon-btn" onClick={() => setStatus('idle')} aria-label="Close birth details"><X size={16} strokeWidth={1.4} /></button>
              </div>
              <div className="search-fields">
                <label className="field">
                  <span>Date of birth</span>
                  <input ref={firstField} type="date" max={today} value={details.date} onChange={(event) => set('date', event.target.value)} aria-invalid={!!errors.date} />
                  {errors.date && <em role="alert">{errors.date}</em>}
                </label>
                <label className="field">
                  <span>Time of birth</span>
                  <input type="text" inputMode="numeric" placeholder="HH:MM" autoComplete="off" value={details.time} disabled={details.unknownTime} onChange={(event) => set('time', event.target.value)} aria-invalid={!!errors.time} />
                  <span className="check"><input type="checkbox" checked={details.unknownTime} onChange={(event) => set('unknownTime', event.target.checked)} /> Not sure of exact time</span>
                  {errors.time && <em role="alert">{errors.time}</em>}
                </label>
                <label className="field field--wide">
                  <span>Birthplace</span>
                  <input type="text" autoComplete="address-level2" placeholder="City, country" value={details.place} onChange={(event) => set('place', event.target.value)} aria-invalid={!!errors.place} />
                  {errors.place && <em role="alert">{errors.place}</em>}
                </label>
                <label className="field field--wide">
                  <span>Your question <i>(optional)</i></span>
                  <input type="text" placeholder="Ask in plain language" value={details.question} onChange={(event) => set('question', event.target.value)} />
                </label>
              </div>
              <div className="chips" role="group" aria-label="Try asking">
                {QUESTION_CHIPS.map((chip) => (
                  <button type="button" key={chip.label} className="chip" aria-pressed={details.question === chip.prompt} onClick={() => set('question', chip.prompt)}>{chip.label}</button>
                ))}
              </div>
              <div className="search-foot">
                <p id={`${id}-note`} className="note">This preview stores the details in your browser and does not generate a prediction. A connected ephemeris computes the reading after sign-in.</p>
                <button type="submit" className="search-go search-go--submit" aria-label="Continue"><ArrowRight size={18} strokeWidth={1.4} /></button>
              </div>
            </form>
          )}
          {status === 'ready' && (
            <div className="search-panel glass search-ready" role="status" aria-live="polite">
              <div className="search-head">
                <span className="label label--gold">Details kept on this device</span>
                <button type="button" className="icon-btn" onClick={() => setStatus('idle')} aria-label="Close"><X size={16} strokeWidth={1.4} /></button>
              </div>
              <p className="ready-text">{composeHandoff(details)}</p>
              <p className="note">No chart was calculated. Continue to {account ? 'save this chart in your Family Vault' : 'create a sanctuary — new registration includes 10 complimentary credits'}.</p>
              <div className="ready-actions">
                <button type="button" className="btn btn--primary" onClick={continueTo}>{account ? 'Save to Family Vault' : 'Continue — 10 free credits'}</button>
                <button type="button" className="btn btn--text" onClick={() => setStatus('open')}>Edit</button>
                {!account && <Link className="link-arrow" to="/login">Already registered?</Link>}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
