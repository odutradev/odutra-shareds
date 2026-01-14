import { DeleteForever, Warning } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { DangerContainer, DangerRow, DangerButton, SectionTitle } from './styles';

import type { SettingsDangerZoneProps } from './types';

const SettingsDangerZone = ({ onDeleteProject }: SettingsDangerZoneProps) => {
  return (
    <Box>
      <SectionTitle variant="h6">
        <Warning fontSize="small" /> Zona de Perigo
      </SectionTitle>
      <DangerContainer>
        <DangerRow>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="error.main">
              Deletar Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta ação apagará permanentemente todos os dados do banco de dados para este projeto.
            </Typography>
          </Box>
          <DangerButton variant="outlined" startIcon={<DeleteForever />} onClick={onDeleteProject}>
            Deletar Tudo
          </DangerButton>
        </DangerRow>
      </DangerContainer>
    </Box>
  );
};

export default SettingsDangerZone;