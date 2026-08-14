import React, { useState } from 'react';
import { ZodError } from 'zod';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { Stack, ToggleButton } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import { editorStateStore } from '../../../../documents/editor/EditorContext';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};
export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const [sourceMode, setSourceMode] = useState<'url' | 'upload'>(data.props?.url ? 'url' : 'upload');

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const handle_upload_click = () => {
    const blockId = (editorStateStore.getState() as any).selectedBlockId;
    if (blockId) {
      window.dispatchEvent(new CustomEvent('vozziImageUploadRequested', { detail: { blockId } }));
    }
  };

  const handle_remove_image = () => {
    updateData({ ...data, props: { ...data.props, url: null } });
  };

  return (
    <BaseSidebarPanel title="Image block">
      <RadioGroupInput label="Image source" defaultValue={sourceMode} onChange={(v) => setSourceMode(v as 'url' | 'upload')}>
        <ToggleButton value="url">URL</ToggleButton>
        <ToggleButton value="upload">Upload</ToggleButton>
      </RadioGroupInput>

      {sourceMode === 'url' ? (
        <TextInput
          label="Source URL"
          defaultValue={data.props?.url ?? ''}
          onChange={(v) => {
            const url = v.trim().length === 0 ? null : v.trim();
            updateData({ ...data, props: { ...data.props, url } });
          }}
        />
      ) : (
        <Stack spacing={1} alignItems="stretch">
          {data.props?.url ? (
            <>
              <img
                src={data.props.url}
                alt={data.props?.alt ?? ''}
                style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain', alignSelf: 'center' }}
              />
              <button
                type="button"
                onClick={handle_remove_image}
                style={{
                  padding: '8px 12px',
                  background: '#fff',
                  color: '#d32f2f',
                  border: '1px solid #d32f2f',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Remove image
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handle_upload_click}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#00D59B',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Upload Image
            </button>
          )}
        </Stack>
      )}

      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
      />
      <TextInput
        label="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={data.props?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.props?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
        />
      </Stack>

      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
