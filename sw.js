/* A LA ORDEN — Service Worker demo (caché offline del app-shell) */
const CACHE = "alaorden-v86";
const ASSETS = ["./", "index.html", "app.html", "css/style.css",  "js/data.js", "js/bank2.js", "js/bank3.js", "js/bank4.js", "js/study.js", "js/bank5.js", "js/bank7.js", "js/verdicts.js", "js/trivial.js", "js/app.js", "js/cloud.js", "js/tutor.js", "js/donation.js", "js/convocatorias.js", "js/bod-data.js", "js/temario.js", "js/bank8.js", "js/bank9.js", "js/bank10.js", "js/bank11.js", "checkout.html", "img/og.jpg", "manifest.json", "icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match("app.html")))
  );
});
