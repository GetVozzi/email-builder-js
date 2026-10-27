import React, { useRef, useState } from 'react';
import { ZodError } from 'zod';

import { ToggleButton } from '@mui/material';
import { HeadingProps, HeadingPropsDefaults, HeadingPropsSchema } from '@usewaypoint/block-heading';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import DynamicFieldAndEmojiButtons from './helpers/DynamicFieldAndEmojiButtons';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type HeadingSidebarPanelProps = {
  data: HeadingProps;
  setData: (v: HeadingProps) => void;
};
export default function HeadingSidebarPanel({ data, setData }: HeadingSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateData = (d: unknown) => {
    const res = HeadingPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? HeadingPropsDefaults.text;
  const updateText = (text: string) => updateData({ ...data, props: { ...data.props, text } });

  return (
    <BaseSidebarPanel title="Heading block">
      <div>
        <DynamicFieldAndEmojiButtons inputRef={inputRef} value={text} onChange={updateText} />
        <TextInput
          label="Content"
          rows={3}
          InputProps={{ inputRef }}
          defaultValue={text}
          onChange={updateText}
        />
      </div>
      <RadioGroupInput
        label="Level"
        defaultValue={data.props?.level ?? HeadingPropsDefaults.level}
        onChange={(level) => {
          updateData({ ...data, props: { ...data.props, level } });
        }}
      >
        <ToggleButton value="h1">H1</ToggleButton>
        <ToggleButton value="h2">H2</ToggleButton>
        <ToggleButton value="h3">H3</ToggleButton>
      </RadioGroupInput>
      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
