import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { HeaderContainer } from './styles';

import type { EditorHeaderProps } from './types';

const EditorHeader = ({ isEditMode, loading, isFormValid, onSave }: EditorHeaderProps) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/dashboard/projects')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? 'Editar Compartilhamento' : 'Novo Compartilhamento'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          onClick={() => navigate('/dashboard/projects')}
          disabled={loading}
          size="large"
        >
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          size="large"
          startIcon={<Save />}
          disabled={!isFormValid}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
        </Button>
      </Box>
    </HeaderContainer>
  );
};

export default EditorHeader;