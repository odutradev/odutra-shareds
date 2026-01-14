import type { Shared } from '@actions/shareds/types';

export interface CacheEntry {
  shared: Shared;
  timestamp: number;
}

export interface SharedCacheData {
  data: Record<string, CacheEntry>;
}

export interface SharedCacheState extends SharedCacheData {
  setShared: (slug: string, shared: Shared) => void;
  cleanExpired: () => void;
}