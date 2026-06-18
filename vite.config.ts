import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Deterministic high-range dev port for this workspace — avoids clashing with
// the usual 5173 / 3000 / 8000 defaults when several projects run at once.
const PORT = 51737;

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project site under /robotics-library/; dev stays at /.
  base: command === 'build' ? '/robotics-library/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: true, port: PORT, strictPort: true, allowedHosts: ['.local'] },
  preview: { host: true, port: PORT, strictPort: true, allowedHosts: ['.local'] },
}));
