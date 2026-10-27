import { create } from 'zustand';

export type DynamicField = {
  slug: string;
  label: string;
};

export const dynamicFieldsStore = create<{ fields: DynamicField[] }>(() => ({ fields: [] }));

export function setDynamicFields(fields: DynamicField[]) {
  dynamicFieldsStore.setState({ fields: fields || [] });
}

export function useDynamicFields() {
  return dynamicFieldsStore((s) => s.fields);
}
