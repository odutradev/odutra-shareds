import { create } from 'zustand';
import { presentationsStoreDefaultValues } from './defaultValues';
import type { PresentationsStore } from './types';
import type { Presentation } from '@actions/presentations/types';

const usePresentationsStore = create<PresentationsStore>((set) => ({
  presentations: presentationsStoreDefaultValues,

  setPresentations: (presentations: Presentation[]) =>
    set((state) => ({
      presentations: { ...state.presentations, presentations: presentations || [] },
    })),

  addPresentation: (presentation: Presentation) =>
    set((state) => {

      if (!presentation || !presentation._id) {
        console.warn('Tentativa de adicionar apresentação inválida ao store:', presentation);
        return state;
      }

      return {
        presentations: {
          ...state.presentations,
          presentations: [presentation, ...state.presentations.presentations],
        },
      };
    }),

  updatePresentationInStore: (presentation: Presentation) =>
    set((state) => {
      if (!presentation || !presentation._id) return state;

      return {
        presentations: {
          ...state.presentations,
          presentations: state.presentations.presentations.map((p) =>
            p._id === presentation._id ? presentation : p
          ),
          selectedPresentation:
            state.presentations.selectedPresentation?._id === presentation._id
              ? presentation
              : state.presentations.selectedPresentation,
        },
      };
    }),

  removePresentation: (_id: string) =>
    set((state) => ({
      presentations: {
        ...state.presentations,
        presentations: state.presentations.presentations.filter((p) => p._id !== _id),
        selectedPresentation:
          state.presentations.selectedPresentation?._id === _id
            ? null
            : state.presentations.selectedPresentation,
      },
    })),

  setSelectedPresentation: (presentation: Presentation | null) =>
    set((state) => ({
      presentations: { ...state.presentations, selectedPresentation: presentation },
    })),

  setLoading: (loading: boolean) =>
    set((state) => ({
      presentations: { ...state.presentations, loading },
    })),

  reset: () => set({ presentations: presentationsStoreDefaultValues }),
}));

export default usePresentationsStore;