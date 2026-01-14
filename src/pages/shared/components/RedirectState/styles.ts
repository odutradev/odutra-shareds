import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)({
  alignItems: 'center',
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
});

export const ContentBox = styled(Box)(({ theme }) => ({
  maxWidth: 500,
  padding: theme.spacing(4),
  textAlign: 'center',
}));

export const UrlBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  fontFamily: 'monospace',
  gap: theme.spacing(1),
  justifyContent: 'center',
  padding: theme.spacing(2),
}));