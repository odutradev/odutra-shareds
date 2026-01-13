import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Tooltip
} from '@mui/material';
import { Add, DarkMode, LightMode, Settings } from '@mui/icons-material';
import useSharedsStore from '@stores/shareds';
import { getAllShareds, deleteShared } from '@actions/shareds';
import useAction from '@hooks/useAction';
import Loading from '@components/loading';
import SharedCard from './components/SharedCard';
import {
  DashboardContainer,
  ContentContainer,
  Header,
  TitleSection,
  ActionSection,
  EmptyState,
  GridContainer,
  HeaderIconButton,
  CreateButton,
} from './styles';
import type { Shared } from '@actions/shareds/types';

const Dashboard = () => {
  const {
    shareds: { data, loading },
    setShareds,
    removeShared,
    setLoading,
  } = useSharedsStore();

  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sharedToDelete, setSharedToDelete] = useState<Shared | null>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.location.reload();
  };

  if (loading) {
    return <Loading message="Carregando compartilhamentos" />;
  }

  return (
    <DashboardContainer>
      <ContentContainer>
        <Header>
          <TitleSection>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              Meus Compartilhamentos
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie seus links, páginas e conteúdos compartilhados
            </Typography>
          </TitleSection>

          <ActionSection>
            <Tooltip title="Configurações">
              <HeaderIconButton onClick={() => navigate('/dashboard/settings')}>
                <Settings fontSize="small" />
              </HeaderIconButton>
            </Tooltip>

            <Tooltip title="Alternar tema">
              <HeaderIconButton onClick={toggleTheme}>
                {theme === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
              </HeaderIconButton>
            </Tooltip>

            {data.length > 0 && (
              <CreateButton
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
              >
                Novo Compartilhamento
              </CreateButton>
            )}
          </ActionSection>
        </Header>

        {data.length === 0 ? (
          <EmptyState>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhum compartilhamento encontrado
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
              Crie seu primeiro link ou página para começar a compartilhar suas ideias com o mundo.
            </Typography>
            <CreateButton
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreate}
            >
              Criar Compartilhamento
            </CreateButton>
          </EmptyState>
        ) : (
          <GridContainer>
            {data.map((shared) => {
              if (!shared || !shared._id) return null;
              return (
                <SharedCard
                  key={shared._id}
                  shared={shared}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </GridContainer>
        )}
      </ContentContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px', padding: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Excluir compartilhamento?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a excluir "<strong>{sharedToDelete?.title}</strong>".
            Esta ação é irreversível e todos os dados de estatísticas serão perdidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: '8px', color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disableElevation
            sx={{ borderRadius: '8px' }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

export default Dashboard;