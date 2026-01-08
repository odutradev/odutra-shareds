export type ThemeMode = "light" | "dark";

export interface SystemStoreData {
  theme: ThemeMode;
  loading: boolean;
  checkUserTheme: boolean;
  defaultUserTheme: ThemeMode | null;
  count: number;
}

export interface SystemStore {
  system: SystemStoreData;
  setSystem: (system: SystemStoreData) => void;
  updateSystem: (partialSystem: Partial<SystemStoreData>) => void;
  setLoading: (currentLoading?: boolean) => void;
  setCount: (count: number) => void;
  initializeTheme: () => void;
  reset: () => void;
}