import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { systemStoreDefaultValues } from "./defaultValues";
import { hashPin, generateSessionSignature, validateSessionSignature, MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from "@utils/functions/security";
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
        const { system } = get();
        
        if (system.lockoutUntil && Date.now() < system.lockoutUntil) return false;

        const correctPinHash = import.meta.env.VITE_PIN;
        const inputHash = await hashPin(pin);
        
        if (inputHash === correctPinHash) {
          const signature = generateSessionSignature(inputHash);
          set((state) => ({
            system: { 
              ...state.system, 
              isAuthenticated: true,
              sessionSignature: signature,
              loginAttempts: 0,
              lockoutUntil: null
            }
          }));
          return true;
        }

        const newAttempts = system.loginAttempts + 1;
        const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
        
        set((state) => ({
          system: {
            ...state.system,
            loginAttempts: newAttempts,
            lockoutUntil: shouldLock ? Date.now() + LOCKOUT_DURATION : null
          }
        }));

        return false;
      },
      logout: () => {
        set((state) => ({
          system: { 
            ...state.system, 
            isAuthenticated: false,
            sessionSignature: null 
          }
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
      partialize: (state) => ({
        system: {
          ...state.system,
          isAuthenticated: false,
          loading: false,
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isValid = validateSessionSignature(
            state.system.sessionSignature, 
            import.meta.env.VITE_PIN
          );
          state.system.isAuthenticated = isValid;
          if (!isValid) state.system.sessionSignature = null;
        }
      },
    }
  )
);

export default useSystemStore;