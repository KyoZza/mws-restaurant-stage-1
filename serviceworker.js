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
        // // 'imgs/'
        // // 'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        // // 'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
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
  // console.log('Hellooou');
  // console.log(event.request);
  // event.respondWith(
  //   new Response('Hello <b>World!</b>', {
  //     headers: {
  //       'foo': 'bar'
  //     }
  //   })
  // );


  // event.respondWith(
  //   fetch(event.request).then(function(response) {
  //     if (response.status === 404) {
  //       // TODO: instead, respond with the gif at
  //       // /imgs/dr-evil.gif
  //       // using a network request
  //       return fetch('/imgs/dr-evil.gif');
  //     }
  //     return response;
  //   }).catch(function() {
  //     return new Response("Uh oh, that totally failed!");
  //   })
  // );


  // let req = undefined;
  // const test = 'bask';

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

