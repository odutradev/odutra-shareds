import type { Shared } from '@actions/shareds/types';

export interface SharedCardProps {
  shared: Shared;
  onEdit: (shared: Shared) => void;
  onDelete: (shared: Shared) => void;
}