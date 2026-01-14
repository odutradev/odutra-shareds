import { useState } from 'react';
import { CardContent, Typography, Tooltip } from '@mui/material';
import { Edit, Delete, Link as LinkIcon, ContentCopy, Check } from '@mui/icons-material';

import { StyledCard, CardActionsContainer, ActionButton, DeleteButton, SlugLink } from './styles';
import type { SharedCardProps } from './types';

const SharedCard = ({ shared, onEdit, onDelete }: SharedCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/${shared.slug}`;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    onEdit(shared);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(shared);
  };

  return (
    <StyledCard onClick={handleEdit}>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 600 }}>
          {shared.title || 'Sem título'}
        </Typography>

        <SlugLink
          component="a"
          href={`/${shared.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <LinkIcon fontSize="small" />
          /{shared.slug}
        </SlugLink>
      </CardContent>

      <CardActionsContainer>
        <Tooltip title={copied ? "Copiado!" : "Copiar link"}>
          <ActionButton size="small" onClick={handleCopy}>
            {copied ? <Check fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
          </ActionButton>
        </Tooltip>

        <Tooltip title="Editar">
          <ActionButton size="small" onClick={(e: any) => { e.stopPropagation(); onEdit(shared); }}>
            <Edit fontSize="small" />
          </ActionButton>
        </Tooltip>

        <Tooltip title="Excluir">
          <DeleteButton size="small" onClick={handleDelete}>
            <Delete fontSize="small" />
          </DeleteButton>
        </Tooltip>
      </CardActionsContainer>
    </StyledCard>
  );
};

export default SharedCard;