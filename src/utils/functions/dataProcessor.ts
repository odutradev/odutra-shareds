import type { DailyMetric, TimeEvent, ViewEvent } from '@actions/analytics/types';
import type { Shared } from '@actions/shareds/types';

export const extractResponseData = <T>(response: any): T => {
  if (response?.data?._id) return response.data;
  return response?.data?.result || response?.data?.data || response?.data || {};
};

export const extractResponseList = <T>(response: any): T[] => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  return data?.result || data?.data || [];
};

export const mapSharedResponse = (item: any): Shared => {
  if (!item) return item;
  const data = item.data || {};
  const isActive = data.isActive ?? item.isActive ?? true;
  return {
    _id: item._id,
    slug: data.slug || data.id || item.slug || item.id,
    title: data.title || item.title,
    html: data.html || item.html,
    css: data.css || item.css,
    js: data.js || item.js,
    isActive: String(isActive) !== 'false',
    isRedirect: Boolean(data.isRedirect || item.isRedirect),
    redirectUrl: data.redirectUrl || item.redirectUrl,
    createdAt: item.createdAt,
    updatedAt: item.lastUpdate || item.updatedAt,
  };
};

export const normalizeAnalyticsEvent = <T extends { _id: string; data?: any }>(item: any): T => {
  if (!item) return {} as T;
  return { _id: item._id, ...item.data };
};

export const calculateAnalyticsHistory = (views: ViewEvent[], times: TimeEvent[]) => {
  const totalViews = views.length;
  const totalTime = times.reduce((sum, e) => sum + (Number(e.timeSpent) || 0), 0);
  const avgTimeSpent = totalViews > 0 ? Math.round(totalTime / totalViews) : 0;
  const sortedViews = [...views].sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
  const lastViewed = sortedViews[0]?.viewedAt;
  const historyMap = new Map<string, { views: number; totalTime: number }>();

  const processDate = (dateStr: string, isView: boolean, timeVal = 0) => {
    try {
      const date = dateStr ? dateStr.split('T')[0] : new Date().toISOString().split('T')[0];
      const entry = historyMap.get(date) || { views: 0, totalTime: 0 };
      if (isView) entry.views++;
      else entry.totalTime += timeVal;
      historyMap.set(date, entry);
    } catch {}
  };

  views.forEach(v => processDate(v.viewedAt, true));
  times.forEach(t => processDate(t.recordedAt, false, Number(t.timeSpent) || 0));

  const history: DailyMetric[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const fullDate = d.toISOString().split('T')[0];
    const data = historyMap.get(fullDate) || { views: 0, totalTime: 0 };
    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      fullDate,
      views: data.views,
      avgTime: data.views > 0 ? Math.round(data.totalTime / data.views) : 0
    };
  }).reverse();

  return { totalViews, avgTimeSpent, totalTimeSpent: totalTime, lastViewed, history };
};