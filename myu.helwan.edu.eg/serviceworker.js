var staticCacheName = 'portal-v1';

//importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
       '/'/*,
       '/index.html',
       '/index.html?homescreen=1',
       '/?homescreen=1',
       '/styles/main.css',
       '/scripts/main.min.js',
       '/sounds/airhorn.mp3'*/
     ]);
   })
 );
});
self.addEventListener('fetch', function(event) {
    //console.log("in sw");
    //console.log(event.request);
    var response;
    event.respondWith(
        fetch(event.request)
            .then(function(fetch_response){
                response = fetch_response;
                if(event.request.url.indexOf("/exams/")==-1) {  //========= never cache exams
                    //console.log("cache putttttttttttttttttttttt");
                    caches.open(staticCacheName).then(function (cache) {
                        cache.put(event.request, response).then(function () {
                            //console.log("successfully added to cache");
                        }).catch(function () {
                            //console.log(event.request.url);
                            console.log("failed to add to cache "+event.request.url);
                        });
                    });
                }
                    return response.clone();
            })
            .catch(function(err) {
                console.log(err);
                console.log("get from cache");
                console.log(event.request)
                try {
                    return caches.match(event.request);
                }
                catch(e) {
                    console.log("never cached");
                    // never cached
                    return e
                }
                })
            );
});
/*
self.addEventListener('fetch', function(event) {
 console.log(event.request.url);
//If a request doesn't match anything in the cache, get it from the network
 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});*/
/*

self.addEventListener('install', function(event) {
  console.log("install===========================");
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/base_layout'
      ]);
    })
  );
});
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
      if ((requestUrl.pathname === '/')) {
        event.respondWith(caches.match('/base_layout'));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});*/