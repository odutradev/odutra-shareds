import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SHARED_CACHE_TTL, sharedCacheDefaultValues } from './defaultValues';
import storage from './storage';

import type { SharedCacheState } from './types';

const useSharedCache = create<SharedCacheState>()(
  persist(
    (set) => ({
      ...sharedCacheDefaultValues,
      setShared: (slug, shared) =>
        set((state) => ({
          data: {
            ...state.data,
            [slug]: { shared, timestamp: Date.now() },
          },
        })),
      cleanExpired: () =>
        set((state) => {
          const now = Date.now();
          const newData = { ...state.data };
          let hasChanges = false;
          Object.keys(newData).forEach((key) => {
            if (now - newData[key].timestamp > SHARED_CACHE_TTL) {
              delete newData[key];
              hasChanges = true;
            }
          });
          return hasChanges ? { data: newData } : state;
        }),
    }),
    {
      name: 'shared-content-storage',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.cleanExpired();
      },
    }
  )
);

export default useSharedCache;