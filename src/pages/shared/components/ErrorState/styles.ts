import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
}));