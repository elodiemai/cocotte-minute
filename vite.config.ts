import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://elodiemai.github.io/cocotte-minute/
  base: '/cocotte-minute/',
  plugins: [react()],
});
