import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { ViewEvent, TimeEvent, CreateViewData, CreateTimeData } from './types';
import type { TypeOrError } from '@utils/types/action';
import type { PresentationStats } from '../presentations/types';

const extractList = (response: any) => {
    const list = response.data?.result || response.data?.data;
    return Array.isArray(list) ? list : [];
};

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

export const getPresentationStats = async (presentationId: string): TypeOrError<PresentationStats> => {
  try {

    const [viewsResponse, timeResponse] = await Promise.all([
      api.get(`/kv/analytics_views/get-all?presentationId=${presentationId}&pagination=false`),
      api.get(`/kv/analytics_time/get-all?presentationId=${presentationId}&pagination=false`)
    ]);

    const views: ViewEvent[] = extractList(viewsResponse);
    const times: TimeEvent[] = extractList(timeResponse);

    if (views.length === 0) {
      return {
        totalViews: 0,
        avgTimeSpent: 0,
      };
    }

    const totalViews = views.length;

    const totalTime = times.reduce((sum, event) => sum + (event.timeSpent || 0), 0);

    const avgTimeSpent = totalViews > 0 ? Math.round(totalTime / totalViews) : 0;

    const sortedViews = [...views].sort((a, b) =>
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );

    const lastViewed = sortedViews[0]?.viewedAt;

    return {
      totalViews,
      avgTimeSpent,
      lastViewed,
    };
  } catch (error) {
    return manageActionError(error);
  }
};