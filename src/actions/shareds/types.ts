export type Shared = {
  _id: string;
  slug: string;
  title: string;
  html: string;
  css?: string;
  js?: string;
  isActive: boolean;
  isRedirect?: boolean;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSharedData = {
  slug: string;
  title: string;
  html: string;
  css?: string;
  js?: string;
  isActive: boolean;
  isRedirect?: boolean;
  redirectUrl?: string;
};

export type UpdateSharedData = {
  slug?: string;
  title?: string;
  html?: string;
  css?: string;
  js?: string;
  isActive?: boolean;
  isRedirect?: boolean;
  redirectUrl?: string;
};

export type SharedStats = {
  totalViews: number;
  avgTimeSpent: number;
  lastViewed?: string;
};