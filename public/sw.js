const CACHE_NAME = 'bunyi-kata-v2';
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
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optionally update the cache here if you want
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
