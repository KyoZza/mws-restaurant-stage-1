const staticCacheName = 'restaurant-review-static-v1';

/**
 * Listens to install events
 * @event install
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        //'data/restaurants.json',
        // // 'js/main.js',
        'css/styles.css'
      ]);
    })
  );
});

/**
 * Listens to activate events
 * @event activate
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant-review-') &&
                 cacheName != staticCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Listens to fetch events
 * @event fetch
 */
self.addEventListener('fetch', (event) => {
  if(event.request.url.includes('restaurant.html')) req = 'restaurant.html';
  // Respond with an entry from the cache if there is one.
  // If there isn't, fetch from the network.
  event.respondWith(
    caches.match(event.request).then((response) => {
      if(response) return response;
      return fetch(event.request).then((response) => {
        caches.open(staticCacheName).then((cache) => {
          return cache.add(event.request);
        }).catch((error) => {
          console.log(error);
        })
        return response;
      });
      // if(event.request.url.endsWith('.json')) console.log(response);

      // return response || fetch(event.request);
    })
  );
});

