import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Chip } from '@mui/material';
import { Home, ErrorOutline } from '@mui/icons-material';
import { getPresentation } from '@actions/presentations';
import { createAnalyticsEvent } from '@actions/analytics';
import Loading from '@components/loading';
import {
  PresentationContainer,
  StyledAppBar,
  StyledToolbar,
  ContentFrame,
  ErrorContainer,
} from './styles';
import type { Presentation } from '@actions/presentations/types';

const PresentationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const analyticsSubmittedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    loadPresentation();
    startTimeRef.current = Date.now();

    return () => {
      if (!analyticsSubmittedRef.current && presentation) {
        submitAnalytics();
      }
    };
  }, [id]);

  const loadPresentation = async () => {
    if (!id) return;

    setLoading(true);
    const result = await getPresentation(id);

    if (result && 'error' in result) {
      setError('Apresentação não encontrada');
      setLoading(false);
      return;
    }

    if (!result.isActive) {
      setError('Esta apresentação está inativa');
      setLoading(false);
      return;
    }

    setPresentation(result);
    setLoading(false);
  };

  const submitAnalytics = async () => {
    if (!presentation || analyticsSubmittedRef.current) return;

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    analyticsSubmittedRef.current = true;

    await createAnalyticsEvent({
      presentationId: presentation.id,
      viewedAt: new Date().toISOString(),
      timeSpent,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (presentation && !analyticsSubmittedRef.current) {
        submitAnalytics();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [presentation]);

  useEffect(() => {
    if (!presentation || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${presentation.title}</title>
          ${presentation.css ? `<style>${presentation.css}</style>` : ''}
        </head>
        <body>
          ${presentation.html}
          ${presentation.js ? `<script>${presentation.js}</script>` : ''}
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [presentation]);

  if (loading) {
    return <Loading message="Carregando apresentação" />;
  }

  if (error || !presentation) {
    return (
      <ErrorContainer>
        <ErrorOutline sx={{ fontSize: 80, mb: 2, color: 'error.main' }} />
        <Typography variant="h4" gutterBottom>
          {error || 'Apresentação não encontrada'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Verifique se o link está correto ou se a apresentação está ativa.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Voltar ao Início
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <PresentationContainer>
      <StyledAppBar position="static" color="default">
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>
              {presentation.title}
            </Typography>
            <Chip
              label={presentation.id}
              size="small"
              sx={{ fontFamily: 'monospace' }}
            />
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      <ContentFrame ref={iframeRef} title={presentation.title} />
    </PresentationContainer>
  );
};

export default PresentationPage;
