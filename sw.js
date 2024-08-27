globalThis.addEventListener("install", async (event) => {
  const assets = [
    "/",
    "./main.js",
    "style.css",
    "./train.js",
    "./utils.js",
    "./getData.js",
    "./audio/a.mp3",
    "./audio/b.mp3",
    "./audio/c.mp3",
    "./audio/d.mp3",
    "./audio/e.mp3",
    "./audio/f.mp3",
    "./audio/g.mp3",
    "./audio/h.mp3",
    "./audio/i.mp3",
    "./audio/j.mp3",
    "./audio/k.mp3",

    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0",
    "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js",
    "https://teachablemachine.withgoogle.com/models/HOoA-AZ1B/",
  ];
  const cache = await caches.open("soroborno-assets");
  cache.addAll(assets);
});

globalThis.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open("soroborno-assets");

      // from the cache;

      const cachedResponse = await cache.match(event.request);

      // Fetch the latest resource from the network
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update the cache with the latest version
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch(() => cachedResponse); // In case of network failure, use cached response

      // return cached immediately and update cache in the background
      return cachedResponse || fetchPromise;
    })()
  );
});
