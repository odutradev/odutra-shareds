import type { Dispatch, SetStateAction } from 'react';

import type { SharedAnalytics } from '@actions/analytics/types';
import type { CreateSharedData } from '@actions/shareds/types';

export type EditorTab = 'html' | 'css' | 'js';

export interface SharedEditorState {
  formData: CreateSharedData;
  sharedId: string | null;
  slugError: string;
  loading: boolean;
  initialLoading: boolean;
  checkingSlug: boolean;
  activeEditor: EditorTab;
  stats: SharedAnalytics | null;
  loadingStats: boolean;
}

export interface SharedEditorActions {
  setFormData: Dispatch<SetStateAction<CreateSharedData>>;
  handleSlugChange: (value: string) => void;
  generateRandomSlug: () => void;
  handleSubmit: () => Promise<void>;
  setActiveEditor: (tab: EditorTab) => void;
  refreshStats: () => void;
}
