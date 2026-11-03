import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LANGUAGES, type LanguageCode } from '../../content/site';
import { useAccount } from '../../lib/useAccount';
import { auth, EXAMPLE_PROFILE, type BirthProfile, type ChatEntry } from '../../services';
import { readPending } from '../../services/pending';
import { ChartView } from './ChartView';
import { ConsultView } from './ConsultView';
import { CreditsView } from './CreditsView';
import { DashaRibbon, DashaView } from './DashaView';
import { RectifyView } from './RectifyView';
import { TraditionsView } from './TraditionsView';
import { VaultView } from './VaultView';

const PANELS = [
  { id: 'consult', label: 'Consult' },
  { id: 'chart', label: 'Charts' },
  { id: 'dasha', label: 'Dasha' },
  { id: 'vault', label: 'Family Vault' },
  { id: 'rectify', label: 'Rectify' },
  { id: 'credits', label: 'Credits' },
  { id: 'traditions', label: 'Traditions' },
] as const;

type PanelId = (typeof PANELS)[number]['id'];

function isPanel(value: string | null): value is PanelId {
  return PANELS.some((panel) => panel.id === value);
}

export function SanctuaryShell() {
  const account = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requested = params.get('panel');
  const panel: PanelId = isPanel(requested) ? requested : 'consult';
  const profile: BirthProfile | null = account
    ? account.profiles.find((item) => item.id === account.activeProfileId) ?? null
    : EXAMPLE_PROFILE;
  const routedQuestion = (location.state as { question?: string } | null)?.question ?? '';
  const [draft, setDraft] = useState(() => routedQuestion || readPending()?.question || '');
  const [language, setLanguage] = useState<LanguageCode>(profile?.language ?? 'en');
  const [guestThreads, setGuestThreads] = useState<Record<string, ChatEntry[]>>({});

  useEffect(() => {
    document.title = 'Sanctuary — Dasha Astro';
  }, []);

  const profileId = profile?.id;
  const profileLanguage = profile?.language;
  useEffect(() => {
    if (profileLanguage) setLanguage(profileLanguage);
  }, [profileId, profileLanguage]);

  const open = (id: PanelId) => {
    const next = new URLSearchParams(params);
    next.set('panel', id);
    navigate(`/app?${next.toString()}`, { replace: true });
  };

  const messages = !profile ? [] : account ? account.threads[profile.id] ?? [] : guestThreads[profile.id] ?? [];
  const userCount = messages.filter((message) => message.role === 'user').length;
  const langLabel = LANGUAGES.find((item) => item.code === language)?.label ?? 'English';

  return (
    <div className="sanctuary">
      <a className="skip" href="#sanctuary-panel">Skip to sanctuary</a>
      <header className="sanctuary-top">
        <Link to="/" className="nav-brand">DASHA<span>·</span>ASTRO</Link>
        <p className="sanctuary-title">Sanctuary</p>
        {account ? (
          <label className="profile-select">
            <span className="sr-only">Active chart</span>
            <select value={account.activeProfileId ?? ''} aria-label="Active chart" onChange={(event) => auth.setActiveProfile(event.target.value)} disabled={account.profiles.length === 0}>
              {account.profiles.length === 0 && <option value="">No chart yet</option>}
              {account.profiles.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.relationship}{item.example ? ' · example' : ''}</option>)}
            </select>
          </label>
        ) : (
          <p className="guest-pill">Preview · {EXAMPLE_PROFILE.name} · example data</p>
        )}
        <button type="button" className="nav-signin" onClick={() => open('credits')}>{account ? `${account.credits} credits` : 'Credits'}</button>
        {account ? <button type="button" className="btn btn--text" onClick={() => auth.signOut()}>Sign out</button> : <Link className="nav-signin" to="/login">Sign in</Link>}
      </header>
      <p className="preview-banner">Local preview. No ephemeris, SMS, or payment is connected. Published example data is marked.</p>
      <div className="sanctuary-ribbon" role="region" aria-label="Active Dasha timeline">
        <DashaRibbon profile={profile} />
        <button type="button" className="btn btn--ghost" onClick={() => open('chart')}>View kundali</button>
      </div>
      <div className="sanctuary-body">
        <nav className="sanctuary-rail" aria-label="Sanctuary">
          {PANELS.map((item) => (
            <button key={item.id} type="button" aria-current={panel === item.id ? 'page' : undefined} onClick={() => open(item.id)}>{item.label}</button>
          ))}
        </nav>
        <div id="sanctuary-panel" className="sanctuary-panel" tabIndex={-1}>
          {panel === 'consult' && (
            <ConsultView
              profile={profile}
              signedIn={!!account}
              messages={messages}
              language={language}
              onLanguage={setLanguage}
              draft={draft}
              onDraft={setDraft}
              onGuestAppend={(entry) => {
                if (!profile) return;
                setGuestThreads((current) => ({ ...current, [profile.id]: [...(current[profile.id] ?? []), entry] }));
              }}
            />
          )}
          {panel === 'chart' && <ChartView profile={profile} />}
          {panel === 'dasha' && <DashaView profile={profile} />}
          {panel === 'vault' && <VaultView account={account} profile={profile} startOpen={params.get('prefill') === '1'} />}
          {panel === 'rectify' && <RectifyView profile={profile} />}
          {panel === 'credits' && <CreditsView account={account} highlight={params.get('pack')} />}
          {panel === 'traditions' && <TraditionsView />}
        </div>
      </div>
      <footer className="sanctuary-status">
        <span>Active chart: {profile ? `${profile.name}${profile.example ? ' (example)' : ''} · ${profile.relationship}` : 'None'}</span>
        <span>Responds in: {langLabel}</span>
        {account && <span>Credits: {account.credits}</span>}
        {account && <span>Questions: {userCount}</span>}
      </footer>
    </div>
  );
}
