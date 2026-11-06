import type { ChatEntry } from '../services/types';

const KEY = 'dasha-astro.guest-threads.v1';

export function readGuestThreads(): Record<string, ChatEntry[]> {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ChatEntry[]>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function writeGuestThreads(threads: Record<string, ChatEntry[]>) {
  sessionStorage.setItem(KEY, JSON.stringify(threads));
}

export function guestHasQuestion() {
  return Object.values(readGuestThreads()).some((entries) => entries.some((entry) => entry.role === 'user'));
}
