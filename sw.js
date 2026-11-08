/* Preview shell for /elemental-evolves-preview/.
 * Scope stays the directory of this file, so it does not control /elemental-evolves/.
 * Cache names are ee-preview-* only. Activate never deletes the live game's caches.
 */
var CACHE = "ee-preview-shell-v1";
var CACHE_PREFIX = "ee-preview-";

function scoped(path) {
  return new URL(path, self.location).href;
}

var PRECACHE = [
  scoped("./"),
  scoped("./index.html"),
  scoped("./manifest.webmanifest"),
  scoped("./elemental-evolves-keyart.jpg"),
  scoped("./icons/icon-512.png"),
  scoped("./icons/icon-maskable-512.png"),
  scoped("./icons/apple-touch-icon.png"),
  scoped("./icons/icon-1024.png"),
  scoped("./assets/index.js"),
  scoped("./assets/index.css"),
  scoped("./assets/elemental-evolves-keyart.jpg")
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE).catch(function () {
        return Promise.resolve();
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE && key.indexOf(CACHE_PREFIX) === 0) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.href.startsWith(self.registration.scope)) return;

  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match(scoped("./index.html"));
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req);
    })
  );
});
