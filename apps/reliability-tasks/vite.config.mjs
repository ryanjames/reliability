import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@reliability-ui': path.resolve(__dirname, '../../packages/reliability-ui/src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
