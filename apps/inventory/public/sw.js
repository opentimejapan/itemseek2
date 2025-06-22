// Service Worker for ItemSeek Inventory
const CACHE_NAME = 'itemseek-inventory-v1';
const STATIC_CACHE = 'itemseek-static-v1';
const API_CACHE = 'itemseek-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('itemseek-') && 
                     cacheName !== CACHE_NAME &&
                     cacheName !== STATIC_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add offline indicator to response
      const responseInit = {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: new Headers(cachedResponse.headers)
      };
      responseInit.headers.set('X-From-Cache', 'true');
      responseInit.headers.set('X-Cache-Time', new Date().toISOString());
      
      return new Response(cachedResponse.body, responseInit);
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No cached data available' 
      }), 
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Check cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cache);
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return 503 for other requests
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Background fetch and cache update
function fetchAndCache(request, cache) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response);
      }
    })
    .catch(() => {
      // Silently fail - we already returned cached version
    });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('itemseek-'))
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inventory') {
    event.waitUntil(syncInventoryData());
  }
});

async function syncInventoryData() {
  // Get pending actions from IndexedDB
  const pendingActions = await getPendingActions();
  
  for (const action of pendingActions) {
    try {
      const response = await fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body
      });
      
      if (response.ok) {
        await removePendingAction(action.id);
        
        // Notify clients of successful sync
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              action: action
            });
          });
        });
      }
    } catch (error) {
      console.error('Sync failed for action:', action, error);
    }
  }
}

// IndexedDB helpers for offline queue
async function getPendingActions() {
  // Implementation would use IndexedDB to store/retrieve pending actions
  return [];
}

async function removePendingAction(id) {
  // Implementation would remove action from IndexedDB
}