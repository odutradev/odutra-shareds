import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HomeContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
}));

export const Logo = styled('img')({
  height: 60,
  marginBottom: 16,
  alignSelf: 'center',
});