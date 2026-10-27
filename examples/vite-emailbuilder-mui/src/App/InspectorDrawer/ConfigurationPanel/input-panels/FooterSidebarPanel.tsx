import React, { useRef, useState } from 'react';
import { ZodError } from 'zod';

import { FooterProps, FooterPropsDefaults, FooterPropsSchema } from '@usewaypoint/block-footer';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import DynamicFieldAndEmojiButtons from './helpers/DynamicFieldAndEmojiButtons';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type FooterSidebarPanelProps = {
  data: FooterProps;
  setData: (v: FooterProps) => void;
};
export default function FooterSidebarPanel({ data, setData }: FooterSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateData = (d: unknown) => {
    const res = FooterPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? FooterPropsDefaults.text;
  const updateText = (text: string) => updateData({ ...data, props: { ...data.props, text } });

  return (
    <BaseSidebarPanel title="Footer block">
      <div>
        <DynamicFieldAndEmojiButtons inputRef={inputRef} value={text} onChange={updateText} />
        <TextInput
          label="Content"
          rows={4}
          InputProps={{ inputRef }}
          defaultValue={text}
          onChange={updateText}
        />
      </div>
      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
