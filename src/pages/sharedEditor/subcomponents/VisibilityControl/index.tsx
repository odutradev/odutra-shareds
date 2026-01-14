import { Box, Typography } from '@mui/material';

import { StatusSwitch, StatusToggleContainer } from './styles';
import type { VisibilityControlProps } from './types';

const VisibilityControl = ({ isActive, slug, onChange }: VisibilityControlProps) => {
  return (
    <StatusToggleContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Visibilidade
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isActive
            ? `Público em: ${window.location.origin}/${slug || '...'}`
            : 'Oculto (404 para visitantes)'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: isActive ? 'success.main' : 'text.disabled',
            fontWeight: 600,
            minWidth: '60px',
            textAlign: 'right',
          }}
        >
          {isActive ? 'Ativo' : 'Inativo'}
        </Typography>
        <StatusSwitch
          checked={isActive}
          onChange={(e: any) => onChange(e.target.checked)}
        />
      </Box>
    </StatusToggleContainer>
  );
};

export default VisibilityControl;