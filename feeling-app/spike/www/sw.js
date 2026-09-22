// Throwaway spike service worker: cache-first for the spike's own
// assets, so "offline behavior" is testable by disabling network and
// reloading. Not a real offline strategy for the product — Phase 3
// will need a proper cache-versioning/update strategy.
const CACHE = 'sprocket-spike-v17';
const ASSETS = [
  './', 'index.html', 'style.css', 'app.js', 'tts.js', 'common.css', 'manifest.webmanifest',
  'stories.html', 'stories.css', 'story.html', 'story-frustrated.html', 'story-excited.html',
  'story-sad.html', 'story-angry.html', 'story-scared.html', 'story-embarrassed.html',
  'story-proud.html', 'story-overwhelmed.html', 'story-happy.html', 'story.css', 'story.js',
  'games.html', 'games.css', 'game-breathe.html', 'game-breathe.css', 'game-breathe.js',
  'academy-data.js', 'academy-icons.js',
  'academy.html', 'academy.css', 'academy.js',
  'academy-level.html', 'academy-level.css', 'academy-level.js',
  'academy-shop.html', 'academy-shop.css', 'academy-shop.js',
  'diary.html', 'diary.css', 'diary.js',
  'help.html', 'help.css', 'help.js',
  'parent-gate.html', 'parent-gate.css', 'parent-gate.js',
  'parent-home.html', 'parent-home.css', 'parent-home.js',
  'fonts/baloo2-400.ttf', 'fonts/baloo2-600.ttf', 'fonts/baloo2-800.ttf',
];

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
