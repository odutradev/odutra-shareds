import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getSystemMetrics, performBackup, restoreBackup, clearCollection, deleteProject } from '@actions/settings';
import SettingsDataManagement from './subcomponents/dataManagement';
import SettingsDangerZone from './subcomponents/dangerZone';
import useConfirmDialog from '@hooks/useConfirmDialog';
import SettingsMetrics from './subcomponents/metrics';
import ConfirmDialog from '@components/confirmDialog';
import { SettingsContainer, Content } from './styles';
import SettingsHeader from './subcomponents/header';
import useAction from '@hooks/useAction';

import type { SystemMetrics } from '@actions/settings/types';

const Settings = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const { confirm, props: confirmProps } = useConfirmDialog();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const result = await getSystemMetrics();
    if (result && !('error' in result)) setMetrics(result);
    setLoading(false);
  };

  const handleBackup = async () => {
    await useAction({
      action: performBackup,
      toastMessages: {
        pending: 'Gerando backup...',
        success: 'Backup iniciado!',
        error: 'Erro ao gerar backup',
      },
    });
  };

  const handleRestore = async (file: File) => {
    const isConfirmed = await confirm({
      title: 'Restaurar Backup',
      message: 'Isso irá adicionar os dados do arquivo ao seu sistema atual. Dados duplicados podem gerar erros. Deseja continuar?',
      confirmText: 'Restaurar',
      variant: 'primary',
    });

    if (isConfirmed) {
      await useAction({
        action: () => restoreBackup(file),
        callback: loadMetrics,
        toastMessages: { pending: 'Restaurando...', success: 'Dados restaurados!', error: 'Erro na restauração' }
      });
    }
  };

  const handleClearViews = async () => {
    const isConfirmed = await confirm({
      title: 'Limpar Histórico de Views',
      message: 'Tem certeza que deseja apagar todos os registros de visualizações?',
      confirmText: 'Limpar',
      variant: 'warning',
    });

    if (isConfirmed) {
      await useAction({
        action: () => clearCollection('analytics_views'),
        callback: loadMetrics,
        toastMessages: { pending: 'Limpando...', success: 'Views limpas!', error: 'Erro ao limpar' }
      });
    }
  };

  const handleClearTime = async () => {
    const isConfirmed = await confirm({
      title: 'Limpar Registros de Tempo',
      message: 'Tem certeza que deseja apagar todos os registros de tempo?',
      confirmText: 'Limpar',
      variant: 'warning',
    });

    if (isConfirmed) {
      await useAction({
        action: () => clearCollection('analytics_time'),
        callback: loadMetrics,
        toastMessages: { pending: 'Limpando...', success: 'Registros limpos!', error: 'Erro ao limpar' }
      });
    }
  };

  const handleDeleteProject = async () => {
    const isConfirmed = await confirm({
      title: 'DELETAR PROJETO INTEIRO',
      message: 'ATENÇÃO: Isso apagará TODOS os compartilhamentos e TODOS os dados de analytics. O sistema será resetado.',
      confirmText: 'DELETAR TUDO',
      variant: 'error',
    });

    if (isConfirmed) {
      await deleteProject();
      navigate('/');
      window.location.reload();
    }
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
      <ConfirmDialog {...confirmProps} />
    </SettingsContainer>
  );
};

export default Settings;