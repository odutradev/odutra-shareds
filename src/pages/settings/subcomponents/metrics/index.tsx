import { AccessTime, Dashboard, Timer, Visibility } from '@mui/icons-material';
import { CardContent, Skeleton, Box } from '@mui/material';

import { MetricsContainer, MetricCard, IconWrapper, MetricValue, MetricLabel } from './styles';
import formatTime from '@utils/functions/formatTime';

import type { SettingsMetricsProps } from './types';

const SettingsMetrics = ({ metrics, loading }: SettingsMetricsProps) => {
  const items = [
    {
      label: 'Compartilhamentos',
      value: metrics?.presentationsCount || 0,
      icon: <Dashboard />,
      color: 'primary'
    },
    {
      label: 'Visualizações Totais',
      value: metrics?.viewsCount || 0,
      icon: <Visibility />,
      color: 'secondary'
    },
    {
      label: 'Registros de Tempo',
      value: metrics?.timeRecordsCount || 0,
      icon: <AccessTime />,
      color: 'primary'
    },
    {
      label: 'Tempo Total em Tela',
      value: formatTime(metrics?.totalTimeSpent || 0),
      icon: <Timer />,
      color: 'secondary'
    }
  ];

  return (
    <MetricsContainer>
      {items.map((item, index) => (
        <MetricCard key={index}>
          {}
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
            <IconWrapper color={item.color as any}>
              {item.icon}
            </IconWrapper>

            {}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <MetricLabel variant="body2" color="text.secondary" title={item.label}>
                {item.label}
              </MetricLabel>
              {loading ? (
                <Skeleton width={50} height={30} />
              ) : (
                <MetricValue variant="h4" title={String(item.value)}>
                  {item.value}
                </MetricValue>
              )}
            </Box>
          </CardContent>
        </MetricCard>
      ))}
    </MetricsContainer>
  );
};

export default SettingsMetrics;