import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

export const SettingsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export const Content = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(8),
  maxWidth: '1000px !important',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));