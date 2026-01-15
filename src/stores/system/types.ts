export type ThemeMode = "light" | "dark";

export interface SystemStoreData {
  theme: ThemeMode;
  loading: boolean;
  checkUserTheme: boolean;
  defaultUserTheme: ThemeMode | null;
  count: number;
  isAuthenticated: boolean;
  sessionToken: string | null;
}

export interface SystemStore {
  system: SystemStoreData;
  setSystem: (system: SystemStoreData) => void;
  updateSystem: (partialSystem: Partial<SystemStoreData>) => void;
  setLoading: (currentLoading?: boolean) => void;
  setCount: (count: number) => void;
  initializeTheme: () => void;
  toggleTheme: () => void;
  reset: () => void;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}