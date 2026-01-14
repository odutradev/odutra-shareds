import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const EditorToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
}));

export const ToggleButton = styled(Button, { shouldForwardProp: (p) => p !== 'active' })<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  border: 'none',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  transition: 'all 0.2s ease',
}));

export const EditorLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));