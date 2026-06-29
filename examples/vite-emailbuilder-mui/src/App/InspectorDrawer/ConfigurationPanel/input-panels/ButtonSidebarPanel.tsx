import React, { useState } from 'react';
import { ZodError } from 'zod';

import { ToggleButton } from '@mui/material';
import { ButtonProps, ButtonPropsDefaults, ButtonPropsSchema } from '@usewaypoint/block-button';

import { editorStateStore } from '../../../../documents/editor/EditorContext';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};
export default function ButtonSidebarPanel({ data, setData }: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? ButtonPropsDefaults.text;
  const url = data.props?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const buttonStyle = data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle;
  const buttonTextColor = data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor = data.props?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor;

  const handle_vozzi_link = () => {
    const blockId = (editorStateStore.getState() as any).selectedBlockId;
    if (blockId) {
      window.dispatchEvent(new CustomEvent('vozziCTAButtonInserted', { detail: { blockId } }));
    }
  };

  return (
    <BaseSidebarPanel title="Button block">
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={handle_vozzi_link}
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
          Set Vozzi Link
        </button>
      </div>
      <TextInput
        label="Text"
        defaultValue={text}
        onChange={(text) => updateData({ ...data, props: { ...data.props, text } })}
      />
      <TextInput
        label="Url"
        defaultValue={url}
        onChange={(url) => updateData({ ...data, props: { ...data.props, url } })}
      />
      <RadioGroupInput
        label="Width"
        defaultValue={fullWidth ? 'FULL_WIDTH' : 'AUTO'}
        onChange={(v) => updateData({ ...data, props: { ...data.props, fullWidth: v === 'FULL_WIDTH' } })}
      >
        <ToggleButton value="FULL_WIDTH">Full</ToggleButton>
        <ToggleButton value="AUTO">Auto</ToggleButton>
      </RadioGroupInput>
      <RadioGroupInput
        label="Size"
        defaultValue={size}
        onChange={(size) => updateData({ ...data, props: { ...data.props, size } })}
      >
        <ToggleButton value="x-small">Xs</ToggleButton>
        <ToggleButton value="small">Sm</ToggleButton>
        <ToggleButton value="medium">Md</ToggleButton>
        <ToggleButton value="large">Lg</ToggleButton>
      </RadioGroupInput>
      <RadioGroupInput
        label="Style"
        defaultValue={buttonStyle}
        onChange={(buttonStyle) => updateData({ ...data, props: { ...data.props, buttonStyle } })}
      >
        <ToggleButton value="rectangle">Rectangle</ToggleButton>
        <ToggleButton value="rounded">Rounded</ToggleButton>
        <ToggleButton value="pill">Pill</ToggleButton>
      </RadioGroupInput>
      <ColorInput
        label="Text color"
        defaultValue={buttonTextColor}
        onChange={(buttonTextColor) => updateData({ ...data, props: { ...data.props, buttonTextColor } })}
      />
      <ColorInput
        label="Button color"
        defaultValue={buttonBackgroundColor}
        onChange={(buttonBackgroundColor) => updateData({ ...data, props: { ...data.props, buttonBackgroundColor } })}
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
