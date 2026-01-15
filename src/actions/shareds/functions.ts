import type { Shared } from './types';

export const mapResponseToShared = (item: any): Shared => {
  if (!item) return item;
  const data = item.data || {};
  let isActive = data.isActive ?? item.isActive ?? true;
  if (isActive === 'false') isActive = false;
  return {
    _id: item._id,
    slug: data.slug || data.id || item.slug || item.id,
    title: data.title || item.title,
    html: data.html || item.html,
    css: data.css || item.css,
    js: data.js || item.js,
    isActive: Boolean(isActive),
    isRedirect: Boolean(data.isRedirect || item.isRedirect),
    redirectUrl: data.redirectUrl || item.redirectUrl,
    createdAt: item.createdAt,
    updatedAt: item.lastUpdate || item.updatedAt,
  };
};

export const extractSharedData = (response: any) => {
    if (response.data && response.data._id) return response.data;
    return response.data?.result || response.data?.data || response.data;
};

export const extractSharedList = (response: any) => {
    const list = response.data?.result || response.data?.data;
    return Array.isArray(list) ? list : [];
};