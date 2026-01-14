import type { SharedAnalytics } from '@actions/analytics/types';

export interface MetricsDashboardProps {
  stats: SharedAnalytics | null;
  loading: boolean;
  onRefresh: () => void;
}