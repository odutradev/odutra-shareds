import type { DailyMetric, SharedAnalytics, TimeEvent, ViewEvent } from './types';

export const extractAnalyticsList = (response: any) => {
  const responseBody = response.data;
  if (Array.isArray(responseBody)) return responseBody;
  return responseBody?.result || responseBody?.data || [];
};

export const normalizeEvent = (item: any): any => {
  if (!item) return {};
  return { _id: item._id, ...item.data };
};

export const processSharedStats = (rawViews: any[], rawTimes: any[], sharedId: string): SharedAnalytics => {
  const filterBySharedId = (item: any) => (item.data?.sharedId || item.sharedId) === sharedId;
  const views: ViewEvent[] = rawViews.filter(filterBySharedId).map(normalizeEvent);
  const times: TimeEvent[] = rawTimes.filter(filterBySharedId).map(normalizeEvent);

  const totalViews = views.length;
  const totalTime = times.reduce((sum, event) => sum + (Number(event.timeSpent) || 0), 0);
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