import { styled } from '@mui/material/styles';
import { Box, Card, Typography } from '@mui/material';

export const MetricsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const MetricCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

export const IconWrapper = styled(Box)<{ color: 'primary' | 'secondary' | 'info' | 'success' }>(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '42px',
  height: '42px',
  borderRadius: '10px',
  marginRight: theme.spacing(1.5),
  backgroundColor: theme.palette[color].main + '20',
  color: theme.palette[color].main,
  flexShrink: 0,
  '& svg': {
    fontSize: '22px',
  },
}));

export const MetricLabel = styled(Typography)({
  fontWeight: 500,
  marginBottom: '2px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '0.75rem',
  letterSpacing: '0.01em',
});

export const MetricValue = styled(Typography)({
  fontWeight: 700,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '1.25rem',
});