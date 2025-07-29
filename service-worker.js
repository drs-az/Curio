const CACHE_NAME = 'goodthings-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './profile.html',
  './style.css',
  './index.js',
  './script.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
