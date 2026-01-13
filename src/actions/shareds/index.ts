import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';
import type { Shared, CreateSharedData, UpdateSharedData } from './types';
import type { TypeOrError } from '@utils/types/action';
import { deleteSharedAnalytics } from '../analytics';

const mapResponseToShared = (item: any): Shared => {
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

const extractData = (response: any) => {
    if (response.data && response.data._id) {
        return response.data;
    }
    return response.data?.result || response.data?.data || response.data;
};

const extractList = (response: any) => {
    const list = response.data?.result || response.data?.data;
    return Array.isArray(list) ? list : [];
};

export const createShared = async (data: CreateSharedData): TypeOrError<Shared> => {
  try {
    const response = await api.post("/kv/shareds/create", {
      data: {
        ...data,
        id: data.slug
      }
    });
    const rawData = extractData(response);
    if (!rawData || !rawData._id) {
      console.error("Resposta inválida do servidor:", response.data);
      throw new Error("Falha ao criar compartilhamento: O servidor não retornou um ID válido.");
    }
    return mapResponseToShared(rawData);
  } catch (error) {
    console.error("Erro ao criar compartilhamento:", error);
    return manageActionError(error);
  }
};

export const getAllShareds = async (): TypeOrError<Shared[]> => {
  try {
    const response = await api.get("/kv/shareds/get-all?pagination=false");
    const list = extractList(response);
    return list.map(mapResponseToShared);
  } catch (error) {
    return manageActionError(error);
  }
};

export const getShared = async (slug: string): TypeOrError<Shared> => {
  try {
    let response = await api.get(`/kv/shareds/get-all?slug=${slug}&pagination=false`);
    let list = extractList(response);
    let exactMatch = list.find((item: any) => {
         const itemSlug = item.data?.slug || item.slug;
         return itemSlug === slug;
    });
    if (exactMatch) {
        return mapResponseToShared(exactMatch);
    }
    response = await api.get(`/kv/shareds/get-all?id=${slug}&pagination=false`);
    list = extractList(response);
    exactMatch = list.find((item: any) => {
         const itemId = item.data?.id || item.id;
         return itemId === slug;
    });
    if (exactMatch) {
         return mapResponseToShared(exactMatch);
    }
    try {
         const directResponse = await api.get(`/kv/shareds/get/${slug}`);
         const directData = extractData(directResponse);
         if (directData && directData._id) {
             return mapResponseToShared(directData);
         }
    } catch (e) {}
    return { error: 'Compartilhamento não encontrado' };
  } catch (error) {
    return manageActionError(error);
  }
};

export const updateShared = async (_id: string, data: UpdateSharedData): TypeOrError<Shared> => {
  try {
    const payload = { ...data };
    if (payload.slug) {
        (payload as any).id = payload.slug;
    }
    const response = await api.patch(`/kv/shareds/update/${_id}`, { data: payload });
    const rawData = extractData(response);
    if (!rawData || !rawData._id) {
        throw new Error("Falha ao atualizar: Resposta inválida da API");
    }
    return mapResponseToShared(rawData);
  } catch (error) {
    return manageActionError(error);
  }
};

export const deleteShared = async (_id: string): TypeOrError<void> => {
  try {
    let slugToDelete: string | null = null;
    try {
      const responseCheck = await api.get(`/kv/shareds/get/${_id}`);
      const data = extractData(responseCheck);
      if (data) {
        slugToDelete = data.data?.slug || data.data?.id || data.slug;
      }
    } catch (e) {
      console.warn("Não foi possível recuperar o slug antes da deleção:", e);
    }

    await api.delete(`/kv/shareds/delete/${_id}`);

    if (slugToDelete) {
      await deleteSharedAnalytics(slugToDelete);
    }

    return;
  } catch (error) {
    return manageActionError(error);
  }
};

export const checkIdAvailable = async (slug: string): Promise<boolean> => {
  try {
    let response = await api.get(`/kv/shareds/get-all?slug=${slug}&pagination=false`);
    let list = extractList(response);
    const exactSlugMatch = list.some((item: any) => {
        const itemSlug = item.data?.slug || item.slug;
        return itemSlug === slug;
    });
    if (exactSlugMatch) return false;
    response = await api.get(`/kv/shareds/get-all?id=${slug}&pagination=false`);
    list = extractList(response);
    const exactIdMatch = list.some((item: any) => {
        const itemId = item.data?.id || item.id;
        return itemId === slug;
    });
    return !exactIdMatch;
  } catch (error: any) {
    if (error.response?.status === 404) {
        return true;
    }
    console.warn("Erro ao verificar disponibilidade do ID:", error);
    return true;
  }
};