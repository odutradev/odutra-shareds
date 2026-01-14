import type { DialogConfig } from '../../types';

export interface SettingsConfirmDialogProps {
  open: boolean;
  config: DialogConfig | null;
  onClose: () => void;
}