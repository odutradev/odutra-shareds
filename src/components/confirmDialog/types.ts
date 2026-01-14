export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'error' | 'warning' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}