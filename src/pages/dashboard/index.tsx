import { useEffect, useState } from 'react';
import { Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Add, Code } from '@mui/icons-material';
import usePresentationsStore from '@stores/presentations';
import { getAllPresentations, createPresentation, updatePresentation, deletePresentation } from '@actions/presentations';
import useAction from '@hooks/useAction';
import Loading from '@components/loading';
import PresentationCard from './components/PresentationCard';
import PresentationForm from './components/PresentationForm';
import {
  DashboardContainer,
  StyledAppBar,
  StyledToolbar,
  ContentContainer,
  EmptyState,
  GridContainer,
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

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    setLoading(true);
    const result = await getAllPresentations();
    if (result && !('error' in result)) {
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
        callback: (updated) => updatePresentationInStore(updated),
        toastMessages: {
          pending: 'Atualizando apresentação...',
          success: 'Apresentação atualizada!',
          error: 'Erro ao atualizar apresentação',
        },
      });
    } else {
      await useAction({
        action: () => createPresentation(data),
        callback: (created) => addPresentation(created),
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

  if (loading) {
    return <Loading message="Carregando apresentações" />;
  }

  return (
    <DashboardContainer>
      <StyledAppBar position="static" color="default">
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code />
            <Typography variant="h6">Code Presentations</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Nova Apresentação
          </Button>
        </StyledToolbar>
      </StyledAppBar>

      <ContentContainer>
        {presentations.length === 0 ? (
          <EmptyState>
            <Code sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
            <Typography variant="h5" gutterBottom>
              Nenhuma apresentação criada
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Crie sua primeira apresentação de código HTML/CSS/JS
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreate}
            >
              Criar Apresentação
            </Button>
          </EmptyState>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Minhas Apresentações
            </Typography>
            <GridContainer>
              {presentations.map((presentation) => (
                <PresentationCard
                  key={presentation._id}
                  presentation={presentation}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </GridContainer>
          </>
        )}
      </ContentContainer>

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
