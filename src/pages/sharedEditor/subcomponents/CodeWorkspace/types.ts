import type { EditorTab } from '../../types';

export interface CodeWorkspaceProps {
  html: string;
  css: string;
  js: string;
  activeEditor: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  onCodeChange: (tab: EditorTab, value: string) => void;
}