import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/notion-api': {
        target: 'https://api.notion.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notion-api/, ''),
        headers: {
          'Origin': 'https://api.notion.com'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
