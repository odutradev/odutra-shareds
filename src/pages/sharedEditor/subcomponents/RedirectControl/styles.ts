import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';

export const RedirectContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease',
}));

export const HeaderWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasMargin'
})<{ hasMargin?: boolean }>(({ theme, hasMargin }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: hasMargin ? theme.spacing(3) : 0,
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : theme.palette.action.hover,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const InfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));