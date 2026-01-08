import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { Refresh, Close, Code, Style, Javascript } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CodeEditor from '@components/codeEditor';
import type { Presentation, CreatePresentationData } from '@actions/presentations/types';
import { generateId, isValidId } from '@utils/functions/idGenerator';
import { checkIdAvailable } from '@actions/presentations';

interface PresentationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePresentationData) => void;
  presentation?: Presentation | null;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    margin: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2.5, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  minHeight: '64px',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' ? '#444' : '#888',
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#555' : '#777',
    },
  },
}));

const EditorToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
}));

const ToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  border: 'none',
  backgroundColor: active
    ? theme.palette.primary.main
    : 'transparent',
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)',
  },
  transition: 'all 0.2s ease',
}));

const EditorLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

const StatusToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
}));

const StatusSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== 'checked',
})<{ checked: boolean }>(({ theme, checked }) => ({
  width: 56,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: checked ? '#4caf50' : theme.palette.error.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 28,
    height: 28,
  },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const PresentationForm = ({ open, onClose, onSubmit, presentation }: PresentationFormProps) => {
  const [formData, setFormData] = useState<CreatePresentationData>({
    id: '',
    title: '',
    html: '',
    css: '',
    js: '',
    isActive: true,
  });
  const [idError, setIdError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css' | 'js'>('html');

  useEffect(() => {
    if (presentation) {
      setFormData({
        id: presentation.id,
        title: presentation.title,
        html: presentation.html,
        css: presentation.css || '',
        js: presentation.js || '',
        isActive: presentation.isActive,
      });
    } else if (open && !presentation) {
      handleGenerateId();
    }
  }, [presentation, open]);

  const handleGenerateId = async () => {
    for (let i = 0; i < 10; i++) {
      const newId = generateId(6);
      const result = await checkIdAvailable(newId);
      
      if (!('error' in result) && result === true) {
        setFormData((prev) => ({ ...prev, id: newId }));
        setIdError('');
        return;
      }
    }
    
    setIdError('Erro ao gerar ID. Tente novamente.');
  };

  const handleIdChange = async (value: string) => {
    const lowercaseValue = value.toLowerCase();
    setFormData((prev) => ({ ...prev, id: lowercaseValue }));

    if (!isValidId(lowercaseValue)) {
      setIdError('ID deve ter entre 3-12 caracteres (letras e números)');
      return;
    }

    if (presentation && lowercaseValue === presentation.id) {
      setIdError('');
      return;
    }

    const available = await checkIdAvailable(lowercaseValue);
    if (typeof available === 'boolean' && !available) {
      setIdError('ID já está em uso');
    } else {
      setIdError('');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.html || !formData.id || idError) {
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      id: '',
      title: '',
      html: '',
      css: '',
      js: '',
      isActive: true,
    });
    setIdError('');
    setActiveEditor('html');
    onClose();
  };

  const editorConfig = {
    html: {
      icon: <Code fontSize="small" />,
      label: 'HTML',
      description: 'Estrutura da apresentação',
      value: formData.html,
      onChange: (value: string) => setFormData({ ...formData, html: value }),
      language: 'html' as const,
    },
    css: {
      icon: <Style fontSize="small" />,
      label: 'CSS',
      description: 'Estilos (opcional)',
      value: formData.css || '',
      onChange: (value: string) => setFormData({ ...formData, css: value }),
      language: 'css' as const,
    },
    js: {
      icon: <Javascript fontSize="small" />,
      label: 'JavaScript',
      description: 'Comportamento (opcional)',
      value: formData.js || '',
      onChange: (value: string) => setFormData({ ...formData, js: value }),
      language: 'javascript' as const,
    },
  };

  const currentEditor = editorConfig[activeEditor];

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <StyledDialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
          {presentation ? 'Editar Apresentação' : 'Nova Apresentação'}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ flexShrink: 0 }}>
          <Close />
        </IconButton>
      </StyledDialogTitle>
      
      <StyledDialogContent>
        <Stack spacing={3}>
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
            variant="outlined"
            placeholder="Ex: Minha Apresentação Incrível"
          />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              ID da apresentação (URL: {window.location.origin}/{formData.id || 'seu-id'})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="ID único"
                value={formData.id}
                onChange={(e) => handleIdChange(e.target.value)}
                error={!!idError}
                helperText={idError || 'Entre 3-12 caracteres (letras e números)'}
                required
                sx={{ flexGrow: 1 }}
                inputProps={{ maxLength: 12 }}
                variant="outlined"
                placeholder="Ex: abc123"
              />
              {!presentation && (
                <Tooltip title="Gerar ID aleatório">
                  <IconButton 
                    onClick={handleGenerateId} 
                    color="primary"
                    sx={{ 
                      mt: 0.5,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <StatusToggleContainer>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Status da Apresentação
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formData.isActive ? 'Apresentação visível publicamente' : 'Apresentação oculta'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: formData.isActive ? 'success.main' : 'error.main',
                  fontWeight: 600,
                  minWidth: '60px',
                  textAlign: 'right',
                }}
              >
                {formData.isActive ? 'Ativa' : 'Inativa'}
              </Typography>
              <StatusSwitch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Box>
          </StatusToggleContainer>

          <Box>
            <EditorToggle>
              <ToggleButton
                active={activeEditor === 'html'}
                onClick={() => setActiveEditor('html')}
                startIcon={editorConfig.html.icon}
              >
                HTML
              </ToggleButton>
              <ToggleButton
                active={activeEditor === 'css'}
                onClick={() => setActiveEditor('css')}
                startIcon={editorConfig.css.icon}
              >
                CSS
              </ToggleButton>
              <ToggleButton
                active={activeEditor === 'js'}
                onClick={() => setActiveEditor('js')}
                startIcon={editorConfig.js.icon}
              >
                JavaScript
              </ToggleButton>
            </EditorToggle>

            <EditorLabel>
              {currentEditor.icon}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {currentEditor.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentEditor.description}
                </Typography>
              </Box>
              {activeEditor !== 'html' && (
                <Chip 
                  label="Opcional" 
                  size="small" 
                  sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }}
                />
              )}
            </EditorLabel>

            <CodeEditor
              value={currentEditor.value}
              onChange={currentEditor.onChange}
              language={currentEditor.language}
              height="500px"
            />
          </Box>
        </Stack>
      </StyledDialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} size="large">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={!formData.title || !formData.html || !formData.id || !!idError || loading}
        >
          {presentation ? 'Salvar Alterações' : 'Criar Apresentação'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default PresentationForm;