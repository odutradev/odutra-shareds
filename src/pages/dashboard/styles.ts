import { Box, AppBar, Toolbar, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledAppBar = styled(AppBar)({
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: 'divider',
});

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

export const ContentContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));
