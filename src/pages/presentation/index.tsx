import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { Home, ErrorOutline } from '@mui/icons-material';
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
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!slug) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
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

    const startTime = Date.now();
    const currentSlug = presentation.slug;

    const sendAnalytics = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      createAnalyticsEvent({
        presentationId: currentSlug,
        viewedAt: new Date().toISOString(),
        timeSpent,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }).catch(console.error);
    };

    const handleBeforeUnload = () => {
      sendAnalytics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sendAnalytics();
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
      <ContentFrame ref={iframeRef} title={presentation.title} />
    </PresentationContainer>
  );
};

export default PresentationPage;