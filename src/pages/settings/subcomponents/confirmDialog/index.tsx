import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import type { SettingsConfirmDialogProps } from './types';

const SettingsConfirmDialog = ({ open, config, onClose }: SettingsConfirmDialogProps) => {
  const isRestore = config?.title?.includes('Restaurar') ?? false;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '16px', padding: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{config?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{config?.message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Cancelar
        </Button>
        <Button
          onClick={config?.action}
          variant="contained"
          color={isRestore ? 'primary' : 'error'}
          disableElevation
          sx={{ borderRadius: '8px' }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsConfirmDialog;