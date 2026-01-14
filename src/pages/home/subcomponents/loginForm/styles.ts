import { Box, Paper, styled } from '@mui/material';

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

export const PinContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginTop: theme.spacing(1),
}));

export const PinInput = styled('input')(({ theme }) => ({
  width: '100%',
  maxWidth: '48px',
  height: '56px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.action.disabled}`,
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'monospace',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
    transform: 'translateY(-2px)',
  },
  '&.error': {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    animation: 'shake 0.4s ease-in-out',
  },
  '@keyframes shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-4px)' },
    '75%': { transform: 'translateX(4px)' },
  },
}));