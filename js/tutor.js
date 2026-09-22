/* ============================================================
   A LA ORDEN · TUTOR — análisis inteligente de errores (motor local)
   ------------------------------------------------------------
   Nada de humo: es un motor de reglas con la tabla de verdad
   normativa del banco. No envía nada a ninguna nube (todo en tu
   dispositivo) y por eso funciona offline y sin coste.
   Qué hace:
   · Analiza CADA fallo y diagnostica la trampa:
     - norma confundida (p. ej. marcar 39/2015 cuando preguntaba LODN)
     - cifra casi-clave (4,335 vs 4,390)
     - órganos/empleos intercambiados
     - categoría vecina / distractor plausible
   · Ofrece refuerzo: una pregunta "gemela" del mismo hecho
   · Ofrece machacar el tema del fallo
   · Test adaptativo: elige preguntas por tus debilidades reales
   ============================================================ */
(function () {
"use strict";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---- banco (mismo cargador que la app) ---- */
let BANK = [], byId = {};
function loadBank() {
  if (BANK.length) return;
  /* QUESTIONS vive como global de script (data.js), no en window: se lee con guard */
  const q0 = (typeof QUESTIONS !== "undefined") ? QUESTIONS : [];
  const list = q0.concat(window.QUESTIONS2 || [], window.QUESTIONS3 || [], window.QUESTIONS4 || [], window.QUESTIONS5 || [], window.QUESTIONS6 || [], window.QUESTIONS7 || []);
  const V = window.VERDICTS || {};
  BANK = list.filter(q => { const v = V[q.id]; return !(v && v.v === "ko"); });
  BANK.forEach(q => byId[q.id] = q);
}

/* ---- estado local del alumno ---- */
function readState() {
  try { return JSON.parse(localStorage.getItem("galon_state") || "{}"); } catch (e) { return {}; }
}

/* ---- tabla de verdad: nº de norma → qué es de verdad ---- */
const LEYES = {
  "5/2005": "la Ley Orgánica de Defensa Nacional (LODN)",
  "96/2009": "los Reales Ordenanzas para las FAS",
  "502/2020": "el RD que regula las guardias de seguridad",
  "847/2015": "la organización básica del Ejército de Tierra",
  "39/2007": "la Ley de la Carrera Militar",
  "8/2006": "la Ley de Tropa y Marinería",
  "9/2011": "la LO de derechos y deberes de los miembros de las FAS",
  "8/2014": "la LO del Régimen Disciplinario de las FAS",
  "14/2015": "el Código Penal Militar (LO)",
  "36/2015": "la Ley de Seguridad Nacional",
  "40/2015": "el régimen jurídico del sector público",
  "39/2015": "el procedimiento administrativo común (¡NO es la LODN!)",
  "3/2007": "la igualdad efectiva de mujeres y hombres (LO)",
  "1150/2021": "la Estrategia de Seguridad Nacional 2021",
  "339/2015": "las enseñanzas de perfeccionamiento de la Defensa",
  "456/2011": "los destinos del militar profesional",
  "170/2026": "el RD de la convocatoria de permanencia 2026"
};
const ORGANOS = ["presidente del gobierno", "ministro de defensa", "el rey", "jemad", "jeme", "ajema", "gobierno", "cortes", "congreso", "senado", "subsecretaría", "segenpol", "cefot", "sargento", "cabo", "brigada", "teniente", "coronel", "capitán", "alférez"];

function nums(s) { return (String(s).match(/\d+(?:[.,]\d+)?/g) || []).filter(n => n.replace(/\D/g, "").length >= 1); }
function firstLaw(s) {
  const m = String(s).match(/\b(\d{1,4}\/\d{4})\b/);
  return m ? m[1] : null;
}

/* ---- diagnóstico de la trampa ---- */
function analyze(q, chosenIdx) {
  const ok = q.o[q.a], mal = q.o[chosenIdx];
  const lineas = [];
  const lawOk = firstLaw(ok), lawMal = firstLaw(mal);
  if (lawMal && lawMal !== lawOk && LEYES[lawMal]) {
    lineas.push("Has marcado <b>" + esc(lawMal) + "</b>, que es " + LEYES[lawMal] + "." + (LEYES[lawOk] ? " La pregunta iba de <b>" + esc(lawOk) + "</b>: " + LEYES[lawOk] + "." : ""));
  }
  const nOk = nums(ok), nMal = nums(mal);
  if (nOk.length && nMal.length && nOk[0] !== nMal[0] && !lineas.length) {
    lineas.push("Casi: la cifra clave era <b>" + esc(nOk[0]) + "</b> y has marcado <b>" + esc(nMal[0]) + "</b>. Este tipo de cifra es la que cae siempre en el examen: escríbela tres veces.");
  }
  const lowOk = ok.toLowerCase(), lowMal = mal.toLowerCase();
  const orgOk = ORGANOS.find(o => lowOk.includes(o)), orgMal = ORGANOS.find(o => lowMal.includes(o) && o !== orgOk);
  if (orgOk && orgMal && !lineas.length) {
    lineas.push("Intercambio de papeles: <b>" + esc(orgMal) + "</b> y <b>" + esc(orgOk) + "</b> se confunden a menudo. Repasa quién hace qué (" + esc(q.r) + ").");
  }
  if (!lineas.length) {
    lineas.push("Distractor plausible: sonaba bien, pero la referencia manda. <b>" + esc(q.r) + "</b>.");
  }
  lineas.push("Ancla de memoria: «<b>" + esc(ok) + "</b>».");
  return lineas;
}

/* ---- pregunta gemela para refuerzo ---- */
function gemela(q) {
  loadBank();
  const key = (q.o[q.a].toLowerCase().match(/[a-záéíóúñü]{5,}/g) || [])[0];
  const same = BANK.filter(x => x.c === q.c && x.t === q.t && x.id !== q.id);
  const conAnswer = key ? same.filter(x => x.o[x.a].toLowerCase().includes(key)) : [];
  const pool = conAnswer.length ? conAnswer : same;
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

/* ---- panel que se pinta bajo la explicación al fallar ---- */
function html(q, chosenIdx) {
  loadBank();
  if (chosenIdx == null || chosenIdx === q.a) return "";
  const gem = gemela(q);
  const nTema = BANK.filter(x => x.c === q.c && x.t === q.t).length;
  window._tutorQ = q;
  return '<div style="margin-top:10px;border:1px dashed var(--gold);border-radius:10px;padding:10px">' +
    '<div style="font-weight:800">🧠 El tutor analiza tu fallo <span class="small muted" style="font-weight:400">· motor local, sin nube</span></div>' +
    '<ul style="margin:8px 0 10px;padding-left:18px" class="small">' + analyze(q, chosenIdx).map(l => "<li style='margin:3px 0'>" + l + "</li>").join("") + "</ul>" +
    (gem ? '<button class="btn btn-ghost btn-sm" onclick="GalonTutor.goRefuerzo()">🔁 Pregunta de refuerzo</button> ' : "") +
    (nTema > 1 ? '<button class="btn btn-gold btn-sm" onclick="GalonTutor.goTema()">💪 Machacar «' + esc(q.t) + "» (" + Math.min(10, nTema) + ')</button>' : "") +
    "</div>";
}

/* ---- acciones de los botones (via app: window.galonStart) ---- */
function start(cfg) { if (window.galonStart) window.galonStart(cfg); }
window.GalonTutor = {
  html,
  goRefuerzo() { const q = window._tutorQ; if (!q) return; const g = gemela(q); if (g) start({ course: q.c, fixed: [g.id], mode: "study", label: "Refuerzo del tutor" }); },
  goTema() { const q = window._tutorQ; if (!q) return; start({ course: q.c, filter: "tema", topic: q.t, n: 10, mode: "study", label: "Tutor · " + q.t }); },
  /* ---- test adaptativo: debilidades reales del alumno ---- */
  adaptativo(course, n) {
    loadBank();
    n = n || 20;
    const st = readState();
    const pool = BANK.filter(q => q.c === course);
    const fallos = pool.filter(q => (st.fails || {})[q.id] > 0);
    const vistos = st.seen || {};
    const nuevos = pool.filter(q => !vistos[q.id] && !(st.fails || {})[q.id]);
    /* precisión por tema (historial) */
    const per = {};
    (st.history || []).forEach(h => {
      if (h.course !== course || !h.byTopic) return;
      Object.keys(h.byTopic).forEach(t => { per[t] = per[t] || { ok: 0, n: 0 }; per[t].ok += h.byTopic[t].ok; per[t].n += h.byTopic[t].n; });
    });
    const debiles = Object.keys(per).filter(t => per[t].n >= 3 && per[t].ok / per[t].n < 0.8);
    const deTema = pool.filter(q => debiles.indexOf(q.t) >= 0 && !(st.fails || {})[q.id]);
    const pick = (arr, k) => { const c = arr.slice(); const out = []; while (out.length < k && c.length) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return out; };
    let ids = pick(fallos, Math.ceil(n * 0.5)).map(q => q.id);
    ids = ids.concat(pick(deTema.filter(q => ids.indexOf(q.id) < 0), Math.ceil(n * 0.25)).map(q => q.id));
    ids = ids.concat(pick(nuevos.filter(q => ids.indexOf(q.id) < 0), Math.ceil(n * 0.15)).map(q => q.id));
    const resto = pool.filter(q => ids.indexOf(q.id) < 0);
    ids = ids.concat(pick(resto, n - ids.length).map(q => q.id));
    return ids.slice(0, n);
  }
};
})();
