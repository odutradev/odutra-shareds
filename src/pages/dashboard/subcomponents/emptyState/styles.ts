import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  border: `1px dashed ${theme.palette.divider}`,
  padding: theme.spacing(6),
  marginTop: theme.spacing(2),
}));

export const EmptyStateButton = styled(Button)(({ theme }) => ({
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