import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Shared } from '@actions/shareds/types';

export const CACHE_TTL = 60000;

interface CacheEntry {
  shared: Shared;
  timestamp: number;
}

interface SharedCacheState {
  data: Record<string, CacheEntry>;
  setShared: (slug: string, shared: Shared) => void;
}

const useSharedCache = create<SharedCacheState>()(
  persist(
    (set) => ({
      data: {},
      setShared: (slug, shared) =>
        set((state) => {
          try {
            return {
              data: {
                ...state.data,
                [slug]: { shared, timestamp: Date.now() },
              },
            };
          } catch {
            return state;
          }
        }),
    }),
    {
      name: 'shared-content-cache',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSharedCache;
