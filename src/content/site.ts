/**
 * Product copy is taken from https://www.dashaastro.com (fetched 2 Nov 2026),
 * including the published fictional sample chart. Do not add claims, counts,
 * testimonials, or predictions that are not on that site.
 */
export const DASHA_ORIGIN = 'https://www.dashaastro.com';

export interface NavLink { label: string; href: string }
export const NAV_LINKS: NavLink[] = [
  { label: 'Dasha', href: '#dasha' },
  { label: 'Sample', href: '#sample' },
  { label: 'Reports', href: '#tools' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO = {
  eyebrow: 'Time reveals everything',
  headline: 'Discover Your Dasha',
  sub: 'Unlock the timeline of your life.',
  support:
    'Dasha analyzes your exact Kundali across Parashari, Jaimini, and KP traditions with Swiss Ephemeris precision to give you clear, dated timelines.',
  traditions: 'Parashari · Jaimini · KP Astrology',
  sidereal: 'Chitrapaksha / Lahiri Ayanamsha',
};

/** The nine Vedic Navagrahas. */
export const NAVAGRAHAS = ['Shani', 'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Rahu', 'Ketu'];

export const FEATURES = [
  { title: '7 Languages', text: 'Hindi, Tamil, English & more' },
  { title: 'Whole Family', text: 'Save multiple birth charts' },
  { title: 'Speak or Type', text: 'Ask queries naturally' },
  { title: 'Exact Timing', text: 'Dated transit & dasha peaks' },
] as const;

/** Suggested questions — the site's own "Try asking" chips, with the prompts it submits. */
export const QUESTION_CHIPS: { label: string; prompt: string }[] = [
  { label: 'When is my next career promotion window?', prompt: 'When is my next career promotion window?' },
  { label: 'What does my current Mahadasha indicate?', prompt: 'Analyze my current Mahadasha balance and favorable periods' },
  { label: 'Saturn Sade Sati timing & impact', prompt: 'What does my Saturn Sade Sati status look like?' },
];

/** Topic chips from the signed-in sanctuary zero state. */
export const SANCTUARY_TOPICS: { label: string; hint: string; prompt: string }[] = [
  { label: 'Career & Promotion Window', hint: '10th house dasha timing, Sun–Saturn aspects & mobility', prompt: 'What does my chart indicate about career and promotion timing?' },
  { label: 'Marriage & Union Timing', hint: '7th lord activations, Venus transits & SBC vedha', prompt: 'What does my chart indicate about marriage and union timing?' },
  { label: 'Wealth & Financial Windows', hint: '2nd & 11th house lords, Jupiter transit & Dhana Yogas', prompt: 'What does my chart indicate about wealth and financial windows?' },
  { label: 'Vitality & Energy Periods', hint: '6th house transit indicators, Tara Bala & recovery', prompt: 'What does my chart indicate about vitality and energy periods?' },
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

export interface Tool { title: string; tag: string; text: string; glyph: 'rings' | 'nested' | 'chara' | 'cusp' | 'varga' | 'btr'; href: string }
export const TOOLS: Tool[] = [
  { title: 'Vimshottari Dasha', tag: 'Parashari · BPHS', glyph: 'rings', href: '/app?panel=dasha',
    text: 'Your running Mahadasha and Antardasha, computed from your exact birth coordinates, with dated periods.' },
  { title: 'Pratyantar Windows', tag: 'Sub-periods', glyph: 'nested', href: '/app?panel=dasha',
    text: 'Drill into the pratyantar sub-window inside a Mahadasha – Antardasha period to find the strongest stretch.' },
  { title: 'Jaimini Chara Dasha', tag: 'Jaimini Upadesha Sutras', glyph: 'chara', href: '/app?panel=traditions',
    text: 'Sign-based Chara Dasha periods read with Arudha Lagna and karakas. Jaimini times to the month.' },
  { title: 'KP Sub-Lord Timing', tag: 'Krishnamurti Padhdhati', glyph: 'cusp', href: '/app?panel=traditions',
    text: 'Cuspal sub-lord verification of the houses a period signifies, used to confirm or refine timing.' },
  { title: 'Divisional Varga Charts', tag: 'D1 · D9 · D10', glyph: 'varga', href: '/app?panel=chart',
    text: 'Swiss Ephemeris computes sidereal longitudes, divisional Varga charts (D1, D9, D10), and dasha balances.' },
  { title: 'Birth Time Rectification', tag: 'BTR Suite', glyph: 'btr', href: '/app?panel=rectify',
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

export const CREDIT_EXPLAINER = 'One credit covers a complete, multi-step consultation including Swiss Ephemeris transit generation, Parashari dasha calculations, Jaimini chara dasha analysis, KP sub-lord verification, and follow-up conversational clarifications within the thread.';

export interface CreditPack {
  id: 'starter' | 'pro' | 'family';
  tier: string;
  priceInr: number;
  credits: number;
  perReading: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    tier: 'Tier I · Starter',
    priceInr: 99,
    credits: 3,
    perReading: '₹33 per in-depth reading',
    features: ['Full 3-tradition Shastric synthesis', 'Dated transit & dasha window predictions', 'Never expires'],
    cta: 'Choose Starter',
    featured: false,
  },
  {
    id: 'pro',
    tier: 'Tier II · Pro Seeker',
    priceInr: 249,
    credits: 10,
    perReading: '₹25 per in-depth reading',
    features: ['Full 3-tradition Shastric synthesis', 'Dated transit & dasha window predictions', 'Voice dictation in 7 languages', 'Priority generation speed', 'Never expires'],
    cta: 'Choose Pro Seeker',
    featured: true,
  },
  {
    id: 'family',
    tier: 'Tier III · Family & Life',
    priceInr: 499,
    credits: 25,
    perReading: '₹20 per in-depth reading',
    features: ['Full 3-tradition Shastric synthesis', 'Multi-year transit forecasting', 'Birth Time Rectification (BTR) suite', 'Voice dictation in 7 languages', 'Never expires'],
    cta: 'Choose Family Pack',
    featured: false,
  },
];

export const WELCOME_CREDITS = 10;

export const FAQ = [
  {
    q: 'How is Dasha different from typical horoscope apps?',
    a: 'Typical horoscopes use 12 broad Sun signs. Dasha calculates your exact ascendant (Lagna) down to the degree and second based on your birth coordinates. It runs thousands of planetary ephemeris calculations, evaluating Parashari Mahadasha/Antardasha, Jaimini sign periods, and KP sub-lords to deliver dated, personalized windows tailored to you alone.',
  },
  {
    q: 'What if I do not know my exact birth minute?',
    a: 'An approximate window (within 15–30 minutes) still provides deep insight into your planetary transits and Mahadasha periods. If your Lagna or Navamsha is borderline, Dasha offers an interactive Birth Time Rectification (BTR) tool to calibrate your chart using major life events.',
  },
  {
    q: 'Which languages can I ask questions in?',
    a: 'Dasha natively understands and speaks English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), and Marathi (मराठी). You can both type and use voice dictation in your preferred language.',
  },
  {
    q: 'Do my purchased credits ever expire?',
    a: 'No. Your consultation credits never expire. Use them today, next week, or years from now across any family profile in your account.',
  },
  {
    q: 'Can I consult for family members or my spouse?',
    a: 'Yes! Dasha features a Family Vault. You can add multiple birth charts for your spouse, children, parents, or business partners, and switch between charts seamlessly with a single click.',
  },
] as const;

export const CTA = {
  label: 'Your timeline awaits',
  headline: ['Explore your Dasha.', 'Read your time.'],
  body: 'Ask your career, marriage, or life timing question. Sign in with your phone number to receive 10 complimentary consultation credits.',
  primary: 'Begin Consultation — First Reading Free',
  secondary: 'Log in to your sanctuary',
  guarantee: 'No credit card required · Instant setup in 30 seconds · Three-tradition Shastric synthesis',
};

export const FOOTER_COPY = '© 2026 Dasha Astro. Classical timelines synthesized with mathematical precision.';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', speech: 'en-IN', placeholder: 'Ask Dasha a timing question…' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', speech: 'hi-IN', placeholder: 'अपना समय संबंधी प्रश्न लिखें…' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', speech: 'ta-IN', placeholder: 'உங்கள் நேரக் கேள்வியை எழுதுங்கள்…' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', speech: 'te-IN', placeholder: 'మీ సమయ ప్రశ్నను రాయండి…' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', speech: 'kn-IN', placeholder: 'ನಿಮ್ಮ ಸಮಯದ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ…' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', speech: 'gu-IN', placeholder: 'તમારો સમયનો પ્રશ્ન લખો…' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', speech: 'mr-IN', placeholder: 'तुमचा वेळेचा प्रश्न लिहा…' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const DIAL_CODES = [
  { code: '+91', label: '+91 (IN)' },
  { code: '+1', label: '+1 (US)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+971', label: '+971 (UAE)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+61', label: '+61 (AU)' },
] as const;

export const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Parent', 'Business partner', 'Other'] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

export const GENDERS = ['Male', 'Female', 'Other'] as const;
export type Gender = (typeof GENDERS)[number];

export const TRADITIONS = [
  {
    id: 'parashari',
    badge: 'Parashari (Default Foundation)',
    method: 'Vimshottari Mahadasha/Antardasha cycles, planetary house lordships, and Graha Drishti aspects.',
    effect: 'Sets the primary multi-year timing window and active planetary rulers. Powers the top Dasha ribbon.',
  },
  {
    id: 'jaimini',
    badge: 'Jaimini Sutras',
    method: 'Sign-based Chara Dashas and dynamic Karakas (Atmakaraka = soul self, Amatyakaraka = career intellect).',
    effect: 'Acts as an objective second check from a sign perspective, validating whether life events manifest at the soul level.',
  },
  {
    id: 'kp',
    badge: 'KP Stellar System (Krishnamurti Paddhati)',
    method: 'Placidus unequal house cusps, Nakshatra star lords, and unequal 249 sub-lords.',
    effect: 'Pinpoints exact days and hours of event manifestation and answers definitive Yes/No questions via cuspal sub-lords.',
  },
] as const;
