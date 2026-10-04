/* MICABO — Service Worker demo (caché offline del app-shell) */
const CACHE = "alaorden-v125";
const ASSETS = ["./", "index.html", "app.html", "css/style.css",  "js/data.js", "js/bank2.js", "js/bank3.js", "js/bank4.js", "js/study.js", "js/bank5.js", "js/bank7.js", "js/verdicts.js", "js/trivial.js", "js/app.js", "js/cloud.js", "js/tutor.js", "js/donation.js", "js/convocatorias.js", "js/bod-data.js", "js/temario.js", "js/biblio.js", "js/bank8.js", "js/bank9.js", "js/bank10.js", "js/bank11.js", "js/bank12.js", "js/bank13.js", "js/bank14.js", "js/bank15.js", "js/bank16.js", "js/bank17.js", "js/bank18.js", "js/bank19.js", "js/chat.js", "js/bank20.js", "js/bank21.js", "js/bank22.js", "js/bank23.js", "js/bank24.js", "js/bank25.js", "js/bank26.js", "js/bank27.js", "js/bank28.js", "checkout.html", "img/og.jpg", "manifest.json", "icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  if (new URL(e.request.url).pathname.indexOf("/pdf/") === 0) return; /* los PDF pesan: sin caché, directo */
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match("app.html")))
  );
});
