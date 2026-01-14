import { Box, CircularProgress, IconButton, TextField, Tooltip } from '@mui/material';
import { Casino, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

import type { GeneralSettingsProps } from './types';

const GeneralSettings = ({ title, slug, slugError, checkingSlug, onTitleChange, onSlugChange, onGenerateSlug }: GeneralSettingsProps) => {
  const isSlugValid = slug && !slugError && !checkingSlug;
  const isSlugInvalid = !!slugError;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
      <TextField
        label="Título"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        fullWidth
        variant="outlined"
        placeholder="Ex: Minha Página Incrível"
      />

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          label="Slug / URL"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          error={isSlugInvalid}
          helperText={slugError || ''}
          required
          fullWidth
          variant="outlined"
          placeholder="Ex: minha-pagina"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: isSlugValid ? 'success.main' : undefined },
              '&:hover fieldset': { borderColor: isSlugValid ? 'success.main' : undefined },
              '&.Mui-focused fieldset': { borderColor: isSlugValid ? 'success.main' : undefined },
            },
          }}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {checkingSlug && <Tooltip title="Verificando..."><CircularProgress size={20} /></Tooltip>}
                {!checkingSlug && isSlugInvalid && <Tooltip title={slugError}><ErrorIcon color="error" /></Tooltip>}
                {!checkingSlug && isSlugValid && <Tooltip title="Disponível"><CheckCircle color="success" /></Tooltip>}
              </Box>
            )
          }}
        />
        <Tooltip title="Gerar ID aleatório">
          <IconButton
            onClick={onGenerateSlug}
            size="large"
            sx={{
              width: 56, height: 56, borderRadius: 1, border: '1px solid', borderColor: 'action.disabled',
              color: 'text.secondary', transition: 'all 0.2s ease',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'action.hover' }
            }}
          >
            <Casino />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default GeneralSettings;