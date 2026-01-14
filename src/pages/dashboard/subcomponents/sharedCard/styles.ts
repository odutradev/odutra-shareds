import { Card, CardActions, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

export const CardActionsContainer = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.secondary,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.secondary,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export const SlugLink = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  transition: 'color 0.2s',
  marginTop: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
})) as typeof Typography;