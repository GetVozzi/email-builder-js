import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/assets/email-builder/',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'VozziEmailBuilder',
      fileName: 'vozzi-email-builder',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'vozzi-email-builder.[ext]',
      },
    },
  },
});
