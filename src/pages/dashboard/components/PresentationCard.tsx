import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, AccessTime, Link as LinkIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { Presentation, PresentationStats } from '@actions/presentations/types';
import { getPresentationStats } from '@actions/analytics';

interface PresentationCardProps {
  presentation: Presentation;
  onEdit: (presentation: Presentation) => void;
  onDelete: (presentation: Presentation) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const PreviewBox = styled(Box)(({ theme }) => ({
  height: 120,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StatsBox = styled(Box)({
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  marginTop: 1,
});

const PresentationCard = ({ presentation, onEdit, onDelete }: PresentationCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<PresentationStats>({ totalViews: 0, avgTimeSpent: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const result = await getPresentationStats(presentation.id);
      if (result && 'totalViews' in result) {
        setStats(result);
      }
    };
    loadStats();
  }, [presentation.id]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(presentation);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(presentation);
    handleMenuClose();
  };

  const copyLink = () => {
    const url = `${window.location.origin}/${presentation.id}`;
    navigator.clipboard.writeText(url);
    handleMenuClose();
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <StyledCard>
      <PreviewBox>
        <Typography variant="h2" color="text.secondary" sx={{ opacity: 0.3 }}>
          {`<${presentation.id}/>`}
        </Typography>
      </PreviewBox>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, pr: 1 }}>
            {presentation.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={presentation.id}
            size="small"
            sx={{ fontFamily: 'monospace' }}
          />
          <Chip
            label={presentation.isActive ? 'Ativa' : 'Inativa'}
            size="small"
            color={presentation.isActive ? 'success' : 'default'}
          />
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <StatsBox>
            <Visibility fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {stats.totalViews} visualizações
            </Typography>
          </StatsBox>
          <StatsBox>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Média: {formatTime(stats.avgTimeSpent)}
            </Typography>
          </StatsBox>
        </Box>
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={copyLink}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Copiar link
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Deletar
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default PresentationCard;
