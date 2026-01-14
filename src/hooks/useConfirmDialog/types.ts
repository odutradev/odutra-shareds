import type { ConfirmDialogProps } from '@components/confirmDialog/types';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'error' | 'warning' | 'info';
}

export interface UseConfirmDialogReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  props: ConfirmDialogProps;
}