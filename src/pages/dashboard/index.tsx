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
import usePresentationsStore from '@stores/presentations';
import { getAllPresentations, deletePresentation } from '@actions/presentations';
import useAction from '@hooks/useAction';
import Loading from '@components/loading';
import PresentationCard from './components/PresentationCard';
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
import type { Presentation } from '@actions/presentations/types';

const Dashboard = () => {
  const {
    presentations: { presentations, loading },
    setPresentations,
    removePresentation,
    setLoading,
  } = usePresentationsStore();

  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<Presentation | null>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    setLoading(true);
    const result = await getAllPresentations();
    if (result && Array.isArray(result)) {
      setPresentations(result);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    navigate('/dashboard/edit');
  };

  const handleEdit = (presentation: Presentation) => {
    navigate(`/dashboard/edit?slug=${presentation.slug}`);
  };

  const handleDeleteClick = (presentation: Presentation) => {
    setPresentationToDelete(presentation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presentationToDelete) return;

    await useAction({
      action: () => deletePresentation(presentationToDelete._id),
      callback: () => removePresentation(presentationToDelete._id),
      toastMessages: {
        pending: 'Deletando apresentação...',
        success: 'Apresentação deletada!',
        error: 'Erro ao deletar apresentação',
      },
    });

    setDeleteDialogOpen(false);
    setPresentationToDelete(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.location.reload();
  };

  if (loading) {
    return <Loading message="Carregando apresentações" />;
  }

  return (
    <DashboardContainer>
      <ContentContainer>
        <Header>
          <TitleSection>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              Minhas Apresentações
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie seus slides e acompanhe estatísticas
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

            {presentations.length > 0 && (
              <CreateButton
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
              >
                Nova Apresentação
              </CreateButton>
            )}
          </ActionSection>
        </Header>

        {presentations.length === 0 ? (
          <EmptyState>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhuma apresentação encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
              Crie sua primeira apresentação para começar a compartilhar suas ideias com o mundo.
            </Typography>
            <CreateButton
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreate}
            >
              Criar Apresentação
            </CreateButton>
          </EmptyState>
        ) : (
          <GridContainer>
            {presentations.map((presentation) => {
              if (!presentation || !presentation._id) return null;
              return (
                <PresentationCard
                  key={presentation._id}
                  presentation={presentation}
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
        <DialogTitle sx={{ fontWeight: 600 }}>Excluir apresentação?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a excluir "<strong>{presentationToDelete?.title}</strong>".
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