import React, { useRef, useState } from 'react';
import { ZodError } from 'zod';

import { TextProps, TextPropsSchema } from '@usewaypoint/block-text';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import DynamicFieldAndEmojiButtons from './helpers/DynamicFieldAndEmojiButtons';
import BooleanInput from './helpers/inputs/BooleanInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type TextSidebarPanelProps = {
  data: TextProps;
  setData: (v: TextProps) => void;
};
export default function TextSidebarPanel({ data, setData }: TextSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateData = (d: unknown) => {
    const res = TextPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? '';
  const updateText = (text: string) => updateData({ ...data, props: { ...data.props, text } });

  return (
    <BaseSidebarPanel title="Text block">
      <div>
        <DynamicFieldAndEmojiButtons inputRef={inputRef} value={text} onChange={updateText} />
        <TextInput
          label="Content"
          rows={5}
          InputProps={{ inputRef }}
          defaultValue={text}
          onChange={updateText}
        />
      </div>
      <BooleanInput
        label="Markdown (GitHub flavored)"
        defaultValue={data.props?.markdown ?? false}
        onChange={(markdown) => updateData({ ...data, props: { ...data.props, markdown } })}
      />

      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
