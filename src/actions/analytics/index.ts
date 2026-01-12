import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { AnalyticsEvent, CreateAnalyticsData } from './types';
import type { TypeOrError } from '@utils/types/action';
import type { PresentationStats } from '../presentations/types';

const extractList = (response: any) => {
    const list = response.data?.result || response.data?.data;
    return Array.isArray(list) ? list : [];
};

export const createAnalyticsEvent = async (data: CreateAnalyticsData): TypeOrError<AnalyticsEvent> => {
  try {
    const response = await api.post("/kv/analytics/create", { data });
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    return manageActionError(error);
  }
};

export const getPresentationStats = async (presentationId: string): TypeOrError<PresentationStats> => {
  try {
    const response = await api.get(
      `/kv/analytics/get-all?presentationId=${presentationId}&pagination=false`
    );

    const events: AnalyticsEvent[] = extractList(response);

    if (events.length === 0) {
      return {
        totalViews: 0,
        avgTimeSpent: 0,
      };
    }

    const totalViews = events.length;
    const totalTime = events.reduce((sum, event) => sum + (event.timeSpent || 0), 0);
    const avgTimeSpent = totalViews > 0 ? Math.round(totalTime / totalViews) : 0;

    const sortedEvents = [...events].sort((a, b) =>
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );

    const lastViewed = sortedEvents[0]?.viewedAt;

    return {
      totalViews,
      avgTimeSpent,
      lastViewed,
    };
  } catch (error) {
    return manageActionError(error);
  }
};