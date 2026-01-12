import { Box, Button, Switch, Container, Paper } from '@mui/material';
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

export const StatusSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== 'checked',
})<{ checked: boolean }>(({ theme, checked }) => ({
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
        backgroundColor: checked ? '#4caf50' : theme.palette.error.main,
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