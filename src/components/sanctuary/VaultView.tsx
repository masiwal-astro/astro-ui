import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BirthForm, emptyDraft, toProfileDraft, validateDraft, type BirthDraft } from '../BirthForm';
import { ExampleMark, PlaceholderNote } from '../Marks';
import { auth, type Account, type BirthProfile } from '../../services';
import { clearPending, readPending, type PendingBirth } from '../../services/pending';

function formatWhen(profile: BirthProfile) {
  const [year, month, day] = profile.date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = year ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : profile.date;
  const time = profile.timeUnknown || !profile.time ? 'time unknown' : profile.time;
  return `${date} · ${time} · ${profile.place}`;
}

function draftFromPending(pending: PendingBirth | null): BirthDraft {
  if (!pending) return emptyDraft();
  return emptyDraft({
    date: pending.date,
    time: pending.time,
    timeUnknown: pending.unknownTime,
    place: pending.place,
  });
}

export function VaultView({ account, profile, startOpen }: { account: Account | null; profile: BirthProfile | null; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const [draft, setDraft] = useState<BirthDraft>(() => draftFromPending(readPending()));
  const [errors, setErrors] = useState<Partial<Record<keyof BirthDraft, string>>>({});

  if (!account) {
    return (
      <div className="stack">
        <div className="panel-head"><div><p className="label">Family Vault</p><h2>Saved profiles</h2></div></div>
        <PlaceholderNote>The vault is stored on a placeholder account in this browser. Sign in to save charts for yourself, a spouse, children, parents, or a business partner.</PlaceholderNote>
        <p>The preview is showing the published fictional chart{profile ? ` (${profile.name})` : ''} so the chart and dasha screens have something honest to display.</p>
        <Link className="btn btn--primary" to="/signup">Begin free — 10 credits</Link>
      </div>
    );
  }

  const save = () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    auth.addProfile(toProfileDraft(draft));
    clearPending();
    setDraft(emptyDraft({ relationship: 'Spouse' }));
    setOpen(false);
  };

  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Family Vault</p>
          <h2>{account.profiles.length} saved {account.profiles.length === 1 ? 'chart' : 'charts'}</h2>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => setOpen((value) => !value)}>{open ? 'Close form' : 'Add family chart'}</button>
      </div>
      <ul className="vault-list">
        {account.profiles.map((item) => (
          <li key={item.id} className={item.id === account.activeProfileId ? 'is-active' : undefined}>
            <div>
              <strong>{item.name}</strong>
              {item.example && <ExampleMark />}
              <p>{item.relationship}{item.example ? '' : ` · ${item.gender}`} · {formatWhen(item)}</p>
              {item.example && <p className="muted">Fictional subject. Charts use only the birth facts printed on dashaastro.com.</p>}
            </div>
            <div className="row-actions">
              {item.id !== account.activeProfileId && <button type="button" className="btn btn--ghost" onClick={() => auth.setActiveProfile(item.id)}>Use chart</button>}
              <button type="button" className="btn btn--text" onClick={() => auth.removeProfile(item.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      {account.profiles.length === 0 && <p>No charts yet. Add the first birth details, or open the published example.</p>}
      {!account.profiles.some((item) => item.example) && (
        <button type="button" className="btn btn--ghost" onClick={() => auth.addExampleProfile()}>Open published example chart</button>
      )}
      {open && (
        <form className="vault-form" onSubmit={(event) => { event.preventDefault(); save(); }} noValidate>
          <h3>Birth details</h3>
          <BirthForm idPrefix="vault" draft={draft} errors={errors} onChange={(next) => { setDraft(next); setErrors({}); }} />
          <div className="row-actions">
            <button type="submit" className="btn btn--primary">Save chart</button>
            <button type="button" className="btn btn--text" onClick={() => setOpen(false)}>Cancel</button>
          </div>
          <PlaceholderNote>Saved only in this browser. Nothing is uploaded.</PlaceholderNote>
        </form>
      )}
    </div>
  );
}
