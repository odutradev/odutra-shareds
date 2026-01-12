import { Box, Button, Switch, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EditorContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  maxWidth: '1600px !important',
}));

export const EditorPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

export const Header = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

export const ContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const EditorToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
}));

export const ToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  border: 'none',
  backgroundColor: active
    ? theme.palette.primary.main
    : 'transparent',
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)',
  },
  transition: 'all 0.2s ease',
}));

export const EditorLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

export const StatusToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
}));

export const StatusSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#4caf50',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 28,
    height: 28,
  },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const DashboardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',

  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',

  '& .icon-wrapper': {
    width: 40,
    height: 40,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.view': {
      backgroundColor: 'rgba(136, 132, 216, 0.1)',
      color: '#8884d8',
    },
    '&.time': {
      backgroundColor: 'rgba(130, 202, 157, 0.1)',
      color: '#82ca9d',
    },
    '&.total': {
      backgroundColor: 'rgba(255, 128, 66, 0.1)',
      color: '#ff8042',
    }
  }
}));

export const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  lineHeight: 1.2,
}));

export const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

export const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 250,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',

  gridColumn: '1 / -1',
}));