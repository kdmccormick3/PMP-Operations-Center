/* PMP Operations Center service worker — v4.23
 *
 * Tuned for a phone-hotspot connection.
 *
 * Serves the app shell from cache immediately and refreshes it in the
 * background (stale-while-revalidate), so a weak hotspot never leaves the
 * app hanging on load.
 *
 * v4.23 fix: opening a PDF in a new tab is ALSO a "navigate" request. The
 * old worker answered every navigation with the cached index.html, which
 * hijacked the Label/SDS links (the new tab showed the Dashboard instead of
 * the PDF) — and then cached the PDF *as* index.html, so reopening the app
 * showed the last label viewed. Document navigations now go to the network
 * and are cached under their own URL.
 */

const CACHE_VERSION = "v4-23";
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
// throws a TypeError on those — so skip anything that isn't a clean 200.
function safePut(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") return;
  caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, response))
    .catch((error) => console.warn("PMP SW: cache write skipped", error));
}

// PDFs and anything in the labels folder are documents, not the app shell.
function isDocumentUrl(url) {
  const path = url.pathname.toLowerCase();
  return path.endsWith(".pdf") || path.includes("/labels/");
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

  if (request.mode === "navigate") {
    // Document links (Label / SDS / Technical Bulletin / Training) open in a
    // new tab, which arrives here as a navigation. Serve the real file —
    // cache-first so previously viewed labels still open on a dead hotspot —
    // and NEVER substitute the app shell for it.
    if (isDocumentUrl(url)) {
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

    // App-shell navigations: serve the cached shell instantly, refresh it in
    // the background. The refresh fetches ./index.html explicitly so the shell
    // cache can only ever contain the shell.
    event.respondWith(
      caches.match("./index.html").then((cached) => {
        const network = fetch("./index.html")
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
