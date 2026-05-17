const CACHE_NAME = 'nutrisage-v1';
const ASSETS = [
  '/NutriSage/',
  '/NutriSage/index.html',
  '/NutriSage/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(ASSETS);
  }).catch(function() {}));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('api.jsonbin.io') ||
      e.request.url.includes('workers.dev') ||
      e.request.url.includes('accounts.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match('/NutriSage/index.html');
      });
    })
  );
});
