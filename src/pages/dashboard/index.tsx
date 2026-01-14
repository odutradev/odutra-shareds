import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import DashboardEmptyState from './subcomponents/emptyState';
import { getAllShareds, deleteShared } from '@actions/shareds';
import { DashboardContainer, ContentContainer } from './styles';
import useConfirmDialog from '@hooks/useConfirmDialog';
import ConfirmDialog from '@components/confirmDialog';
import DashboardHeader from './subcomponents/header';
import DashboardGrid from './subcomponents/grid';
import useSharedsStore from '@stores/shareds';
import useSystemStore from '@stores/system';
import Loading from '@components/loading';
import useAction from '@hooks/useAction';

import type { Shared } from '@actions/shareds/types';

const Dashboard = () => {
  const { data, loading, setShareds, removeShared, setLoading } = useSharedsStore();
  const { system: { theme }, toggleTheme } = useSystemStore();
  const { confirm, props: confirmProps } = useConfirmDialog();
  const navigate = useNavigate();

  useEffect(() => {
    loadShareds();
  }, []);

  const loadShareds = async () => {
    setLoading(true);
    const result = await getAllShareds();
    if (result && Array.isArray(result)) setShareds(result);
    setLoading(false);
  };

  const handleCreate = () => navigate('/dashboard/edit');
  const handleEdit = (shared: Shared) => navigate(`/dashboard/edit?slug=${shared.slug}`);
  const handleSettings = () => navigate('/dashboard/settings');

  const handleDelete = async (shared: Shared) => {
    const isConfirmed = await confirm({
      title: 'Excluir compartilhamento?',
      message: `Você está prestes a excluir "${shared.title}". Esta ação é irreversível e todos os dados de estatísticas serão perdidos.`,
      confirmText: 'Excluir',
      variant: 'error',
    });

    if (!isConfirmed) return;

    await useAction({
      action: () => deleteShared(shared._id),
      callback: () => removeShared(shared._id),
      toastMessages: {
        pending: 'Deletando compartilhamento...',
        success: 'Compartilhamento deletado!',
        error: 'Erro ao deletar compartilhamento',
      },
    });
  };

  if (loading) return <Loading message="Carregando compartilhamentos" />;

  return (
    <DashboardContainer>
      <ContentContainer>
        <DashboardHeader
          theme={theme}
          onCreate={handleCreate}
          onSettings={handleSettings}
          onToggleTheme={toggleTheme}
          showCreateButton={data.length > 0}
        />
        {data.length === 0 ? (
          <DashboardEmptyState onCreate={handleCreate} />
        ) : (
          <DashboardGrid
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </ContentContainer>
      <ConfirmDialog {...confirmProps} />
    </DashboardContainer>
  );
};

export default Dashboard;
