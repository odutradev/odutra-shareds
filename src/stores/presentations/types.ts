import type { Presentation } from '@actions/presentations/types';

export interface PresentationsStoreData {
  presentations: Presentation[];
  selectedPresentation: Presentation | null;
  loading: boolean;
}

export interface PresentationsStore {
  presentations: PresentationsStoreData;
  setPresentations: (presentations: Presentation[]) => void;
  addPresentation: (presentation: Presentation) => void;
  updatePresentationInStore: (presentation: Presentation) => void;
  removePresentation: (_id: string) => void;
  setSelectedPresentation: (presentation: Presentation | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}
