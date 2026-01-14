export interface DeleteConfirmationDialogProps {
  open: boolean;
  itemName?: string;
  onClose: () => void;
  onConfirm: () => void;
}