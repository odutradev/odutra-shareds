import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

export const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '8rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  opacity: 0.8,
}));

export const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontSize: '6rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '4rem',
  },
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  maxWidth: '500px',
}));

export const HomeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
}));