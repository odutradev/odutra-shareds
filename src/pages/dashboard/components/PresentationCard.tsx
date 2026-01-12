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
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '16px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(100, 108, 255, 0.15)'
      : '0 12px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const PreviewBox = styled(Box)(({ theme }) => ({
  height: 140,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StatsBox = styled(Box)({
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  marginTop: 1,
});

const PresentationCard = ({ presentation, onEdit, onDelete }: PresentationCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<PresentationStats>({ totalViews: 0, avgTimeSpent: 0 });

  useEffect(() => {
    const loadStats = async () => {

      const result = await getPresentationStats(presentation.slug);
      if (result && 'totalViews' in result) {
        setStats(result);
      }
    };
    loadStats();
  }, [presentation.slug]);

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
    const url = `${window.location.origin}/${presentation.slug}`;
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
        <Typography
          variant="h2"
          sx={{
            opacity: 0.15,
            fontWeight: 700,
            fontFamily: 'monospace',
          }}
        >
          {`<${presentation.slug}/>`}
        </Typography>
      </PreviewBox>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              flexGrow: 1,
              pr: 1,
              fontWeight: 600,
            }}
          >
            {presentation.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ mt: -1 }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={presentation.slug}
            size="small"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          />
          <Chip
            label={presentation.isActive ? 'Ativa' : 'Inativa'}
            size="small"
            color={presentation.isActive ? 'success' : 'default'}
          />
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <StatsBox>
            <Visibility fontSize="small" sx={{ opacity: 0.6 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {stats.totalViews} visualizações
            </Typography>
          </StatsBox>
          <StatsBox>
            <AccessTime fontSize="small" sx={{ opacity: 0.6 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Média: {formatTime(stats.avgTimeSpent)}
            </Typography>
          </StatsBox>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1.5 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={copyLink}>
          <LinkIcon fontSize="small" sx={{ mr: 1.5 }} />
          Copiar link
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1.5 }} />
          Deletar
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default PresentationCard;