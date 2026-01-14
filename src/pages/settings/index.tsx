import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getSystemMetrics, performBackup, restoreBackup, clearCollection, deleteProject } from '@actions/settings';
import SettingsDataManagement from './subcomponents/dataManagement';
import SettingsConfirmDialog from './subcomponents/confirmDialog';
import SettingsDangerZone from './subcomponents/dangerZone';
import SettingsMetrics from './subcomponents/metrics';
import { SettingsContainer, Content } from './styles';
import SettingsHeader from './subcomponents/header';
import useAction from '@hooks/useAction';

import type { SystemMetrics } from '@actions/settings/types';
import type { DialogConfig } from './types';

const Settings = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const result = await getSystemMetrics();
    if (result && !('error' in result)) setMetrics(result);
    setLoading(false);
  };

  const openConfirmDialog = (title: string, message: string, actionFn: () => Promise<void>) => {
    setDialogConfig({
      title,
      message,
      action: async () => {
        await useAction({
          action: actionFn,
          callback: () => setDialogOpen(false),
          toastMessages: {
            pending: 'Processando...',
            success: 'Operação realizada!',
            error: 'Erro ao realizar operação',
          },
        });
      },
    });
    setDialogOpen(true);
  };

  const handleBackup = async () => {
    await useAction({
      action: performBackup,
      callback: () => {},
      toastMessages: {
        pending: 'Gerando backup...',
        success: 'Backup iniciado!',
        error: 'Erro ao gerar backup',
      },
    });
  };

  const handleRestore = (file: File) => {
    openConfirmDialog(
      'Restaurar Backup',
      'Isso irá adicionar os dados do arquivo ao seu sistema atual. Dados duplicados podem gerar erros. Deseja continuar?',
      async () => {
        await restoreBackup(file);
        loadMetrics();
      }
    );
  };

  const handleClearViews = () => {
    openConfirmDialog(
      'Limpar Histórico de Views',
      'Tem certeza que deseja apagar todos os registros de visualizações?',
      async () => {
        await clearCollection('analytics_views');
        loadMetrics();
      }
    );
  };

  const handleClearTime = () => {
    openConfirmDialog(
      'Limpar Registros de Tempo',
      'Tem certeza que deseja apagar todos os registros de tempo?',
      async () => {
        await clearCollection('analytics_time');
        loadMetrics();
      }
    );
  };

  const handleDeleteProject = () => {
    openConfirmDialog(
      'DELETAR PROJETO INTEIRO',
      'ATENÇÃO: Isso apagará TODOS os compartilhamentos e TODOS os dados de analytics. O sistema será resetado.',
      async () => {
        await deleteProject();
        navigate('/');
        window.location.reload();
      }
    );
  };

  return (
    <SettingsContainer>
      <Content>
        <SettingsHeader onBack={() => navigate('/dashboard/projects')} />

        <SettingsMetrics
          metrics={metrics}
          loading={loading}
        />

        <SettingsDataManagement
          onBackup={handleBackup}
          onRestore={handleRestore}
          onClearViews={handleClearViews}
          onClearTime={handleClearTime}
        />

        <SettingsDangerZone
          onDeleteProject={handleDeleteProject}
        />
      </Content>

      <SettingsConfirmDialog
        open={dialogOpen}
        config={dialogConfig}
        onClose={() => setDialogOpen(false)}
      />
    </SettingsContainer>
  );
};

export default Settings;