import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { AccessTime, HourglassEmpty, Refresh, Timeline, Visibility } from '@mui/icons-material';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';

import { ChartContainer, DashboardGrid, MetricCard, MetricLabel, MetricValue } from './styles';
import type { MetricsDashboardProps } from './types';

const MetricsDashboard = ({ stats, loading, onRefresh }: MetricsDashboardProps) => {
  const theme = useTheme();

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    return `${(seconds / 86400).toFixed(1)}d`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Timeline color="primary" />
        <Typography variant="subtitle1" fontWeight="600">
          Métricas (Últimos 14 dias)
        </Typography>
        <IconButton size="small" onClick={onRefresh} disabled={loading}>
          <Refresh fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
        </IconButton>
      </Box>

      <DashboardGrid>
        <MetricCard className="view">
          <Box className="icon-wrapper view"><Visibility /></Box>
          <Box>
            <MetricLabel>Total de Visualizações</MetricLabel>
            <MetricValue>{stats?.totalViews || 0}</MetricValue>
          </Box>
        </MetricCard>
        <MetricCard className="time">
          <Box className="icon-wrapper time"><AccessTime /></Box>
          <Box>
            <MetricLabel>Tempo Médio</MetricLabel>
            <MetricValue>{formatTime(stats?.avgTimeSpent || 0)}</MetricValue>
          </Box>
        </MetricCard>
        <MetricCard className="total">
          <Box className="icon-wrapper total"><HourglassEmpty /></Box>
          <Box>
            <MetricLabel>Tempo Total</MetricLabel>
            <MetricValue>{formatTime(stats?.totalTimeSpent || 0)}</MetricValue>
          </Box>
        </MetricCard>

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.history || []}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [value, 'Visualizações']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area type="monotone" dataKey="views" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </DashboardGrid>
    </Box>
  );
};

export default MetricsDashboard;