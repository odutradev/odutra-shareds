import { EmptyStateContainer, EmptyStateButton } from './styles';
import { Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

import type { DashboardEmptyStateProps } from './types';

const DashboardEmptyState = ({ onCreate }: DashboardEmptyStateProps) => {
  return (
    <EmptyStateContainer>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Nenhum compartilhamento encontrado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        Crie seu primeiro link ou página para começar a compartilhar suas ideias com o mundo.
      </Typography>
      <EmptyStateButton
        variant="contained"
        size="large"
        startIcon={<Add />}
        onClick={onCreate}
      >
        Criar Compartilhamento
      </EmptyStateButton>
    </EmptyStateContainer>
  );
};

export default DashboardEmptyState;
