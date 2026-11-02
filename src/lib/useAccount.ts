import { useSyncExternalStore } from 'react';
import { auth } from '../services';

export function useAccount() {
  return useSyncExternalStore(auth.subscribe, auth.getAccount, () => null);
}
