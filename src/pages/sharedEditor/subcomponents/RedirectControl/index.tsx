import { Box, Switch, TextField, Typography } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

import type { RedirectControlProps } from './types';

const RedirectControl = ({ isRedirect, redirectUrl, onChangeRedirect, onChangeUrl }: RedirectControlProps) => {
  return (
    <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: 'background.paper', transition: 'all 0.2s' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: isRedirect ? 3 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: '8px', bgcolor: isRedirect ? 'primary.lighter' : 'action.hover', color: isRedirect ? 'primary.main' : 'text.secondary' }}>
            <LinkIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Modo Redirecionador</Typography>
            <Typography variant="body2" color="text.secondary">
              Ao invés de exibir conteúdo, redireciona o visitante para outra URL.
            </Typography>
          </Box>
        </Box>
        <Switch
          checked={isRedirect}
          onChange={(e) => onChangeRedirect(e.target.checked)}
        />
      </Box>

      {isRedirect && (
        <TextField
          fullWidth
          label="URL de Destino"
          placeholder="https://exemplo.com"
          value={redirectUrl}
          onChange={(e) => onChangeUrl(e.target.value)}
          InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
          helperText="Certifique-se de incluir https://"
        />
      )}
    </Box>
  );
};

export default RedirectControl;