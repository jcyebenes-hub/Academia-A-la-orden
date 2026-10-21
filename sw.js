/* MICABO — Service Worker (caché offline del app-shell)

   v276 · reescrito para que una actualización NUNCA se quede a medias.
   Antes: `c.addAll(ASSETS)` con 174 archivos. Si uno solo fallaba (mala
   cobertura, un 404, un timeout), el install se rechazaba y el móvil se
   quedaba clavado en la versión vieja para siempre. Pasó de la v268 a la v275.
   Ahora:
     · el install precarga solo el núcleo, y cada archivo por separado: si uno
       falla, se ignora y la instalación sigue.
     · el resto se cachea la primera vez que se usa.
     · las páginas (app.html, index.html) y el propio sw.js van SIEMPRE a red
       primero: así se ve la versión nueva en cuanto hay conexión.
*/
const CACHE = "alaorden-v278";
const CORE = ["./", "index.html", "app.html", "css/style.css", "manifest.json", "icon.png", "js/data.js", "js/app.js", "js/study.js", "js/verdicts.js", "js/trivial.js", "js/cloud.js", "js/tutor.js", "js/donation.js", "js/convocatorias.js", "js/bod-data.js", "js/temario.js", "js/temario-cabo26.js", "js/teoria-idx.js", "js/pfu-data.js", "js/pfu.js", "js/temario-cabo1.js", "js/temario-perm.js", "js/biblio.js", "js/chat.js", "img/qr-arte.png", "img/qr-arte@2x.png", "img/qr-micabo.png", "img/qr-micabo@2x.png", "img/qr-soldado.png", "img/arte-soldado.png", "img/og.jpg", "img/kofi-logo.png", "img/bizum-logo.png", "checkout.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      /* uno a uno: un fallo no tumba la instalación */
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const esPagina = u => {
  const p = new URL(u).pathname;
  return p === "/" || p.endsWith(".html") || p.endsWith("/sw.js") || p.endsWith("/version.json");
};

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.indexOf("/pdf/") === 0) return;  /* los PDF pesan: sin caché */
  if (new URL(req.url).pathname.indexOf("/api/") === 0) return;  /* API siempre a red */

  /* Páginas y sw.js: red primero, caché solo si no hay conexión */
  if (esPagina(req.url)) {
    e.respondWith(
      fetch(req).then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("app.html")))
    );
    return;
  }

  /* Resto: caché primero y, si no está, red (y se guarda para la próxima) */
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia));
      return res;
    }).catch(() => caches.match("app.html")))
  );
});
