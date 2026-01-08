import { Box, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

export const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(12),
  maxWidth: '1400px !important',
}));

export const EmptyState = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  textAlign: 'center',
});

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(10),
  right: theme.spacing(4),
  width: '56px',
  height: '56px',
  minWidth: '56px',
  borderRadius: '50%',
  boxShadow: theme.shadows[8],
  zIndex: 1000,
  '&:hover': {
    boxShadow: theme.shadows[12],
  },
}));

export const Footer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: 'transparent',
  opacity: 0.6,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
}));

export const ThemeToggle = styled('button')(({ theme }) => ({
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));
