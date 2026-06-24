import React from 'react';

import { Stack, useTheme } from '@mui/material';

import { useInspectorDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import TemplatePanel from './TemplatePanel';

function useDrawerTransition(open: boolean) {
  const { transitions } = useTheme();
  return transitions.create('margin-right', {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

type AppProps = {
  onChange?: (html: string, document: unknown) => void;
};

export default function App({ onChange }: AppProps) {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const marginRightTransition = useDrawerTransition(inspectorDrawerOpen);

  return (
    <Stack sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <InspectorDrawer />
      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          transition: marginRightTransition,
          height: '100%',
        }}
      >
        <TemplatePanel />
      </Stack>
    </Stack>
  );
}
