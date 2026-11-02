/**
 * PLACEHOLDER auth. No SMS is sent. Any 6-digit code is accepted.
 * Accounts live in localStorage under `dasha-astro.accounts.v1`.
 * Replace this module with an AuthService that calls your API.
 */
import { WELCOME_CREDITS } from '../content/site';
import { EXAMPLE_PROFILE, EXAMPLE_PROFILE_ID } from './exampleData';
import type { Account, AuthService, BirthProfile, ChatEntry, PhoneInput } from './types';

const ACCOUNTS = 'dasha-astro.accounts.v1';
const SESSION = 'dasha-astro.session.v1';

const wait = (ms = 420) => new Promise((resolve) => window.setTimeout(resolve, ms));

function phoneE164(input: PhoneInput) {
  return `${input.dialCode}${input.nationalNumber}`;
}

function emptyStore(): Record<string, Account> {
  return {};
}

function readStore(): Record<string, Account> {
  if (typeof localStorage === 'undefined') return emptyStore();
  try {
    const raw = localStorage.getItem(ACCOUNTS);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Record<string, Account>;
    return parsed && typeof parsed === 'object' ? parsed : emptyStore();
  } catch {
    return emptyStore();
  }
}

let accounts = readStore();
let sessionPhone = typeof localStorage === 'undefined' ? null : localStorage.getItem(SESSION);
let current: Account | null = sessionPhone ? accounts[sessionPhone] ?? null : null;
let verifiedPhone: PhoneInput | null = null;
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(ACCOUNTS, JSON.stringify(accounts));
  if (current) localStorage.setItem(SESSION, current.phoneE164);
  else localStorage.removeItem(SESSION);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next: Account | null) {
  current = next;
  if (next) accounts = { ...accounts, [next.phoneE164]: next };
  persist();
  emit();
}

function requireAccount(): Account {
  if (!current) throw new Error('Sign in required');
  return current;
}

function uid(prefix: string) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

export function validatePhone(input: PhoneInput): string | null {
  const digits = input.nationalNumber.replace(/\D/g, '');
  if (digits !== input.nationalNumber) return 'Use digits only, without spaces.';
  if (input.dialCode === '+91') {
    if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a 10-digit Indian mobile number.';
    return null;
  }
  if (digits.length < 6 || digits.length > 14) return 'Enter the mobile number without the country code.';
  return null;
}

export function formatDestination(input: PhoneInput) {
  const n = input.nationalNumber;
  if (input.dialCode === '+91' && n.length === 10) return `${input.dialCode} ${n.slice(0, 5)} ${n.slice(5)}`;
  return `${input.dialCode} ${n}`;
}

const auth: AuthService = {
  async requestCode(input) {
    const error = validatePhone(input);
    if (error) throw new Error(error);
    await wait();
    return { destination: formatDestination(input) };
  },

  async verifyCode(input) {
    const error = validatePhone(input);
    if (error) throw new Error(error);
    if (!/^\d{6}$/.test(input.code)) throw new Error('Enter the 6-digit code.');
    await wait(520);
    verifiedPhone = { dialCode: input.dialCode, nationalNumber: input.nationalNumber };
    const id = phoneE164(input);
    if (accounts[id]) {
      commit(accounts[id]);
      return { status: 'existing' as const };
    }
    return { status: 'new' as const };
  },

  async completeSignup(profile) {
    if (!verifiedPhone) throw new Error('Verify the mobile number first.');
    const id = phoneE164(verifiedPhone);
    if (accounts[id]) {
      commit(accounts[id]);
      return accounts[id];
    }
    await wait(640);
    const birth: BirthProfile = { ...profile, id: uid('profile'), example: false };
    const account: Account = {
      phoneE164: id,
      dialCode: verifiedPhone.dialCode,
      nationalNumber: verifiedPhone.nationalNumber,
      credits: WELCOME_CREDITS,
      lastCheckIn: null,
      profiles: [birth],
      activeProfileId: birth.id,
      threads: {},
      createdAt: new Date().toISOString(),
      placeholder: true,
    };
    accounts = { ...accounts, [id]: account };
    verifiedPhone = null;
    commit(account);
    return account;
  },

  signOut() {
    verifiedPhone = null;
    current = null;
    persist();
    emit();
  },

  getAccount() {
    return current;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  addProfile(draft) {
    const account = requireAccount();
    const birth: BirthProfile = { ...draft, id: uid('profile'), example: false };
    commit({
      ...account,
      profiles: [...account.profiles, birth],
      activeProfileId: birth.id,
    });
    return birth;
  },

  addExampleProfile() {
    const account = requireAccount();
    const existing = account.profiles.find((profile) => profile.id === EXAMPLE_PROFILE_ID || profile.example);
    if (existing) {
      commit({ ...account, activeProfileId: existing.id });
      return;
    }
    commit({
      ...account,
      profiles: [...account.profiles, EXAMPLE_PROFILE],
      activeProfileId: EXAMPLE_PROFILE.id,
    });
  },

  removeProfile(id) {
    const account = requireAccount();
    const profiles = account.profiles.filter((profile) => profile.id !== id);
    const threads = { ...account.threads };
    delete threads[id];
    const activeProfileId = account.activeProfileId === id ? profiles[0]?.id ?? null : account.activeProfileId;
    commit({ ...account, profiles, threads, activeProfileId });
  },

  setActiveProfile(id) {
    const account = requireAccount();
    if (!account.profiles.some((profile) => profile.id === id)) return;
    commit({ ...account, activeProfileId: id });
  },

  updateProfile(id, patch) {
    const account = requireAccount();
    commit({
      ...account,
      profiles: account.profiles.map((profile) => (profile.id === id ? { ...profile, ...patch } : profile)),
    });
  },

  appendMessage(profileId, message: ChatEntry) {
    const account = requireAccount();
    const existing = account.threads[profileId] ?? [];
    commit({ ...account, threads: { ...account.threads, [profileId]: [...existing, message] } });
  },
};

export function replaceAccount(next: Account) {
  commit(next);
}

export { auth };
