import { Backup, CloudUpload } from '@mui/icons-material';
import { Typography, Button, Box } from '@mui/material';
import { useRef } from 'react';

import { ActionCard, ActionRow, SectionTitle } from './styles';

import type { SettingsDataManagementProps } from './types';

const SettingsDataManagement = ({ onBackup, onRestore, onClearViews, onClearTime }: SettingsDataManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onRestore(file);
      event.target.value = '';
    }
  };

  return (
    <Box>
      <SectionTitle variant="h6">Gerenciamento de Dados</SectionTitle>
      <ActionCard>
        <ActionRow>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Backup dos Dados</Typography>
            <Typography variant="body2" color="text.secondary">
              Baixe um arquivo JSON contendo todos os compartilhamentos e métricas.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Backup />} onClick={onBackup}>
            Fazer Backup
          </Button>
        </ActionRow>

        <ActionRow>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Restaurar Backup</Typography>
            <Typography variant="body2" color="text.secondary">
              Importe um arquivo JSON para restaurar dados antigos.
            </Typography>
          </Box>
          <Box>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => fileInputRef.current?.click()}>
              Importar Dados
            </Button>
          </Box>
        </ActionRow>

        <ActionRow>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Limpar Visualizações</Typography>
            <Typography variant="body2" color="text.secondary">
              Remove todo o histórico de quem acessou seus links.
            </Typography>
          </Box>
          <Button color="warning" onClick={onClearViews}>
            Limpar Views
          </Button>
        </ActionRow>

        <ActionRow>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Limpar Métricas de Tempo</Typography>
            <Typography variant="body2" color="text.secondary">
              Remove os dados de tempo de permanência.
            </Typography>
          </Box>
          <Button color="warning" onClick={onClearTime}>
            Limpar Tempo
          </Button>
        </ActionRow>
      </ActionCard>
    </Box>
  );
};

export default SettingsDataManagement;