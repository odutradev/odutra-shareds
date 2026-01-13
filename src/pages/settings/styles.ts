import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SettingsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(8),
  maxWidth: '1000px !important',
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

export const MetricsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(5),
}));

export const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.08)',
  },
}));

export const ActionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(3),
}));

export const ActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
    paddingBottom: 0,
  },
  '&:first-of-type': {
    paddingTop: 0,
  },
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