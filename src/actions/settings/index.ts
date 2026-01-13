import api from '@utils/functions/api';
import { manageActionError } from '@utils/functions/action';
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

export const getSystemMetrics = async (): TypeOrError<SystemMetrics> => {
  try {
    const [presentationsCount, viewsCount, timeRecordsCount] = await Promise.all([
      getCount('presentations'),
      getCount('analytics_views'),
      getCount('analytics_time')
    ]);

    return {
      presentationsCount,
      viewsCount,
      timeRecordsCount
    };
  } catch (error) {
    return manageActionError(error);
  }
};

export const performBackup = async (): Promise<void> => {
    const collections = ['presentations', 'analytics_views', 'analytics_time'];
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