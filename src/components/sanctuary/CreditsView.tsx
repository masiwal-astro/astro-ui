import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CREDIT_EXPLAINER, CREDIT_PACKS, CREDITS_NOTE, WELCOME_CREDITS } from '../../content/site';
import { ledger, type Account } from '../../services';
import { ConfirmDialog, pushToast } from '../Feedback';
import { PlaceholderNote } from '../Marks';

function todayStamp() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function CreditsView({ account, highlight }: { account: Account | null; highlight: string | null }) {
  const [pending, setPending] = useState<string | null>(null);
  const [receipt, setReceipt] = useState('');
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<'starter' | 'pro' | 'family' | null>(null);
  const pack = CREDIT_PACKS.find((item) => item.id === confirmId);
  const checkedIn = account?.lastCheckIn === todayStamp();

  const buy = async (id: 'starter' | 'pro' | 'family') => {
    setError('');
    setPending(id);
    setConfirmId(null);
    try {
      const result = await ledger.purchase(id);
      setReceipt(result.note);
      pushToast('Placeholder only. No payment was taken.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The ledger could not be updated.');
    } finally {
      setPending(null);
    }
  };

  const checkIn = async () => {
    setError('');
    setPending('checkin');
    try {
      const result = await ledger.checkIn();
      setReceipt(result.note);
      pushToast(result.granted > 0 ? "+1 credit for today's check-in" : result.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The ledger could not be updated.');
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="stack credits-panel">
      <div className="panel-head">
        <div>
          <p className="label">Sanctuary balance</p>
          <h2>{account ? (account.credits === 0 ? '0 credits — choose a pack' : `${account.credits} credits`) : 'Credits'}</h2>
        </div>
      </div>
      <PlaceholderNote>No payment is taken in this preview. Packs only change the balance stored in this browser.</PlaceholderNote>
      <p className="credits-lead">{CREDITS_NOTE}</p>
      <p className="credits-lead">New registration in this preview adds {WELCOME_CREDITS} credits on the local account. 1 credit = 1 in-depth multi-tradition consultation on the live service.</p>
      {!account && <Link className="btn btn--primary" to="/signup">Begin free</Link>}
      {account?.credits === 0 && <p className="notice">You have no credits left. Choose a pack below. This does not charge a card.</p>}
      <div className="price-grid price-grid--compact">
        {CREDIT_PACKS.map((item) => (
          <article key={item.id} className={item.featured || highlight === item.id ? 'price-card is-featured' : 'price-card'}>
            <span className="label label--gold">{item.tier}</span>
            <p className="price-amount"><span>₹</span>{item.priceInr}</p>
            <p className="price-credits">{item.credits} consultation credits</p>
            <p className="price-per">{item.perReading}</p>
            <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <button type="button" className={item.featured ? 'btn btn--primary' : 'btn btn--ghost'} disabled={!account || pending !== null} onClick={() => setConfirmId(item.id)}>
              {pending === item.id ? 'Adding…' : item.cta}
            </button>
          </article>
        ))}
      </div>
      {account && (
        <button type="button" className="btn btn--ghost" disabled={pending !== null || checkedIn} onClick={checkIn}>
          {checkedIn ? 'Checked in today' : pending === 'checkin' ? 'Checking in…' : 'Daily check-in (+1)'}
        </button>
      )}
      <aside className="explainer">
        <h3>What does 1 credit include?</h3>
        <p>{CREDIT_EXPLAINER}</p>
      </aside>
      {receipt && <p className="notice" role="status">{receipt}</p>}
      {error && <p className="notice" role="alert">{error}</p>}
      {pack && (
        <ConfirmDialog
          title={`Add the ${pack.tier} pack?`}
          confirmLabel="Add credits"
          body={`This is a preview. No payment will be taken for ₹${pack.priceInr}. ${pack.credits} credits will be added on this browser only.`}
          onCancel={() => setConfirmId(null)}
          onConfirm={() => buy(pack.id)}
        />
      )}
    </div>
  );
}
