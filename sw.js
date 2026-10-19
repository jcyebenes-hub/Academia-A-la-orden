/* MICABO — Service Worker demo (caché offline del app-shell) */
const CACHE = "alaorden-v252";
const ASSETS = ["./", "index.html", "app.html", "css/style.css",  "js/data.js", "js/bank2.js", "js/bank3.js", "js/bank4.js", "js/study.js", "js/bank5.js", "js/bank7.js", "js/verdicts.js", "js/trivial.js", "js/app.js", "js/cloud.js", "js/tutor.js", "js/donation.js", "js/convocatorias.js", "js/bod-data.js", "js/temario.js", "js/biblio.js", "js/bank8.js", "js/bank9.js", "js/bank10.js", "js/bank11.js", "js/bank12.js", "js/bank13.js", "js/bank14.js", "js/bank15.js", "js/bank16.js", "js/bank17.js", "js/bank18.js", "js/bank19.js", "js/chat.js", "js/bank20.js", "js/bank21.js", "js/bank23.js", "js/bank24.js", "js/bank25.js", "js/bank26.js", "js/bank27.js", "js/bank28.js", "js/bank29.js", "js/bank30.js", "js/bank31.js", "js/bank32.js", "js/bank33.js", "js/bank34.js", "js/bank35.js", "js/bank36.js", "js/bank38.js", "js/bank39.js", "js/bank40.js", "js/bank41.js", "js/bank42.js", "js/bank43.js", "js/bank44.js", "js/bank45.js", "js/bank46.js", "js/bank47.js", "js/bank48.js", "js/bank49.js", "js/bank50.js", "js/bank51.js", "js/bank52.js", "js/bank53.js", "js/bank54.js", "js/bank55.js", "js/bank56.js", "js/bank57.js", "js/bank58.js", "js/bank59.js", "js/bank60.js", "js/bank61.js", "js/bank62.js", "js/bank63.js", "js/bank64.js", "js/bank65.js", "js/bank66.js", "js/bank67.js", "js/bank68.js", "js/bank69.js", "js/bank70.js", "js/bank71.js", "js/bank72.js", "js/bank73.js", "js/bank74.js", "js/bank75.js", "js/bank76.js", "js/bank77.js", "js/bank78.js", "js/bank79.js", "js/bank80.js", "js/bank81.js", "js/bank82.js", "js/bank83.js", "js/bank84.js", "js/bank85.js", "js/bank86.js", "js/bank87.js", "js/bank88.js", "js/bank89.js", "js/bank90.js", "js/bank91.js", "js/bank92.js", "js/bank93.js", "js/bank94.js", "js/bank95.js", "js/bank96.js", "js/bank97.js", "js/bank98.js", "js/bank99.js", "js/bank100.js", "js/bank101.js", "js/bank102.js", "js/bank103.js", "js/bank104.js", "js/bank105.js", "js/bank106.js", "js/bank107.js", "js/bank108.js", "js/bank109.js", "js/bank110.js", "js/bank111.js", "js/bank112.js", "js/bank113.js", "js/bank114.js", "js/bank115.js", "js/bank116.js", "js/bank117.js", "js/bank118.js", "js/bank119.js", "js/bank120.js", "js/bank121.js", "js/bank122.js", "js/bank123.js", "js/bank124.js", "js/bank125.js", "js/bank126.js", "js/bank127.js", "js/bank128.js", "js/bank129.js", "js/bank130.js", "js/bank131.js", "js/bank132.js", "checkout.html", "img/og.jpg", "img/kofi-logo.png", "img/bizum-logo.png", "manifest.json", "icon.png"];
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
