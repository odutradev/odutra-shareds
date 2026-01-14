import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { StyledDialogActions, CancelButton, ConfirmButton } from './styles';

import type { DeleteConfirmationDialogProps } from './types';

const DeleteConfirmationDialog = ({  open, itemName, onClose, onConfirm }: DeleteConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '16px', padding: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Excluir compartilhamento?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você está prestes a excluir "<strong>{itemName}</strong>".
          Esta ação é irreversível e todos os dados de estatísticas serão perdidos.
        </DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <CancelButton onClick={onClose}>
          Cancelar
        </CancelButton>
        <ConfirmButton
          onClick={onConfirm}
          color="error"
          variant="contained"
          disableElevation
        >
          Excluir
        </ConfirmButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
