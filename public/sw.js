// NAHKAN v6: Bump versi cache memaksa pelayar membuang cache lama yang
// mungkin menyimpan index.html / app-logic.js / src/App.tsx basi.
// PEMBETULAN UTAMA v6: Tambah pengecualian untuk fail sumber Vite
// (/src/*, *.ts, *.tsx). Sebelum ini, semua permintaan fetch() dari JS
// (cth import Vite ke App.tsx) jatuh ke "cache-first" kerana req.destination
// kosong, menyebabkan versi App.tsx lama terpakai selepas pembetulan.
// Sekarang /src/* sentiasa network-first.
const CACHE_NAME = 'bunyi-kata-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app-logic.js',
  '/surih-logic.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(err => console.log('PWA cache notice:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Hanya kendalikan permintaan GET daripada asalan yang sama.
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;

  const isDoc = req.mode === 'navigate' || req.destination === 'document';
  const isScript = req.destination === 'script' || req.destination === 'style';
  const isAssetBerhash = url.pathname.startsWith('/assets/');

  // PEMBETULAN v6: Sumber Vite (/src/*, .ts, .tsx, .css, .html) SELALU
  // network-first, walaupun req.destination kosong (import() bawa fetch()
  // dengan destination=''). Tanpa ini, App.tsx versi lama terhidang dari
  // cache selepas edit kod, menyebabkan splash nampak "stuck" walaupun
  // kod sudah dibuang.
  const isViteSource =
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules/') ||
    /\.(tsx?|jsx?|css|html)(\?|$)/.test(url.pathname);

  // 1) Sumber Vite & dokumen & skrip: NETWORK-FIRST.
  //    Versi terbaharu sentiasa diambil apabila ada talian; cache
  //    hanya digunakan sebagai sandaran luar talian.
  if (isDoc || isScript || isViteSource) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // 2) Aset berhash Vite — kekal cache-first (selamat, nama fail berubah).
  if (isAssetBerhash) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // 3) Aset lain (imej, audio, fon): cache-first dengan kemas kini latar.
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
