import { getAllShareds, deleteShared } from '@actions/shareds';
import { DashboardContainer, ContentContainer } from './styles';
import { useNavigate } from 'react-router-dom';
import useSharedsStore from '@stores/shareds';
import { useEffect, useState } from 'react';
import useSystemStore from '@stores/system';
import Loading from '@components/loading';
import useAction from '@hooks/useAction';

import DeleteConfirmationDialog from './subcomponents/deleteDialog';
import DashboardEmptyState from './subcomponents/emptyState';
import DashboardHeader from './subcomponents/header';
import DashboardGrid from './subcomponents/grid';

import type { Shared } from '@actions/shareds/types';

const Dashboard = () => {
  const { shareds: { data, loading }, setShareds, removeShared, setLoading } = useSharedsStore();
  const { system: { theme }, toggleTheme } = useSystemStore();
  const navigate = useNavigate();

  const [sharedToDelete, setSharedToDelete] = useState<Shared | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadShareds();
  }, []);

  const loadShareds = async () => {
    setLoading(true);
    const result = await getAllShareds();
    if (result && Array.isArray(result)) {
      setShareds(result);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    navigate('/dashboard/edit');
  };

  const handleEdit = (shared: Shared) => {
    navigate(`/dashboard/edit?slug=${shared.slug}`);
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
  };

  const handleDeleteClick = (shared: Shared) => {
    setSharedToDelete(shared);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sharedToDelete) return;

    await useAction({
      action: () => deleteShared(sharedToDelete._id),
      callback: () => removeShared(sharedToDelete._id),
      toastMessages: {
        pending: 'Deletando compartilhamento...',
        success: 'Compartilhamento deletado!',
        error: 'Erro ao deletar compartilhamento',
      },
    });

    setDeleteDialogOpen(false);
    setSharedToDelete(null);
  };

  if (loading) {
    return <Loading message="Carregando compartilhamentos" />;
  }

  return (
    <DashboardContainer>
      <ContentContainer>
        <DashboardHeader
          theme={theme}
          showCreateButton={data.length > 0}
          onToggleTheme={toggleTheme}
          onSettings={handleSettings}
          onCreate={handleCreate}
        />

        {data.length === 0 ? (
          <DashboardEmptyState onCreate={handleCreate} />
        ) : (
          <DashboardGrid 
            data={data} 
            onEdit={handleEdit} 
            onDelete={handleDeleteClick} 
          />
        )}
      </ContentContainer>

      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        itemName={sharedToDelete?.title}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardContainer>
  );
};

export default Dashboard;