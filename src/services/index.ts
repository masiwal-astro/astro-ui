/**
 * Bindings the UI imports.
 * PLACEHOLDER implementations — swap these three exports to wire a real API
 * without changing screens. See AuthService, AstrologyService, and LedgerService.
 */
export { auth } from './mockAuth';
export { astrology } from './mockAstrology';
export { ledger } from './mockLedger';
export { EXAMPLE_PROFILE, EXAMPLE_PROFILE_ID, PUBLISHED_QUESTION } from './exampleData';
export type {
  Account,
  AstrologyService,
  AuthService,
  BirthProfile,
  ChartModel,
  ChatEntry,
  DashaModel,
  LedgerService,
  ProfileDraft,
  Varga,
} from './types';
