import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

export const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(8),
  maxWidth: '1400px !important',
}));