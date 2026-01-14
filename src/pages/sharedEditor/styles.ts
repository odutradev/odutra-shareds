import { Box, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EditorContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  maxWidth: '1600px !important',
}));

export const EditorPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

export const ContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));