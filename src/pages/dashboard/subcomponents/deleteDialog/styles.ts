import { DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 2, 3),
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px', 
  color: theme.palette.text.secondary 
}));

export const ConfirmButton = styled(Button)({
  borderRadius: '8px'
});