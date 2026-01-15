import { calculateTotalTime, generateBackupFile, getCollectionCount, parseRestoreFile } from './functions';
import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { SystemMetrics } from './types';
import type { TypeOrError } from '@utils/types/action';

export const getSystemMetrics = async (): TypeOrError<SystemMetrics> => {
  try {
    const [sharedsCount, viewsCount, timeRecordsCount, totalTimeSpent] = await Promise.all([
      getCollectionCount('shareds'),
      getCollectionCount('analytics_views'),
      getCollectionCount('analytics_time'),
      calculateTotalTime()
    ]);

    return {
      presentationsCount: sharedsCount,
      viewsCount,
      timeRecordsCount,
      totalTimeSpent
    };
  } catch (error) {
    return manageActionError(error);
  }
};

export const performBackup = async (): Promise<void> => {
  const collections = ['shareds', 'analytics_views', 'analytics_time'];
  const backupData: Record<string, any[]> = {};

  await Promise.all(collections.map(async (col) => {
    try {
      const response = await api.get(`/kv/${col}/get-all?pagination=false`);
      backupData[col] = response.data?.result || response.data?.data || [];
    } catch { backupData[col] = []; }
  }));
  generateBackupFile(backupData);
};

export const restoreBackup = async (file: File): TypeOrError<void> => {
  try {
    const { data, collections } = await parseRestoreFile(file);
    for (const col of collections) {
      const items = data[col];
      if (Array.isArray(items)) {
        await Promise.all(items.map(async (item: any) => {
          if (item.data) {
            try {
              await api.post(`/kv/${col}/create`, {
                data: item.data,
                createdAt: item.createdAt
              });
            } catch (e) { console.warn(`Falha ao restaurar item em ${col}:`, e); }
          }
        }));
      }
    }
  } catch (error) {
    return manageActionError(error);
  }
};

export const clearCollection = async (collection: string): TypeOrError<void> => {
  try {
    await api.delete(`/kv/${collection}/delete-all`);
  } catch (error) {
    return manageActionError(error);
  }
};

export const deleteProject = async (): TypeOrError<void> => {
  try {
    await api.delete(`/kv/project/delete-all`);
  } catch (error) {
    return manageActionError(error);
  }
};
