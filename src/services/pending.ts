/** Birth details captured on the landing search, kept in this browser only. */

const KEY = 'dasha-astro.pending.v1';

export interface PendingBirth {
  date: string;
  time: string;
  unknownTime: boolean;
  place: string;
  question: string;
}

export function savePending(value: PendingBirth) {
  sessionStorage.setItem(KEY, JSON.stringify(value));
}

export function readPending(): PendingBirth | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingBirth;
    if (!parsed || typeof parsed.date !== 'string' || typeof parsed.place !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPending() {
  sessionStorage.removeItem(KEY);
}
