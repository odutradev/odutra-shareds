import { Code, Javascript, Style } from '@mui/icons-material';
import { Box, Chip, Typography } from '@mui/material';

import { EditorLabel, EditorToggle, ToggleButton } from './styles';
import CodeEditor from '@components/codeEditor';

import type { CodeWorkspaceProps } from './types';

const CodeWorkspace = ({ html, css, js, activeEditor, onTabChange, onCodeChange }: CodeWorkspaceProps) => {
  const config = {
    html: { icon: <Code fontSize="small" />, label: 'HTML', desc: 'Estrutura', value: html, lang: 'html' as const },
    css: { icon: <Style fontSize="small" />, label: 'CSS', desc: 'Estilos', value: css, lang: 'css' as const },
    js: { icon: <Javascript fontSize="small" />, label: 'JS', desc: 'Scripts', value: js, lang: 'javascript' as const }
  };

  const current = config[activeEditor];

  return (
    <Box>
      <EditorToggle>
        {(['html', 'css', 'js'] as const).map((type) => (
          <ToggleButton
            key={type}
            active={activeEditor === type}
            onClick={() => onTabChange(type)}
            startIcon={config[type].icon}
          >
            {config[type].label}
          </ToggleButton>
        ))}
      </EditorToggle>

      <EditorLabel>
        {current.icon}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{current.label}</Typography>
          <Typography variant="caption" color="text.secondary">{current.desc}</Typography>
        </Box>
        {activeEditor !== 'html' && <Chip label="Opcional" size="small" sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }} />}
      </EditorLabel>

      <CodeEditor
        value={current.value}
        onChange={(val) => onCodeChange(activeEditor, val)}
        language={current.lang}
        height="60vh"
      />
    </Box>
  );
};

export default CodeWorkspace;