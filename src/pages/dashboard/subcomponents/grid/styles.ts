import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: theme.spacing(2.5),
}));