import { useEffect, useRef } from 'react';

import { Frame } from './styles';

import type { Shared } from '@actions/shareds/types';

interface ContentFrameProps {
  shared: Shared;
}

const ContentFrame = ({ shared }: ContentFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${shared.title}</title>
          ${shared.css ? `<style>${shared.css}</style>` : ''}
        </head>
        <body>
          ${shared.html}
          ${shared.js ? `<script>${shared.js}</script>` : ''}
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [shared]);

  return <Frame ref={iframeRef} title={shared.title} />;
};

export default ContentFrame;