// This service worker previously tried to cache product images for faster
// refreshes, but intercepting cross-origin image requests inside the
// worker caused some of those fetches to fail (images showing up blank/
// broken instead of loading), so that approach has been reverted. This
// version does nothing but cleanly remove itself from any browser that
// still has the old one installed.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});
