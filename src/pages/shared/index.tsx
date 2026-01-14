import Loading from '@components/loading';

import ContentFrame from './components/ContentFrame';
import ErrorState from './components/ErrorState';
import RedirectState from './components/RedirectState';
import { useSharedAnalytics } from './hooks/useSharedAnalytics';
import { useSharedData } from './hooks/useSharedData';
import { SharedContainer } from './styles';

const SharedPage = () => {
  const { shared, loading, error } = useSharedData();
  
  useSharedAnalytics(shared);

  if (loading) {
    return <Loading message="Carregando conteúdo" />;
  }

  if (error || !shared) {
    return <ErrorState message={error || 'Conteúdo não encontrado'} />;
  }

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