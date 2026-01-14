import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SHARED_CACHE_TTL } from '@stores/sharedCache/defaultValues';
import useSharedCache from '@stores/sharedCache';
import { getShared } from '@actions/shareds';


import type { Shared } from '@actions/shareds/types';

export const useSharedData = () => {
  const { id } = useParams<{ id: string }>();
  const slug = id ?? '';

  const cachedEntry = useSharedCache((state) => state.data[slug]);
  const setSharedCache = useSharedCache((state) => state.setShared);

  const isCacheValid = cachedEntry && (Date.now() - cachedEntry.timestamp < SHARED_CACHE_TTL);

  const [shared, setShared] = useState<Shared | null>(isCacheValid ? cachedEntry.shared : null);
  const [loading, setLoading] = useState(!isCacheValid);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    if (isCacheValid) {
      setShared(cachedEntry.shared);
      setLoading(false);
      return;
    }

    const fetchShared = async () => {
      setLoading(true);
      setError(null);

      const result = await getShared(slug);

      if (!result) {
        setError('Erro ao carregar compartilhamento');
      } else if ('error' in result) {
        setError('Compartilhamento não encontrado');
      } else if (!result.isActive) {
        setError('Este conteúdo está inativo');
      } else {
        setShared(result);
        setSharedCache(slug, result);
      }
      setLoading(false);
    };

    fetchShared();
  }, [slug, isCacheValid, cachedEntry, setSharedCache]);

  return { shared, loading, error };
};
