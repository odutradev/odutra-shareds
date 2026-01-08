export type Presentation = {
  _id: string;
  id: string;
  title: string;
  html: string;
  css?: string;
  js?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePresentationData = {
  id: string;
  title: string;
  html: string;
  css?: string;
  js?: string;
  isActive: boolean;
};

export type UpdatePresentationData = {
  title?: string;
  html?: string;
  css?: string;
  js?: string;
  isActive?: boolean;
};

export type PresentationStats = {
  totalViews: number;
  avgTimeSpent: number;
  lastViewed?: string;
};
