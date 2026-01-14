import { ErrorOutline } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { Container } from './styles';

interface ErrorStateProps {
  message: string;
}

const ErrorState = ({ message }: ErrorStateProps) => (
  <Container>
    <ErrorOutline sx={{ color: 'error.main', fontSize: 80, mb: 2 }} />
    <Typography gutterBottom variant="h4">
      {message}
    </Typography>
  </Container>
);

export default ErrorState;