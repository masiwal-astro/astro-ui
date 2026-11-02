import { createPortal } from 'react-dom';
import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, X } from 'lucide-react';
import { LOGIN_URL, QUESTION_CHIPS } from '../content/site';

interface Details { date: string; time: string; unknownTime: boolean; place: string; question: string }
type Status = 'idle' | 'open' | 'ready';
const EMPTY: Details = { date: '', time: '', unknownTime: false, place: '', question: '' };

export function composeHandoff(d: Details) {
  const t = d.unknownTime || !d.time ? 'time unknown / approximate' : d.time;
  const q = d.question.trim() || 'What does my current Mahadasha indicate?';
  return `Birth details — Date: ${d.date}, Time: ${t}, Place: ${d.place.trim()}. Question: ${q}`;
}

/**
 * Glass birth-details search.
 * Integration: dashaastro.com computes readings only inside its signed-in app (/login → /app).
 * Its own landing form stores the question in same-origin sessionStorage ("pending_query")
 * before redirecting, which a different origin cannot do. So this form validates the details,
 * composes the consultation prompt, copies it, and hands off to the real sign-in page.
 */
export function DashaSearch() {
  const [status, setStatus] = useState<Status>('idle');
  const [d, setD] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [copied, setCopied] = useState(false);
  const id = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { if (status === 'open') firstField.current?.focus(); }, [status]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape' && status !== 'idle') setStatus('idle'); };
    window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc);
  }, [status]);

  const set = <K extends keyof Details>(k: K, v: Details[K]) => { setD((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!d.date) err.date = 'Enter your date of birth';
    else if (d.date > today) err.date = 'Date of birth cannot be in the future';
    if (!d.unknownTime && !d.time) err.time = 'Enter a time, or mark it as unknown';
    if (d.place.trim().length < 2) err.place = 'Enter your birthplace (city)';
    setErrors(err);
    if (Object.keys(err).length) return;
    try { await navigator.clipboard.writeText(composeHandoff(d)); setCopied(true); } catch { setCopied(false); }
    setStatus('ready');
  };

  const copyAgain = async () => { try { await navigator.clipboard.writeText(composeHandoff(d)); setCopied(true); } catch { /* clipboard blocked */ } };

  return (
    <div className="search" data-status={status} ref={root}>
      {(
        <button type="button" className="search-pill" onClick={() => setStatus('open')} aria-haspopup="dialog" aria-expanded={status !== 'idle'}>
          <span className="search-placeholder">Enter your birth details to discover your Dasha</span>
          <span className="search-go" aria-hidden><ArrowRight size={18} strokeWidth={1.4} /></span>
        </button>
      )}

      {status !== 'idle' && createPortal(<div className="search-overlay" data-lenis-prevent onClick={(e) => { if (e.target === e.currentTarget) setStatus('idle'); }}>
      {status === 'open' && (
        <form className="search-panel glass" onSubmit={submit} noValidate role="dialog" aria-label="Birth details" aria-describedby={`${id}-note`}>
          <div className="search-head">
            <span className="label">Birth coordinates</span>
            <button type="button" className="icon-btn" onClick={() => setStatus('idle')} aria-label="Close birth details"><X size={16} strokeWidth={1.4} /></button>
          </div>
          <div className="search-fields">
            <label className="field">
              <span>Date of birth</span>
              <input ref={firstField} type="date" max={today} value={d.date} onChange={(e) => set('date', e.target.value)} aria-invalid={!!errors.date} />
              {errors.date && <em role="alert">{errors.date}</em>}
            </label>
            <label className="field">
              <span>Time of birth</span>
              <input type="time" value={d.time} disabled={d.unknownTime} onChange={(e) => set('time', e.target.value)} aria-invalid={!!errors.time} />
              <span className="check"><input type="checkbox" checked={d.unknownTime} onChange={(e) => set('unknownTime', e.target.checked)} /> Not sure of exact time</span>
              {errors.time && <em role="alert">{errors.time}</em>}
            </label>
            <label className="field field--wide">
              <span>Birthplace</span>
              <input type="text" autoComplete="address-level2" placeholder="City, country" value={d.place} onChange={(e) => set('place', e.target.value)} aria-invalid={!!errors.place} />
              {errors.place && <em role="alert">{errors.place}</em>}
            </label>
            <label className="field field--wide">
              <span>Your question <i>(optional)</i></span>
              <input type="text" placeholder="Ask in plain language" value={d.question} onChange={(e) => set('question', e.target.value)} />
            </label>
          </div>
          <div className="chips" role="group" aria-label="Try asking">
            {QUESTION_CHIPS.map((q) => (
              <button type="button" key={q} className="chip" aria-pressed={d.question === q} onClick={() => set('question', q)}>{q}</button>
            ))}
          </div>
          <div className="search-foot">
            <p id={`${id}-note`} className="note">Readings are computed by Dasha Astro with Swiss Ephemeris after you sign in. This page does not generate predictions.</p>
            <button type="submit" className="search-go search-go--submit" aria-label="Continue"><ArrowRight size={18} strokeWidth={1.4} /></button>
          </div>
        </form>
      )}

      {status === 'ready' && (
        <div className="search-panel glass search-ready" role="status" aria-live="polite">
          <div className="search-head"><span className="label label--gold">Ready for your consultation</span><button type="button" className="icon-btn" onClick={() => setStatus('idle')} aria-label="Close"><X size={16} strokeWidth={1.4} /></button></div>
          <p className="ready-text">{composeHandoff(d)}</p>
          <p className="note">
            {copied ? 'Copied to your clipboard. ' : ''}Sign in at Dasha Astro, then paste these details into your consultation. New accounts receive 10 complimentary credits.
          </p>
          <div className="ready-actions">
            <a className="btn btn--primary" href={LOGIN_URL} target="_blank" rel="noopener">Continue on dashaastro.com <ExternalLink size={14} strokeWidth={1.5} /></a>
            <button type="button" className="btn btn--ghost" onClick={copyAgain}>{copied ? <Check size={14} /> : <Copy size={14} />} Copy</button>
            <button type="button" className="btn btn--text" onClick={() => setStatus('open')}>Edit</button>
          </div>
        </div>
      )}
      </div>, document.body)}
    </div>
  );
}
