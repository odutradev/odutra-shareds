import { extractAnalyticsList, normalizeEvent, processSharedStats } from './functions';
import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { CreateTimeData, CreateViewData, SharedAnalytics, TimeEvent, ViewEvent } from './types';
import type { TypeOrError } from '@utils/types/action';

export const createViewEvent = async (data: CreateViewData): TypeOrError<ViewEvent> => {
  try {
    const response = await api.post("/kv/analytics_views/create", { data });
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    return manageActionError(error);
  }
};

export const createTimeEvent = async (data: CreateTimeData): TypeOrError<TimeEvent> => {
  try {
    const response = await api.post("/kv/analytics_time/create", { data });
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    return manageActionError(error);
  }
};

export const getSharedStats = async (sharedId: string): TypeOrError<SharedAnalytics> => {
  try {
    const encodedId = encodeURIComponent(sharedId);
    const [viewsRes, timeRes] = await Promise.all([
      api.get(`/kv/analytics_views/get-all?sharedId=${encodedId}&pagination=false`),
      api.get(`/kv/analytics_time/get-all?sharedId=${encodedId}&pagination=false`)
    ]);
    return processSharedStats(extractAnalyticsList(viewsRes), extractAnalyticsList(timeRes), sharedId);
  } catch (error) {
    return manageActionError(error);
  }
};

export const deleteSharedAnalytics = async (sharedId: string): Promise<void> => {
  try {
    const encodedId = encodeURIComponent(sharedId);
    const [viewsRes, timeRes] = await Promise.all([
      api.get(`/kv/analytics_views/get-all?sharedId=${encodedId}&pagination=false`),
      api.get(`/kv/analytics_time/get-all?sharedId=${encodedId}&pagination=false`)
    ]);

    const filterFn = (item: any) => (item.data?.sharedId || item.sharedId) === sharedId;
    const views = extractAnalyticsList(viewsRes).filter(filterFn);
    const times = extractAnalyticsList(timeRes).filter(filterFn);

    await Promise.all([
        ...views.map((v: any) => api.delete(`/kv/analytics_views/delete/${v._id}`)),
        ...times.map((t: any) => api.delete(`/kv/analytics_time/delete/${t._id}`))
    ]);
  } catch (error) {
    console.error("Erro ao limpar analytics do compartilhamento:", error);
  }
};
