import { Editor } from '@monaco-editor/react';
import { Box, useTheme } from '@mui/material';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  height?: string;
}

const CodeEditor = ({ value, onChange, language, height = '400px' }: CodeEditorProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        overflow: 'hidden',
        height,
      }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={isDark ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
        }}
      />
    </Box>
  );
};

export default CodeEditor;
