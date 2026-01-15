import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { systemStoreDefaultValues } from "./defaultValues";
import { hashPin } from "@utils/functions/security";
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
      toggleTheme: () => {
        set((state) => ({
          system: {
            ...state.system,
            theme: state.system.theme === 'light' ? 'dark' : 'light'
          }
        }));
      },
      login: async (pin: string) => {
        const correctPinHash = import.meta.env.VITE_PIN;
        const inputHash = await hashPin(pin);
        
        if (inputHash === correctPinHash) {
            set((state) => ({
                system: { ...state.system, isAuthenticated: true }
            }));
            return true;
        }
        return false;
      },
      logout: () => {
        set((state) => ({
            system: { ...state.system, isAuthenticated: false }
        }));
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