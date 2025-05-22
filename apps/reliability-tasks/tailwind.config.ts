import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  content: [
    './src/**/*.{ts,tsx}',
    path.resolve(__dirname, '../../packages/reliability-ui/**/*.{ts,tsx}'),
  ],
};
