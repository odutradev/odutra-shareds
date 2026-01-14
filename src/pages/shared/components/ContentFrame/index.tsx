import { useMemo } from 'react';

import { Frame } from './styles';

import type { Shared } from '@actions/shareds/types';

interface ContentFrameProps {
  shared: Shared;
}

const ContentFrame = ({ shared }: ContentFrameProps) => {
  const srcDoc = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${shared.title}</title>
        <style>
          body { margin: 0; padding: 0; }
          ${shared.css || ''}
        </style>
      </head>
      <body>
        ${shared.html}
        ${shared.js ? `<script>${shared.js}</script>` : ''}
      </body>
    </html>
  `, [shared]);

  return (
    <Frame
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      srcDoc={srcDoc}
      title={shared.title}
    />
  );
};

export default ContentFrame;
