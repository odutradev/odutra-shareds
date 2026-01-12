import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import { ErrorOutline, Link as LinkIcon } from '@mui/icons-material';
import { getPresentation } from '@actions/presentations';
import { createViewEvent, createTimeEvent } from '@actions/analytics';
import Loading from '@components/loading';
import {
  PresentationContainer,
  ContentFrame,
  ErrorContainer,
} from './styles';
import type { Presentation } from '@actions/presentations/types';

const PresentationPage = () => {
  const { id: slug } = useParams<{ id: string }>();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const lastSentTimeRef = useRef<number>(0);
  const viewRecordedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setPresentation(null);

      const result = await getPresentation(slug);

      if (!result) {
        setError('Erro ao carregar apresentação');
        setLoading(false);
        return;
      }

      if ('error' in result) {
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

    load();
  }, [slug]);

  useEffect(() => {
    if (!presentation) return;

    const currentSlug = presentation.slug;

    if (viewRecordedSlugRef.current !== currentSlug) {
      const viewPromise = createViewEvent({
        presentationId: currentSlug,
        viewedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      });
      
      if (presentation.isRedirect && presentation.redirectUrl) {
          const performRedirect = () => {
             let targetUrl = presentation.redirectUrl!;
             if (!targetUrl.match(/^https?:\/\//)) {
                 targetUrl = 'https://' + targetUrl;
             }
             window.location.href = targetUrl;
          };

          viewPromise
            .finally(() => {
               setTimeout(performRedirect, 100);
            });
            
          setTimeout(performRedirect, 2000);
      } else {
          viewPromise.catch(console.error);
      }

      viewRecordedSlugRef.current = currentSlug;
    }

    if (presentation.isRedirect) return;

    lastSentTimeRef.current = Date.now();

    const sendTimeAnalytics = (timeSpent: number) => {
      if (timeSpent <= 0) return;

      createTimeEvent({
        presentationId: currentSlug,
        recordedAt: new Date().toISOString(),
        timeSpent,
      }).catch(console.error);
    };

    const intervalId = setInterval(() => {
      const now = Date.now();
      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);

      if (duration >= 30) {
        sendTimeAnalytics(duration);
        lastSentTimeRef.current = now;
      }
    }, 30000);

    const handleExit = () => {
      const now = Date.now();
      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);
      if (duration > 0) {
        sendTimeAnalytics(duration);
        lastSentTimeRef.current = now;
      }
    };

    window.addEventListener('beforeunload', handleExit);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleExit);
      handleExit();
    };
  }, [presentation]);

  useEffect(() => {
    if (!presentation || !iframeRef.current || presentation.isRedirect) return;

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
      </ErrorContainer>
    );
  }

  if (presentation.isRedirect && presentation.redirectUrl) {
      return (
        <PresentationContainer sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', p: 4, maxWidth: 500 }}>
                <CircularProgress size={40} sx={{ mb: 3 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Redirecionando...
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Você está sendo redirecionado para:
                </Typography>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 1, 
                    p: 2, 
                    bgcolor: 'action.hover', 
                    borderRadius: 2,
                    typography: 'body2',
                    fontFamily: 'monospace'
                }}>
                    <LinkIcon fontSize="small" />
                    {presentation.redirectUrl}
                </Box>
            </Box>
        </PresentationContainer>
      );
  }

  return (
    <PresentationContainer>
      <ContentFrame ref={iframeRef} title={presentation.title} />
    </PresentationContainer>
  );
};

export default PresentationPage;