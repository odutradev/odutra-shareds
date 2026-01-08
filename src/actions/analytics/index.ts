import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { AnalyticsEvent, CreateAnalyticsData } from './types';
import type { TypeOrError } from '@utils/types/action';
import type { PresentationStats } from '../presentations/types';

const token = import.meta.env.VITE_POCKETDB_TOKEN;

export const createAnalyticsEvent = async (data: CreateAnalyticsData): TypeOrError<AnalyticsEvent> => {
  try {
    const response = await api.post(
      "/kv/analytics/create",
      { data },
      { headers: { controlAccess: token } }
    );
    return response.data.result;
  } catch (error) {
    return manageActionError(error);
  }
};

export const getPresentationStats = async (presentationId: string): TypeOrError<PresentationStats> => {
  try {
    const response = await api.get(
      `/kv/analytics/get-all?presentationId=${presentationId}&pagination=false`,
      { headers: { controlAccess: token } }
    );
    const events: AnalyticsEvent[] = response.data.result;
    
    if (events.length === 0) {
      return {
        totalViews: 0,
        avgTimeSpent: 0,
      };
    }

    const totalViews = events.length;
    const totalTime = events.reduce((sum, event) => sum + event.timeSpent, 0);
    const avgTimeSpent = Math.round(totalTime / totalViews);
    const lastViewed = events.sort((a, b) => 
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    )[0]?.viewedAt;

    return {
      totalViews,
      avgTimeSpent,
      lastViewed,
    };
  } catch (error) {
    return manageActionError(error);
  }
};
