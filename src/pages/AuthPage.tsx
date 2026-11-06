import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DIAL_CODES, WELCOME_CREDITS } from '../content/site';
import { BirthForm, emptyDraft, toProfileDraft, validateDraft, type BirthDraft } from '../components/BirthForm';
import { pushToast, ToastRegion } from '../components/Feedback';
import { RectifyView } from '../components/sanctuary/RectifyView';
import { StaticSky } from '../components/StaticSky';
import { useAccount } from '../lib/useAccount';
import { auth } from '../services';
import { formatDestination, validatePhone } from '../services/mockAuth';
import { PlaceholderNote } from '../components/Marks';
import { guestHasQuestion, readGuestThreads } from '../lib/guestThreads';
import { clearPending, readPending } from '../services/pending';

type Phase = 'phone' | 'code' | 'profile' | 'welcome' | 'returning' | 'btr';

export function AuthPage({ intent }: { intent: 'login' | 'signup' }) {
  const navigate = useNavigate();
  const account = useAccount();
  const [params] = useSearchParams();
  const pack = params.get('pack');
  const pending = readPending();
  const [phase, setPhase] = useState<Phase>('phone');
  const [dialCode, setDialCode] = useState<(typeof DIAL_CODES)[number]['code']>('+91');
  const [nationalNumber, setNationalNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [draft, setDraft] = useState<BirthDraft>(() => emptyDraft({
    date: pending?.date ?? '',
    time: pending?.time ?? '',
    timeUnknown: pending?.unknownTime ?? false,
    place: pending?.place ?? '',
  }));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BirthDraft, string>>>({});
  const [newNumber, setNewNumber] = useState(false);
  const [keepPreview, setKeepPreview] = useState(false);
  const previewWaiting = guestHasQuestion();

  useEffect(() => {
    document.title = intent === 'login' ? 'Sign in — Dasha Astro' : 'Begin free — Dasha Astro';
  }, [intent]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const destinationFor = () => formatDestination({ dialCode, nationalNumber });
  const nextPath = () => (pack ? `/app?panel=credits&pack=${encodeURIComponent(pack)}` : '/app');

  const enter = () => {
    const question = readPending()?.question ?? '';
    if (keepPreview && account?.activeProfileId) {
      Object.values(readGuestThreads()).flat().forEach((entry) => auth.appendMessage(account.activeProfileId!, entry));
    }
    clearPending();
    navigate(nextPath(), { state: { question: keepPreview ? '' : question } });
  };

  const sendCode = async (event?: FormEvent, resent = false) => {
    event?.preventDefault();
    setError('');
    const phoneError = validatePhone({ dialCode, nationalNumber });
    if (phoneError) { setError(phoneError); return; }
    setBusy(true);
    try {
      const result = await auth.requestCode({ dialCode, nationalNumber });
      setDestination(result.destination);
      setPhase('code');
      setResendIn(30);
      setCode('');
      if (resent) pushToast('Code sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The code could not be requested.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await auth.verifyCode({ dialCode, nationalNumber, code });
      if (result.status === 'existing') {
        if (intent === 'signup') {
          setPhase('returning');
          return;
        }
        const question = readPending()?.question ?? '';
        const hasBirth = !!readPending()?.date;
        navigate(hasBirth ? '/app?panel=vault&prefill=1' : nextPath(), { state: { question } });
        return;
      }
      setNewNumber(true);
      setPhase('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The code could not be checked.');
    } finally {
      setBusy(false);
    }
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    setError('');
    try {
      await auth.completeSignup(toProfileDraft(draft));
      setPhase('welcome');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The sanctuary could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const active = account?.profiles.find((profile) => profile.id === account.activeProfileId) ?? null;

  return (
    <div className="auth-screen">
      <div className="scene-layer" aria-hidden><StaticSky /><div className="vignette" /></div>
      <a className="skip" href="#auth-card">Skip to sign in</a>
      <header className="auth-bar">
        <Link to="/" className="nav-brand">DASHA<span>·</span>ASTRO</Link>
        <Link to={intent === 'login' ? '/signup' : '/login'}>{intent === 'login' ? 'Begin free' : 'Log in'}</Link>
      </header>
      <main className="auth-card glass" id="auth-card">
        <p className="label label--gold">{phase === 'phone' ? 'Step 1 of 2 · Phone' : phase === 'code' ? 'Step 2 of 2 · Verify' : 'Sanctuary'}</p>
        {phase === 'phone' && (
          <form onSubmit={sendCode} noValidate>
            <h1>{intent === 'login' ? 'Sign in to Dasha Astro' : 'Begin your free sanctuary'}</h1>
            <p>Enter your mobile number. We’ll text you a 6-digit verification code. No password needed.</p>
            <div className="phone-row">
              <label className="field">
                <span className="sr-only">Country code</span>
                <select aria-label="Country code" value={dialCode} onChange={(event) => setDialCode(event.target.value as typeof dialCode)}>
                  {DIAL_CODES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                </select>
              </label>
              <label className="field">
                <span className="sr-only">Mobile phone</span>
                <input inputMode="numeric" autoComplete="tel" placeholder="Mobile phone" value={nationalNumber} onChange={(event) => setNationalNumber(event.target.value.replace(/\D/g, ''))} aria-invalid={!!error} />
              </label>
            </div>
            <PlaceholderNote>Verification is simulated. No SMS is sent. Any 6-digit code continues.</PlaceholderNote>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn--primary btn--lg" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Send verification code'}</button>
          </form>
        )}

        {phase === 'code' && (
          <form onSubmit={verify} noValidate>
            <h1>Enter the code</h1>
            <p>Verification code sent to: {destination || destinationFor()}</p>
            <label className="field">
              <span>6-digit code</span>
              <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} aria-invalid={!!error} />
            </label>
            <p className="muted">{resendIn > 0 ? `Resend code in ${resendIn}s` : <button type="button" className="btn btn--text" onClick={() => sendCode(undefined, true)}>Resend code</button>}</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="row-actions">
              <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Verify code'}</button>
              <button className="btn btn--text" type="button" onClick={() => { setPhase('phone'); setError(''); }}>Change number</button>
            </div>
          </form>
        )}

        {phase === 'profile' && (
          <form onSubmit={create} noValidate>
            <h1>{newNumber && intent === 'login' ? 'Create your sanctuary' : 'Your birth chart'}</h1>
            <p>{newNumber && intent === 'login' ? `No sanctuary for this number yet. Registration includes ${WELCOME_CREDITS} complimentary credits. They do not expire. This account stays in this browser.` : `Registration includes ${WELCOME_CREDITS} complimentary credits. They do not expire. This account stays in this browser.`}</p>
            <BirthForm idPrefix="signup" draft={draft} errors={fieldErrors} onChange={(next) => { setDraft(next); setFieldErrors({}); }} showRelationship={false} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn--primary btn--lg" type="submit" disabled={busy}>{busy ? 'Setting up your profile…' : 'Continue'}</button>
          </form>
        )}

        {phase === 'welcome' && (
          <div className="stack">
            <h1>Welcome, {draft.name.trim().split(' ')[0] || 'seeker'}</h1>
            <p>Your planetary dasha timeline is being prepared…</p>
            <p>{WELCOME_CREDITS} complimentary credits are on this placeholder account. Credits never expire. Private to this browser · no ephemeris was called.</p>
            {previewWaiting && (
              <label className="check">
                <input type="checkbox" checked={keepPreview} onChange={(event) => setKeepPreview(event.target.checked)} />
                Keep your preview question in {draft.name.trim().split(' ')[0] || 'this'}&apos;s thread?
              </label>
            )}
            <div className="row-actions">
              <button type="button" className="btn btn--primary" onClick={enter}>Enter sanctuary</button>
              <button type="button" className="btn btn--ghost" onClick={() => setPhase('btr')}>Birth time rectification</button>
            </div>
          </div>
        )}

        {phase === 'returning' && (
          <div className="stack">
            <h1>Welcome back</h1>
            <p>Welcome back — this number already has a sanctuary.</p>
            <button type="button" className="btn btn--primary" onClick={() => navigate(nextPath())}>Enter sanctuary</button>
          </div>
        )}

        {phase === 'btr' && (
          <RectifyView profile={active} onDone={enter} />
        )}
      </main>
      <ToastRegion />
    </div>
  );
}
