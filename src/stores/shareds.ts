import { create } from 'zustand';
import type { Shared } from '@actions/shareds/types';

interface SharedsState {
  shareds: {
    data: Shared[];
    loading: boolean;
  };
  setShareds: (data: Shared[]) => void;
  removeShared: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const useSharedsStore = create<SharedsState>((set) => ({
  shareds: {
    data: [],
    loading: false,
  },
  setShareds: (data) =>
    set((state) => ({
      shareds: { ...state.shareds, data },
    })),
  removeShared: (id) =>
    set((state) => ({
      shareds: {
        ...state.shareds,
        data: state.shareds.data.filter((shared) => shared._id !== id),
      },
    })),
  setLoading: (loading) =>
    set((state) => ({
      shareds: { ...state.shareds, loading },
    })),
}));

export default useSharedsStore;