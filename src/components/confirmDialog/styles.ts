import { Button, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3, 3),
  gap: theme.spacing(1),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  minWidth: '100px',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));