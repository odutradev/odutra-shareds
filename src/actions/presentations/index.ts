import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';
import type { Presentation, CreatePresentationData, UpdatePresentationData } from './types';
import type { TypeOrError } from '@utils/types/action';
const mapResponseToPresentation = (item: any): Presentation => {
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
export const createPresentation = async (data: CreatePresentationData): TypeOrError<Presentation> => {
  try {
    const response = await api.post("/kv/presentations/create", {
      data: {
        ...data,
        id: data.slug
      }
    });
    const rawData = extractData(response);
    if (!rawData || !rawData._id) {
      console.error("Resposta inválida do servidor:", response.data);
      throw new Error("Falha ao criar apresentação: O servidor não retornou um ID válido.");
    }
    return mapResponseToPresentation(rawData);
  } catch (error) {
    console.error("Erro ao criar apresentação:", error);
    return manageActionError(error);
  }
};
export const getAllPresentations = async (): TypeOrError<Presentation[]> => {
  try {
    const response = await api.get("/kv/presentations/get-all?pagination=false");
    const list = extractList(response);
    return list.map(mapResponseToPresentation);
  } catch (error) {
    return manageActionError(error);
  }
};
export const getPresentation = async (slug: string): TypeOrError<Presentation> => {
  try {
    let response = await api.get(`/kv/presentations/get-all?slug=${slug}&pagination=false`);
    let list = extractList(response);
    let exactMatch = list.find((item: any) => {
         const itemSlug = item.data?.slug || item.slug;
         return itemSlug === slug;
    });
    if (exactMatch) {
        return mapResponseToPresentation(exactMatch);
    }
    response = await api.get(`/kv/presentations/get-all?id=${slug}&pagination=false`);
    list = extractList(response);
    exactMatch = list.find((item: any) => {
         const itemId = item.data?.id || item.id;
         return itemId === slug;
    });
    if (exactMatch) {
         return mapResponseToPresentation(exactMatch);
    }
    try {
         const directResponse = await api.get(`/kv/presentations/get/${slug}`);
         const directData = extractData(directResponse);
         if (directData && directData._id) {
             return mapResponseToPresentation(directData);
         }
    } catch (e) {}
    return { error: 'Apresentação não encontrada' };
  } catch (error) {
    return manageActionError(error);
  }
};
export const updatePresentation = async (_id: string, data: UpdatePresentationData): TypeOrError<Presentation> => {
  try {
    const payload = { ...data };
    if (payload.slug) {
        (payload as any).id = payload.slug;
    }
    const response = await api.patch(`/kv/presentations/update/${_id}`, { data: payload });
    const rawData = extractData(response);
    if (!rawData || !rawData._id) {
        throw new Error("Falha ao atualizar: Resposta inválida da API");
    }
    return mapResponseToPresentation(rawData);
  } catch (error) {
    return manageActionError(error);
  }
};
export const deletePresentation = async (_id: string): TypeOrError<void> => {
  try {
    await api.delete(`/kv/presentations/delete/${_id}`);
    return;
  } catch (error) {
    return manageActionError(error);
  }
};
export const checkIdAvailable = async (slug: string): Promise<boolean> => {
  try {
    let response = await api.get(`/kv/presentations/get-all?slug=${slug}&pagination=false`);
    let list = extractList(response);
    const exactSlugMatch = list.some((item: any) => {
        const itemSlug = item.data?.slug || item.slug;
        return itemSlug === slug;
    });
    if (exactSlugMatch) return false;
    response = await api.get(`/kv/presentations/get-all?id=${slug}&pagination=false`);
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