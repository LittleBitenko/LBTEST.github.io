// sw.js — cache-first for images under any /assets/ path (works on GitHub Pages subpaths)
const CACHE_NAME = 'lb-imgs-v2';

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const isAsset = url.pathname.includes('/assets/') && /\.(webp|png|jpe?g)$/i.test(url.pathname);

  if (!isAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, {ignoreVary: true});
    if (cached) return cached;

    try {
      const fresh = await fetch(req, {cache: 'no-store'});
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      if (cached) return cached;
      throw e;
    }
  })());
});
