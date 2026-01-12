import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Code,
  Style,
  Javascript,
  Save,
  CheckCircle,
  Error as ErrorIcon,
  Casino,
} from '@mui/icons-material';
import CodeEditor from '@components/codeEditor';
import type { Presentation, CreatePresentationData } from '@actions/presentations/types';
import { checkIdAvailable, createPresentation, updatePresentation, getPresentation } from '@actions/presentations';
import useAction from '@hooks/useAction';
import Loading from '@components/loading';

import {
  EditorContainer,
  EditorPaper,
  Header,
  ContentArea,
  EditorToggle,
  ToggleButton,
  EditorLabel,
  StatusToggleContainer,
  StatusSwitch,
} from './styles';

const PresentationEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('slug');

  const [formData, setFormData] = useState<CreatePresentationData>({
    slug: '',
    title: '',
    html: '',
    css: '',
    js: '',
    isActive: true,
  });

  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [slugError, setSlugError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editSlug);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css' | 'js'>('html');

  useEffect(() => {
    if (editSlug) {
      loadPresentation(editSlug);
    }
  }, [editSlug]);

  const loadPresentation = async (slug: string) => {
    setInitialLoading(true);
    try {
      const result = await getPresentation(slug);
      if (result && !('error' in result)) {
        setFormData({
          slug: result.slug,
          title: result.title,
          html: result.html,
          css: result.css || '',
          js: result.js || '',
          isActive: result.isActive,
        });
        setPresentationId(result._id);
      } else {
        navigate('/dashboard/projects');
      }
    } catch (error) {
      console.error('Erro ao carregar apresentação', error);
      navigate('/dashboard/projects');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const currentSlug = formData.slug;

    if (!currentSlug || (editSlug && currentSlug === editSlug)) {
      setSlugError('');
      return;
    }

    setSlugError('');
    setCheckingSlug(true);

    const timer = setTimeout(async () => {
      try {
        const available = await checkIdAvailable(currentSlug);

        if (available === false) {
          setSlugError('Slug já está em uso');
        } else {
          setSlugError('');
        }
      } catch (error) {
        setSlugError('');
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug, editSlug]);

  const handleSlugChange = (value: string) => {
    setFormData((prev) => ({ ...prev, slug: value }));
  };

  const generateRandomSlug = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    handleSlugChange(randomId);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.html || !formData.slug || slugError || checkingSlug) {
      return;
    }

    setLoading(true);

    if (presentationId) {
      await useAction({
        action: () => updatePresentation(presentationId, formData),
        callback: () => navigate('/dashboard/projects'),
        toastMessages: {
          pending: 'Salvando alterações...',
          success: 'Apresentação atualizada com sucesso!',
          error: 'Erro ao atualizar apresentação',
        },
      });
    } else {
      await useAction({
        action: () => createPresentation(formData),
        callback: () => navigate('/dashboard/projects'),
        toastMessages: {
          pending: 'Criando apresentação...',
          success: 'Apresentação criada com sucesso!',
          error: 'Erro ao criar apresentação',
        },
      });
    }

    setLoading(false);
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

  if (initialLoading) {
    return <Loading message="Carregando editor..." />;
  }

  const isSlugValid = formData.slug && !slugError && !checkingSlug;
  const isSlugInvalid = !!slugError;

  return (
    <EditorContainer>
      <EditorPaper elevation={0}>
        <Header>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/dashboard/projects')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {presentationId ? 'Editar Apresentação' : 'Nova Apresentação'}
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
              onClick={handleSubmit}
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={!formData.title || !formData.html || !formData.slug || !!slugError || checkingSlug || loading}
            >
              Salvar
            </Button>
          </Box>
        </Header>

        <ContentArea>
          <Stack spacing={3}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <TextField
                label="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                fullWidth
                variant="outlined"
                placeholder="Ex: Minha Apresentação Incrível"
              />

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="Slug / URL"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  error={isSlugInvalid}
                  helperText={''}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Ex: minha-apresentacao"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isSlugValid ? 'success.main' : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: isSlugValid ? 'success.main' : undefined,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isSlugValid ? 'success.main' : undefined,
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         {checkingSlug && (
                          <Tooltip title="Verificando disponibilidade...">
                            <CircularProgress size={20} />
                          </Tooltip>
                        )}
                        {!checkingSlug && isSlugInvalid && (
                          <Tooltip title={slugError}>
                            <ErrorIcon color="error" />
                          </Tooltip>
                        )}
                        {!checkingSlug && isSlugValid && (
                           <Tooltip title="Disponível">
                            <CheckCircle color="success" />
                           </Tooltip>
                        )}
                      </Box>
                    )
                  }}
                />
                <Tooltip title="Gerar ID aleatório">
                  <IconButton
                    onClick={generateRandomSlug}
                    size="large"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'action.disabled',
                      color: 'text.secondary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <Casino />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <StatusToggleContainer>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Visibilidade da Apresentação
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.isActive
                    ? `Pública em: ${window.location.origin}/${formData.slug || '...'}`
                    : 'Apresentação oculta (404 para visitantes)'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: formData.isActive ? 'success.main' : 'text.disabled',
                    fontWeight: 600,
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {formData.isActive ? 'Ativa' : 'Inativa'}
                </Typography>
                <StatusSwitch
                  checked={formData.isActive}
                  onChange={(e: any) => setFormData({ ...formData, isActive: e.target.checked })}
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
                height="60vh"
              />
            </Box>
          </Stack>
        </ContentArea>
      </EditorPaper>
    </EditorContainer>
  );
};

export default PresentationEditor;