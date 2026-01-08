import { Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(4),
}));

export const Logo = styled('img')({
  height: '12em',
  willChange: 'filter',
  transition: 'filter 300ms',
  '&:hover': {
    filter: 'drop-shadow(0 0 2em #646cffaa)',
  },
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: '3.2em',
  lineHeight: 1.1,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    fontSize: '2em',
  },
}));

export const ChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.9em',
  fontWeight: 500,
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));