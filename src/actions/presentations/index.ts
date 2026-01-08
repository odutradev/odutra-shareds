import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { Presentation, CreatePresentationData, UpdatePresentationData } from './types';
import type { TypeOrError } from '@utils/types/action';

const token = import.meta.env.VITE_POCKETDB_TOKEN;

export const createPresentation = async (data: CreatePresentationData): TypeOrError<Presentation> => {
  try {
    const response = await api.post(
      "/kv/presentations/create",
      { data },
      { headers: { controlAccess: token } }
    );
    return response.data.result;
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
    return response.data.result;
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
    const presentations = response.data.result;
    if (presentations.length === 0) {
      return { error: 'Apresentação não encontrada' };
    }
    return presentations[0];
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
    return response.data.result;
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
    return response.data.result.length === 0;
  } catch (error) {
    return manageActionError(error);
  }
};
