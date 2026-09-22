/* A LA ORDEN · Próximas convocatorias oficiales — datos curados (última revisión: 20-sep-2026)
   Regla de honestidad: est:true = FECHA PREVISTA según el calendario de años anteriores
   (se muestra con "~"); est:false = dato oficial publicado. Cuando salga una convocatoria
   oficial, actualizar aquí y en tools/bod-seed.js. El panel la pinta en #convos si existe. */
window.GALON_CONVOS = {
  actualizado: "20-sep-2026",
  cursos: [
    {
      id: "cabo",
      nombre: "Ascenso a Cabo (ET)",
      badge: "PREVISTA · I/26",
      badgeClass: "badge badge-gold",
      resumen: "La siguiente en abrirse. Patrón de los últimos años: bases en otoño y examen en febrero.",
      hitos: [
        { k: "Publicación de bases (BOD)", d: "otoño 2026", est: true },
        { k: "Examen · 50 + 5 preguntas en 70 min", d: "febrero 2027", est: true },
        { k: "Resolución y nota de corte", d: "verano 2027", est: true, extra: "La I/25 se resolvió el 6-jul-2026 (corte 4,335)." }
      ]
    },
    {
      id: "cabo1",
      nombre: "Ascenso a Cabo 1º (ET)",
      badge: "EN CURSO · I/26",
      badgeClass: "badge badge-green",
      resumen: "I/26 en marcha (fechas oficiales de la Res. 551/04582/26 · BOD nº 83): ahora mismo, fase presencial en las Academias.",
      hitos: [
        { k: "Convocatoria I/26", d: "feb – abr 2026", est: false, ref: "Res. 551/01505/26 y 551/04582/26" },
        { k: "Fase a distancia (CVCDEF)", d: "31-ago → 11-sep 2026", est: false },
        { k: "Examen del Módulo de Formación Común", d: "14-sep 2026 · 09:30 · 60 min · 50+5 preg.", est: false },
        { k: "Fase presencial en Academias", d: "14-sep → 9-oct 2026", est: false, ahora: true },
        { k: "Siguiente convocatoria (I/27)", d: "~ 1er trimestre 2027", est: true }
      ]
    },
    {
      id: "perm",
      nombre: "Permanencia (Tropa y Marinería)",
      badge: "EN MARCHA · 2026",
      badgeClass: "badge badge-green",
      resumen: "1.000 plazas convocadas (ET 540 · AR 211 · EA 249). Examen: 100 preguntas en 120 min.",
      hitos: [
        { k: "Convocatoria y solicitudes", d: "18-jun → 7-jul 2026", est: false, ref: "Res. 452/08724/26 · BOD nº 116" },
        { k: "Examen de conocimientos", d: "pendiente de citación oficial", est: false, extra: "Lo avisamos en cuanto salga en el BOD." },
        { k: "Condición de militar de carrera", d: "31-dic-2026", est: false },
        { k: "Próxima convocatoria 2027", d: "~ junio 2027", est: true }
      ]
    }
  ]
};

/* ---- render en #convos (portada) y #convosApp (si se usa en la app) ---- */
(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function renderCard(c) {
    var hitos = c.hitos.map(function (h) {
      var ico = h.ahora ? "⏳" : (h.est ? "📅" : "✅");
      var color = h.ahora ? "var(--gold)" : (h.est ? "var(--muted)" : "var(--ok)");
      var peso = h.ahora ? "800" : (h.est ? "500" : "600");
      var extra = h.extra ? '<div class="small" style="color:var(--muted);margin-top:2px">' + esc(h.extra) + "</div>" : "";
      var ref = h.ref ? '<div class="small" style="color:var(--muted);margin-top:2px">' + esc(h.ref) + "</div>" : "";
      var tilde = h.est && !/pendiente/i.test(h.d) ? ' <span style="color:var(--muted)">~</span>' : "";
      return '<li style="list-style:none;display:flex;gap:8px;padding:7px 0;border-top:1px dashed var(--line)">' +
        '<span aria-hidden="true">' + ico + '</span><div><b style="font-weight:' + peso + '">' + esc(h.k) + '</b>' +
        '<div style="color:' + color + ';font-weight:700;font-size:.92rem">' + esc(h.d) + tilde + "</div>" + ref + extra + "</div></li>";
    }).join("");
    return '<div style="background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;display:flex;flex-direction:column;gap:10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">' +
      '<b style="font-size:1.05rem">' + esc(c.nombre) + "</b>" +
      '<span class="' + c.badgeClass + '">' + esc(c.badge) + "</span></div>" +
      '<p class="small" style="margin:0;color:var(--muted)">' + esc(c.resumen) + "</p>" +
      '<ul style="margin:0;padding:0">' + hitos + "</ul></div>";
  }
  window.renderConvocatorias = function () {
    ["convos", "convosApp"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var C = window.GALON_CONVOS;
      var grid = C.cursos.map(renderCard).join("");
      var tg = (window.GALON_DONATE || {}).telegram;
      var cta = tg ? '<a class="btn btn-ghost btn-sm" href="' + esc(tg) + '" target="_blank" rel="noopener">🔔 Canal de Alertas BOD</a>'
                   : '<a class="btn btn-ghost btn-sm" href="app.html">🔔 Alertas BOD en la app</a>';
      el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;align-items:stretch;text-align:left">' + grid + "</div>" +
        '<p class="small" style="margin-top:14px;color:var(--muted)">Las fechas marcadas con <b>~</b> son <b>previstas</b>, según el calendario de convocatorias anteriores. Las oficiales se publican en el Boletín Oficial de Defensa. Última revisión: <b>' + esc(C.actualizado) + "</b> · " + cta + "</p>";
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", window.renderConvocatorias);
  else window.renderConvocatorias();
})();
