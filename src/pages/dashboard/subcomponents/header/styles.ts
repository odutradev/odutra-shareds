import { Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '10px',
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const CreateButton = styled(Button)(({ theme }) => ({
  height: '44px',
  padding: '0 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.primary.main}`,
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.dark,
  },
}));