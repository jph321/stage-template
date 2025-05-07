
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    cors: true
  },
  build: {
    rollupOptions: {
      input: './src/stage.ts'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
