import React from 'react';
import { createRoot } from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import App from './App';
import { editorStateStore, resetDocument } from './documents/editor/EditorContext';
import theme from './theme';

type MountOptions = {
  onChange?: (html: string, document: unknown) => void;
  initialDocument?: unknown;
};

export function mount(element: HTMLElement, options: MountOptions = {}) {
  if (options.initialDocument) {
    resetDocument(options.initialDocument as any);
  }

  const root = createRoot(element);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App onChange={options.onChange} />
      </ThemeProvider>
    </React.StrictMode>
  );

  const unsubscribe = editorStateStore.subscribe((state) => {
    if (options.onChange) {
      const html = renderToStaticMarkup(state.document, { rootBlockId: 'root' });
      options.onChange(html, state.document);
    }
  });

  return {
    unmount: () => {
      unsubscribe();
      root.unmount();
    },
  };
}
