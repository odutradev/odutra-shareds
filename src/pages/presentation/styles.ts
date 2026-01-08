import { Box, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PresentationContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const StyledAppBar = styled(AppBar)({
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: 'divider',
});

export const StyledToolbar = styled(Toolbar)({
  minHeight: '48px !important',
  paddingLeft: '16px !important',
  paddingRight: '16px !important',
});

export const ContentFrame = styled('iframe')({
  flexGrow: 1,
  border: 'none',
  width: '100%',
  backgroundColor: '#fff',
});

export const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  padding: theme.spacing(4),
}));
