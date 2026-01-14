import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sharedCacheDefaultValues } from './defaultValues';
import type { SharedCacheState } from './types';

const useSharedCache = create<SharedCacheState>()(
  persist(
    (set) => ({
      ...sharedCacheDefaultValues,
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
