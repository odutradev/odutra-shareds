import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { systemStoreDefaultValues } from "./defaultValues";
import { SystemStore } from "./types";

const useSystemStore = create<SystemStore>()(
  persist(
    (set, get) => ({
      system: systemStoreDefaultValues,
      setSystem: (system) => set({ system }),
      updateSystem: (partialSystem) =>
        set((state) => ({
          system: { ...state.system, ...partialSystem },
        })),
      setLoading: (currentLoading?: boolean) =>
        set((state) => ({
          system: { ...state.system, loading: currentLoading ?? !state.system.loading },
        })),
      setCount: (count: number) =>
        set((state) => ({
          system: { ...state.system, count },
        })),
      initializeTheme: () => {
        const { system } = get();
        if (!system.checkUserTheme) {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = isDark ? 'dark' : 'light';
          set((state) => ({
            system: { ...state.system, theme, defaultUserTheme: theme, checkUserTheme: true }
          }));
        }
      },
      reset: () => {
        set({ system: systemStoreDefaultValues });
        localStorage.removeItem("system-store");
      },
    }),
    {
      name: "system-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSystemStore;