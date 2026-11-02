import { GENDERS, LANGUAGES, RELATIONSHIPS, type Gender, type LanguageCode, type Relationship } from '../content/site';
import type { ProfileDraft, Uncertainty } from '../services/types';

export interface BirthDraft {
  name: string;
  relationship: Relationship;
  gender: Gender | '';
  date: string;
  time: string;
  timeUnknown: boolean;
  uncertaintyMinutes: Uncertainty;
  place: string;
  language: LanguageCode;
}

export function emptyDraft(partial?: Partial<BirthDraft>): BirthDraft {
  return {
    name: '',
    relationship: 'Self',
    gender: '',
    date: '',
    time: '',
    timeUnknown: false,
    uncertaintyMinutes: 15,
    place: '',
    language: 'en',
    ...partial,
  };
}

export function validateDraft(draft: BirthDraft) {
  const errors: Partial<Record<keyof BirthDraft, string>> = {};
  const today = new Date().toISOString().slice(0, 10);
  if (draft.name.trim().length < 2) errors.name = 'Enter the name for this chart.';
  if (!draft.gender) errors.gender = 'Select a gender. It is used for karakas.';
  if (!draft.date) errors.date = 'Enter the date of birth.';
  else if (draft.date > today) errors.date = 'Date of birth cannot be in the future.';
  if (!draft.timeUnknown && !draft.time) errors.time = 'Enter a time, or mark it as unknown.';
  else if (!draft.timeUnknown && !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)) errors.time = 'Use 24-hour time as HH:MM, for example 06:15.';
  if (draft.place.trim().length < 2) errors.place = 'Enter the birthplace (city).';
  return errors;
}

export function toProfileDraft(draft: BirthDraft): ProfileDraft {
  return {
    name: draft.name.trim(),
    relationship: draft.relationship,
    gender: draft.gender as Gender,
    date: draft.date,
    time: draft.timeUnknown ? null : draft.time,
    timeUnknown: draft.timeUnknown,
    uncertaintyMinutes: draft.timeUnknown ? draft.uncertaintyMinutes : null,
    place: draft.place.trim(),
    language: draft.language,
  };
}

export function BirthForm({
  draft,
  errors,
  onChange,
  idPrefix,
  showRelationship = true,
}: {
  draft: BirthDraft;
  errors: Partial<Record<keyof BirthDraft, string>>;
  onChange: (next: BirthDraft) => void;
  idPrefix: string;
  showRelationship?: boolean;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const set = <K extends keyof BirthDraft>(key: K, value: BirthDraft[K]) => onChange({ ...draft, [key]: value });
  return (
    <div className="form-grid">
      <label className="field" htmlFor={`${idPrefix}-name`}>
        <span>Full name</span>
        <input id={`${idPrefix}-name`} autoComplete="name" value={draft.name} onChange={(event) => set('name', event.target.value)} aria-invalid={!!errors.name} />
        {errors.name && <em role="alert">{errors.name}</em>}
      </label>
      {showRelationship && (
        <label className="field" htmlFor={`${idPrefix}-rel`}>
          <span>Relationship</span>
          <select id={`${idPrefix}-rel`} value={draft.relationship} onChange={(event) => set('relationship', event.target.value as Relationship)}>
            {RELATIONSHIPS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      )}
      <label className="field" htmlFor={`${idPrefix}-gender`}>
        <span>Gender (for karaka)</span>
        <select id={`${idPrefix}-gender`} value={draft.gender} onChange={(event) => set('gender', event.target.value as Gender | '')} aria-invalid={!!errors.gender}>
          <option value="">Select</option>
          {GENDERS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {errors.gender && <em role="alert">{errors.gender}</em>}
      </label>
      <label className="field" htmlFor={`${idPrefix}-date`}>
        <span>Date of birth</span>
        <input id={`${idPrefix}-date`} type="date" max={today} autoComplete="bday" value={draft.date} onChange={(event) => set('date', event.target.value)} aria-invalid={!!errors.date} />
        {errors.date && <em role="alert">{errors.date}</em>}
      </label>
      <label className="field" htmlFor={`${idPrefix}-time`}>
        <span>Time of birth</span>
        <input id={`${idPrefix}-time`} type="text" inputMode="numeric" placeholder="HH:MM" autoComplete="off" value={draft.time} disabled={draft.timeUnknown} onChange={(event) => set('time', event.target.value)} aria-invalid={!!errors.time} />
        <span className="check"><input type="checkbox" checked={draft.timeUnknown} onChange={(event) => set('timeUnknown', event.target.checked)} /> Not sure of exact birth time</span>
        {errors.time && <em role="alert">{errors.time}</em>}
      </label>
      {draft.timeUnknown && (
        <label className="field" htmlFor={`${idPrefix}-window`}>
          <span>Approximate uncertainty</span>
          <select id={`${idPrefix}-window`} value={draft.uncertaintyMinutes} onChange={(event) => set('uncertaintyMinutes', Number(event.target.value) as Uncertainty)}>
            <option value={15}>±15 mins (Standard)</option>
            <option value={30}>±30 mins (Half-hour)</option>
            <option value={60}>±60 mins (Hour window)</option>
          </select>
        </label>
      )}
      <label className="field field--wide" htmlFor={`${idPrefix}-place`}>
        <span>City / place of birth</span>
        <input id={`${idPrefix}-place`} autoComplete="address-level2" placeholder="City, country" value={draft.place} onChange={(event) => set('place', event.target.value)} aria-invalid={!!errors.place} />
        <i>Place lookup is not connected. Type the city.</i>
        {errors.place && <em role="alert">{errors.place}</em>}
      </label>
      <label className="field field--wide" htmlFor={`${idPrefix}-lang`}>
        <span>Preferred language</span>
        <select id={`${idPrefix}-lang`} value={draft.language} onChange={(event) => set('language', event.target.value as LanguageCode)}>
          {LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.native} ({language.label})</option>)}
        </select>
      </label>
    </div>
  );
}
