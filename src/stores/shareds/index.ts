import { create } from 'zustand';

import type { SharedsStore } from './types';

const useSharedsStore = create<SharedsStore>((set) => ({
  data: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setShareds: (data) => set({ data }),
  removeShared: (id) => set((state) => ({
    data: state.data.filter((item) => item._id !== id)
  })),
  updateShared: (shared) => set((state) => ({
    data: state.data.map((item) => (item._id === shared._id ? shared : item))
  })),
  addShared: (shared) => set((state) => ({
    data: [shared, ...state.data]
  })),
}));

export default useSharedsStore;