import { Link as LinkIcon } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';

import { Container, ContentBox, UrlBox } from './styles';

interface RedirectStateProps {
  url: string;
}

const RedirectState = ({ url }: RedirectStateProps) => (
  <Container>
    <ContentBox>
      <CircularProgress size={40} sx={{ mb: 3 }} />
      <Typography gutterBottom fontWeight={600} variant="h5">
        Redirecionando...
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Você está sendo redirecionado para:
      </Typography>
      <UrlBox>
        <LinkIcon fontSize="small" />
        {url}
      </UrlBox>
    </ContentBox>
  </Container>
);

export default RedirectState;