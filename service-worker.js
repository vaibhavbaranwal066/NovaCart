const CACHE_NAME = "novacart-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/product.html",
  "/checkout.html",
  "/manifest.json",

  "/css/main.css",
  "/css/theme.css",
  "/css/animations.css",

  "/js/data.js",
  "/js/app.js",
  "/js/cart.js",
  "/js/theme.js",
  "/js/product.js",
  "/js/wishlist.js",
  "/js/toast.js"
];

/* INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

/* FETCH */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      cached => cached || fetch(event.request)
    )
  );
});
