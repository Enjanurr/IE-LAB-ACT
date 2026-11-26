import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Bingo API is served over plain HTTP and does not send CORS headers,
// so the browser cannot call it directly. We proxy /api/* to the real host
// for both `npm run dev` and `npm run preview`.
const proxy = {
  '/api': {
    target: 'http://www.hyeumine.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
});
