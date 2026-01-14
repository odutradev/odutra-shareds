import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getShared } from '@actions/shareds';

import type { Shared } from '@actions/shareds/types';

export const useSharedData = () => {
  const { id: slug } = useParams<{ id: string }>();
  const [shared, setShared] = useState<Shared | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      
      const result = await getShared(slug);

      if (!result) {
        setError('Erro ao carregar compartilhamento');
        setLoading(false);
        return;
      }

      if ('error' in result) {
        setError('Compartilhamento não encontrado');
        setLoading(false);
        return;
      }

      if (!result.isActive) {
        setError('Este conteúdo está inativo');
        setLoading(false);
        return;
      }

      setShared(result);
      setLoading(false);
    };

    load();
  }, [slug]);

  return { shared, loading, error };
};