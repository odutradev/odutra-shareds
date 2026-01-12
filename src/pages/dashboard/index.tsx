import { useEffect, useState } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Add } from '@mui/icons-material';
import usePresentationsStore from '@stores/presentations';
import { getAllPresentations, createPresentation, updatePresentation, deletePresentation } from '@actions/presentations';
import useAction from '@hooks/useAction';
import Loading from '@components/loading';
import PresentationCard from './components/PresentationCard';
import PresentationForm from './components/PresentationForm';
import {
  DashboardContainer,
  ContentContainer,
  EmptyState,
  GridContainer,
  FloatingButton,
  Footer,
  ThemeToggle,
} from './styles';
import type { Presentation, CreatePresentationData } from '@actions/presentations/types';

const Dashboard = () => {
  const {
    presentations: { presentations, selectedPresentation, loading },
    setPresentations,
    addPresentation,
    updatePresentationInStore,
    removePresentation,
    setSelectedPresentation,
    setLoading,
  } = usePresentationsStore();

  const [formOpen, setFormOpen] = useState(false);
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
    setSelectedPresentation(null);
    setFormOpen(true);
  };

  const handleEdit = (presentation: Presentation) => {
    setSelectedPresentation(presentation);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CreatePresentationData) => {
    if (selectedPresentation) {
      await useAction({
        action: () => updatePresentation(selectedPresentation._id, data),
        callback: (updated) => {
            if (updated && updated._id) updatePresentationInStore(updated);
        },
        toastMessages: {
          pending: 'Atualizando apresentação...',
          success: 'Apresentação atualizada!',
          error: 'Erro ao atualizar apresentação',
        },
      });
    } else {
      await useAction({
        action: () => createPresentation(data),
        callback: (created) => {
            if (created && created._id) {
                addPresentation(created);
            }
        },
        toastMessages: {
          pending: 'Criando apresentação...',
          success: 'Apresentação criada!',
          error: 'Erro ao criar apresentação',
        },
      });
    }
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
        {presentations.length === 0 ? (
          <EmptyState>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Suas Apresentações
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.7 }}>
              Nenhuma apresentação criada ainda
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{ borderRadius: '12px', px: 4, py: 1.5 }}
            >
              Nova Apresentação
            </Button>
          </EmptyState>
        ) : (
          <>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 4,
                pl: 1
              }}
            >
              Suas Apresentações
            </Typography>
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
          </>
        )}
      </ContentContainer>

      <FloatingButton
        variant="contained"
        onClick={handleCreate}
        sx={{ display: presentations.length > 0 ? 'flex' : 'none' }}
      >
        <Add />
      </FloatingButton>

      <Footer>
        <ThemeToggle onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </ThemeToggle>
      </Footer>

      <PresentationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        presentation={selectedPresentation}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar a apresentação "{presentationToDelete?.title}"?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

export default Dashboard;