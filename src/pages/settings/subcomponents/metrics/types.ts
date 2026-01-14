import type { SystemMetrics } from '@actions/settings/types';

export interface SettingsMetricsProps {
  metrics: SystemMetrics | null;
  loading: boolean;
}