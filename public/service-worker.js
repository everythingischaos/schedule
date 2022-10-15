const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/main.js",
      "/manifest.webmanifest",
      "/icons/icon-48x48.png",
      "/icons/icon-72x72.png",
      "/icons/icon-96x96.png",
      "/icons/icon-128x128.png",
      "/icons/icon-144x144.png",
      "/icons/icon-152x152.png",
      "/icons/icon-192x192.png",
      "/icons/icon-384x384.png",
      "/icons/icon-512x512.png",
    ])
  );
});