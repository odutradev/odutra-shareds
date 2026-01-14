export interface SettingsDataManagementProps {
  onBackup: () => void;
  onRestore: (file: File) => void;
  onClearViews: () => void;
  onClearTime: () => void;
}