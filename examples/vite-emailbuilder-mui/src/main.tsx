import React from 'react';
import { createRoot } from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import App from './App';
import { editorStateStore, resetDocument, setDocument } from './documents/editor/EditorContext';
import theme from './theme';

type MountOptions = {
  onChange?: (html: string, document: unknown) => void;
  initialDocument?: unknown;
  teamColor?: string;
  teamTextColor?: string;
};

export function mount(element: HTMLElement, options: MountOptions = {}) {
  if (options.initialDocument) {
    resetDocument(options.initialDocument as any);
  } else if (options.teamColor) {
    resetDocument({
      root: {
        type: 'EmailLayout',
        data: {
          backdropColor: options.teamColor,
          canvasColor: '#FFFFFF',
          textColor: '#262626',
          fontFamily: 'MODERN_SANS',
          childrenIds: [],
        },
      },
    } as any);
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

  if (options.onChange) {
    const initialHtml = renderToStaticMarkup(editorStateStore.getState().document, { rootBlockId: 'root' });
    options.onChange(initialHtml, editorStateStore.getState().document);
  }

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

export function loadDocument(document: unknown) {
  resetDocument(document as any);
}

export function updateButtonBlock(blockId: string, url: string, label: string, color: string, textColor: string) {
  const state = editorStateStore.getState();
  const doc = state.document as any;
  const existingBlock = doc[blockId];
  if (!existingBlock) return;

  setDocument({
    [blockId]: {
      ...existingBlock,
      data: {
        ...existingBlock.data,
        props: {
          ...(existingBlock.data?.props || {}),
          text: label || existingBlock.data?.props?.text || 'Button',
          url: url,
          ...(color ? { buttonBackgroundColor: color } : {}),
        },
      },
    },
  } as any);
}

export function insertButtonBlock(url: string, label: string, color: string, textColor: string) {
  const state = editorStateStore.getState();
  const doc = state.document as any;
  const blockId = 'block-vozzi-btn-' + String(Math.floor(Math.random() * 1e12));
  const root = doc['root'];
  const newChildrenIds = [...(root.data.childrenIds || []), blockId];

  setDocument({
    root: {
      ...root,
      data: {
        ...root.data,
        childrenIds: newChildrenIds,
      },
    },
    [blockId]: {
      type: 'Button',
      data: {
        style: {
          fontSize: 14,
          padding: { top: 16, bottom: 24, right: 24, left: 24 },
        },
        props: {
          buttonBackgroundColor: color,
          buttonStyle: 'rectangle',
          text: label,
          url: url,
        },
      },
    },
  } as any);
}
