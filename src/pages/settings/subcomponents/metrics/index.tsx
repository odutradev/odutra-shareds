import { AccessTime, Slideshow, Visibility } from '@mui/icons-material';
import { CircularProgress, Box, Typography } from '@mui/material';

import { MetricsContainer, MetricCard, SectionTitle } from './styles';

import type { SettingsMetricsProps } from './types';

const SettingsMetrics = ({ metrics, loading }: SettingsMetricsProps) => {
  return (
    <Box>
      <SectionTitle variant="h6">Visão Geral do Sistema</SectionTitle>
      <MetricsContainer>
        <MetricCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
            <Slideshow />
            <Typography variant="subtitle2" fontWeight={600}>Compartilhamentos</Typography>
          </Box>
          <Typography variant="h3" fontWeight={700}>
            {loading ? <CircularProgress size={20} /> : metrics?.presentationsCount || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">Cadastrados no sistema</Typography>
        </MetricCard>

        <MetricCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'secondary.main' }}>
            <Visibility />
            <Typography variant="subtitle2" fontWeight={600}>Total de Views</Typography>
          </Box>
          <Typography variant="h3" fontWeight={700}>
            {loading ? <CircularProgress size={20} /> : metrics?.viewsCount || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">Visualizações registradas</Typography>
        </MetricCard>

        <MetricCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
            <AccessTime />
            <Typography variant="subtitle2" fontWeight={600}>Registros de Tempo</Typography>
          </Box>
          <Typography variant="h3" fontWeight={700}>
            {loading ? <CircularProgress size={20} /> : metrics?.timeRecordsCount || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">Pings de atividade</Typography>
        </MetricCard>
      </MetricsContainer>
    </Box>
  );
};

export default SettingsMetrics;