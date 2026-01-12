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
  Switch
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
  Timeline,
  AccessTime,
  Visibility,
  Refresh,
  HourglassEmpty,
  Link as LinkIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

import CodeEditor from '@components/codeEditor';
import type { CreatePresentationData } from '@actions/presentations/types';
import type { PresentationAnalytics } from '@actions/analytics/types';
import { checkIdAvailable, createPresentation, updatePresentation, getPresentation } from '@actions/presentations';
import { getPresentationStats } from '@actions/analytics';
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
  DashboardGrid,
  MetricCard,
  ChartContainer,
  MetricValue,
  MetricLabel
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
    isRedirect: false,
    redirectUrl: ''
  });

  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [slugError, setSlugError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editSlug);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css' | 'js'>('html');

  const [stats, setStats] = useState<PresentationAnalytics | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
          isRedirect: result.isRedirect || false,
          redirectUrl: result.redirectUrl || ''
        });
        setPresentationId(result._id);

        loadStats(result.slug);
      } else {
        console.error("Apresentação não encontrada");
        navigate('/dashboard/projects');
      }
    } catch (error) {
      console.error('Erro ao carregar apresentação', error);
      navigate('/dashboard/projects');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadStats = async (slug: string) => {
    setLoadingStats(true);
    try {
      const result = await getPresentationStats(slug);
      if (result && !('error' in result)) {
        setStats(result);
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const currentSlug = formData.slug;

    if (!currentSlug || (editSlug && currentSlug === editSlug)) {
      setSlugError('');
      setCheckingSlug(false);
      return;
    }

    setSlugError('');
    setCheckingSlug(true);

    const timer = setTimeout(async () => {
      if (!currentSlug) return;

      try {
        const available = await checkIdAvailable(currentSlug);
        if (!available) {
          setSlugError('Slug já está em uso');
        } else {
          setSlugError('');
        }
      } catch (error) {
        console.error("Erro na verificação do slug", error);
        setSlugError('');
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug, editSlug]);

  const handleSlugChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setFormData((prev) => ({ ...prev, slug: normalized }));
  };

  const generateRandomSlug = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    handleSlugChange(randomId);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      return;
    }
    
    if (!formData.isRedirect && !formData.html) {
        return;
    }
    
    if (formData.isRedirect && !formData.redirectUrl) {
        return;
    }

    if (slugError || checkingSlug) {
      return;
    }

    setLoading(true);

    try {
      if (presentationId) {
        await useAction({
          action: () => updatePresentation(presentationId, formData),
          callback: () => navigate('/dashboard/projects'),
          toastMessages: {
            pending: 'Salvando alterações...',
            success: 'Apresentação atualizada!',
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
            error: 'Erro ao criar. Tente outro Slug.',
          },
        });
      }
    } catch (err) {
      console.error("Erro no fluxo de salvamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    return `${(seconds / 86400).toFixed(1)}d`;
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
  const isFormValid = formData.title && formData.slug && !slugError && !checkingSlug && !loading && (formData.isRedirect ? !!formData.redirectUrl : !!formData.html);

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
              disabled={!isFormValid}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
            </Button>
          </Box>
        </Header>

        <ContentArea>
          <Stack spacing={3}>
            {presentationId && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Timeline color="primary" />
                  <Typography variant="subtitle1" fontWeight="600">
                    Métricas (Últimos 14 dias)
                  </Typography>
                  <IconButton size="small" onClick={() => loadStats(formData.slug)} disabled={loadingStats}>
                     <Refresh fontSize="small" sx={{ animation: loadingStats ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                  </IconButton>
                </Box>

                <DashboardGrid>
                  <MetricCard>
                    <Box className="icon-wrapper view">
                      <Visibility />
                    </Box>
                    <Box>
                      <MetricLabel>Total de Visualizações</MetricLabel>
                      <MetricValue>{stats?.totalViews || 0}</MetricValue>
                    </Box>
                  </MetricCard>

                  <MetricCard>
                    <Box className="icon-wrapper time">
                      <AccessTime />
                    </Box>
                    <Box>
                      <MetricLabel>Tempo Médio</MetricLabel>
                      <MetricValue>{formatTime(stats?.avgTimeSpent || 0)}</MetricValue>
                    </Box>
                  </MetricCard>

                  <MetricCard>
                    <Box className="icon-wrapper total">
                      <HourglassEmpty />
                    </Box>
                    <Box>
                      <MetricLabel>Tempo Total</MetricLabel>
                      <MetricValue>{formatTime(stats?.totalTimeSpent || 0)}</MetricValue>
                    </Box>
                  </MetricCard>

                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.history || []}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorViews)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </DashboardGrid>
              </Box>
            )}

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
                  helperText={slugError || ''}
                  required
                  fullWidth
                  disabled={!!presentationId}
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
                {!presentationId && (
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
                )}
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

            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: 'background.paper', transition: 'all 0.2s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: formData.isRedirect ? 3 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '8px', bgcolor: formData.isRedirect ? 'primary.lighter' : 'action.hover', color: formData.isRedirect ? 'primary.main' : 'text.secondary' }}>
                      <LinkIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>Modo Redirecionador</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ao invés de exibir slides, redireciona o visitante para outra URL.
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={formData.isRedirect || false}
                  onChange={(e) => setFormData({ ...formData, isRedirect: e.target.checked })}
                />
              </Box>

              {formData.isRedirect && (
                <TextField
                  fullWidth
                  label="URL de Destino"
                  placeholder="https://exemplo.com"
                  value={formData.redirectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                  InputProps={{
                    startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  helperText="Certifique-se de incluir https://"
                />
              )}
            </Box>

            {!formData.isRedirect && (
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
            )}
          </Stack>
        </ContentArea>
      </EditorPaper>
    </EditorContainer>
  );
};

export default PresentationEditor;
