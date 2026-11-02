/**
 * Published illustrative chart from dashaastro.com.
 * Fictional subject. These strings are the site's own sample, not a calculation
 * performed here and not a reading of any real person.
 */
import type { BirthProfile, DashaNode } from './types';

export const EXAMPLE_PROFILE_ID = 'example-aarav-verma';

export const EXAMPLE_DISCLAIMER =
  'Illustrative sample chart · fictional subject (Aarav Verma), as published on dashaastro.com. Example data. Not a reading of your chart, and not computed by this preview.';

export const EXAMPLE_PROFILE: BirthProfile = {
  id: EXAMPLE_PROFILE_ID,
  name: 'Aarav Verma',
  relationship: 'Self',
  gender: 'Male',
  date: '1988-11-18',
  time: '12:00',
  timeUnknown: false,
  uncertaintyMinutes: null,
  place: 'New Delhi',
  language: 'en',
  example: true,
};

export const EXAMPLE_BIRTH_LINE = '18 Nov 1988 · 12:00 IST · New Delhi (28°37′N, 77°13′E) · Makara Lagna (15°58′)';

export const EXAMPLE_AYANAMSHA = 'Lahiri 23°42′06″';

export const EXAMPLE_LAGNA = '15°58′ Makara';

/** Only grahas the live sample actually prints. Others stay empty on purpose. */
export const EXAMPLE_GRAHAS: { name: string; short: string; sign: string | null; detail: string | null }[] = [
  { name: 'Surya', short: 'Su', sign: 'Vrischika', detail: '02°26′ Vrischika' },
  { name: 'Chandra', short: 'Mo', sign: 'Kumbha', detail: '20°23′ Kumbha (Purva Bhadrapada)' },
  { name: 'Mangala', short: 'Ma', sign: null, detail: null },
  { name: 'Budha', short: 'Me', sign: 'Tula', detail: '24°55′ Tula' },
  { name: 'Guru', short: 'Ju', sign: null, detail: null },
  { name: 'Shukra', short: 'Ve', sign: 'Kanya', detail: '29°47′ Kanya' },
  { name: 'Shani', short: 'Sa', sign: null, detail: null },
  { name: 'Rahu', short: 'Ra', sign: null, detail: null },
  { name: 'Ketu', short: 'Ke', sign: null, detail: null },
];

export const EXAMPLE_DASHA_SUMMARY = 'Vimshottari: Mercury MD · Venus AD (Oct 2026 – Aug 2029)';

export const EXAMPLE_DASHA: DashaNode = {
  level: 'Mahadasha',
  lord: 'Mercury',
  start: null,
  end: null,
  startIso: null,
  endIso: null,
  note: 'The published example names Mercury as the running Mahadasha. It does not print the full Mahadasha start and end, so those bounds are left blank.',
  children: [
    {
      level: 'Antardasha',
      lord: 'Venus',
      start: 'Oct 2026',
      end: 'Aug 2029',
      startIso: '2026-10-01',
      endIso: '2029-08-31',
      note: 'Mercury Mahadasha – Venus Antardasha, as printed on the sample. The bar uses that month range only.',
      children: [
        {
          level: 'Pratyantar',
          lord: 'Venus',
          start: '24 Oct 2026',
          end: '15 Apr 2027',
          startIso: '2026-10-24',
          endIso: '2027-04-15',
          note: 'The sample calls the Venus pratyantar (Oct 2026 – Apr 2027) the strongest sub-window, and dates the illustrated career window 24 Oct 2026 – 15 Apr 2027.',
          children: [],
        },
      ],
    },
  ],
};

export const PUBLISHED_QUESTION =
  'I am evaluating an executive leadership transition or independent advisory mandate over the coming year. When is my strongest window, and do all three traditions concur?';

export const PUBLISHED_READING = {
  title: 'Primary Career Elevation & Mandate Window',
  support: '3/3 support the period',
  window: 'Oct 24, 2026 – Apr 15, 2027',
  parashari:
    'You are running Mercury Mahadasha – Venus Antardasha (Oct 2026 – Aug 2029). For Makara lagna, Mercury rules the 9th (and 6th) and sits in the 10th, while Venus, the yogakaraka (lord of the 5th and 10th), sits in the 9th. The 9th and 10th lords have exchanged signs, a Dharma-Karmadhipati link, and both dasha lords are its two partners. The Venus pratyantar (Oct 2026 – Apr 2027) is the strongest sub-window for a career move.',
  jaimini:
    'Jaimini places you in Simha Chara Dasha, the sign that is both your Rajya Pada (A10) and the 10th from your Arudha Lagna, and it casts rashi drishti on your Amatyakaraka Mercury in the 10th house. That marks 2026–27 as a period of professional visibility. Jaimini times to the month and supports the period, not a specific start date.',
  kp:
    'At the stated 12:00 birth time, your 10th cusp sub-lord Mars signifies houses 2 (income), 10 (career) and 11 (gains), with the 1st adding a self-directed, independent flavour. Venus bhukti carries the same 2–10–11 link, so KP supports the move, best suited to a leadership or advisory role rather than salaried service, with the strongest stretch through early March 2027.',
  guidance:
    'Prioritize leadership or independent advisory mandate discussions during the shared Mercury–Venus–Venus window from late October 2026 through early March 2027, where Parashari, Jaimini, and KP all support the period.',
};
