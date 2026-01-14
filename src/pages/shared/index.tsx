import { useEffect } from 'react';

import { useSharedAnalytics } from './hooks/useSharedAnalytics';
import RedirectState from './components/RedirectState';
import { useSharedData } from './hooks/useSharedData';
import ContentFrame from './components/ContentFrame';
import ErrorState from './components/ErrorState';
import { SharedContainer } from './styles';
import Loading from '@components/loading';

const SharedPage = () => {
  const { shared, loading, error } = useSharedData();

  useSharedAnalytics(shared);

  useEffect(() => {
    if (shared?.title) {
      document.title = shared.title;
    }
  }, [shared]);

  if (loading) return <Loading message="Carregando conteúdo" />;

  if (error || !shared) return <ErrorState message={error || 'Conteúdo não encontrado'} />;

  if (shared.isRedirect && shared.redirectUrl) {
    return (
      <SharedContainer>
        <RedirectState url={shared.redirectUrl} />
      </SharedContainer>
    );
  }

  return (
    <SharedContainer>
      <ContentFrame shared={shared} />
    </SharedContainer>
  );
};

export default SharedPage;