import React, { useState } from 'react';
import { ZodError } from 'zod';

import { FooterProps, FooterPropsDefaults, FooterPropsSchema } from '@usewaypoint/block-footer';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type FooterSidebarPanelProps = {
  data: FooterProps;
  setData: (v: FooterProps) => void;
};
export default function FooterSidebarPanel({ data, setData }: FooterSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = FooterPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Footer block">
      <TextInput
        label="Content"
        rows={4}
        defaultValue={data.props?.text ?? FooterPropsDefaults.text}
        onChange={(text) => {
          updateData({ ...data, props: { ...data.props, text } });
        }}
      />
      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
