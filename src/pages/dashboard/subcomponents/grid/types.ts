import type { Shared } from '@actions/shareds/types';

export interface DashboardGridProps {
  onDelete: (shared: Shared) => void;
  onEdit: (shared: Shared) => void;
  data: Shared[];
}