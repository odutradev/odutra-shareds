import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Button } from '@mui/material';

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const DangerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.error.main}`,
  backgroundColor: theme.palette.background.paper,
}));

export const DangerRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

export const DangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  '&:hover': {
    borderColor: theme.palette.error.dark,
    backgroundColor: theme.palette.error.light + '20',
  },
}));