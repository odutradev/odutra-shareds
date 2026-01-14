import { useTheme } from '@mui/material';
import { Editor } from '@monaco-editor/react';

import { EDITOR_OPTIONS } from './defaultValues';
import { EditorContainer } from './styles';

import type { CodeEditorProps } from './types';

const CodeEditor = ({ value, onChange, language, height = '400px' }: CodeEditorProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <EditorContainer height={height}>
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val || '')}
        theme={isDark ? 'vs-dark' : 'light'}
        options={EDITOR_OPTIONS}
      />
    </EditorContainer>
  );
};

export default CodeEditor;
