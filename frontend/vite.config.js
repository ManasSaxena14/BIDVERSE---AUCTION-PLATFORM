import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: mode === 'production' 
          ? 'https://your-render-backend-url.onrender.com' 
          : 'http://localhost:6001',
        changeOrigin: true
      }
    }
  }
}));