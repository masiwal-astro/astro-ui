import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LANGUAGES, type LanguageCode } from '../../content/site';
import { ConfirmDialog, pushToast, ToastRegion } from '../Feedback';
import { useAccount } from '../../lib/useAccount';
import { readGuestThreads, writeGuestThreads } from '../../lib/guestThreads';
import { applyTheme, readTheme, type ThemeName } from '../../lib/theme';
import { auth, EXAMPLE_PROFILE, type BirthProfile, type ChatEntry } from '../../services';
import { formatDestination } from '../../services/mockAuth';
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
  const [guestThreads, setGuestThreads] = useState<Record<string, ChatEntry[]>>(readGuestThreads);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [banner, setBanner] = useState(() => sessionStorage.getItem('dasha-astro.banner') !== 'done');
  const [theme, setTheme] = useState<ThemeName>(readTheme);

  useEffect(() => {
    document.title = 'Sanctuary — Dasha Astro';
    if (sessionStorage.getItem('dasha-astro.banner') === 'done') setBanner(false);
    const mark = () => sessionStorage.setItem('dasha-astro.banner', 'done');
    window.addEventListener('pagehide', mark);
    return () => window.removeEventListener('pagehide', mark);
  }, []);

  useEffect(() => { writeGuestThreads(guestThreads); }, [guestThreads]);

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
          <div className="chart-menu">
            <button type="button" className="chart-menu-btn" aria-expanded={chartOpen} aria-haspopup="listbox" onClick={() => setChartOpen((value) => !value)}>
              {profile ? `${profile.name} · ${profile.relationship}` : 'No chart yet'}
            </button>
            {chartOpen && (
              <ul className="chart-menu-list" role="listbox" aria-label="Active chart">
                {account.profiles.length === 0 && <li className="chart-menu-empty">No chart yet</li>}
                {account.profiles.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={item.id === account.activeProfileId}
                      onClick={() => { auth.setActiveProfile(item.id); setChartOpen(false); }}
                    >
                      <span>{item.id === account.activeProfileId ? '✓' : ''}</span>
                      {item.name} · {item.relationship}{item.example ? ' · example' : ''}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="guest-pill">Preview · {EXAMPLE_PROFILE.name} · example data</p>
        )}
        {account && <button type="button" className="nav-signin credits-pill" onClick={() => open('credits')}>{account.credits} credits</button>}
        {account ? (
          <div className="account-menu">
            <button type="button" className="nav-signin" aria-expanded={menuOpen} aria-haspopup="menu" onClick={() => setMenuOpen((value) => !value)}>Account</button>
            {menuOpen && (
              <div className="account-panel" role="menu">
                <p className="label">This browser</p>
                <p>{formatDestination(account)}</p>
                <p className="form-hint">Number change is not connected in this preview. No SMS is sent.</p>
                <label className="field" htmlFor="account-lang">
                  <span>Default language</span>
                  <select id="account-lang" value={account.language ?? language} onChange={(event) => { const next = event.target.value as LanguageCode; auth.setPreferredLanguage(next); setLanguage(next); }}>
                    {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.native}</option>)}
                  </select>
                </label>
                <div className="row-actions" role="group" aria-label="Theme">
                  <button type="button" className="btn btn--ghost" aria-pressed={theme === 'dark'} onClick={() => { applyTheme('dark'); setTheme('dark'); }}>Dark</button>
                  <button type="button" className="btn btn--ghost" aria-pressed={theme === 'light'} onClick={() => { applyTheme('light'); setTheme('light'); }}>Light</button>
                </div>
                <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); open('credits'); }}>Credits</button>
                <button type="button" role="menuitem" onClick={() => { auth.signOut(); setMenuOpen(false); pushToast('Signed out. Example chart restored.'); }}>Sign out</button>
                <button type="button" className="danger-text" role="menuitem" onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}>Delete account</button>
              </div>
            )}
          </div>
        ) : <Link className="nav-signin" to="/login">Sign in</Link>}
      </header>
      {banner && <p className="preview-banner">Local preview. No ephemeris, SMS, or payment is connected. Published example data is marked.</p>}
      <div className="sanctuary-ribbon" role="region" aria-label="Active Dasha timeline">
        <DashaRibbon profile={profile} />
        <button type="button" className="btn btn--ghost" onClick={() => open('chart')}>View kundali</button>
      </div>
      <div className="sanctuary-body">
        <div className="sanctuary-rail-wrap">
          <nav className="sanctuary-rail" aria-label="Sanctuary">
            {PANELS.map((item) => (
              <button key={item.id} type="button" aria-current={panel === item.id ? 'page' : undefined} onClick={() => open(item.id)}>{item.label}</button>
            ))}
          </nav>
        </div>
        <div id="sanctuary-panel" className="sanctuary-panel" tabIndex={-1}>
          {panel === 'consult' && (
            <ConsultView
              profile={profile}
              signedIn={!!account}
              credits={account ? account.credits : null}
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
          {panel === 'chart' && <ChartView profile={profile} onEdit={account && profile ? () => navigate(`/app?panel=vault&edit=${profile.id}`) : undefined} />}
          {panel === 'dasha' && <DashaView profile={profile} />}
          {panel === 'vault' && <VaultView account={account} profile={profile} startOpen={params.get('prefill') === '1' || !!params.get('edit')} editId={params.get('edit')} />}
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
      <ToastRegion />
      {confirmDelete && account && (
        <ConfirmDialog
          title="Delete this sanctuary?"
          danger
          confirmLabel="Delete account"
          body={`This clears the placeholder account for ${formatDestination(account)} from this browser, including charts and credits. It does not contact a server.`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { auth.deleteAccount(); setConfirmDelete(false); pushToast('Account deleted from this browser.'); }}
        />
      )}
    </div>
  );
}
