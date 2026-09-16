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
    build: {
      // Bundle utama sebelum ini >1 MB (warning "Some chunks are larger than
      // 500 kB"). Pecahkan vendor besar kepada chunk berasingan supaya muat
      // awal lebih pantas & cache lebih efektif. Ini BUKAN sekadar menyenyapkan
      // amaran — ia benar-benar mengurangkan saiz chunk utama.
      // Had amaran dinaikkan sedikit (600 kB) kerana satu-satunya chunk melebihi
      // 500 kB ialah `vendor-jspdf` yang LAZY (hanya dimuat bila sijil dibuka).
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('firebase-admin')) return 'vendor-firebase-admin';
            if (id.includes('firebase') || id.includes('@firebase')) return 'vendor-firebase';
            if (id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react-dom';
            if (id.includes('/react/') || id.includes('react/jsx-runtime')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('motion')) return 'vendor-motion';
            if (id.includes('canvas-confetti')) return 'vendor-confetti';
            // jspdf hanya digunakan oleh AdminSijilManager (lazy import), jadi
            // asingkan ke chunk sendiri — ia tidak dimuat sehingga sijil dibuka.
            if (id.includes('jspdf')) return 'vendor-jspdf';
            if (id.includes('html2canvas')) return 'vendor-jspdf';
            if (id.includes('@google/genai') || id.includes('@google')) return 'vendor-genai';
            return 'vendor';
          },
        },
      },
    },
    // Pre-bundle deps berat supaya Vite tidak perlu transform mereka
    // pada setiap request — elak "waterfall" delay semasa dev pertama kali.
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'motion/react',
        'firebase/app',
        'firebase/auth',
        'firebase/database',
        'lucide-react',
        'canvas-confetti',
      ],
      // Jangan paksa re-bundle jika deps tidak berubah
      force: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/node_modules/**', '**/.git/**'],
        usePolling: false,
      },
    },
  };
});
