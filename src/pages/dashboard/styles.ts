import { Box, Container, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
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
export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
}));
export const TitleSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});
export const ActionSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));
export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  border: `1px dashed ${theme.palette.divider}`,
  padding: theme.spacing(6),
  marginTop: theme.spacing(2),
}));
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: theme.spacing(2.5),
}));

export const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '10px',
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const ThemeButton = HeaderIconButton;

export const CreateButton = styled(Button)(({ theme }) => ({
  height: '44px',
  padding: '0 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.primary.main}`,
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.dark,
  },
}));