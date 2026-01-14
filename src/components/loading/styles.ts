import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  width: '100%',
  height: '100%',
  minHeight: '200px',
}));

export const Spinner = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  border: `3px solid ${theme.palette.action.hover}`,
  borderTop: `3px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
}));

export const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  minWidth: '120px',
  textAlign: 'center',
}));