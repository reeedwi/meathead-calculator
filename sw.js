// Service Worker for Meathead Calculator PWA
const CACHE_NAME = 'meathead-calculator-v5';

// Get the base path from the service worker location
const getBasePath = () => {
    const swPath = self.location.pathname;
    return swPath.substring(0, swPath.lastIndexOf('/'));
};

const basePath = getBasePath();
console.log('Service Worker base path:', basePath);

const urlsToCache = [
    basePath + '/',
    basePath + '/index.html',
    basePath + '/styles.css', 
    basePath + '/script.js',
    basePath + '/manifest.json',
    basePath + '/debug.html',
    basePath + '/icon-192.png',
    basePath + '/icon-512.png'
];

console.log('URLs to cache:', urlsToCache);

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                console.log('Cache name:', CACHE_NAME);
                console.log('URLs to cache:', urlsToCache);
                
                // Cache files one by one to identify any failing requests
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(url)
                            .then(response => {
                                if (response.ok) {
                                    console.log('Successfully fetched:', url);
                                    return cache.put(url, response);
                                } else {
                                    console.error('Failed to fetch:', url, 'Status:', response.status);
                                    throw new Error(`Failed to fetch ${url}: ${response.status}`);
                                }
                            })
                            .catch(error => {
                                console.error('Error caching:', url, error);
                                // Don't let one failed cache prevent the rest
                                return Promise.resolve();
                            });
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                // Take control immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Installation failed', error);
                throw error;
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Always fetch from network to check for updates
                const fetchPromise = fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response since it's a stream
                        const responseToCache = response.clone();
                        
                        // Add to cache for future use
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                                console.log('Service Worker: Updated cache for', event.request.url);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('Service Worker: Fetch failed', error);
                        throw error;
                    });
                
                // Return cached response immediately if available, otherwise wait for network
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache while updating', event.request.url);
                    return cachedResponse;
                } else {
                    console.log('Service Worker: Fetching from network (no cache)', event.request.url);
                    return fetchPromise;
                }
            })
    );
});

// Handle background sync (for future enhancement)
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync', event.tag);
    // Could be used for syncing calculation history or preferences
});

// Handle push notifications (for future enhancement)
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    // Could be used for workout reminders or app updates
});

// Handle message from main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // Send response back to main thread
    event.ports[0].postMessage({
        type: 'SW_RESPONSE',
        message: 'Service Worker is active'
    });
}); 