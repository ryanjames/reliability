import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@reliability-ui': path.resolve(__dirname, '../../packages/reliability-ui/src'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
