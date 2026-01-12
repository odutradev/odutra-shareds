export type ViewEvent = {
  _id: string;
  presentationId: string;
  viewedAt: string;
  userAgent?: string;
  referrer?: string;
};

export type TimeEvent = {
  _id: string;
  presentationId: string;
  recordedAt: string;
  timeSpent: number;
};

export type CreateViewData = {
  presentationId: string;
  viewedAt: string;
  userAgent?: string;
  referrer?: string;
};

export type CreateTimeData = {
  presentationId: string;
  recordedAt: string;
  timeSpent: number;
};