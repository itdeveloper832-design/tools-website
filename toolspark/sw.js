// Service Worker for Core Web Vitals Optimization
const CACHE_NAME = 'tools-park-v1';
const STATIC_CACHE = 'static-v1';
const RUNTIME_CACHE = 'runtime-v1';

// Critical assets for LCP optimization
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/premium.css',
  '/css/core-web-vitals.css',
  '/js/performance.js',
  '/js/main.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        // For HTML files, use stale-while-revalidate
        if (request.destination === 'document') {
          fetchAndCache(request);
          return cachedResponse;
        }
        return cachedResponse;
      }
      
      // Otherwise, fetch from network
      return fetchAndCache(request);
    })
  );
});

// Fetch and cache helper
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // Only cache successful responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    
    // Clone response since it can only be used once
    const responseToCache = response.clone();
    
    // Determine which cache to use
    const cacheName = request.destination === 'document' ? RUNTIME_CACHE : STATIC_CACHE;
    
    caches.open(cacheName).then((cache) => {
      cache.put(request, responseToCache);
    });
    
    return response;
  }).catch(() => {
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return new Response('Offline', { status: 503 });
    }
  });
}