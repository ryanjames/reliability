import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      cva: path.resolve(
        __dirname,
        'node_modules/class-variance-authority/dist/index.mjs',
      ),
    },
  },
});
