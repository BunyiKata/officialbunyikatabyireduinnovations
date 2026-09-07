import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'legacy-audio-rewrite',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url) {
              const decoded = decodeURIComponent(req.url);
              if (decoded.startsWith('/AUDIO FONIK/')) {
                req.url = req.url.replace(/^\/AUDIO(%20| )FONIK\//i, '/audio/fonik/');
              } else if (decoded.startsWith('/AUDIO BACAAN BERGRED/')) {
                req.url = req.url.replace(/^\/AUDIO(%20| )BACAAN(%20| )BERGRED\//i, '/audio/bacaan-bergred/');
              } else if (decoded.startsWith('/AUDIO TAMBAH TOLAK/audio tambah/')) {
                req.url = req.url.replace(/^\/AUDIO(%20| )TAMBAH(%20| )TOLAK\/audio(%20| )tambah\//i, '/audio/tambah/');
              } else if (decoded.startsWith('/AUDIO TAMBAH TOLAK/audio tolak/')) {
                req.url = req.url.replace(/^\/AUDIO(%20| )TAMBAH(%20| )TOLAK\/audio(%20| )tolak\//i, '/audio/tolak/');
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/node_modules/**']
      },
    },
  };
});
