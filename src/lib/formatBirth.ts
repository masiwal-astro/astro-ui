import type { BirthProfile } from '../services/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatBirthLine(profile: BirthProfile) {
  const [year, month, day] = profile.date.split('-');
  const date = year ? `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}` : profile.date;
  const time = profile.timeUnknown || !profile.time ? 'time unknown' : profile.time;
  return `${date} · ${time} · ${profile.place}`;
}
