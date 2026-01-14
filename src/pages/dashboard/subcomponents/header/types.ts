export interface DashboardHeaderProps {
  theme: 'light' | 'dark';
  showCreateButton: boolean;
  onToggleTheme: () => void;
  onSettings: () => void;
  onCreate: () => void;
}