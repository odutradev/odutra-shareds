export type ViewEvent = {
  _id: string;
  sharedId: string;
  viewedAt: string;
  userAgent?: string;
  referrer?: string;
};

export type TimeEvent = {
  _id: string;
  sharedId: string;
  recordedAt: string;
  timeSpent: number;
};

export type CreateViewData = {
  sharedId: string;
  viewedAt: string;
  userAgent?: string;
  referrer?: string;
};

export type CreateTimeData = {
  sharedId: string;
  recordedAt: string;
  timeSpent: number;
};

export type DailyMetric = {
  date: string;
  fullDate: string;
  views: number;
  avgTime: number;
};

export type SharedAnalytics = {
  totalViews: number;
  avgTimeSpent: number;
  totalTimeSpent: number;
  lastViewed?: string;
  history: DailyMetric[];
};