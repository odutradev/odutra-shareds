import { extractSharedData, extractSharedList, mapResponseToShared } from './functions';
import { manageActionError } from '@utils/functions/action';
import { deleteSharedAnalytics } from '../analytics';
import api from '@utils/functions/api';

import type { CreateSharedData, Shared, UpdateSharedData } from './types';
import type { TypeOrError } from '@utils/types/action';

export const createShared = async (data: CreateSharedData): TypeOrError<Shared> => {
  try {
    const response = await api.post("/kv/shareds/create", { data: { ...data, id: data.slug } });
    const rawData = extractSharedData(response);
    if (!rawData || !rawData._id) throw new Error("Falha ao criar: ID inválido.");
    return mapResponseToShared(rawData);
  } catch (error) {
    return manageActionError(error);
  }
};

export const getAllShareds = async (): TypeOrError<Shared[]> => {
  try {
    const response = await api.get("/kv/shareds/get-all?pagination=false");
    return extractSharedList(response).map(mapResponseToShared);
  } catch (error) {
    return manageActionError(error);
  }
};

export const getShared = async (slug: string): TypeOrError<Shared> => {
  try {
    let response = await api.get(`/kv/shareds/get-all?slug=${slug}&pagination=false`);
    let exactMatch = extractSharedList(response).find((item: any) => (item.data?.slug || item.slug) === slug);
    if (exactMatch) return mapResponseToShared(exactMatch);

    response = await api.get(`/kv/shareds/get-all?id=${slug}&pagination=false`);
    exactMatch = extractSharedList(response).find((item: any) => (item.data?.id || item.id) === slug);
    if (exactMatch) return mapResponseToShared(exactMatch);

    try {
         const directData = extractSharedData(await api.get(`/kv/shareds/get/${slug}`));
         if (directData && directData._id) return mapResponseToShared(directData);
    } catch {}
    return { error: 'Compartilhamento não encontrado' };
  } catch (error) {
    return manageActionError(error);
  }
};

export const updateShared = async (_id: string, data: UpdateSharedData): TypeOrError<Shared> => {
  try {
    const payload = { ...data, ...(data.slug && { id: data.slug }) };
    const response = await api.patch(`/kv/shareds/update/${_id}`, { data: payload });
    const rawData = extractSharedData(response);
    if (!rawData || !rawData._id) throw new Error("Falha ao atualizar: Resposta inválida");
    return mapResponseToShared(rawData);
  } catch (error) {
    return manageActionError(error);
  }
};

export const deleteShared = async (_id: string): TypeOrError<void> => {
  try {
    let slugToDelete: string | null = null;
    try {
      const data = extractSharedData(await api.get(`/kv/shareds/get/${_id}`));
      if (data) slugToDelete = data.data?.slug || data.data?.id || data.slug;
    } catch (e) { console.warn("Erro ao recuperar slug antes da deleção:", e); }

    await api.delete(`/kv/shareds/delete/${_id}`);
    if (slugToDelete) await deleteSharedAnalytics(slugToDelete);
    return;
  } catch (error) {
    return manageActionError(error);
  }
};

export const checkIdAvailable = async (slug: string): Promise<boolean> => {
  try {
    const [resSlug, resId] = await Promise.all([
      api.get(`/kv/shareds/get-all?slug=${slug}&pagination=false`),
      api.get(`/kv/shareds/get-all?id=${slug}&pagination=false`)
    ]);
    const check = (res: any) => extractSharedList(res).some((item: any) => 
      (item.data?.slug || item.slug || item.data?.id || item.id) === slug
    );
    return !check(resSlug) && !check(resId);
  } catch (error: any) {
    return error.response?.status === 404;
  }
};
