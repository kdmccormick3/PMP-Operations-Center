/* PMP Operations Center service worker — v4.18
 *
 * Tuned for a phone-hotspot connection.
 *
 * Previous version was network-first: every request waited on the network and only
 * fell back to cache when the fetch *failed*. On a weak hotspot a request does not
 * fail quickly, it hangs — so the app sat there loading. This version serves the
 * shell from cache immediately and refreshes it in the background instead.
 */

const CACHE_VERSION = "v4-18";
const CACHE_NAME = `pmp-operations-${CACHE_VERSION}-shell`;

// Only same-origin files we control. Missing entries are tolerated (see install).
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // addAll() is all-or-nothing: one missing icon and the whole worker fails to
      // install. Add individually so a missing file degrades instead of breaking.
      await Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((error) => {
            console.warn("PMP SW: could not precache", url, error);
          })
        )
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("pmp-operations-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Safe cache write. Cross-origin script/style responses are opaque, and cache.put()
// throws a TypeError on those — the old version had no catch, so every page load
// produced unhandled rejections.
function safePut(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") return;
  caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, response))
    .catch((error) => console.warn("PMP SW: cache write skipped", error));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache Firestore/auth traffic — it must always hit the network, and the
  // long-lived listen channel must not be intercepted.
  if (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com")
  ) {
    return;
  }

  // Navigations: serve the cached shell instantly, refresh in the background.
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => {
        const network = fetch(request)
          .then((response) => {
            safePut("./index.html", response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Same-origin assets: stale-while-revalidate.
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            safePut(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Cross-origin (the CDN libraries): try cache, else network. These are opaque and
  // cannot be cached from here — see the note in the deployment instructions about
  // vendoring them locally, which is what actually fixes offline use.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
