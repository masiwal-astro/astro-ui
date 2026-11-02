/**
 * Service interfaces for a real Dasha Astro backend.
 *
 * PLACEHOLDER: the app ships with in-browser mocks in `mockAuth.ts`,
 * `mockAstrology.ts`, and `mockLedger.ts`. Swap the bindings in `index.ts`
 * for clients that call your API. These types are the contract.
 *
 * The astrology methods must not be treated as a calculation engine.
 * The mock returns either a published fictional example or an explicit notice
 * that nothing was computed.
 */
import type { Gender, LanguageCode, Relationship } from '../content/site';

export type Varga = 'D1' | 'D9' | 'D10';
export type ChartStyle = 'north' | 'south';
export type Uncertainty = 15 | 30 | 60;

export interface BirthProfile {
  id: string;
  name: string;
  relationship: Relationship;
  gender: Gender;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** HH:MM, or null when the minute is unknown */
  time: string | null;
  timeUnknown: boolean;
  uncertaintyMinutes: Uncertainty | null;
  place: string;
  language: LanguageCode;
  /** True only for the published fictional illustration. */
  example: boolean;
}

export interface ProfileDraft {
  name: string;
  relationship: Relationship;
  gender: Gender;
  date: string;
  time: string | null;
  timeUnknown: boolean;
  uncertaintyMinutes: Uncertainty | null;
  place: string;
  language: LanguageCode;
}

export interface PhoneInput {
  dialCode: string;
  nationalNumber: string;
}

export type ChatEntry =
  | { id: string; role: 'user'; text: string; createdAt: string; language: LanguageCode }
  | {
      id: string;
      role: 'assistant';
      kind: 'notice' | 'published-example';
      title: string;
      body: string;
      createdAt: string;
    };

export interface Account {
  phoneE164: string;
  dialCode: string;
  nationalNumber: string;
  /** Local placeholder balance. Credits do not expire. */
  credits: number;
  /** YYYY-MM-DD of the last simulated daily check-in. */
  lastCheckIn: string | null;
  profiles: BirthProfile[];
  activeProfileId: string | null;
  threads: Record<string, ChatEntry[]>;
  createdAt: string;
  /** Always true in this build. A real account service would omit it. */
  placeholder: true;
}

export interface AuthService {
  requestCode(input: PhoneInput): Promise<{ destination: string }>;
  verifyCode(input: PhoneInput & { code: string }): Promise<{ status: 'existing' | 'new' }>;
  completeSignup(profile: ProfileDraft): Promise<Account>;
  signOut(): void;
  getAccount(): Account | null;
  subscribe(listener: () => void): () => void;
  addProfile(draft: ProfileDraft): BirthProfile;
  /** Inserts the published fictional sample, if it is not already in the vault. */
  addExampleProfile(): void;
  removeProfile(id: string): void;
  setActiveProfile(id: string): void;
  updateProfile(id: string, patch: Partial<Pick<BirthProfile, 'timeUnknown' | 'uncertaintyMinutes' | 'language'>>): void;
  appendMessage(profileId: string, message: ChatEntry): void;
}

export interface GrahaMark {
  name: string;
  short: string;
  /** Published detail, or null when the sample does not include it. */
  detail: string | null;
}

export interface ChartHouse {
  house: number;
  /** Sign name for D1 when lagna is known. Null when the varga was not computed. */
  sign: string | null;
  grahas: GrahaMark[];
  lagna: boolean;
}

export interface ChartModel {
  varga: Varga;
  example: boolean;
  lagnaLabel: string | null;
  ayanamsha: string | null;
  houses: ChartHouse[];
  /** Fixed South-Indian sign cells. Grahas only where published. */
  signs: { sign: string; grahas: GrahaMark[]; lagna: boolean }[];
  notice: string;
}

export interface DashaNode {
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantar';
  lord: string;
  start: string | null;
  end: string | null;
  /** ISO bounds when the published text gives them; otherwise null. */
  startIso: string | null;
  endIso: string | null;
  note: string;
  children: DashaNode[];
}

export interface DashaModel {
  example: boolean;
  available: boolean;
  summary: string;
  tree: DashaNode | null;
  notice: string;
}

export interface ConsultReply {
  kind: 'notice' | 'published-example';
  title: string;
  body: string;
}

export interface RectifyInput {
  profileId: string;
  uncertaintyMinutes: Uncertainty;
  milestones: { event: string; year: string }[];
}

export interface RectifyResult {
  changed: false;
  headline: string;
  detail: string;
}

export interface AstrologyService {
  chart(profile: BirthProfile, varga: Varga): ChartModel;
  dasha(profile: BirthProfile): DashaModel;
  consult(input: { profile: BirthProfile; question: string; language: LanguageCode }): ConsultReply;
  rectify(input: RectifyInput): RectifyResult;
}

export interface LedgerReceipt {
  credits: number;
  granted: number;
  note: string;
}

export interface LedgerService {
  purchase(packId: 'starter' | 'pro' | 'family'): Promise<LedgerReceipt>;
  checkIn(): Promise<LedgerReceipt>;
}
