const CACHE = 'simfinly-v2';

// Pages pré-cachées à l'installation pour un fonctionnement offline
const PRECACHE = [
  '/',
  '/index.html',
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/emprunt-immobilier',
  '/simulateurs/impot-revenu',
  '/simulateurs/agirc-arrco',
  '/simulateurs/cnav',
  '/simulateurs/per',
  '/og-image.webp',
  '/favicon.svg',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Ne jamais intercepter : API, analytics, AdSense, Vercel toolbar
  if (
    url.includes('/api/') ||
    url.includes('googlesyndication') ||
    url.includes('googletagmanager') ||
    url.includes('vercel.live') ||
    url.includes('va.vercel-scripts') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) return;

  // Assets hashés (JS, CSS, images statiques) → cache first
  if (url.includes('/assets/') || url.includes('/og-') || url.includes('.webp') || url.includes('.svg')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Navigation HTML → network first, fallback cache puis racine
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request)
            .then(cached => cached || caches.match('/'))
        )
    );
  }
});
