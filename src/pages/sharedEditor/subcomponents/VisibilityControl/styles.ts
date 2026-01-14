import { Box, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

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
      '& + .MuiSwitch-track': { backgroundColor: '#4caf50', opacity: 1, border: 0 },
    },
  },
  '& .MuiSwitch-thumb': { boxSizing: 'border-box', width: 28, height: 28 },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], { duration: 500 }),
  },
}));