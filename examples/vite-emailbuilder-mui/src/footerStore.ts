import { create } from 'zustand';

export const footerStore = create<{ html: string }>(() => ({ html: '' }));

export function setFooterHtml(html: string) {
  footerStore.setState({ html: html || '' });
}

export function useFooterHtml() {
  return footerStore((s) => s.html);
}
