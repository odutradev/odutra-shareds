import { Link as LinkIcon } from '@mui/icons-material';
import { Box, Switch, TextField, Typography } from '@mui/material';

import { HeaderWrapper, IconWrapper, InfoWrapper, RedirectContainer } from './styles';
import type { RedirectControlProps } from './types';

const RedirectControl = ({ isRedirect, redirectUrl, onChangeRedirect, onChangeUrl }: RedirectControlProps) => {
  return (
    <RedirectContainer>
      <HeaderWrapper hasMargin={isRedirect}>
        <InfoWrapper>
          <IconWrapper active={isRedirect}>
            <LinkIcon />
          </IconWrapper>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Modo Redirecionador
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ao invés de exibir conteúdo, redireciona o visitante para outra URL.
            </Typography>
          </Box>
        </InfoWrapper>
        <Switch
          checked={isRedirect}
          onChange={(e) => onChangeRedirect(e.target.checked)}
        />
      </HeaderWrapper>

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
    </RedirectContainer>
  );
};

export default RedirectControl;