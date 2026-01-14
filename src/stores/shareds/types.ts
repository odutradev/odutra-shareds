import type { Shared } from '@actions/shareds/types';

export interface SharedsState {
  data: Shared[];
  loading: boolean;
}

export interface SharedsActions {
  setLoading: (loading: boolean) => void;
  setShareds: (data: Shared[]) => void;
  removeShared: (id: string) => void;
  updateShared: (shared: Shared) => void;
  addShared: (shared: Shared) => void;
}

export type SharedsStore = SharedsState & SharedsActions;