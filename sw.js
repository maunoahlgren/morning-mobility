// Morning Mobility — Service Worker
// Caches the app shell for offline use. YouTube iframes still require network.

const CACHE = 'morning-mobility-v1';
const SHELL = [
  '/morning-mobility/',
  '/morning-mobility/index.html',
  '/morning-mobility/manifest.json',
  '/morning-mobility/icon-192.png',
  '/morning-mobility/icon-512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for shell, network-first for everything else
self.addEventListener('fetch', e => {
  // Don't intercept YouTube or Google Fonts — always network
  const url = e.request.url;
  if (url.includes('youtube.com') || url.includes('youtu.be') ||
      url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache successful GET responses for our own origin
        if (e.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return cached index.html for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('/morning-mobility/index.html');
        }
      });
    })
  );
});
