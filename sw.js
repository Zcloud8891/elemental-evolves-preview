/* Preview shell for /elemental-evolves-preview/.
 * Scope stays the directory of this file, so it does not control /elemental-evolves/.
 * Cache names are ee-preview-* only. Activate never deletes the live game's caches.
 */
var CACHE = "ee-preview-unit-art-v1";
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
  scoped("./assets/elemental-evolves-keyart.jpg"),
  scoped("./assets/units/ee_fire_spark_idle0_r.png"),
  scoped("./assets/units/ee_fire_cinder_idle0_r.png"),
  scoped("./assets/units/ee_fire_blaze_idle0_r.png"),
  scoped("./assets/units/ee_fire_inferno_idle0_r.png"),
  scoped("./assets/units/ee_fire_pyre_idle0_r.png"),
  scoped("./assets/units/ee_water_ripple_idle0_r.png"),
  scoped("./assets/units/ee_water_tide_idle0_r.png"),
  scoped("./assets/units/ee_water_current_idle0_r.png"),
  scoped("./assets/units/ee_water_torrent_idle0_r.png"),
  scoped("./assets/units/ee_water_deep_idle0_r.png"),
  scoped("./assets/units/ee_earth_pebble_idle0_r.png"),
  scoped("./assets/units/ee_earth_bramble_idle0_r.png"),
  scoped("./assets/units/ee_earth_crag_idle0_r.png"),
  scoped("./assets/units/ee_earth_quake_idle0_r.png"),
  scoped("./assets/units/ee_earth_mountain_idle0_r.png"),
  scoped("./assets/units/ee_light_gleam_idle0_r.png"),
  scoped("./assets/units/ee_light_lumen_idle0_r.png"),
  scoped("./assets/units/ee_light_radiant_idle0_r.png"),
  scoped("./assets/units/ee_light_solaris_idle0_r.png"),
  scoped("./assets/units/ee_light_crown_idle0_r.png"),
  scoped("./assets/units/ee_dark_shade_idle0_r.png"),
  scoped("./assets/units/ee_dark_gloom_idle0_r.png"),
  scoped("./assets/units/ee_dark_dusk_idle0_r.png"),
  scoped("./assets/units/ee_dark_umbra_idle0_r.png"),
  scoped("./assets/units/ee_dark_eclipse_idle0_r.png"),
  scoped("./assets/sfx/attack.ogg"),
  scoped("./assets/sfx/hit.ogg"),
  scoped("./assets/sfx/death.ogg"),
  scoped("./assets/sfx/evolve.ogg")
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
