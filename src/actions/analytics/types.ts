export type AnalyticsEvent = {
  _id: string;
  presentationId: string;
  viewedAt: string;
  timeSpent: number;
  userAgent?: string;
  referrer?: string;
};

export type CreateAnalyticsData = {
  presentationId: string;
  viewedAt: string;
  timeSpent: number;
  userAgent?: string;
  referrer?: string;
};
