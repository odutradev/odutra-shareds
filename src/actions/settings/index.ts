import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { TypeOrError } from '@utils/types/action';
import type { SystemMetrics } from './types';

const getCount = async (collection: string): Promise<number> => {
  try {
    const response = await api.get(`/kv/${collection}/get-all?pagination=false`);
    const data = response.data?.result || response.data?.data || [];
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
};

const getTotalTime = async (): Promise<number> => {
  try {
    const response = await api.get('/kv/analytics_time/get-all?pagination=false');
    const data = response.data?.result || response.data?.data || [];
    if (!Array.isArray(data)) return 0;

    return data.reduce((acc: number, item: any) => {
      const time = Number(item.data?.timeSpent || item.timeSpent);
      return acc + (isNaN(time) ? 0 : time);
    }, 0);
  } catch {
    return 0;
  }
};

export const getSystemMetrics = async (): TypeOrError<SystemMetrics> => {
  try {
    const [presentationsCount, viewsCount, timeRecordsCount, totalTimeSpent] = await Promise.all([
      getCount('shareds'),
      getCount('analytics_views'),
      getCount('analytics_time'),
      getTotalTime()
    ]);

    return {
      presentationsCount,
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
    } catch (e) {
      console.error(`Erro ao buscar ${col} para backup`, e);
      backupData[col] = [];
    }
  }));

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-odutra-presentation-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const restoreBackup = async (file: File): TypeOrError<void> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const collections = ['shareds', 'analytics_views', 'analytics_time'];

    const hasValidData = collections.some(col => Array.isArray(data[col]) && data[col].length > 0);
    if (!hasValidData) throw new Error("O arquivo não contém dados válidos ou está vazio.");

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
            } catch (e) {
              console.warn(`Falha ao restaurar item em ${col}:`, e);
            }
          }
        }));
      }
    }
  } catch (error) {
    console.error("Erro na restauração:", error);
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