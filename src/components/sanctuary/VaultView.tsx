import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BirthForm, emptyDraft, toProfileDraft, validateDraft, type BirthDraft } from '../BirthForm';
import { ConfirmDialog, pushToast } from '../Feedback';
import { ExampleMark, PlaceholderNote } from '../Marks';
import { formatBirthLine } from '../../lib/formatBirth';
import { auth, type Account, type BirthProfile, type ChatEntry } from '../../services';
import { clearPending, readPending, type PendingBirth } from '../../services/pending';
import type { Relationship } from '../../content/site';

function draftFromProfile(profile: BirthProfile): BirthDraft {
  return emptyDraft({
    name: profile.name,
    relationship: profile.relationship,
    gender: profile.gender,
    date: profile.date,
    time: profile.time ?? '',
    timeUnknown: profile.timeUnknown,
    uncertaintyMinutes: profile.uncertaintyMinutes ?? 15,
    place: profile.place,
    language: profile.language,
  });
}

function draftFromPending(pending: PendingBirth | null, relationship: Relationship): BirthDraft {
  return emptyDraft({
    relationship,
    date: pending?.date ?? '',
    time: pending?.time ?? '',
    timeUnknown: pending?.unknownTime ?? false,
    place: pending?.place ?? '',
  });
}

function defaultRelationship(account: Account): Relationship {
  return account.profiles.some((profile) => profile.relationship === 'Self') ? 'Spouse' : 'Self';
}

export function VaultView({
  account,
  profile,
  startOpen,
  editId,
}: {
  account: Account | null;
  profile: BirthProfile | null;
  startOpen: boolean;
  editId?: string | null;
}) {
  const editing = account?.profiles.find((item) => item.id === editId) ?? null;
  const [open, setOpen] = useState(startOpen || !!editing);
  const [editingId, setEditingId] = useState<string | null>(editing?.id ?? null);
  const [draft, setDraft] = useState<BirthDraft>(() => editing ? draftFromProfile(editing) : draftFromPending(readPending(), account ? defaultRelationship(account) : 'Self'));
  const [errors, setErrors] = useState<Partial<Record<keyof BirthDraft, string>>>({});
  const [pendingRemove, setPendingRemove] = useState<BirthProfile | null>(null);

  const beginAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft({ relationship: account ? defaultRelationship(account) : 'Self' }));
    setErrors({});
    setOpen(true);
  };

  const beginEdit = (item: BirthProfile) => {
    setEditingId(item.id);
    setDraft(draftFromProfile(item));
    setErrors({});
    setOpen(true);
  };

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

  const selfCount = account.profiles.filter((item) => item.relationship === 'Self' && item.id !== editingId).length;
  const anotherSelf = draft.relationship === 'Self' && selfCount > 0;

  const save = () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const next = toProfileDraft(draft);
    if (editingId) {
      auth.updateProfile(editingId, next);
      pushToast(`Updated ${next.name}.`);
    } else {
      const created = auth.addProfile(next);
      pushToast(`Now viewing ${created.name} (${created.relationship}).`);
    }
    clearPending();
    setDraft(emptyDraft({ relationship: defaultRelationship(auth.getAccount() ?? account) }));
    setEditingId(null);
    setOpen(false);
  };

  const removeNow = (item: BirthProfile) => {
    const wasActive = account.activeProfileId === item.id;
    const thread: ChatEntry[] = account.threads[item.id] ?? [];
    auth.removeProfile(item.id);
    setPendingRemove(null);
    pushToast(`${item.name} removed.`, {
      ms: 8000,
      actionLabel: 'Undo',
      onAction: () => auth.restoreProfile(item, thread, wasActive),
    });
  };

  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Family Vault</p>
          <h2>{account.profiles.length} saved {account.profiles.length === 1 ? 'chart' : 'charts'}</h2>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => (open ? setOpen(false) : beginAdd())}>{open ? 'Close form' : 'Add family chart'}</button>
      </div>
      <ul className="vault-list">
        {account.profiles.map((item) => (
          <li key={item.id} className={item.id === account.activeProfileId ? 'is-active' : undefined}>
            <div>
              <strong>{item.name}</strong>
              {item.example && <ExampleMark />}
              <p>{item.relationship}{item.example ? '' : ` · ${item.gender}`} · {formatBirthLine(item)}</p>
              {item.example && <p className="muted">Fictional subject. Charts use only the birth facts printed on dashaastro.com.</p>}
            </div>
            <div className="row-actions">
              {item.id !== account.activeProfileId && <button type="button" className="btn btn--primary" onClick={() => auth.setActiveProfile(item.id)}>Use chart</button>}
              <button type="button" className="btn btn--ghost" onClick={() => beginEdit(item)}>Edit details</button>
              <button type="button" className="btn btn--text btn--quiet" onClick={() => setPendingRemove(item)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      {account.profiles.length === 0 && <p>No charts yet. Add the first birth details, or open the published example.</p>}
      {!account.profiles.some((item) => item.example) && (
        <button type="button" className="btn btn--ghost" onClick={() => { auth.addExampleProfile(); pushToast('Now viewing Aarav Verma (example).'); }}>Open published example chart</button>
      )}
      {open && (
        <form className="vault-form" onSubmit={(event) => { event.preventDefault(); save(); }} noValidate>
          <h3>{editingId ? 'Edit details' : 'Birth details'}</h3>
          <BirthForm idPrefix="vault" draft={draft} errors={errors} onChange={(next) => { setDraft(next); setErrors({}); }} />
          {anotherSelf && <p className="form-hint">Another chart marked as you.</p>}
          <div className="form-dock">
            <button type="submit" className="btn btn--primary">Save chart</button>
            <button type="button" className="btn btn--text" onClick={() => { setOpen(false); setEditingId(null); }}>Cancel</button>
          </div>
          <PlaceholderNote>Saved only in this browser. Nothing is uploaded.</PlaceholderNote>
        </form>
      )}
      {pendingRemove && (
        <ConfirmDialog
          title={`Remove ${pendingRemove.name}?`}
          danger
          confirmLabel="Remove chart"
          onCancel={() => setPendingRemove(null)}
          onConfirm={() => removeNow(pendingRemove)}
          body={`${account.profiles.length === 1 ? 'This is your only chart. Your sanctuary will be empty until you add another. ' : ''}This deletes this chart and its Consult questions (${(account.threads[pendingRemove.id] ?? []).filter((entry) => entry.role === 'user').length} saved). This cannot be undone from here.`}
        />
      )}
    </div>
  );
}
