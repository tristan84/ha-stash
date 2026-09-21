// Throwaway spike service worker: cache-first for the spike's own
// assets, so "offline behavior" is testable by disabling network and
// reloading. Not a real offline strategy for the product — Phase 3
// will need a proper cache-versioning/update strategy.
const CACHE = 'sprocket-spike-v1';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
