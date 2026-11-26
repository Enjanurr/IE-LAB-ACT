import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// hyeumine.com is served over plain http and may not send CORS headers.
// The browser talks to /api on the Vite server, which forwards to the real host,
// so there is no mixed-content or CORS problem during development and preview.
const target = process.env.FORUM_PROXY_TARGET || 'http://hyeumine.com';
const proxy = {
  '/api': {
    target,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
