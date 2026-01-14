import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { StyledDialogActions, ActionButton } from './styles';

import type { ConfirmDialogProps } from './types';

const ConfirmDialog = ({ open, title = 'Confirmar Ação', message = 'Tem certeza que deseja prosseguir?', confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'primary', onConfirm,  onClose }: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '16px', padding: 1, minWidth: '320px', maxWidth: '480px' },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <ActionButton onClick={onClose} color="inherit" variant="text">
          {cancelText}
        </ActionButton>
        <ActionButton
          onClick={onConfirm}
          color={variant === 'error' ? 'error' : variant as any}
          variant="contained"
          autoFocus
        >
          {confirmText}
        </ActionButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;