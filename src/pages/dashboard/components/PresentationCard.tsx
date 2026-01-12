import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Link as LinkIcon, OpenInNew } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { Presentation, PresentationStats } from '@actions/presentations/types';
import { getPresentationStats } from '@actions/analytics';

interface PresentationCardProps {
  presentation: Presentation;
  onEdit: (presentation: Presentation) => void;
  onDelete: (presentation: Presentation) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  height: 'auto',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.08)',
  },
}));

const PresentationCard = ({ presentation, onEdit, onDelete }: PresentationCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<PresentationStats>({ totalViews: 0, avgTimeSpent: 0 });

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      const result = await getPresentationStats(presentation.slug);

      if (mounted && result && 'totalViews' in result) {
        setStats(result);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [presentation.slug]);

  const handleCardClick = () => {
    onEdit(presentation);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOption = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onEdit(presentation);
    handleMenuClose();
  };

  const handleDeleteOption = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDelete(presentation);
    handleMenuClose();
  };

  const copyLink = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const url = `${window.location.origin}/${presentation.slug}`;
    navigator.clipboard.writeText(url);
    handleMenuClose();
  };

  const openPresentation = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const url = `${window.location.origin}/${presentation.slug}`;
    window.open(url, '_blank');
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardContent sx={{ p: '24px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.3,
                mb: 1.5,
                color: 'text.primary'
              }}
            >
              {presentation.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={presentation.isActive ? 'Ativa' : 'Inativa'}
                size="small"
                color={presentation.isActive ? 'success' : 'default'}
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: presentation.isActive ? 'success.main' : 'divider'
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <Visibility sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {stats.totalViews}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Abrir site">
              <IconButton
                size="small"
                onClick={openPresentation}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.lighter'
                  }
                }}
              >
                <OpenInNew fontSize="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: 'text.secondary' }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditOption}>
          <Edit fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          <Typography variant="body2">Editar</Typography>
        </MenuItem>
        <MenuItem onClick={copyLink}>
          <LinkIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          <Typography variant="body2">Copiar link</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteOption} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1.5 }} />
          <Typography variant="body2">Deletar</Typography>
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default PresentationCard;