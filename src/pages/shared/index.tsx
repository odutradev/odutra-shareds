import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import { ErrorOutline, Link as LinkIcon } from '@mui/icons-material';
import { getShared } from '@actions/shareds';
import { createViewEvent, createTimeEvent } from '@actions/analytics';
import Loading from '@components/loading';
import {
  SharedContainer,
  ContentFrame,
  ErrorContainer,
} from './styles';
import type { Shared } from '@actions/shareds/types';

const SharedPage = () => {
  const { id: slug } = useParams<{ id: string }>();
  const [shared, setShared] = useState<Shared | null>(null);
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
      setShared(null);

      const result = await getShared(slug);

      if (!result) {
        setError('Erro ao carregar compartilhamento');
        setLoading(false);
        return;
      }

      if ('error' in result) {
        setError('Compartilhamento não encontrado');
        setLoading(false);
        return;
      }

      if (!result.isActive) {
        setError('Este conteúdo está inativo');
        setLoading(false);
        return;
      }

      setShared(result);
      setLoading(false);
    };

    load();
  }, [slug]);

  useEffect(() => {
    if (!shared) return;

    const currentSlug = shared.slug;

    if (viewRecordedSlugRef.current !== currentSlug) {
      const viewPromise = createViewEvent({
        sharedId: currentSlug,
        viewedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      });

      if (shared.isRedirect && shared.redirectUrl) {
          const performRedirect = () => {
             let targetUrl = shared.redirectUrl!;
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

    if (shared.isRedirect) return;

    lastSentTimeRef.current = Date.now();

    const sendTimeAnalytics = (timeSpent: number) => {
      if (timeSpent <= 0) return;

      createTimeEvent({
        sharedId: currentSlug,
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
  }, [shared]);

  useEffect(() => {
    if (!shared || !iframeRef.current || shared.isRedirect) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${shared.title}</title>
          ${shared.css ? `<style>${shared.css}</style>` : ''}
        </head>
        <body>
          ${shared.html}
          ${shared.js ? `<script>${shared.js}</script>` : ''}
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [shared]);

  if (loading) {
    return <Loading message="Carregando conteúdo" />;
  }

  if (error || !shared) {
    return (
      <ErrorContainer>
        <ErrorOutline sx={{ fontSize: 80, mb: 2, color: 'error.main' }} />
        <Typography variant="h4" gutterBottom>
          {error || 'Conteúdo não encontrado'}
        </Typography>
      </ErrorContainer>
    );
  }

  if (shared.isRedirect && shared.redirectUrl) {
      return (
        <SharedContainer sx={{ alignItems: 'center', justifyContent: 'center' }}>
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
                    {shared.redirectUrl}
                </Box>
            </Box>
        </SharedContainer>
      );
  }

  return (
    <SharedContainer>
      <ContentFrame ref={iframeRef} title={shared.title} />
    </SharedContainer>
  );
};

export default SharedPage;