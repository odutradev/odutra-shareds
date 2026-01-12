import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { Presentation, CreatePresentationData, UpdatePresentationData } from './types';
import type { TypeOrError } from '@utils/types/action';

const token = import.meta.env.VITE_POCKETDB_TOKEN;



const mapResponseToPresentation = (item: any): Presentation => {
  if (!item) return item;

  if (item.id && item.title && !item.data) return item as Presentation;

  return {
    _id: item._id,
    id: item.data?.id || item.id,
    title: item.data?.title || item.title,
    html: item.data?.html || item.html,
    css: item.data?.css || item.css,
    js: item.data?.js || item.js,
    isActive: item.data?.isActive ?? item.isActive ?? true,
    createdAt: item.createdAt,
    updatedAt: item.lastUpdate || item.updatedAt,
  };
};

export const createPresentation = async (data: CreatePresentationData): TypeOrError<Presentation> => {
  try {
    const response = await api.post(
      "/kv/presentations/create",
      { data },
      { headers: { controlAccess: token } }
    );


    const rawData = response.data?.result || response.data;

    if (!rawData || !rawData._id) {
      throw new Error("Falha ao criar apresentação: Resposta inválida da API");
    }

    return mapResponseToPresentation(rawData);
  } catch (error) {
    return manageActionError(error);
  }
};

export const getAllPresentations = async (): TypeOrError<Presentation[]> => {
  try {
    const response = await api.get(
      "/kv/presentations/get-all?pagination=false",
      { headers: { controlAccess: token } }
    );

    const list = response.data?.result || [];
    if (!Array.isArray(list)) return [];

    return list.map(mapResponseToPresentation);
  } catch (error) {
    return manageActionError(error);
  }
};

export const getPresentation = async (id: string): TypeOrError<Presentation> => {
  try {
    const response = await api.get(
      `/kv/presentations/get-all?id=${id}&pagination=false`,
      { headers: { controlAccess: token } }
    );

    const presentations = response.data?.result;

    if (!presentations || !Array.isArray(presentations) || presentations.length === 0) {
      return { error: 'Apresentação não encontrada' };
    }

    return mapResponseToPresentation(presentations[0]);
  } catch (error) {
    return manageActionError(error);
  }
};

export const updatePresentation = async (_id: string, data: UpdatePresentationData): TypeOrError<Presentation> => {
  try {
    const response = await api.patch(
      `/kv/presentations/update/${_id}`,
      { data },
      { headers: { controlAccess: token } }
    );

    const rawData = response.data?.result || response.data;

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
    await api.delete(
      `/kv/presentations/delete/${_id}`,
      { headers: { controlAccess: token } }
    );
    return;
  } catch (error) {
    return manageActionError(error);
  }
};

export const checkIdAvailable = async (id: string): TypeOrError<boolean> => {
  try {
    const response = await api.get(
      `/kv/presentations/get-all?id=${id}&pagination=false`,
      { headers: { controlAccess: token } }
    );

    const list = response.data?.result;
    if (!list || !Array.isArray(list)) return true;


    const exists = list.some((item: any) => {
        const itemData = mapResponseToPresentation(item);
        return itemData.id === id;
    });

    return !exists;
  } catch (error) {
    return true;
  }
};