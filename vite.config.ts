import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', plugins: [react()],
  server: { host: '127.0.0.1', port: 5185, strictPort: true, watch: {ignored:['**/release/**','**/build/**','**/sources/**','**/screenshots/**','**/test-results/**','**/playwright-report/**']} },
  build: { target: 'es2022' },
});
