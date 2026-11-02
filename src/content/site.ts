/**
 * All product copy below is taken verbatim (or lightly condensed) from
 * https://www.dashaastro.com (fetched 2 Nov 2026). Do not add features,
 * claims, counts or testimonials that are not present on that site.
 */
export const DASHA_ORIGIN = 'https://www.dashaastro.com';
export const LOGIN_URL = `${DASHA_ORIGIN}/login`;

export interface NavLink { label: string; href: string }
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#top' },
  { label: 'Dasha', href: '#dasha' },
  { label: 'Reports', href: '#tools' },
  { label: 'Learn', href: '#how' },
  { label: 'About', href: '#why' },
];

export const HERO = {
  eyebrow: 'Time reveals everything',
  headline: 'Discover Your Dasha',
  sub: 'Unlock the timeline of your life.',
  // site: "Answers your questions directly from your birth chart ... to give you clear, dated timelines."
  support:
    'Dasha analyzes your exact Kundali across Parashari, Jaimini, and KP traditions with Swiss Ephemeris precision to give you clear, dated timelines.',
  traditions: 'Parashari · Jaimini · KP Astrology',
  sidereal: 'Chitrapaksha / Lahiri Ayanamsha',
};

/** The nine Vedic Navagrahas (Sanskrit names as used on dashaastro.com where present). */
export const NAVAGRAHAS = ['Shani', 'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Rahu', 'Ketu'];

/** Suggested questions — the site's own "Try asking" chips. */
export const QUESTION_CHIPS = [
  'When is my next career promotion window?',
  'What does my current Mahadasha indicate?',
  'Saturn Sade Sati timing & impact',
];

export const INTRO = {
  label: 'Folio I · Jyotish Ganita',
  headline: ['The Power of', 'Vimshottari Dasha'],
  body: [
    'No generic Sun-sign horoscopes. Every consultation computes exact sidereal longitudes (Chitrapaksha / Lahiri Ayanamsha) and cross-examines Parashari Vimshottari Dasha, Jaimini Chara Dasha, and KP Nakshatra sub-lords.',
    'Dasha calculates your exact ascendant (Lagna) down to the degree, evaluating Parashari Mahadasha / Antardasha, Jaimini sign periods, and KP sub-lords to deliver dated, personalized windows.',
  ],
  points: [
    { icon: 'clock', label: 'Exact Timing', text: 'Dated transit & dasha peaks.' },
    { icon: 'layers', label: 'Three Traditions', text: 'See where Parashari, Jaimini, and KP agree.' },
    { icon: 'orbit', label: 'Ephemeris Precision', text: 'Swiss Ephemeris (Astrodienst, based on JPL DE ephemerides).' },
    { icon: 'users', label: 'Whole Family', text: 'Save multiple birth charts.' },
  ],
} as const;

export interface Tool { title: string; tag: string; text: string; glyph: 'rings' | 'nested' | 'chara' | 'cusp' | 'varga' | 'btr' }
export const TOOLS: Tool[] = [
  { title: 'Vimshottari Dasha', tag: 'Parashari · BPHS', glyph: 'rings',
    text: 'Your running Mahadasha and Antardasha, computed from your exact birth coordinates, with dated periods.' },
  { title: 'Pratyantar Windows', tag: 'Sub-periods', glyph: 'nested',
    text: 'Drill into the pratyantar sub-window inside a Mahadasha – Antardasha period to find the strongest stretch.' },
  { title: 'Jaimini Chara Dasha', tag: 'Jaimini Upadesha Sutras', glyph: 'chara',
    text: 'Sign-based Chara Dasha periods read with Arudha Lagna and karakas. Jaimini times to the month.' },
  { title: 'KP Sub-Lord Timing', tag: 'Krishnamurti Padhdhati', glyph: 'cusp',
    text: 'Cuspal sub-lord verification of the houses a period signifies, used to confirm or refine timing.' },
  { title: 'Divisional Varga Charts', tag: 'D1 · D9 · D10', glyph: 'varga',
    text: 'Swiss Ephemeris computes sidereal longitudes, divisional Varga charts (D1, D9, D10), and dasha balances.' },
  { title: 'Birth Time Rectification', tag: 'BTR Suite', glyph: 'btr',
    text: 'Uncertain of your birth minute? Tattva Shodhana, Kunda, and D9 Navamsha boundary calibration lock your true Lagna.' },
];

export const STEPS = [
  { n: 'I', title: 'Ask Your Question', text: 'Type or speak in English, Hindi, Tamil, Telugu, Kannada, Gujarati, or Marathi. Ask about career timing, marriage windows, finances, or children.' },
  { n: 'II', title: 'Enter Birth Coordinates', text: 'Provide date, time, and birthplace once. The Swiss Ephemeris engine computes sidereal longitudes, Varga charts, and dasha balances.' },
  { n: 'III', title: 'Receive Dated Clarity', text: 'Read a clear, scannable synthesis showing where Parashari, Jaimini, and KP agree — with exact date windows and classical context.' },
];

export const WHY = [
  { icon: 'layers', title: 'Three Vedic Traditions', text: 'Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Krishnamurti Padhdhati evaluated independently and synthesized to surface convergence.' },
  { icon: 'orbit', title: 'Swiss Ephemeris Precision', text: 'High-precision sidereal longitudes, speeds, and stationary transitions using the Chitrapaksha (Lahiri) Ayanamsha.' },
  { icon: 'languages', title: 'Speak or Type, 7 Languages', text: 'English, Hindi, Tamil, Telugu, Kannada, Gujarati, and Marathi — typed or by voice dictation.' },
  { icon: 'shield', title: 'Strict Privacy & Zero Ads', text: 'Your birth coordinates and inquiries remain private to your vault. No sale of personal data, no third-party ads.' },
] as const;

export const CREDITS_NOTE = 'Zero monthly subscriptions. Credits never expire. Receive 10 complimentary credits upon registration.';

export const CTA = {
  label: 'Your timeline awaits',
  headline: ['Explore your Dasha.', 'Read your time.'],
  body: 'Ask in plain language — Dasha computes your sidereal ephemeris and reconciles three classical traditions in seconds.',
  primary: 'Begin Consultation — First Reading Free',
  secondary: 'Log in to your sanctuary',
};

export const FOOTER_COPY = '© 2026 Dasha Astro. Classical timelines synthesized with mathematical precision.';
