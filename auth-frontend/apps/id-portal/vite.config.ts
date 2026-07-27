import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@api': path.resolve(__dirname, '../../packages/api-client/src'),
      '@auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@types': path.resolve(__dirname, '../../packages/types/src'),
    },
  },
  server: {
    port: 5173,
  },
});
