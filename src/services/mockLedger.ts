/**
 * PLACEHOLDER credit ledger. No payment is taken.
 * Balances live on the local account. Credits are stored without an expiry.
 * Replace with a LedgerService that creates a real checkout.
 */
import { CREDIT_PACKS, WELCOME_CREDITS } from '../content/site';
import { auth, replaceAccount } from './mockAuth';
import type { LedgerService } from './types';

const wait = (ms = 480) => new Promise((resolve) => window.setTimeout(resolve, ms));

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const ledger: LedgerService = {
  async purchase(packId) {
    const pack = CREDIT_PACKS.find((item) => item.id === packId);
    if (!pack) throw new Error('Unknown credit pack');
    await wait();
    const account = auth.getAccount();
    if (!account) throw new Error('Sign in required');
    const credits = account.credits + pack.credits;
    replaceAccount({ ...account, credits });
    return {
      credits,
      granted: pack.credits,
      note: `Placeholder ledger. No payment was taken for the ₹${pack.priceInr} ${pack.tier} pack. ${pack.credits} credits were added locally and do not expire. Registration still includes ${WELCOME_CREDITS} complimentary credits.`,
    };
  },

  async checkIn() {
    await wait(280);
    const account = auth.getAccount();
    if (!account) throw new Error('Sign in required');
    const stamp = today();
    if (account.lastCheckIn === stamp) {
      return {
        credits: account.credits,
        granted: 0,
        note: 'Already checked in on this device today. The live sanctuary offers +1 on check-in. This preview did not add another credit.',
      };
    }
    const credits = account.credits + 1;
    replaceAccount({ ...account, credits, lastCheckIn: stamp });
    return {
      credits,
      granted: 1,
      note: 'Placeholder check-in. +1 credit was added on this device, matching the sanctuary’s daily check-in. It is not a server balance, and it does not expire.',
    };
  },
};
