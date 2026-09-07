import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Legacy audio path compatibility middleware
  app.use((req, res, next) => {
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

  // Serve static files from public directory directly (handles audio, images, fonts)
  app.use(express.static(path.join(__dirname, 'public')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
