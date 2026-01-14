import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EditorContainer = styled(Box)<{ height?: string }>(({ theme, height }) => ({
  height: height || '400px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  '& .monaco-editor': {
    paddingTop: theme.spacing(1),
  },
}));
