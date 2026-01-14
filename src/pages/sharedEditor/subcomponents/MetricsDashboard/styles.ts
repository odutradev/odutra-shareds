import { Box, Paper, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

export const DashboardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr 1fr 1fr' },
  [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
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
    '&.total': { backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main },
    '&.time': { backgroundColor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main },
    '&.view': { backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main },
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