var CACHE_NAME = 'yam-v1';
var urlsToCache = [
  '/',
  '/shared.css',
  '/shared.js',
  '/menu.js',
  '/router',
  '/yourmap',
  '/awareness',
  '/test-meta',
  '/collaborate'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
