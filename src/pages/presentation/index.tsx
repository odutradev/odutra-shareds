import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { getPresentation } from '@actions/presentations';
import { createAnalyticsEvent } from '@actions/analytics';
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

    lastSentTimeRef.current = Date.now();
    const currentSlug = presentation.slug;

    const sendAnalytics = (timeSpent: number) => {
      if (timeSpent <= 0) return;

      createAnalyticsEvent({
        presentationId: currentSlug,
        viewedAt: new Date().toISOString(),
        timeSpent,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }).catch(console.error);
    };

    const intervalId = setInterval(() => {
      const now = Date.now();


      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);

      if (duration >= 30) {
        sendAnalytics(duration);
        lastSentTimeRef.current = now;
      }
    }, 30000);

    const handleExit = () => {
      const now = Date.now();
      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);
      if (duration > 0) {
        sendAnalytics(duration);
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
      </ErrorContainer>
    );
  }

  return (
    <PresentationContainer>
      <ContentFrame ref={iframeRef} title={presentation.title} />
    </PresentationContainer>
  );
};

export default PresentationPage;