import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack,
  Backup,
  DeleteForever,
  Slideshow,
  Visibility,
  AccessTime,
  Warning
} from '@mui/icons-material';
import useAction from '@hooks/useAction';
import { getSystemMetrics, performBackup, clearCollection, deleteProject } from '@actions/settings';
import type { SystemMetrics } from '@actions/settings/types';
import {
  SettingsContainer,
  ContentContainer,
  Header,
  SectionTitle,
  MetricsGrid,
  MetricCard,
  ActionCard,
  ActionRow,
  DangerButton
} from './styles';

const Settings = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const result = await getSystemMetrics();
    if (result && !('error' in result)) {
      setMetrics(result);
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    await useAction({
        action: performBackup,
        callback: () => {},
        toastMessages: {
            pending: 'Gerando backup...',
            success: 'Backup iniciado!',
            error: 'Erro ao gerar backup'
        }
    });
  };

  const openConfirmDialog = (
    title: string,
    message: string,
    actionFn: () => Promise<any>
  ) => {
    setDialogConfig({
        title,
        message,
        action: async () => {
            await useAction({
                action: actionFn,
                callback: () => {
                    loadMetrics();
                    setDialogOpen(false);
                },
                toastMessages: {
                    pending: 'Processando...',
                    success: 'Operação realizada com sucesso!',
                    error: 'Erro ao realizar operação'
                }
            });
        }
    });
    setDialogOpen(true);
  };

  const handleDeleteViews = () => {
    openConfirmDialog(
        'Limpar Histórico de Views',
        'Tem certeza que deseja apagar todos os registros de visualizações? Isso zerará as contagens de views.',
        () => clearCollection('analytics_views')
    );
  };

  const handleDeleteTime = () => {
    openConfirmDialog(
        'Limpar Registros de Tempo',
        'Tem certeza que deseja apagar todos os registros de tempo? As estatísticas de tempo médio serão perdidas.',
        () => clearCollection('analytics_time')
    );
  };

  const handleDeleteProject = () => {
    openConfirmDialog(
        'DELETAR PROJETO INTEIRO',
        'ATENÇÃO: Isso apagará TODAS as apresentações e TODOS os dados de analytics. Esta ação não pode ser desfeita. O sistema será resetado.',
        async () => {
            await deleteProject();
            navigate('/');
            window.location.reload();
        }
    );
  };

  return (
    <SettingsContainer>
      <ContentContainer>
        <Header>
          <IconButton onClick={() => navigate('/dashboard/projects')} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Configurações
          </Typography>
        </Header>

        <SectionTitle variant="h6">Visão Geral do Sistema</SectionTitle>
        <MetricsGrid>
          <MetricCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
              <Slideshow />
              <Typography variant="subtitle2" fontWeight={600}>Apresentações</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {loading ? <CircularProgress size={20} /> : metrics?.presentationsCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">Cadastradas no sistema</Typography>
          </MetricCard>

          <MetricCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'info.main' }}>
              <Visibility />
              <Typography variant="subtitle2" fontWeight={600}>Total de Views</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {loading ? <CircularProgress size={20} /> : metrics?.viewsCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">Visualizações registradas</Typography>
          </MetricCard>

          <MetricCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'success.main' }}>
              <AccessTime />
              <Typography variant="subtitle2" fontWeight={600}>Registros de Tempo</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {loading ? <CircularProgress size={20} /> : metrics?.timeRecordsCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">Pings de atividade</Typography>
          </MetricCard>
        </MetricsGrid>

        <SectionTitle variant="h6">Gerenciamento de Dados</SectionTitle>
        <ActionCard>
          <ActionRow>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Backup dos Dados</Typography>
              <Typography variant="body2" color="text.secondary">
                Baixe um arquivo JSON contendo todas as apresentações e métricas.
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<Backup />} onClick={handleBackup}>
              Fazer Backup
            </Button>
          </ActionRow>

          <ActionRow>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Limpar Visualizações</Typography>
              <Typography variant="body2" color="text.secondary">
                Remove todo o histórico de quem acessou suas apresentações.
              </Typography>
            </Box>
            <Button color="warning" onClick={handleDeleteViews}>
              Limpar Views
            </Button>
          </ActionRow>

          <ActionRow>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Limpar Métricas de Tempo</Typography>
              <Typography variant="body2" color="text.secondary">
                Remove os dados de tempo de permanência nos slides.
              </Typography>
            </Box>
            <Button color="warning" onClick={handleDeleteTime}>
              Limpar Tempo
            </Button>
          </ActionRow>
        </ActionCard>

        <SectionTitle variant="h6" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning fontSize="small" /> Zona de Perigo
        </SectionTitle>
        <ActionCard sx={{ borderColor: 'error.main', borderWidth: 1 }}>
            <ActionRow sx={{ borderBottom: 'none' }}>
                <Box>
                <Typography variant="subtitle1" fontWeight={600} color="error.main">Deletar Projeto</Typography>
                <Typography variant="body2" color="text.secondary">
                    Esta ação apagará permanentemente todos os dados do banco de dados para este projeto.
                </Typography>
                </Box>
                <DangerButton variant="outlined" startIcon={<DeleteForever />} onClick={handleDeleteProject}>
                    Deletar Tudo
                </DangerButton>
            </ActionRow>
        </ActionCard>

      </ContentContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', padding: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>{dialogConfig?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogConfig?.message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            onClick={dialogConfig?.action}
            variant="contained"
            color="error"
            disableElevation
            sx={{ borderRadius: '8px' }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </SettingsContainer>
  );
};

export default Settings;