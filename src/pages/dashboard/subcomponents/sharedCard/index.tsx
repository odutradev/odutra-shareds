import { CardContent, Typography, Tooltip } from '@mui/material';
import { Edit, Delete, Link as LinkIcon } from '@mui/icons-material';

import { StyledCard, CardActionsContainer, ActionButton, DeleteButton } from './styles';

import type { SharedCardProps } from './types';

const SharedCard = ({ shared, onEdit, onDelete }: SharedCardProps) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 600 }}>
          {shared.title || 'Sem título'}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <LinkIcon fontSize="small" />
          /{shared.slug}
        </Typography>
      </CardContent>
      
      <CardActionsContainer>
        <Tooltip title="Editar">
          <ActionButton size="small" onClick={() => onEdit(shared)}>
            <Edit fontSize="small" />
          </ActionButton>
        </Tooltip>
        
        <Tooltip title="Excluir">
          <DeleteButton size="small" onClick={() => onDelete(shared)}>
            <Delete fontSize="small" />
          </DeleteButton>
        </Tooltip>
      </CardActionsContainer>
    </StyledCard>
  );
};

export default SharedCard;
