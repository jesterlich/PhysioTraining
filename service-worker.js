const CACHE_NAME = "physio-training-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",

  "./icons/icon-192.png",
  "./icons/icon-512.png",

  "./vendor/jspdf.umd.min.js",
  "./vendor/jspdf.plugin.autotable.min.js"
  "./vendor/supabase.js",
];


// =====================================
// INSTALLATION
// =====================================

self.addEventListener(
  "install",
  function (event) {

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(function (cache) {

          return cache.addAll(
            FILES_TO_CACHE
          );

        })
    );

    self.skipWaiting();
  }
);


// =====================================
// AKTIVIERUNG
// =====================================

self.addEventListener(
  "activate",
  function (event) {

    event.waitUntil(

      caches
        .keys()
        .then(function (cacheNames) {

          return Promise.all(

            cacheNames.map(
              function (cacheName) {

                if (
                  cacheName !== CACHE_NAME
                ) {

                  return caches.delete(
                    cacheName
                  );

                }

              }
            )

          );

        })

    );

    self.clients.claim();
  }
);


// =====================================
// DATEIEN LADEN
// =====================================

self.addEventListener(
  "fetch",
  function (event) {

    if (
      event.request.method !== "GET"
    ) {
      return;
    }


    const requestUrl =
      new URL(
        event.request.url
      );


    // Nur Dateien unserer eigenen App behandeln
    if (
      requestUrl.origin !==
      self.location.origin
    ) {
      return;
    }


    event.respondWith(

      fetch(event.request)

        .then(function (response) {

          if (response.ok) {

            const responseCopy =
              response.clone();


            caches
              .open(CACHE_NAME)
              .then(function (cache) {

                cache.put(
                  event.request,
                  responseCopy
                );

              });

          }


          return response;

        })


        .catch(function () {

          return caches
            .match(event.request)

            .then(function (
              cachedResponse
            ) {

              if (cachedResponse) {

                return cachedResponse;

              }


              // Falls eine Seite offline
              // nicht gefunden wird:
              if (
                event.request.mode ===
                "navigate"
              ) {

                return caches.match(
                  "./index.html"
                );

              }

            });

        })

    );

  }
);