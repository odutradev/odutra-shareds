export type Presentation = {
  _id: string;
  slug: string;
  title: string;
  html: string;
  css?: string;
  js?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePresentationData = {
  slug: string;
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