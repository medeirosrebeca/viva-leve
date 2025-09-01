const APP_CACHE = 'viva-leve-v1';
const ASSETS = [
  './',
  'index.html',
  'icons/icon-192.png',
  'icons/icon-512.png'
];
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', evt => {
  evt.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==APP_CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', evt => {
  const req = evt.request;
  if(req.method !== 'GET') return;
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      const copy = resp.clone();
      caches.open(APP_CACHE).then(c => c.put(req, copy));
      return resp;
    }).catch(()=> cached))
  );
});
