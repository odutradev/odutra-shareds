import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';
import type { ViewEvent, TimeEvent, CreateViewData, CreateTimeData, PresentationAnalytics, DailyMetric } from './types';
import type { TypeOrError } from '@utils/types/action';

const extractList = (response: any) => {
    const responseBody = response.data;
    if (Array.isArray(responseBody)) return responseBody;
    return responseBody?.result || responseBody?.data || [];
};

const normalizeEvent = (item: any): any => {
  if (!item) return {};
  return {
    _id: item._id,
    ...item.data
  };
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

export const getPresentationStats = async (presentationId: string): TypeOrError<PresentationAnalytics> => {
  try {
    const encodedId = encodeURIComponent(presentationId);
    const [viewsResponse, timeResponse] = await Promise.all([
      api.get(`/kv/analytics_views/get-all?presentationId=${encodedId}&pagination=false`),
      api.get(`/kv/analytics_time/get-all?presentationId=${encodedId}&pagination=false`)
    ]);

    const rawViews = extractList(viewsResponse).filter((item: any) => {
      const pId = item.data?.presentationId || item.presentationId;
      return pId === presentationId;
    });

    const rawTimes = extractList(timeResponse).filter((item: any) => {
      const pId = item.data?.presentationId || item.presentationId;
      return pId === presentationId;
    });

    const views: ViewEvent[] = rawViews.map(normalizeEvent);
    const times: TimeEvent[] = rawTimes.map(normalizeEvent);

    const totalViews = views.length;
    const totalTime = times.reduce((sum, event) => sum + (Number(event.timeSpent) || 0), 0);
    const avgTimeSpent = totalViews > 0 ? Math.round(totalTime / totalViews) : 0;

    const sortedViews = [...views].sort((a, b) =>
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
    const lastViewed = sortedViews[0]?.viewedAt;

    const historyMap = new Map<string, { views: number; totalTime: number; countTime: number }>();

    views.forEach(v => {
      try {
        const date = v.viewedAt ? v.viewedAt.split('T')[0] : new Date().toISOString().split('T')[0];
        const entry = historyMap.get(date) || { views: 0, totalTime: 0, countTime: 0 };
        entry.views++;
        historyMap.set(date, entry);
      } catch (e) { console.error('Erro ao processar data view', e) }
    });

    times.forEach(t => {
      try {
        const date = t.recordedAt ? t.recordedAt.split('T')[0] : new Date().toISOString().split('T')[0];
        const entry = historyMap.get(date) || { views: 0, totalTime: 0, countTime: 0 };
        entry.totalTime += Number(t.timeSpent) || 0;
        entry.countTime++;
        historyMap.set(date, entry);
      } catch (e) { console.error('Erro ao processar data time', e) }
    });

    const history: DailyMetric[] = [];
    for(let i=13; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dateDisplay = `${d.getDate()}/${d.getMonth()+1}`;

      const data = historyMap.get(dateStr) || { views: 0, totalTime: 0, countTime: 0 };
      const avgTime = data.views > 0 ? Math.round(data.totalTime / data.views) : 0;

      history.push({
        date: dateDisplay,
        fullDate: dateStr,
        views: data.views,
        avgTime: avgTime
      });
    }

    return {
      totalViews,
      avgTimeSpent,
      totalTimeSpent: totalTime,
      lastViewed,
      history
    };
  } catch (error) {
    return manageActionError(error);
  }
};