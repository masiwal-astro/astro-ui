import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CREDIT_EXPLAINER, CREDIT_PACKS, CREDITS_NOTE, WELCOME_CREDITS } from '../../content/site';
import { ledger, type Account } from '../../services';
import { PlaceholderNote } from '../Marks';

export function CreditsView({ account, highlight }: { account: Account | null; highlight: string | null }) {
  const [pending, setPending] = useState<string | null>(null);
  const [receipt, setReceipt] = useState('');
  const [error, setError] = useState('');

  const run = async (id: 'starter' | 'pro' | 'family' | 'checkin') => {
    setError('');
    setPending(id);
    try {
      const result = id === 'checkin' ? await ledger.checkIn() : await ledger.purchase(id);
      setReceipt(result.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The ledger could not be updated.');
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="stack">
      <div className="panel-head">
        <div>
          <p className="label">Sanctuary balance</p>
          <h2>{account ? `${account.credits} credits` : 'Credits'}</h2>
        </div>
      </div>
      <p>{CREDITS_NOTE} New registration in this preview adds {WELCOME_CREDITS} credits on the local account. 1 credit = 1 in-depth multi-tradition consultation on the live service. Asking here does not spend a credit.</p>
      {!account && (
        <>
          <PlaceholderNote>Purchases are a local ledger with no payment. Sign in before adding a pack.</PlaceholderNote>
          <Link className="btn btn--primary" to="/signup">Begin free</Link>
        </>
      )}
      <div className="price-grid price-grid--compact">
        {CREDIT_PACKS.map((pack) => (
          <article key={pack.id} className={pack.featured || highlight === pack.id ? 'price-card is-featured' : 'price-card'}>
            <span className="label label--gold">{pack.tier}</span>
            <p className="price-amount"><span>₹</span>{pack.priceInr}</p>
            <p className="price-credits">{pack.credits} consultation credits</p>
            <p className="price-per">{pack.perReading}</p>
            <ul>{pack.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <button type="button" className={pack.featured ? 'btn btn--primary' : 'btn btn--ghost'} disabled={!account || pending !== null} onClick={() => run(pack.id)}>
              {pending === pack.id ? 'Adding…' : pack.cta}
            </button>
          </article>
        ))}
      </div>
      {account && (
        <button type="button" className="btn btn--ghost" disabled={pending !== null} onClick={() => run('checkin')}>
          {pending === 'checkin' ? 'Checking in…' : 'Daily check-in (+1)'}
        </button>
      )}
      <aside className="explainer">
        <h3>What does 1 credit include?</h3>
        <p>{CREDIT_EXPLAINER}</p>
      </aside>
      {receipt && <p className="notice" role="status">{receipt}</p>}
      {error && <p className="notice" role="alert">{error}</p>}
    </div>
  );
}
