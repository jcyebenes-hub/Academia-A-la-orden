/* A LA ORDEN · Academia de Tropa — motor de la app */
(function () {
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---- almacenamiento seguro (memoria si no hay localStorage) ---- */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem("galon_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return (k in mem) ? mem[k] : d; } },
  set(k, v) { try { localStorage.setItem("galon_" + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
  del(k) { try { localStorage.removeItem("galon_" + k); } catch (e) {} delete mem[k]; }
};

/* ---- estado ---- */
let state = Object.assign({ course: "cabo", name: "Recluta", xp: 0, streak: 0, lastDay: null, fails: {}, history: [], seen: {}, blanks: {}, srs: {}, daily: {}, stars: {}, notes: {}, tramita: {}, donation: {} }, store.get("state", {}));
function save() { state.updatedAt = Date.now(); store.set("state", state); paintChips(); }
function level() { return Math.floor(state.xp / 300) + 1; }
function paintChips() {
  const c = COURSES[state.course];
  $("#courseBadge").textContent = c.badge;
  $("#streakChip").textContent = "🔥 " + state.streak + " días";
  $("#xpChip").textContent = state.xp + " XP · Nv " + level();
}
let toastT = null;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

if (store.get("dark", false)) document.documentElement.classList.add("dark");

/* ---- preguntas ---- */
const BANK_ALL = QUESTIONS.concat(window.QUESTIONS2 || [], window.QUESTIONS3 || [], window.QUESTIONS4 || [], window.QUESTIONS5 || [], window.QUESTIONS6 || [], window.QUESTIONS7 || []);
const _VERD = window.VERDICTS || {};
const BANK = BANK_ALL.filter(q => { const v = _VERD[q.id]; return !(v && v.v === "ko"); });
const byId = {}; BANK.forEach(q => byId[q.id] = q);

/* Baraja las opciones de cada pregunta UNA vez por carga de la app: así la correcta
   no cae siempre en la misma posición (los bancos antiguos la ponían en "A" el 40%
   de las veces). Todas las vistas (test, simulacro, duelo, tarjetas, revisión) leen
   los mismos objetos, por lo que pregunta servida, corrección y revisión coinciden. */
(function () {
  for (const q of BANK) {
    if (!Array.isArray(q.o) || q.o.length !== 4 || typeof q.a !== "number") continue;
    const idx = shuffle([0, 1, 2, 3]);
    q.o = idx.map(i => q.o[i]);
    q.a = idx.indexOf(q.a);
  }
})();
function bank(course) { return BANK.filter(q => q.c === course); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function diffLabel(d) { return d === "F" ? "Fácil" : d === "M" ? "Media" : "Difícil"; }

/* ---- sesión de test ---- */
let S = null; // {cfg, list, idx, ans:{}, flagged:{}, study, timerOn, remaining, timerId, locked:{}}
let lastResult = null;

function startTest(cfg) {
  let list, capped = false, refuerzos = 0;
  if (cfg.fixed) list = cfg.fixed.slice();
  else {
    let pool = bank(cfg.course);
    if (cfg.filter === "tema") pool = pool.filter(q => q.t === cfg.topic);
    if (cfg.filter === "bloque") pool = pool.filter(q => q.b === cfg.block);
    if (cfg.filter === "fallos") pool = pool.filter(q => (state.fails[q.id] || 0) > 0);
    if (cfg.filter === "blancos") pool = pool.filter(q => state.blanks[q.id] === 1);
    if (cfg.filter === "nuevos") pool = pool.filter(q => !state.seen[q.id]);
    if (cfg.diff) pool = pool.filter(q => q.d === cfg.diff);
    pool = shuffle(pool);
    let n = cfg.n || pool.length;
    if (n > pool.length) { n = pool.length; capped = true; }
    list = pool.slice(0, n);
    /* BUCLE DE MEMORIA: los fallos vivos vuelven a salir hasta que se dominan */
    if (cfg.mode === "study" && (cfg.filter === "all" || cfg.filter === "tema" || cfg.filter === "bloque") && n >= 6) {
      const k = Math.min(3, Math.ceil(n * 0.3));
      const enLista = id => list.some(q => q.id === id);
      const falladas = pool.filter(q => (state.fails[q.id] || 0) > 0 && !enLista(q.id))
        .sort((a, b) => (state.fails[b.id] || 0) - (state.fails[a.id] || 0)).slice(0, k);
      if (falladas.length) {
        list = shuffle(list.filter(q => falladas.indexOf(q) < 0).concat(falladas)).slice(0, n);
        refuerzos = list.filter(q => falladas.indexOf(q) >= 0).length;
      }
    }
  }
  if (!list.length) { toast("No hay preguntas disponibles para ese filtro"); return; }
  S = { cfg, list, idx: 0, ans: {}, flagged: {}, locked: {}, study: cfg.mode === "study", remaining: cfg.minutes ? cfg.minutes * 60 : null, timerId: null, capped };
  list.forEach(q => S.ans[q.id] = null);
  if (refuerzos) { S.reinforced = refuerzos; toast("🔁 Este test incluye " + refuerzos + " refuerzos de tus fallos"); }
  location.hash = "#/test";
}
window.galonStart = cfg => startTest(cfg);
function stopTimer() { if (S && S.timerId) { clearInterval(S.timerId); S.timerId = null; } if (S && S.perQId) { clearInterval(S.perQId); S.perQId = null; } }
function fmtTime(s) { s = Math.max(0, s); const m = Math.floor(s / 60), r = s % 60; return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r; }

/* ================= VISTAS ================= */
const view = () => $("#view");

const CURSO_ICO = { cabo: "🪖", cabo1: "⭐", perm: "🎯" };
function courseCards() {
  const c = COURSES[state.course];
  return '<button class="course-pill" data-cursos="1">' + (CURSO_ICO[state.course] || "🎓") + " " + esc(c.name) + ' <span style="opacity:.55">▾</span></button>';
}
function bindCourses(alEntrar) {
  $$("[data-cursos]").forEach(b => b.onclick = () => abrirCursos(false));
  $$("[data-course]").forEach(b => b.onclick = () => {
    state.course = b.getAttribute("data-course"); save();
    const sh = $("#sheetBg"); if (sh) sh.remove();
    if (alEntrar) { location.hash = "#/entrenar"; toast("Curso: " + COURSES[state.course].name); }
    else { render(); toast("Curso: " + COURSES[state.course].name); }
  });
}
/* hoja inferior "¿Qué preparas hoy?": tiles en vertical (FIN de la ruleta deslizable) · con alEntrar, tocas tu curso y entras directo a Entrenar */
function abrirCursos(alEntrar) {
  if (alEntrar && state.opts && state.opts.recordarCurso) { location.hash = "#/entrenar"; return; } /* elección recordada: sin preguntar */
  const old = $("#sheetBg"); if (old) old.remove();
  const ses = id => state.history.filter(h => h.course === id).length;
  const cards = Object.values(COURSES).map(c => {
    const n = bank(c.id).length;
    const yo = state.course === c.id;
    const go = alEntrar ? (yo ? "✔ ES TU CURSO · TOCA PARA ENTRAR →" : "ELEGIR Y ENTRAR →") : (yo ? "✔ ES TU CURSO" : "ELEGIR →");
    return '<button class="cslide' + (yo ? " on" : "") + '" data-course="' + c.id + '" style="flex:0 0 auto;max-width:none;width:auto;min-height:0;padding:14px 14px 12px">' +
      '<span class="big">' + (CURSO_ICO[c.id] || "🎓") + '</span><b>' + esc(c.name) + '</b>' +
      '<span class="sub">' + esc(c.tagline) + '</span>' +
      '<span class="meta">' + n + ' preguntas verificadas · ' + ses(c.id) + ' sesiones tuyas</span>' +
      '<span class="go">' + go + "</span></button>";
  }).join("");
  const bg = document.createElement("div");
  bg.id = "sheetBg"; bg.className = "sheet-bg";
  bg.innerHTML = '<div class="sheet"><h3>¿Qué preparas hoy?</h3>' +
    '<p class="small muted" style="padding:0 18px 8px;margin:0">' + (alEntrar ? "Toca tu curso y entras directo a Entrenar" : "Toca una tarjeta para cambiar de curso") + '</p>' +
    '<div style="display:flex;flex-direction:column;gap:10px;padding:4px 16px 8px;overflow-y:auto">' + cards + "</div>" +
    (alEntrar ? '<button id="tRec" class="btn btn-ghost btn-sm" style="margin:6px 16px 10px;width:calc(100% - 32px)">📌 Recordar mi elección · no volver a preguntar</button>' : "") +
    "</div>";
  document.body.appendChild(bg);
  bg.onclick = e => { if (e.target === bg) bg.remove(); };
  bindCourses(alEntrar);
  if (alEntrar) {
    const rec = $("#tRec");
    if (rec) {
      const pintar = () => { rec.textContent = (state.opts && state.opts.recordarCurso) ? "📌 Elección recordada · toca para olvidarla" : "📌 Recordar mi elección · no volver a preguntar"; };
      pintar();
      rec.onclick = () => {
        state.opts = state.opts || {};
        if (state.opts.recordarCurso) { delete state.opts.recordarCurso; toast("Volverá a preguntarte al entrar"); }
        else { state.opts.recordarCurso = true; toast("Recordado: entras directo a " + COURSES[state.course].name); bg.remove(); location.hash = "#/entrenar"; }
        save(); pintar();
      };
    }
  }
}
/* efecto RUEDA: la carta del centro crece, las vecinas se atenúan; puntos sincronizados */
function bindCarrusel(el, dots) {
  if (!el) return;
  let raf = null;
  const paint = () => {
    raf = null;
    const centro = el.scrollLeft + el.clientWidth / 2;
    let mejor = 0, mejorD = 1e9;
    Array.from(el.children).forEach((c, j) => {
      const d = Math.abs(centro - (c.offsetLeft + c.offsetWidth / 2));
      if (d < mejorD) { mejorD = d; mejor = j; }
      const f = Math.min(1, d / (c.offsetWidth || 1));
      c.style.transform = "scale(" + (1 - f * 0.18).toFixed(3) + ")";
      c.style.opacity = (1 - f * 0.55).toFixed(3);
    });
    if (dots) Array.from(dots.children).forEach((d, j) => d.classList.toggle("on", j === mejor));
  };
  el.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
  setTimeout(paint, 60);
  setTimeout(paint, 400);
  window.addEventListener("resize", () => { if (!raf) raf = requestAnimationFrame(paint); });
}

/* ---- INICIO ---- */
function vHome() {
  const c = COURSES[state.course];
  const hist = state.history.filter(h => h.course === state.course).slice(-5);
  const acc = hist.length ? Math.round(hist.reduce((s, h) => s + h.acc, 0) / hist.length) : null;
  const fails = Object.keys(state.fails).filter(id => (state.fails[id] || 0) > 0 && byId[id] && byId[id].c === state.course).length;
  const weak = weakTopics(state.course).slice(0, 3);
  view().innerHTML =
    '<div class="view-head"><h1>¡A la orden, ' + esc(state.name) + '!</h1></div>' +
    '<div id="newsTick" class="news-tick" role="marquee"></div>' +
    '<div id="onlineChip" class="small" style="margin:-4px 0 10px">🟢 conectando…</div>' +
    courseCards() +
    '<div class="kpi-row">' +
      '<div class="kpi"><b>' + state.streak + '🔥</b><span>Racha</span></div>' +
      '<div class="kpi"><b>' + state.xp + '</b><span>XP total</span></div>' +
      '<div class="kpi"><b>' + (acc == null ? "—" : acc + "%") + '</b><span>Precisión</span></div>' +
      '<div class="kpi"><b>' + fails + '</b><span>Fallos vivos</span></div>' +
    '</div>' +
    '<div class="card" style="margin-bottom:12px"><span class="badge badge-gold">Examen ' + esc(c.badge) + '</span>' +
      '<h3>' + esc(c.tagline) + '</h3><p>' + esc(c.exam.formula) + ' · Nota máxima ' + c.exam.max + ' · Corte: ' + esc(c.cutoff) + '</p>' +
      '<button class="btn btn-green btn-block" id="goStudy">Empezar a entrenar →</button></div>' +
    '<div class="card" style="margin-bottom:12px"><div class="topic-row"><span>🎯 <b>Reto diario</b> · 10 preguntas · +50 XP<br><span class="small muted">' + (state.daily.date === new Date().toDateString() && state.daily.done ? "Completado hoy ✔ · vuelve mañana para mantener la racha" : "Disponible ahora: se recalcula cada día") + '</span></span><a class="btn btn-gold btn-sm" href="#/diario">' + (state.daily.date === new Date().toDateString() && state.daily.done ? "Hecho ✔" : "Jugar") + '</a></div></div>' +
    '<div class="grid2">' +
      '<div class="card"><h3>🎯 Repaso inteligente</h3><p>' + (fails ? "Tienes <b>" + fails + "</b> preguntas falladas en este curso. Límpialas y sube nota." : "Sin fallos pendientes en este curso. ¡A por el simulacro!") + '</p><a class="btn btn-ghost btn-sm" href="#/fallos">Repasar fallos</a></div>' +
      '<div class="card"><h3>⚠️ Tus puntos débiles</h3><p>' + (weak.length ? weak.map(w => "· " + esc(w.t) + " (" + w.acc + "%)").join("<br>") : "Haz tu primer test y te diremos dónde fallas.") + '</p><a class="btn btn-ghost btn-sm" href="#/stats">Ver estadísticas</a></div>' +
    '</div>';
  bindCourses();
  const gs = $("#goStudy"); if (gs) gs.onclick = () => abrirCursos(true);
  /* Novedades rotativas: convocatorias + noticias de la app (pasan solas, se tocan y entran) */
  const cvN = (window.GALON_CONVOS && window.GALON_CONVOS.cursos || []).find(x => x.id === state.course);
  const TICKS = [];
  if (cvN) TICKS.push({ i: "📢", h: "#/tramita", t: "<b>Convocatoria</b> · " + esc(cvN.nombre) + " · " + esc(cvN.badge) });
  TICKS.push({ i: "🎡", h: "#/trivial", t: "<b>NUEVO · Trivial de la Tropa</b>: ruleta de 6 quesitos, solo o por código" });
  TICKS.push({ i: "📚", h: "#/biblio", t: "<b>Biblioteca</b>: 17 cuadernos PDF gratis, uno por tema" });
  TICKS.push({ i: "⚔️", h: "#/duelo", t: "<b>Duelos 1vs1</b>: reta a un compañero con código de WhatsApp" });
  TICKS.push({ i: "📜", h: "#/exams", t: "<b>Exámenes oficiales</b> históricos para practicar" });
  TICKS.push({ i: "☕", h: "#/apoya", t: "<b>Meta de la tropa</b>: el dominio del año, entre todos" });
  const nt = $("#newsTick");
  if (nt && TICKS.length) {
    let ti = 0;
    const ntPaint = () => {
      const it = TICKS[ti % TICKS.length];
      const on = window.GALON_ONLINE ? window.GALON_ONLINE.total : 0;
      nt.innerHTML = '<a href="javascript:void(0)" data-h="' + it.h + '"><span class="nt-i">' + it.i + '</span><span class="nt-t">' + it.t + '</span></a>' + (on ? '<span class="nt-o">🟢 ' + on + " en línea</span>" : "");
      const na = nt.querySelector("a"); if (na) na.onclick = () => { if (location.hash === it.h) render(); else location.hash = it.h; };
      nt.classList.remove("in"); void nt.offsetWidth; nt.classList.add("in");
      ti++;
    };
    ntPaint();
    const ntT = setInterval(() => { if (!document.body.contains(nt)) { clearInterval(ntT); return; } ntPaint(); }, 4500);
  }
}
function weakTopics(course) {
  const per = {};
  state.history.forEach(h => { if (h.course !== course || !h.byTopic) return; Object.keys(h.byTopic).forEach(t => { per[t] = per[t] || { ok: 0, n: 0 }; per[t].ok += h.byTopic[t].ok; per[t].n += h.byTopic[t].n; }); });
  return Object.keys(per).map(t => ({ t, acc: Math.round(100 * per[t].ok / per[t].n) })).filter(x => x.acc < 80).sort((a, b) => a.acc - b.acc);
}

/* ---- ENTRENAR (modos) ---- */
function vTrain() {
  const c = COURSES[state.course];
  const n = bank(state.course).length;
  const fails = Object.keys(state.fails).filter(id => (state.fails[id] || 0) > 0 && byId[id] && byId[id].c === state.course).length;
  const simN = Math.min(c.exam.questions, n);
  view().innerHTML =
    '<div class="view-head"><h1>Entrenar · ' + esc(c.name) + '</h1></div>' +
    '<div class="t-sec" style="margin-top:4px"><span>🎖️ Exámenes que cuentan</span></div>' +
      '<button class="tile hero" id="mSim"><span class="t-ico">🎖️</span><span class="t-main"><b>Simulacro oficial</b><span class="t-sub">' + simN + ' preguntas · ' + c.exam.minutes + ' min · como el de verdad</span></span><span class="t-go">EMPEZAR ▶</span></button>' +
      '<div class="grid2 tiles">' +
        '<button class="tile" id="mExam"><span class="t-ico">⏱️</span><b>Modo examen</b><span class="t-sub">25 preg a ciegas</span></button>' +
        '<button class="tile" id="mExams"><span class="t-ico">📜</span><b>Oficiales</b><span class="t-sub">exámenes reales</span></button>' +
      '</div>' +
    '<div class="t-sec"><span>⚡ Ronda rápida</span></div>' +
      '<div class="grid2 tiles">' +
        '<button class="tile" id="mQuick"><span class="t-ico">⚡</span><b>Test rápido</b><span class="t-sub">10 preg al instante</span></button>' +
        '<button class="tile" id="mDiario"><span class="t-ico">🎯</span><b>Reto diario</b><span class="t-sub">10 preg · +50 XP</span></button>' +
        '<button class="tile" id="mCustom"><span class="t-ico">🎛️</span><b>A la carta</b><span class="t-sub">tú filtras</span></button>' +
      '</div>' +
    '<div class="t-sec"><span>🧠 Tu memoria</span></div>' +
      '<div class="grid2 tiles">' +
        '<button class="tile" id="mFail"><span class="t-ico">🧠</span><b>Fallos (' + fails + ')</b><span class="t-sub">machácalos</span></button>' +
        '<button class="tile" id="mSmart"><span class="t-ico">🔮</span><b>Adaptativo</b><span class="t-sub">a tu medida</span></button>' +
        '<button class="tile" id="mSRS"><span class="t-ico">🧬</span><b>Repaso sáb</b><span class="t-sub">la app decide</span></button>' +
        '<button class="tile" id="mCards"><span class="t-ico">🃏</span><b>Flashcards</b><span class="t-sub">repaso rápido</span></button>' +
      '</div>' +
    '<div class="t-sec"><span>🎯 Duelos y juegos</span></div>' +
      '<div class="grid2 tiles">' +
        '<button class="tile" id="mTrivial"><span class="t-ico">🎡</span><b>Trivial</b><span class="t-sub">ruleta de 6 quesitos</span></button>' +
        '<button class="tile" id="mDuel"><span class="t-ico">⚔️</span><b>Duelo</b><span class="t-sub">reta en línea</span></button>' +
        '<button class="tile" id="mMaraton"><span class="t-ico">🏃</span><b>Maratón</b><span class="t-sub">3 vidas, infinita</span></button>' +
      '</div>' +
    '<div class="t-sec"><span>📚 Temario</span></div>' +
      '<div class="grid2 tiles">' +
        '<button class="tile" id="mTopic"><span class="t-ico">📝</span><b>Por tema</b><span class="t-sub">elige y machaca</span></button>' +
        '<button class="tile" id="mBlock"><span class="t-ico">📦</span><b>Por bloque</b><span class="t-sub">por capítulos</span></button>' +
        '<button class="tile" id="mBiblio"><span class="t-ico">📚</span><b>Biblioteca</b><span class="t-sub">cuadernos PDF y BOE</span></button>' +
      '</div>' +
    '<p class="small muted center" style="margin-top:12px">Banco auditado: ' + n + ' preguntas verificadas contra normativa vigente en este curso (acta pública 20-sep-2026).</p>';
  bindCourses();
  $("#mQuick").onclick = () => startTest({ course: state.course, filter: "all", n: 10, mode: "study", label: "Test rápido" });
  $("#mSim").onclick = () => startTest({ course: state.course, filter: "all", n: c.exam.questions, mode: "exam", minutes: c.exam.minutes, label: "Simulacro oficial", simulacro: true });
  $("#mExam").onclick = () => startTest({ course: state.course, filter: "all", n: 25, mode: "exam", minutes: 30, label: "Modo examen" });
  $("#mFail").onclick = () => { if (!fails) { toast("Sin fallos: haz un test primero"); return; } startTest({ course: state.course, filter: "fallos", n: 999, mode: "study", label: "Repaso de fallos" }); };
  $("#mSmart").onclick = () => {
    if (!window.GalonTutor) return;
    const ids = window.GalonTutor.adaptativo(state.course, 20);
    if (ids.length < 5) { toast("Haz tu primer test y el tutor conocerá tus debilidades"); return; }
    startTest({ course: state.course, fixed: ids, mode: "study", label: "Test adaptativo" });
  };
  $("#mTopic").onclick = () => location.hash = "#/tema";
  $("#mBlock").onclick = () => location.hash = "#/bloque";
  $("#mCards").onclick = () => { FC = null; location.hash = "#/cards"; };
  $("#mExams").onclick = () => location.hash = "#/exams";
  $("#mDuel").onclick = () => { D = null; location.hash = "#/duelo"; };
  $("#mTrivial").onclick = () => { if (location.hash === "#/trivial") render(); else location.hash = "#/trivial"; };
  $("#mDiario").onclick = () => location.hash = "#/diario";
  $("#mCustom").onclick = () => location.hash = "#/custom";
  $("#mSRS").onclick = () => { SR = null; location.hash = "#/srs"; };
  $("#mMaraton").onclick = () => { M = null; location.hash = "#/maraton"; };
  $("#mBiblio").onclick = () => location.hash = "#/biblio";
}
function vPick(kind) {
  const c = COURSES[state.course];
  let rows = "";
  c.syllabus.forEach(bl => {
    let chips;
    if (kind === "bloque") {
      const n = bank(state.course).filter(q => q.b === bl.code).length;
      chips = '<button class="chip" data-k="b:' + bl.code + '"><b>' + esc(bl.title) + '</b><span class="small muted">' + n + ' preguntas</span><span class="go">TEST →</span></button>';
    } else {
      chips = bl.topics.map(t => {
        const n = bank(state.course).filter(q => q.t === t).length;
        return '<button class="chip" data-k="t:' + esc(t) + '"><b>' + esc(t) + '</b><span class="small muted">' + n + ' preguntas</span><span class="go">TEST →</span></button>';
      }).join("");
    }
    rows += '<div style="margin-bottom:14px"><span class="badge">' + esc(bl.title) + '</span><div class="pick2">' + chips + "</div></div>";
  });
  view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>' + (kind === "bloque" ? "Test por bloque" : "Test por tema") + '</h1></div><p class="small muted" style="margin-top:-4px">' + esc(c.name) + ' · toca una tarjeta y arranca</p>' + rows;
  $$("[data-k]").forEach(b => b.onclick = () => {
    const k = b.getAttribute("data-k");
    if (k[0] === "b") startTest({ course: state.course, filter: "bloque", block: k.slice(2), n: 999, mode: "study", label: "Test por bloque" });
    else startTest({ course: state.course, filter: "tema", topic: k.slice(2), n: 999, mode: "study", label: "Test por tema" });
  });
}
function vFallos() {
  const list = Object.keys(state.fails).filter(id => (state.fails[id] || 0) > 0 && byId[id] && byId[id].c === state.course);
  if (!list.length) { view().innerHTML = '<div class="view-head"><a class="back" href="#/home">←</a><h1>Repaso de fallos</h1></div><div class="card center"><h3>Sin fallos pendientes 🎉</h3><p>Haz un test y aquí aparecerán tus errores para repasarlos.</p><a class="btn btn-green" href="#/entrenar">Ir a entrenar</a></div>'; return; }
  startTest({ course: state.course, filter: "fallos", n: 999, mode: "study", label: "Repaso de fallos" });
}

/* ---- TEST ---- */
function vTest() {
  if (!S) { location.hash = "#/entrenar"; return; }
  if (S.autoT) { clearTimeout(S.autoT); S.autoT = null; }
  const total = S.list.length, q = S.list[S.idx];
  const answered = Object.keys(S.ans).filter(id => S.ans[id] !== null).length;
  const pct = Math.round(100 * answered / total);
  let timerHtml = "";
  if (S.remaining !== null) timerHtml = '<span class="timer" id="timer">' + fmtTime(S.remaining) + "</span>";
  if (S.cfg.perQ && !S.study) { S.qLeft = S.cfg.perQ; timerHtml += '<span class="timer" id="qTimer">' + S.qLeft + "s</span>"; }
  const navHtml = '<div class="qnav-head"><b id="qnavCount"></b><span class="qnav-leg">' + (S.study ? "🟩 acierto · 🟥 fallo · toca un nº para saltar" : "🟨 respondida · toca un nº para saltar") + '</span></div><div class="qnav" id="qnav">' +
    S.list.map((qq, i) => '<button data-i="' + i + '" class="qn" id="qn' + i + '">' + (i + 1) + "</button>").join("") + "</div>";
  view().innerHTML =
    '<div class="view-head"><a class="back" href="#/entrenar" id="quitTest">✕</a><h1 style="font-size:1.1rem">' + esc(S.cfg.label) + "</h1>" +
    '<span class="badge" style="margin-left:auto">' + (S.idx + 1) + "/" + total + "</span></div>" +
    (S.capped && S.cfg.simulacro ? '<p class="small muted">Simulacro completo: ' + total + ' preguntas (todas las disponibles en el banco actual).</p>' : "") +
    '<div class="t-meta"><div style="flex:1"><div class="t-progress"><i style="width:' + pct + '%"></i></div></div>' + timerHtml + "</div>" +
    navHtml +
    '<div class="q-card"><div><span class="badge">' + esc(q.t) + '</span> <span class="pill-diff d' + q.d + '">' + diffLabel(q.d) + "</span></div>" +
    '<p class="q-text">' + esc(q.q) + "</p><div id=\"opts\">" +
    q.o.map((op, i) => '<button class="opt" data-o="' + i + '"><b>' + "ABCD"[i] + ".</b> " + esc(op) + "</button>").join("") +
    "</div><div id=\"explain\"></div></div>" +
    '<div class="t-nav"><button class="btn btn-ghost" id="bPrev">← Anterior</button>' +
    '<button class="btn btn-ghost" id="bFlag">🚩 Marcar</button><button class="btn btn-ghost" id="bStar">' + (state.stars[q.id] ? "★ Guardada" : "☆ Guardar") + '</button>' + (S.study ? '<button class="btn btn-ghost" id="bSpeak" title="Escuchar la pregunta">🔊</button>' : "") +
    (S.idx < total - 1 ? '<button class="btn btn-green" id="bNext">Siguiente →</button>' : '<button class="btn btn-gold" id="bFinish">Finalizar 🏁</button>') + "</div>";
  $("#quitTest").onclick = e => { if (!confirm("¿Abandonar el test? No se guardará el resultado.")) { e.preventDefault(); return; } stopTimer(); };
  if (S.cfg.perQ && !S.study) {
    S.perQId = setInterval(() => {
      S.qLeft--;
      const qt = $("#qTimer");
      if (qt) { qt.textContent = S.qLeft + "s"; if (S.qLeft <= 5) qt.classList.add("low"); }
      if (S.qLeft <= 0) { clearInterval(S.perQId); S.perQId = null; toast("¡Tiempo por pregunta agotado!"); if (S.idx < S.list.length - 1) { S.idx++; vTest(); } else finishTest(); }
    }, 1000);
  }
  paintOpts();
  paintNav();
  $$("#opts .opt").forEach(b => b.onclick = () => answer(q, parseInt(b.getAttribute("data-o"), 10)));
  $("#bPrev").onclick = () => { if (S.idx > 0) { S.idx--; vTest(); } };
  const bn = $("#bNext"); if (bn) bn.onclick = () => { S.idx++; vTest(); };
  const bf = $("#bFinish"); if (bf) bf.onclick = finishTest;
  $("#bFlag").onclick = () => { S.flagged[q.id] = !S.flagged[q.id]; toast(S.flagged[q.id] ? "Pregunta marcada 🚩" : "Marca quitada"); vTest(); };
  $("#bStar").onclick = () => { if (state.stars[q.id]) delete state.stars[q.id]; else state.stars[q.id] = 1; save(); toast(state.stars[q.id] ? "⭐ Guardada en Mi rincón" : "Estrella quitada"); vTest(); };
  const bs = $("#bSpeak"); if (bs) bs.onclick = () => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Pregunta. " + q.q + ". " + q.o.map((o, i) => "Opción " + "ABCD"[i] + ": " + o).join(". "));
      u.lang = "es-ES"; u.rate = 1; speechSynthesis.speak(u);
    } catch (e) { toast("Audio no disponible en este dispositivo"); }
  };
  $$(".qnav .qn").forEach(b => b.onclick = () => { S.idx = parseInt(b.getAttribute("data-i"), 10); vTest(); });
  if (S.remaining !== null && !S.timerId) {
    S.timerId = setInterval(() => {
      S.remaining--;
      const t = $("#timer");
      if (t) { t.textContent = fmtTime(S.remaining); if (S.remaining < 300) t.classList.add("low"); }
      if (S.remaining <= 0) { stopTimer(); toast("¡Tiempo agotado!"); finishTest(); }
    }, 1000);
  }
}
function paintOpts() {
  const q = S.list[S.idx];
  const locked = S.study && S.locked[q.id];
  $$("#opts .opt").forEach(b => {
    const i = parseInt(b.getAttribute("data-o"), 10);
    b.classList.remove("sel", "ok", "ko");
    if (S.study) {
      if (locked) { b.disabled = true; if (i === q.a) b.classList.add("ok"); else if (i === S.ans[q.id]) b.classList.add("ko"); }
    } else if (S.ans[q.id] === i) b.classList.add("sel");
  });
  if (locked) {
    const good = S.ans[q.id] === q.a;
    let expl = '<div class="explain"><b>' + (good ? "¡Correcta! ✅" : "Fallada ❌ — correcta: " + "ABCD"[q.a] + ") " + esc(q.o[q.a])) + "</b><br>" + esc(q.x) + '<span class="ref">📖 ' + esc(q.r) + " · " + diffLabel(q.d) + "</span></div>";
    if (!good && window.GalonTutor) expl += window.GalonTutor.html(q, S.ans[q.id]);
    $("#explain").innerHTML = expl;
  } else $("#explain").innerHTML = "";
}
function paintNav() {
  const cur = S.list[S.idx];
  S.list.forEach((qq, i) => {
    const el = $("#qn" + i); if (!el) return;
    let cl = "qn";
    if (S.ans[qq.id] !== null && S.ans[qq.id] !== undefined) {
      if (S.study) cl += S.ans[qq.id] === qq.a ? " ok" : " ko";
      else cl += " done";
    }
    if (S.flagged[qq.id]) cl += " flag";
    if (qq.id === cur.id) cl += " cur";
    el.className = cl;
  });
  const n = S.list.length;
  const ok = S.study ? S.list.filter(qq => S.ans[qq.id] !== null && S.ans[qq.id] === qq.a).length : 0;
  const ko = S.study ? S.list.filter(qq => S.ans[qq.id] !== null && S.ans[qq.id] !== qq.a).length : 0;
  const cnt = $("#qnavCount");
  if (cnt) cnt.textContent = S.study ? "✅ " + ok + " · ❌ " + ko + " · ⬜ " + (n - ok - ko) : Object.keys(S.ans).filter(id => S.ans[id] !== null).length + "/" + n + " respondidas";
  const c = $(".qn.cur"); if (c && c.scrollIntoView) try { c.scrollIntoView({ inline: "center", block: "nearest" }); } catch (e) {}
}
function answer(q, i) {
  if (S.study && S.locked[q.id]) return;
  state.seen[q.id] = 1;
  S.ans[q.id] = i;
  if (S.study) S.locked[q.id] = true;
  paintOpts();
  paintNav();
  const total = S.list.length, answered = Object.keys(S.ans).filter(id => S.ans[id] !== null).length;
  const bar = $(".t-progress i"); if (bar) bar.style.width = Math.round(100 * answered / total) + "%";
  if (S.study) {
    if (i === q.a) { state.xp += 5; } else { state.xp += 1; }
    if (i === q.a) sfxGood(); else sfxBad();
    save();
    /* avance automático al acertar (ajustable en Ajustes; el fallo SIEMPRE pausa para leer la corrección) */
    if (i === q.a && state.opts && state.opts.auto !== false && S.idx < S.list.length - 1) {
      $("#explain").innerHTML = '<div class="explain" style="border-left:4px solid var(--ok)">✅ Correcta · +5 XP' + (q.x ? "<br>" + esc(q.x) + '<span class="ref">📖 ' + esc(q.r) + "</span>" : "") + "</div>";
      const qid = q.id;
      S.autoT = setTimeout(() => {
        if (S && S.list[S.idx] && S.list[S.idx].id === qid && S.ans[qid] !== null) { S.idx++; vTest(); }
      }, q.x ? 2600 : 1300); /* si hay explicación, tiempo de leerla (Siguiente la salta) */
    }
  }
}

/* ---- RESULTADOS ---- */
function finishTest() {
  stopTimer();
  const c = COURSES[S.cfg.course];
  let RA = 0, RE = 0, BL = 0;
  const byTopic = {}, byBlock = {}, byDiff = {};
  S.list.forEach(q => {
    const a = S.ans[q.id];
    const ok = a === q.a;
    if (a === null) BL++; else if (ok) RA++; else RE++;
    [[byTopic, q.t], [byBlock, q.b], [byDiff, q.d]].forEach(([o, k]) => { o[k] = o[k] || { ok: 0, n: 0 }; o[k].n++; if (ok) o[k].ok++; });
    if (a === null) state.blanks[q.id] = 1;
    if (a !== null && !ok) { state.fails[q.id] = (state.fails[q.id] || 0) + 1; if (!state.srs[q.id]) state.srs[q.id] = { b: 0, due: Date.now() }; }
    if (ok && state.fails[q.id]) delete state.fails[q.id];
  });
  let score = c.exam.good * RA - c.exam.bad * RE;
  score = Math.max(0, Math.min(c.exam.max, score));
  score = Math.round(score * 100) / 100;
  const acc = S.list.length ? Math.round(100 * RA / S.list.length) : 0;
  let xp = RA * 5 + (RA + RE) * 1 + (S.cfg.simulacro ? 50 : 10);
  state.xp += xp;
  // racha
  const today = new Date().toDateString();
  if (state.lastDay !== today) {
    const y = new Date(Date.now() - 864e5).toDateString();
    state.streak = (state.lastDay === y) ? state.streak + 1 : 1;
    state.lastDay = today;
  }
  state.history.push({ d: Date.now(), course: S.cfg.course, mode: S.cfg.label, n: S.list.length, acc, score, RA, RE, BL, byTopic, byDiff });
  if (state.history.length > 60) state.history = state.history.slice(-60);
  if (S.cfg.daily) { state.daily = { date: new Date().toDateString(), done: true }; state.xp += 50; }
  save();
  checkAch();
  if (window.cloudSync) { try { window.cloudSync(false); } catch (e) {} }
  lastResult = { course: S.cfg.course, label: S.cfg.label, list: S.list.slice(), ans: Object.assign({}, S.ans), RA, RE, BL, score, acc, xp, max: c.exam.max, formula: c.exam.formula, refuerzos: S.reinforced || 0 };
  S = null;
  location.hash = "#/results";
}
function vResults() {
  if (!lastResult) { location.hash = "#/home"; return; }
  const r = lastResult, c = COURSES[r.course];
  const verdict = r.acc >= 80 ? "¡A por la plaza! 🎖️" : r.acc >= 60 ? "Buen ritmo, sigue así 💪" : "Toca machacar temario 📚";
  if (r.acc >= 80) { setTimeout(confetti, 300); setTimeout(fanfare, 300); }
  view().innerHTML =
    '<div class="score-hero"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">' + esc(r.label) + " · " + esc(c.badge) + '</span>' +
    '<div class="num">' + r.score + '<small style="font-size:1.1rem">/' + r.max + "</small></div>" +
    "<div><b>" + verdict + "</b></div>" +
    '<div class="small" style="margin-top:8px;opacity:.85">✅ ' + r.RA + " · ❌ " + r.RE + " · ⚪ " + r.BL + " · Precisión " + r.acc + "% · +" + r.xp + " XP</div>" +
    '<div class="small" style="opacity:.7">' + esc(r.formula) + "</div></div>" +
    (r.RE > 0 ? '<div class="card" style="margin:12px 0"><b>🔁 Bucle de memoria activado</b><p class="small muted">Las ' + r.RE + ' falladas han entrado en tu repaso: volverán a salir en tus próximos tests y en el repaso espaciado 🧬 hasta que las domines (acierta una para liberarla).' + (r.refuerzos ? ' Este test ya traía ' + r.refuerzos + ' refuerzos de fallos anteriores.' : '') + '</p></div>' : '') +
    '<div class="t-nav" style="margin:0 0 14px"><a class="btn btn-green" href="#/entrenar">Otro test</a><button class="btn btn-gold" onclick="shareResult()">Compartir 📣</button><a class="btn btn-ghost" href="#/stats">Estadísticas</a></div>' +
    "<h3>Revisión de respuestas</h3>" +
    r.list.map((q, i) => {
      const a = r.ans[q.id];
      const cls = a === null ? "blank" : a === q.a ? "ok" : "ko";
      const mark = a === null ? "⚪ Sin responder" : a === q.a ? "✅ Correcta" : "❌ Fallada (tuya: " + "ABCD"[a] + " · correcta: " + "ABCD"[q.a] + ")";
      return '<div class="rev ' + cls + '"><span class="badge">#' + (i + 1) + " · " + esc(q.t) + '</span> <span class="pill-diff d' + q.d + '">' + diffLabel(q.d) + "</span>" +
        "<p><b>" + esc(q.q) + "</b></p><p>" + mark + "</p><p class=\"muted\">" + esc(q.x) + " <b>📖 " + esc(q.r) + "</b></p></div>";
    }).join("");
}

/* ---- STATS ---- */
function lineChart(vals) {
  const w = 320, h = 110, p = 12;
  if (vals.length < 2) return '<p class="muted small">Haz al menos 2 tests para ver tu evolución.</p>';
  const pts = vals.map((v, i) => [p + i * (w - 2 * p) / (vals.length - 1), h - p - (v / 100) * (h - 2 * p)]);
  const line = pts.map((pt, i) => (i ? "L" : "M") + pt[0].toFixed(1) + "," + pt[1].toFixed(1)).join(" ");
  const dots = pts.map(pt => '<circle cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="3.5" fill="#c9971f"/>').join("");
  return '<svg viewBox="0 0 ' + w + " " + h + '" style="width:100%;height:auto">' +
    '<line x1="' + p + '" y1="' + (h - p) + '" x2="' + (w - p) + '" y2="' + (h - p) + '" stroke="#d9d2bd"/>' +
    '<path d="' + line + '" fill="none" stroke="#1f5c38" stroke-width="3" stroke-linecap="round"/>' + dots + "</svg>";
}
function vStats() {
  const c = COURSES[state.course];
  const hist = state.history.filter(h => h.course === state.course);
  const nTests = hist.length;
  const nQ = hist.reduce((s, h) => s + h.n, 0);
  const avg = nTests ? Math.round(hist.reduce((s, h) => s + h.acc, 0) / nTests) : null;
  const recent = hist.slice(-5);
  const rAvg = recent.length ? recent.reduce((s, h) => s + h.acc, 0) / recent.length : null;
  const est = rAvg == null ? null : Math.round(rAvg / 100 * c.exam.max * 100) / 100;
  const perB = {};
  hist.forEach(h => S0(h, perB));
  function S0(h, o) { (h.byTopic ? Object.keys(h.byTopic) : []).forEach(() => {}); }
  // por bloque: reconstruir desde byTopic no guarda bloque; usar último resultado por tema via QUESTIONS
  const byBlock = {};
  hist.forEach(h => { if (!h.byTopic) return; Object.keys(h.byTopic).forEach(t => { const q0 = QUESTIONS.find(q => q.c === state.course && q.t === t); const b = q0 ? q0.b : "?"; byBlock[b] = byBlock[b] || { ok: 0, n: 0 }; byBlock[b].ok += h.byTopic[t].ok; byBlock[b].n += h.byTopic[t].n; }); });
  const blockRows = c.syllabus.map(bl => {
    const d = byBlock[bl.code];
    const a = d ? Math.round(100 * d.ok / d.n) : null;
    return '<div class="bar-row"><span>' + esc(bl.title.split("·")[0].trim()) + '</span><div class="bar-track"><i style="width:' + (a == null ? 0 : a) + '%"></i></div><b>' + (a == null ? "—" : a + "%") + "</b></div>";
  }).join("");
  const byDiffAgg = {};
  hist.forEach(h => { if (!h.byDiff) return; Object.keys(h.byDiff).forEach(k => { byDiffAgg[k] = byDiffAgg[k] || { ok: 0, n: 0 }; byDiffAgg[k].ok += h.byDiff[k].ok; byDiffAgg[k].n += h.byDiff[k].n; }); });
  const diffRowsHtml = ["F", "M", "D"].map(k => {
    const d = byDiffAgg[k]; const a = d ? Math.round(100 * d.ok / d.n) : null;
    return '<div class="bar-row"><span>' + diffLabel(k) + '</span><div class="bar-track"><i style="width:' + (a == null ? 0 : a) + '%"></i></div><b>' + (d ? a + "% (" + d.n + ")" : "—") + "</b></div>";
  }).join("");
  view().innerHTML =
    '<div class="view-head"><h1>Estadísticas</h1></div>' + courseCards() +
    '<div class="kpi-row"><div class="kpi"><b>' + nTests + '</b><span>Tests</span></div>' +
    '<div class="kpi"><b>' + nQ + '</b><span>Preguntas</span></div>' +
    '<div class="kpi"><b>' + (avg == null ? "—" : avg + "%") + '</b><span>Precisión media</span></div>' +
    '<div class="kpi"><b>' + (est == null ? "—" : est) + '</b><span>Nota estimada</span></div></div>' +
    '<div class="card" style="margin-bottom:12px"><h3>📈 Evolución (precisión por test)</h3>' + lineChart(hist.slice(-10).map(h => h.acc)) + "</div>" +
    '<div class="card" style="margin-bottom:12px"><h3>📦 Rendimiento por bloque</h3>' + blockRows + '<h3 style="margin-top:12px">🎚️ Por dificultad</h3>' + diffRowsHtml +
    '<p class="small muted">Nota estimada orientativa según tus últimos 5 tests. En la versión final: predicción por IA y plan de repaso.</p></div>' +
    '<div class="card"><h3>🕘 Historial</h3>' + (hist.length ? '<ul class="list-clean">' + hist.slice(-8).reverse().map(h =>
      "<li><b>" + esc(h.mode) + "</b> · " + h.n + " preg. · " + h.acc + "% · nota " + h.score + ' <span class="muted">' + new Date(h.d).toLocaleDateString("es-ES") + "</span></li>").join("") + "</ul>" : '<p class="muted">Aún no hay tests en este curso.</p>') + "</div>";
  bindCourses();
}

/* ---- TEMARIO ---- */
function vTemario() {
  const c = COURSES[state.course];
  const blocks = c.syllabus.map(bl => {
    const topics = bl.topics.map(t => {
      const n = bank(state.course).filter(q => q.t === t).length;
      return '<div class="topic-row"><span>✓ ' + esc(t) + ' <span class="muted">(' + n + ' test)</span></span><span class="badge badge-green">Revisado</span></div>';
    }).join("");
    return '<details class="acc" open><summary>' + esc(bl.title) + ' <span class="badge">' + esc(bl.weight) + "</span></summary><div class=\"acc-body\">" + topics + "</div></details>";
  }).join("");
  const log = c.changelog.map(e => "<li><b>" + esc(e.date) + "</b> · " + esc(e.ref) + "<br>" + esc(e.text) + "</li>").join("");
  view().innerHTML = '<div class="view-head"><h1>Temario · ' + esc(c.name) + "</h1></div>" + courseCards() + blocks +
    '<div class="card"><h3>🔔 Actualizaciones oficiales aplicadas</h3><ul class="list-clean">' + log + '</ul><p class="small muted">En la versión final: temario completo descargable, esquemas y resúmenes por tema.</p></div>';
  bindCourses();
}

/* ---- RANKING ---- */
function vRanking() {
  const cu = window.cloudUser && window.cloudUser();
  const tu = cu ? cu.name : state.name + " (sin cuenta)";
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Ranking global 🏆</h1></div>' +
    '<p class="small muted" id="rankNote">Datos 100% reales: XP sincronizado de las cuentas de A LA ORDEN. Cargando…</p><div id="rankGlobal"></div>' +
    '<div class="card" style="margin-top:14px"><h3>📊 Tu XP local</h3>' +
    '<div class="rank-row me"><span class="rank-pos">·</span><span><b>' + esc(tu) + "</b>" + (cu ? "" : ' <span class="small muted">solo en este dispositivo</span>') + '</span><span class="rank-xp">' + state.xp + " XP</span></div>" +
    (cu ? '<p class="small muted">Con cuenta: tu XP aparece en el ranking global al sincronizar.</p>' : '<p class="small muted"><a href="#/cuenta">Crea tu cuenta gratis</a> para entrar en el ranking global real y lucir el punto 🟢 en línea.</p>') + "</div>";
  if (window.fetch) fetch("/api/ranking").then(r => r.ok ? r.json() : null).catch(() => null).then(api => {
    const box = $("#rankGlobal");
    if (!box) return;
    if (!api || !api.users || !api.users.length) {
      box.innerHTML = '<p class="small muted">Aún no hay nadie con cuenta en el ranking. <a href="#/cuenta">Sé el primero de la historia</a>.</p>';
      const n = $("#rankNote"); if (n) n.textContent = "Datos 100% reales: XP sincronizado de las cuentas de A LA ORDEN.";
      return;
    }
    const on = ((window.GALON_ONLINE || {}).users || []);
    box.innerHTML = api.users.map((r, i) =>
      '<div class="rank-row"><span class="rank-pos">' + (i + 1) + '</span><span><b>' + esc(r.name) + "</b>" + (on.indexOf(r.name) >= 0 ? ' <span class="badge badge-green">🟢 en línea</span>' : "") + '</span><span class="rank-xp">' + r.xp + " XP</span></div>"
    ).join("");
    const n = $("#rankNote");
    if (n) n.innerHTML = "⚡ <b>" + api.total + "</b> reclutas con cuenta · " + (on.length ? "<b>" + on.length + "</b> en línea ahora mismo" : "nadie en línea en este instante") + " · sin bots, sin números inventados.";
  });
}

/* ---- BAREMO ---- */
function vBaremo() {
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Calculadora de baremo 🧮</h1></div>' +
    '<div class="card"><span class="badge badge-gold">Cabo ET · orientativo</span><p class="muted small">El 50% de tu nota es el expediente (NC). Mueve los grupos y tu nota de examen (NO) para ver tu NCO.</p>' +
    '<div class="calc-grid"><div><label class="f">Grupo 1 · IPEC (40%): <span id="vG1">7.0</span></label><input type="range" id="g1" min="0" max="10" step="0.5" value="7">' +
    '<label class="f">Grupo 2 · Trayectoria (45%): <span id="vG2">6.0</span></label><input type="range" id="g2" min="0" max="10" step="0.5" value="6">' +
    '<label class="f">Grupo 3 · Formación (15%): <span id="vG3">5.0</span></label><input type="range" id="g3" min="0" max="10" step="0.5" value="5"></div>' +
    '<div><label class="f">Nota de examen NO (0-10): <span id="vNO">5.0</span></label><input type="range" id="gNO" min="0" max="10" step="0.1" value="5">' +
    '<div class="score-hero" style="margin-top:14px;padding:18px"><div class="small">NC = <b id="rNC">—</b> · NCO = (NC+NO)/2</div><div class="num" id="rNCO">—</div><div id="rMsg" class="small"></div></div></div></div></div>';
  const upd = () => {
    const g1 = parseFloat($("#g1").value), g2 = parseFloat($("#g2").value), g3 = parseFloat($("#g3").value), no = parseFloat($("#gNO").value);
    $("#vG1").textContent = g1.toFixed(1); $("#vG2").textContent = g2.toFixed(1); $("#vG3").textContent = g3.toFixed(1); $("#vNO").textContent = no.toFixed(1);
    const nc = 0.4 * g1 + 0.45 * g2 + 0.15 * g3, nco = (nc + no) / 2;
    $("#rNC").textContent = nc.toFixed(2); $("#rNCO").textContent = nco.toFixed(2);
    $("#rMsg").innerHTML = nco >= 4.335 ? "✅ Por encima del corte I/25 (4,335)" : "⚠️ Bajo el corte I/25 (4,335): sube NO o expediente";
  };
  ["g1", "g2", "g3", "gNO"].forEach(id => $("#" + id).oninput = upd); upd();
}

/* ---- FÍSICAS ---- */
function vFisicas() {
  const items = [
    ["🏋️ Abdominales (3 min)", "Flexiones de tronco. Puntúa de 0 a 5 según marca por edad y sexo."],
    ["💪 Flexiones de brazos (2 min)", "Flexo-extensiones en suelo. De 0 a 5 puntos."],
    ["⚡ Circuito agilidad-velocidad (CAV)", "Recorrido cronometrado. De 0 a 5 puntos."],
    ["🏃 Carrera 2.000 m", "Resistencia. De 0 a 5 puntos. Suma hasta 15 en aptitud psicofísica del concurso."]
  ];
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Pruebas físicas 🏅</h1></div>' +
    '<div class="card"><span class="badge badge-red">Permanencia · eliminatorias (apto/no apto)</span><ul class="list-clean">' +
    items.map(i => "<li><b>" + i[0] + "</b><br><span class=\"muted\">" + i[1] + "</span></li>").join("") +
    '</ul><p class="small muted">En la versión final: baremos por edad/sexo y plan de entrenamiento con la app.</p></div>';
}

/* ---- FLASHCARDS (tipo ascensoacabo / Soldado Español) ---- */
let FC = null;
function vCards() {
  if (!FC || FC.course !== state.course) FC = { course: state.course, deck: shuffle(bank(state.course)), i: 0, good: 0, bad: 0, flip: false };
  const deck = FC.deck, q = deck[FC.i];
  if (!q) {
    view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Flashcards 🃏</h1></div><div class="card center"><h3>¡Baraja completada!</h3><p>Sabías <b>' + FC.good + '</b> de ' + deck.length + ' tarjetas.</p><button class="btn btn-green" id="fcAgain">Otra ronda</button> <a class="btn btn-ghost" href="#/fallos">Repasar fallos</a></div>';
    $("#fcAgain").onclick = () => { FC = null; vCards(); };
    return;
  }
  view().innerHTML =
    '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Flashcards 🃏</h1><span class="badge" style="margin-left:auto">' + (FC.i + 1) + "/" + deck.length + '</span></div>' +
    '<div class="t-progress" style="margin-bottom:12px"><i style="width:' + Math.round(100 * FC.i / deck.length) + '%"></i></div>' +
    '<div class="q-card"><div><span class="badge">' + esc(q.t) + '</span> <span class="pill-diff d' + q.d + '">' + diffLabel(q.d) + "</span></div>" +
    '<p class="q-text">' + esc(q.q) + "</p>" +
    (FC.flip ? '<div class="explain"><b>' + esc(q.o[q.a]) + "</b><br>" + esc(q.x) + '<span class="ref">📖 ' + esc(q.r) + "</span></div>" : "") + "</div>" +
    '<div class="t-nav" style="justify-content:center">' +
    (FC.flip
      ? '<button class="btn btn-green" id="fcGood">✅ La sabía</button><button class="btn btn-ghost" id="fcBad">❌ No la sabía</button>'
      : '<button class="btn btn-gold" id="fcFlip">Ver respuesta</button>') + "</div>";
  if (FC.flip) {
    $("#fcGood").onclick = () => { FC.good++; FC.i++; FC.flip = false; state.xp += 2; state.cardsDone = (state.cardsDone || 0) + 1; if ((state.cardsDone || 0) >= 50) unlock("cards50"); save(); vCards(); };
    $("#fcBad").onclick = () => { FC.bad++; FC.i++; FC.flip = false; vCards(); };
  } else $("#fcFlip").onclick = () => { FC.flip = true; vCards(); };
}

/* ---- EXÁMENES OFICIALES (tipo ANARO/InnoTest: banco de históricos) ---- */
function vExams() {
  const exs = (window.OFFICIAL_EXAMS || []).filter(e => e.course === state.course);
  const isPerm = state.course === "perm";
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Exámenes oficiales 📜</h1></div>' +
    '<div class="card" style="margin-bottom:12px"><span class="badge badge-gold">Convocatorias</span>' +
    '<ul class="list-clean">' +
    (isPerm
      ? "<li><b>2026 · ¡CONVOCATORIA EN CURSO!</b> · Res. 452/08724/26 · BOD nº 116 (17-jun-2026) · 1.000 plazas (ET 540) · plazo: 20 días</li>" +
        "<li><b>Bases</b> · Orden DEF/1341/2017 · prueba: 100 preguntas · 120 min · P = A − E/3</li>"
      : "<li><b>I/25</b> · Res. 551/14239/25 · BOD nº 192 (2-oct-2025) · examen celebrado en feb-2026</li>" +
        "<li><b>I/25 · cómo cayó</b> · normativa 20 · instrucción 13 · armamento y tiro 6 · topografía 3 · transmisiones 3 · liderazgo 3 · orgánica 2 · corte: 4,335</li>" +
        "<li><b>I/24</b> · examen celebrado el 12-feb-2025 (CEFOT-1)</li>" +
        "<li><b>I/25 resuelta</b> · ascienden los aptos (Res. 562/09759/26 · BOD nº 129, 6-jul-2026)</li>" +
        "<li><b>I/26</b> · convocatoria esperada en el BOD en otoño de 2026</li>") +
    "</ul>" +
    '<p class="small muted">' + (isPerm ? "Formato: 100 preguntas · 4 alternativas · 120 min · P = A − E/3 (los blancos no penalizan)." : "Formato: 50 preguntas + 5 de reserva · 70 minutos · +0,2 por acierto / −0,05 por error.") + "</p></div>" +
    exs.map(e => '<div class="card" style="margin-bottom:10px"><h3>' + esc(e.label) + '</h3><p class="small muted">' + esc(e.source) + '</p><button class="btn btn-green btn-sm" data-ex="' + e.id + '">Hacer este examen (' + e.qs.length + ' preg.)</button></div>').join("") +
    '<div class="card center"><p class="small muted">Estado de la caza: <b>I/24 completo en el banco</b> (20 preguntas auténticas, verificadas contra normativa vigente — descartadas las desactualizadas). <b>I/25</b> (feb-2026): cuadernillo aún no público — en cuanto salga, entra. <b>Cabo 1º I/26</b>: examen del 14-sep-2026, a la espera de cuadernillo. <b>Permanencia</b>: sin cuadernillo verificable por vía pública; seguiremos buscando por canales oficiales. Mientras tanto, el <a href="#/entrenar">simulacro oficial</a> mantiene el formato exacto.</p></div>';
  $$("[data-ex]").forEach(b => b.onclick = () => {
    const e = exs.find(x => x.id === b.getAttribute("data-ex"));
    startTest({ course: e.course, fixed: e.qs.map(q => Object.assign({}, q)), mode: "exam", minutes: Math.max(10, e.qs.length * 2), label: e.label + " · histórico", simulacro: true });
  });
}

/* ---- PLAN DE ESTUDIO (tipo FASPRO: programación guiada) ---- */
function vPlan() {
  const c = COURSES[state.course];
  const byBlock = {};
  state.history.forEach(h => { if (!h.byTopic) return; Object.keys(h.byTopic).forEach(t => { const q0 = BANK.find(q => q.c === state.course && q.t === t); const b = q0 ? q0.b : "?"; byBlock[b] = byBlock[b] || { ok: 0, n: 0 }; byBlock[b].ok += h.byTopic[t].ok; byBlock[b].n += h.byTopic[t].n; }); });
  const order = c.syllabus.slice().sort((a, b2) => (byBlock[a.code] ? byBlock[a.code].ok / byBlock[a.code].n : 0) - (byBlock[b2.code] ? byBlock[b2.code].ok / byBlock[b2.code].n : 0));
  const routine = ["Test del tema más flojo (15-20 preg.)", "Repaso de fallos 🧠", "Test del siguiente tema (15-20 preg.)", "Test del bloque completo", "Simulacro corto (25 preg.) + revisión"];
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  let weeks = "";
  for (let w = 1; w <= 6; w++) {
    const focus = order[(w - 1) % order.length];
    weeks += '<details class="acc"' + (w === 1 ? " open" : "") + '><summary>Semana ' + w + " · " + esc(focus.title) + '</summary><div class="acc-body">' +
      days.map((d, i) => '<div class="topic-row"><span><b>' + d + "</b> · " + (i === 5 ? "Descanso o repaso ligero" : routine[i]) + '</span><span class="badge">30′</span></div>').join("") + "</div></details>";
  }
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Plan de estudio 📅</h1></div>' +
    '<p class="small muted">Plan de 6 semanas para <b>' + esc(c.name) + "</b>: pone primero los bloques donde fallas más (según tus estadísticas).</p>" + weeks +
    '<div class="card" style="margin-top:12px"><p class="small muted">Método: sesiones de 30 min · 5 días/semana · un bloque completo los jueves y simulacro corto los viernes. En la versión final el plan se recalcula cada semana con IA según tus resultados.</p></div>';
}

/* ---- SONIDO (WebAudio, sin ficheros) ---- */
let AC = null;
function tone(f, d, type) {
  if (state.sound === false) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.12, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + d);
    o.start(); o.stop(AC.currentTime + d);
  } catch (e) {}
}
function sfxGood() { tone(880, 0.15, "sine"); }
function sfxBad() { tone(170, 0.3, "sawtooth"); }
function fanfare() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.18, "triangle"), i * 120)); }

/* ---- CONFETI ---- */
function confetti() {
  const colors = ["#c9971f", "#2e7d4f", "#e8d9a0", "#60a5fa", "#ef4444"];
  for (let i = 0; i < 42; i++) {
    const s = document.createElement("span");
    s.className = "cf";
    s.style.left = (Math.random() * 100) + "vw";
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = (Math.random() * 0.6) + "s";
    s.style.animationDuration = (2 + Math.random() * 1.6) + "s";
    const sz = 6 + Math.random() * 7;
    s.style.width = sz + "px"; s.style.height = (sz * 0.6) + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 4600);
  }
}

/* ---- COMPARTIR RESULTADO (viraje social) ---- */
window.shareResult = function () {
  if (!lastResult) return;
  const c = COURSES[lastResult.course];
  const txt = "🎖️ " + lastResult.score + "/" + lastResult.max + " en " + lastResult.label + " (" + c.badge + ") · Precisión " + lastResult.acc + "% · Entreno con A LA ORDEN, la academia de tropa";
  if (navigator.share) navigator.share({ title: "A LA ORDEN", text: txt }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("Resultado copiado: pégalo donde quieras 📋")).catch(() => toast(txt));
  else toast(txt);
};

/* ---- LOGROS ---- */
const ACH = [
 { id: "first", icon: "🎖️", name: "Primer service", desc: "Completa tu primer test" },
 { id: "t10", icon: "🔁", name: "Recluta constante", desc: "Completa 10 tests" },
 { id: "clean", icon: "🧼", name: "Pase sin fallos", desc: "Un test de 10+ preguntas sin ningún error" },
 { id: "streak3", icon: "🔥", name: "Tres días seguidos", desc: "Racha de 3 días entrenando" },
 { id: "streak7", icon: "⚡", name: "Semana completa", desc: "Racha de 7 días entrenando" },
 { id: "xp500", icon: "💪", name: "Cabo de hierro", desc: "Acumula 500 XP" },
 { id: "xp2000", icon: "🪖", name: "Veterano", desc: "Acumula 2.000 XP" },
 { id: "nota8", icon: "🎯", name: "Nota de galón", desc: "80% o más en un simulacro" },
 { id: "duel1", icon: "⚔️", name: "Duelista", desc: "Gana tu primer duelo 1vs1" },
 { id: "cards50", icon: "🃏", name: "Baraja limpiada", desc: "Repasa 50 tarjetas sabidas" },
 { id: "ofi", icon: "📜", name: "Historiador", desc: "Completa un examen oficial histórico" },
 { id: "level5", icon: "🏅", name: "Nivel 5", desc: "Alcanza el nivel 5 de experiencia" }
];
function unlock(id) {
  if (state.ach && state.ach[id]) return;
  state.ach = state.ach || {};
  state.ach[id] = Date.now();
  const a = ACH.find(x => x.id === id);
  if (a) toast(a.icon + " ¡Logro desbloqueado: " + a.name + "!");
  save();
}
function checkAch() {
  const hist = state.history;
  if (hist.length >= 1) unlock("first");
  if (hist.length >= 10) unlock("t10");
  if (state.streak >= 3) unlock("streak3");
  if (state.streak >= 7) unlock("streak7");
  if (state.xp >= 500) unlock("xp500");
  if (state.xp >= 2000) unlock("xp2000");
  if (level() >= 5) unlock("level5");
  if ((state.cardsDone || 0) >= 50) unlock("cards50");
  const last = hist[hist.length - 1];
  if (last) {
    if (last.RA >= 10 && last.RE === 0) unlock("clean");
    if (last.acc >= 80 && /simulacro/i.test(last.mode || "")) unlock("nota8");
    if (/oficial/i.test(last.mode || "")) unlock("ofi");
  }
}

/* ---- VISTA LOGROS ---- */
function vLogros() {
  const got = Object.keys(state.ach || {}).length;
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Logros 🏅</h1><span class="badge" style="margin-left:auto">' + got + "/" + ACH.length + '</span></div>' +
    '<div class="t-progress" style="margin-bottom:12px"><i style="width:' + Math.round(100 * got / ACH.length) + '%"></i></div>' +
    '<div class="grid2">' + ACH.map(a => {
      const on = state.ach && state.ach[a.id];
      return '<div class="card" style="opacity:' + (on ? 1 : 0.45) + '"><h3>' + a.icon + " " + esc(a.name) + (on ? ' <span class="badge badge-green">✔</span>' : "") + '</h3><p class="small muted">' + esc(a.desc) + "</p></div>";
    }).join("") + "</div>" +
    '<p class="small muted center" style="margin-top:10px">Comparte tus medallas en redes y reta a tu unidad 📣</p>';
}

/* ---- DUELO 1vs1: duelos REALES asíncronos (mismo examen, servidor compara) + entrenamiento contra la máquina ---- */
let D = null;
function nName(s) { return String(s || "").trim().toLowerCase(); }
async function refrescaDuelos() {
  const cont = $("#misDuelos"); if (!cont) return;
  try {
    const r = await fetch("/api/duelo/mis?u=" + encodeURIComponent(state.name || ""));
    const d = await r.json();
    if (!d.duelos || !d.duelos.length) { cont.innerHTML = '<span class="muted">Aún no tienes duelos reales. ¡Lanza el primero! 🚀</span>'; return; }
    cont.innerHTML = d.duelos.map(x => {
      if (x.estado === "terminado") {
        const gano = x.ganador && nName(x.ganador) === nName(state.name);
        return '<div class="topic-row" style="border-bottom:1px solid var(--line);padding:6px 0"><span>' + (gano ? "🏆" : "⚔️") + " <b>" + esc(x.de) + "</b> " + (x.mi == null ? "?" : x.mi) + "–" + (x.rival == null ? "?" : x.rival) + " <b>" + esc(x.para) + "</b> · " + (x.ganador ? "gana <b>" + esc(x.ganador) + "</b>" : "empate 🤝") + '</span></div>';
      }
      if (x.mi != null) return '<div class="topic-row" style="border-bottom:1px solid var(--line);padding:6px 0"><span>⏳ <b>' + esc(x.de) + '</b> vs <b>' + esc(x.para || "rival con código") + '</b> · esperando su resultado…</span></div>';
      const etiq = x.para ? '🔥 <b>' + esc(x.para) + '</b> ya está dentro' : (x.rol === "de" ? '⏳ esperando rival · tu código <b>' + esc(x.codigo || "…………") + '</b>' : '⚔️ <b>' + esc(x.de) + '</b> te reta · 10 preg');
      return '<div class="topic-row" style="border-bottom:1px solid var(--line);padding:6px 0"><span>' + etiq + '</span><button class="btn btn-gold btn-sm" data-jugar="' + x.id + '">Jugar ⚔️</button></div>';
    }).join("");
    $$("[data-jugar]").forEach(b => b.onclick = () => jugarDueloReal(b.getAttribute("data-jugar")));
  } catch (e) { cont.innerHTML = '<span class="muted">No se pudieron cargar tus duelos ahora mismo.</span>'; }
}
let duelosPrev = {};
let ultimoCreado = null;
async function crearCodigo() {
  const bot = $("#crearCodBtn"); if (bot) bot.disabled = true;
  try {
    const r = await fetch("/api/duelo/crear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ de: state.name || "Anónimo", curso: state.course }) });
    const d = await r.json();
    if (!r.ok || !d.id) { toast(d.error || "No se pudo crear el duelo"); return; }
    ultimoCreado = d.id;
    pintarCodigo(d);
    refrescaDuelos();
  } catch (e) { toast("Servidor no disponible"); }
  finally { if (bot) bot.disabled = false; }
}
function pintarCodigo(d) {
  const cont = $("#zonaCodigo"); if (!cont) return;
  const url = location.origin + location.pathname + "#/duelo";
  const cName = (COURSES[state.course] || {}).name || state.course;
  const msg = "⚔️ ¡Me retas a un duelo de A LA ORDEN? 10 preguntas de " + cName + " para cada uno, mismo examen. Entra aquí: " + url + " — y usa mi código: " + d.codigo;
  cont.innerHTML = '<div class="card" style="margin-bottom:12px;border:1px solid #d4af37"><b>🎯 Reto creado · mismo examen para los dos</b>' +
    '<div style="font-size:2rem;font-weight:800;letter-spacing:.35em;text-align:center;font-family:ui-monospace,monospace;margin:10px 0">' + esc(d.codigo) + '</div>' +
    '<div class="t-nav" style="justify-content:center"><a class="btn btn-green" href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">📲 Enviar por WhatsApp</a></div>' +
    '<p class="small muted center" style="margin:10px 0 0">' + (d.para ? '✅ <b>' + esc(d.para) + '</b> ya entró: a jugar desde tu lista ⬇️' : '⏳ Esperando a que tu rival entre el código (se actualiza solo)…') + '</p></div>';
}
async function buscarAzar() {
  const bot = $("#azarBtn"); if (bot) bot.disabled = true;
  try {
    const r = await fetch("/api/duelo/azar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jugador: state.name || "Anónimo", curso: state.course }) });
    const d = await r.json();
    if (!r.ok) { toast(d.error || "No se pudo buscar rival"); return; }
    if (d.matched) { toast("🎲 Rival encontrado: " + d.duelo.de); jugarDueloReal(d.duelo.id); return; }
    ultimoCreado = d.duelo.id; D = D || {}; D.azarId = d.duelo.id;
    const cont = $("#zonaAzar"); if (cont) cont.innerHTML = '<div class="card" style="margin-bottom:12px"><b>🎲 En cola…</b><p class="small muted" style="margin:6px 0">Te emparejamos en cuanto alguien busque partida (se actualiza solo; puedes cerrar la app).</p></div>';
    refrescaDuelos();
  } catch (e) { toast("Servidor no disponible"); }
  finally { if (bot) bot.disabled = false; }
}
async function unirPorCodigo() {
  const inp = $("#codInput"); if (!inp) return;
  const codigo = (inp.value || "").trim().toUpperCase();
  if (!codigo) { toast("Escribe el código que te han pasado"); return; }
  try {
    const r = await fetch("/api/duelo/unir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo, jugador: state.name || "Anónimo" }) });
    const d = await r.json();
    if (!r.ok) { toast(d.error || "Código no válido"); return; }
    toast("⚔️ Dentro: reta de " + d.de + " · 10 preg");
    jugarDueloReal(d.id);
  } catch (e) { toast("Servidor no disponible"); }
}
setInterval(async () => {
  if (!$("#misDuelos")) return;
  try {
    const r = await fetch("/api/duelo/mis?u=" + encodeURIComponent(state.name || ""));
    const d = await r.json();
    (d.duelos || []).forEach(x => {
      const p = duelosPrev[x.id];
      if (p && p.para == null && x.para != null) {
        if (D && D.azarId === x.id) { toast("🎲 Rival encontrado: " + x.para); jugarDueloReal(x.id); }
        else toast("⚔️ ¡" + x.para + " entró en tu duelo!");
      }
    });
    duelosPrev = {};
    (d.duelos || []).forEach(x => { duelosPrev[x.id] = x; });
    if (ultimoCreado && $("#zonaCodigo")) { const x = (d.duelos || []).find(y => y.id === ultimoCreado); if (x && x.rol === "de") pintarCodigo(x); }
    refrescaDuelos();
  } catch (e) {}
}, 5000);
async function jugarDueloReal(id) {
  try {
    const r = await fetch("/api/duelo/mis?u=" + encodeURIComponent(state.name || ""));
    const d = await r.json();
    const x = (d.duelos || []).find(y => y.id === id);
    if (!x) { toast("Ese duelo ya no existe"); return; }
    if (x.mi != null) { toast("Ya jugaste este duelo: espera al rival"); return; }
    let list = (x.ids || []).map(pid => byId[pid]).filter(Boolean);
    if (list.length < 10) list = list.concat(shuffle(bank(state.course)).slice(0, 10 - list.length));
    D = { online: x, rivalName: x.rol === "de" ? x.para : x.de, list, i: 0, me: 0, foe: 0, phase: "play" };
    vDuelo();
  } catch (e) { toast("No se pudo cargar el duelo"); }
}
async function finishOnline() {
  D.phase = "wait";
  try {
    const r = await fetch("/api/duelo/resultado", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: D.online.id, jugador: state.name, aciertos: D.me }) });
    const x = await r.json();
    D.online = x;
    const win = x.estado === "terminado" && x.ganador && nName(x.ganador) === nName(state.name);
    const tie = x.estado === "terminado" && !x.ganador;
    if (win) { state.xp += 40; unlock("duel1"); setTimeout(confetti, 300); fanfare(); }
    else if (tie) { state.xp += 15; }
    save();
    const rivalName = x.rol === "de" ? x.para : x.de;
    const msg = x.estado === "terminado" ? (win ? "¡Victoria! ⚔️ +40 XP" : tie ? "Empate 🤝 +15 XP" : "Derrota… revancha 💪") : "Puntuación registrada · esperando a " + rivalName + " ⏳";
    view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>Duelo 1vs1 ⚔️</h1></div>' +
      '<div class="score-hero"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">' + esc(x.de) + " vs " + esc(x.para) + '</span><div class="num">' + D.me + "/10</div><div><b>" + msg + "</b></div>" +
      (x.estado === "terminado" && x.rival != null ? '<div class="small" style="margin-top:6px;opacity:.85">Rival: ' + x.rival + "/10</div>" : "") + '</div>' +
      '<div class="t-nav" style="justify-content:center"><button class="btn btn-gold" id="dBack">Volver a duelos</button></div>';
    $("#dBack").onclick = () => { D = null; vDuelo(); };
  } catch (e) { toast("No se pudo registrar el resultado"); D = null; vDuelo(); }
}
function vDuelo() {
  const rivals = [
    { name: "Sdo. «Novato» Ruiz", acc: 0.6, emoji: "🌱", diff: "Fácil" },
    { name: "Cbo 1º «Zorro» Martín", acc: 0.78, emoji: "🦊", diff: "Medio" },
    { name: "Sge. «Lobo» Ortiz", acc: 0.9, emoji: "🐺", diff: "Difícil" },
    { name: "Stgo. «Cobra» Vargas", acc: 0.97, emoji: "💀", diff: "Extremo" }
  ];
  if (!D || D.phase === "pick") {
    view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Duelo 1vs1 ⚔️</h1></div>' +
      '<p class="small muted" style="margin:2px 0 8px">Juegas como <b>' + esc(state.name || "Anónimo") + '</b> · cámbialo en Más → Ajustes</p>' +
      '<div id="zonaCodigo"></div>' +
      '<div class="card" style="margin-bottom:12px"><b>🎯 Retar a un amigo</b>' +
      '<p class="small muted" style="margin:6px 0 10px">Generas un código, se lo mandas por WhatsApp y jugáis las mismas 10 preguntas. Cada uno responde cuando puede y el servidor compara.</p>' +
      '<button class="btn btn-gold" id="crearCodBtn" style="width:100%">Crear código ⚔️</button></div>' +
      '<div id="zonaAzar"></div>' +
      '<div class="card" style="margin-bottom:12px"><b>🎲 Contrincante al azar</b>' +
      '<p class="small muted" style="margin:6px 0 10px">Te emparejamos con el primer jugador que busque partida en este curso.</p>' +
      '<button class="btn btn-gold" id="azarBtn" style="width:100%">Buscar rival 🎲</button></div>' +
      '<div class="card" style="margin-bottom:12px"><b>🎫 ¿Tienes un código?</b>' +
      '<div style="display:flex;gap:8px;margin-top:8px"><input type="text" id="codInput" placeholder="ABC123" maxlength="6" autocapitalize="characters" style="flex:1;min-width:0;text-transform:uppercase;letter-spacing:.2em"><button class="btn btn-gold btn-sm" id="unirBtn">Unirme</button></div>' +
      '<div id="misDuelos" class="small" style="margin-top:10px"></div></div>' +
      '<p class="small muted">…o entrena contra la máquina (5 preguntas · +40 XP por victoria):</p>' +
      rivals.map((r, i) => '<div class="card" style="margin-bottom:10px"><div class="topic-row"><span>' + r.emoji + " <b>" + esc(r.name) + '</b> <span class="badge">' + r.diff + " · " + Math.round(r.acc * 100) + '%</span></span><button class="btn btn-gold btn-sm" data-r="' + i + '">Reto</button></div></div>').join("");
    $("#crearCodBtn").onclick = crearCodigo;
    $("#azarBtn").onclick = buscarAzar;
    $("#unirBtn").onclick = unirPorCodigo;
    $("#codInput").addEventListener("keydown", e => { if (e.key === "Enter") unirPorCodigo(); });
    refrescaDuelos();
    $$("[data-r]").forEach(b => b.onclick = () => {
      const r = rivals[parseInt(b.getAttribute("data-r"), 10)];
      D = { rival: r, list: shuffle(bank(state.course)).slice(0, 5), i: 0, me: 0, foe: 0, phase: "play" };
      D.foeAns = D.list.map(() => Math.random() < r.acc);
      vDuelo();
    });
    return;
  }
  if (D.phase === "play") {
    const q = D.list[D.i];
    const rn = D.online ? D.rivalName : D.rival.emoji + " " + D.rival.name;
    const pct = D.online ? Math.round(D.i * 100 / D.list.length) : D.i * 20;
    view().innerHTML = '<div class="view-head"><a class="back" href="#/mas" id="duelQuit">✕</a><h1 style="font-size:1.05rem">vs ' + esc(rn) + '</h1><span class="badge" style="margin-left:auto">Tú ' + D.me + " – " + (D.online ? "⏳" : D.foe) + '</span></div>' +
      '<div class="t-progress" style="margin-bottom:12px"><i style="width:' + pct + '%"></i></div>' +
      '<div class="q-card"><div><span class="badge">' + esc(q.t) + '</span></div><p class="q-text">' + esc(q.q) + '</p><div id="dopts">' +
      q.o.map((op, i) => '<button class="opt" data-o="' + i + '"><b>' + "ABCD"[i] + ".</b> " + esc(op) + "</button>").join("") + '</div><div id="dres"></div></div>';
    $("#duelQuit").onclick = () => { D = null; };
    $$("#dopts .opt").forEach(btn => btn.onclick = () => {
      const i = parseInt(btn.getAttribute("data-o"), 10);
      const ok = i === q.a, foeOk = D.foeAns ? D.foeAns[D.i] : false;
      if (ok) { D.me++; sfxGood(); } else sfxBad();
      if (foeOk) D.foe++;
      $$("#dopts .opt").forEach((b2, j) => { b2.disabled = true; if (j === q.a) b2.classList.add("ok"); else if (j === i) b2.classList.add("ko"); });
      $("#dres").innerHTML = '<div class="explain">Tú: ' + (ok ? "✅" : "❌") + (D.online ? "" : " · Rival: " + (foeOk ? "✅" : "❌")) + '</div><div class="t-nav" style="margin-top:10px"><button class="btn btn-green" id="dNext">' + (D.i < D.list.length - 1 ? "Siguiente →" : "Ver resultado 🏁") + "</button></div>";
      $("#dNext").onclick = () => {
        if (D.i < D.list.length - 1) { D.i++; vDuelo(); }
        else if (D.online) finishOnline();
        else {
          D.phase = "end";
          if (D.me > D.foe) { state.xp += 40; unlock("duel1"); }
          else if (D.me === D.foe) state.xp += 15;
          save();
          vDuelo();
        }
      };
    });
  } else {
    const win = D.me > D.foe, tie = D.me === D.foe;
    if (win) { setTimeout(confetti, 300); fanfare(); }
    view().innerHTML = '<div class="score-hero"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">Duelo · ' + D.rival.emoji + " " + esc(D.rival.name) + '</span><div class="num">' + D.me + " – " + D.foe + "</div><div><b>" + (win ? "¡Victoria! ⚔️ +40 XP" : tie ? "Empate 🤝 +15 XP" : "Derrota… revancha 💪") + "</b></div></div>" +
      '<div class="t-nav" style="justify-content:center"><button class="btn btn-gold" id="dAgain">Otro duelo</button><button class="btn btn-ghost" onclick="shareDuel()">Compartir 📣</button></div>';
    $("#dAgain").onclick = () => { D = null; vDuelo(); };
  }
}
window.shareDuel = function () {
  if (!D) return;
  const txt = D.me > D.foe
    ? "⚔️ Acabo de ganar mi duelo " + D.me + "-" + D.foe + " en A LA ORDEN, la academia de tropa. ¿Alguien me reta?"
    : "⚔️ Duelo " + D.me + "-" + D.foe + " en A LA ORDEN. La revancha es cuestión de honor. ¿Te apuntas?";
  if (navigator.share) navigator.share({ title: "A LA ORDEN", text: txt }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("Texto copiado 📋")).catch(() => toast(txt));
  else toast(txt);
};

/* ---- RETO DIARIO ---- */
function vDiario() {
  const done = state.daily.date === new Date().toDateString() && state.daily.done;
  if (done) {
    view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>Reto diario 🎯</h1></div><div class="score-hero"><div class="num">✔</div><div><b>¡Reto de hoy completado!</b></div><div class="small" style="margin-top:8px;opacity:.85">Vuelve mañana para mantener tu racha. Racha actual: ' + state.streak + ' días 🔥</div></div><div class="t-nav" style="justify-content:center"><a class="btn btn-green" href="#/entrenar">Seguir entrenando</a></div>';
    return;
  }
  startTest({ course: state.course, filter: "all", n: 10, mode: "study", label: "Reto diario", daily: true });
}

/* ---- TEST A LA CARTA ---- */
function vCustom() {
  const c = COURSES[state.course];
  const topics = [];
  c.syllabus.forEach(b => b.topics.forEach(t => topics.push(t)));
  view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>Test a la carta 🎛️</h1></div>' +
    '<div class="card">' +
    '<label class="f">Número de preguntas</label><select id="cN"><option value="10">10 preguntas</option><option value="25" selected>25 preguntas</option><option value="50">50 preguntas</option><option value="999">Todas las disponibles</option></select>' +
    '<label class="f">Preguntas de…</label><select id="cFilter"><option value="all">Todo el curso (mezcla)</option><option value="tema">Solo un tema</option><option value="bloque">Solo un bloque</option><option value="fallos">Solo mis fallos</option><option value="blancos">Solo las dejé en blanco</option><option value="nuevos">Solo las que nunca vi</option></select>' +
    '<label class="f">Tema (si aplica)</label><select id="cTopic">' + topics.map(t => '<option>' + esc(t) + '</option>').join("") + '</select>' +
    '<label class="f">Bloque (si aplica)</label><select id="cBlock">' + c.syllabus.map(b => '<option value="' + b.code + '">' + esc(b.title) + '</option>').join("") + '</select>' +
    '<label class="f">Dificultad</label><select id="cDiff"><option value="">Todas</option><option value="F">Solo fáciles</option><option value="M">Solo medias</option><option value="D">Solo difíciles</option></select>' +
    '<label class="f">Modo</label><select id="cMode"><option value="study">Estudio (corrección al instante)</option><option value="exam">Examen (solución al final)</option></select>' +
    '<label class="f">Tiempo</label><select id="cTime"><option value="off">Sin tiempo</option><option value="global">30 minutos en total</option><option value="perq">15 segundos por pregunta</option></select>' +
    '<button class="btn btn-green btn-block" id="cGo" style="margin-top:14px">Crear el test 🎯</button></div>';
  $("#cGo").onclick = () => {
    const filter = $("#cFilter").value, time = $("#cTime").value;
    startTest({
      course: state.course, filter: filter, topic: $("#cTopic").value, block: $("#cBlock").value,
      n: parseInt($("#cN").value, 10), mode: $("#cMode").value, diff: $("#cDiff").value || null,
      minutes: time === "global" ? 30 : undefined, perQ: time === "perq" ? 15 : undefined, label: "A la carta"
    });
  };
}

/* ---- REPASO ESPACIADO (Leitner/Anki) ---- */
let SR = null;
function srsDue(course) {
  const now = Date.now();
  return bank(course).filter(q => state.srs[q.id] && state.srs[q.id].due <= now);
}
function vSRS() {
  const due = srsDue(state.course);
  const inBox = Object.keys(state.srs).filter(id => byId[id] && byId[id].c === state.course).length;
  const failsN = Object.keys(state.fails).filter(id => (state.fails[id] || 0) > 0 && byId[id] && byId[id].c === state.course);
  if (!SR) {
    view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>Repaso espaciado 🧬</h1></div>' +
      '<div class="card" style="margin-bottom:12px"><p>El método de los que aprueban (Anki/Leitner): cada pregunta que dominas vuelve más tarde; la que fallas vuelve hoy. Cajas de 1 → 2 → 4 → 8 → 16 días.</p>' +
      '<div class="kpi-row"><div class="kpi"><b>' + due.length + '</b><span>Por repasar hoy</span></div><div class="kpi"><b>' + inBox + '</b><span>En el sistema</span></div><div class="kpi"><b>' + failsN.length + '</b><span>Fallos vivos</span></div></div>' +
      (due.length ? '<button class="btn btn-green btn-block" id="srsGo">Repasar las ' + Math.min(due.length, 20) + ' de hoy</button>' : '<p class="small muted">Nada pendiente hoy. Las preguntas entran aquí cuando las fallas o las añades tú.</p>') +
      (failsN.length ? '<button class="btn btn-ghost btn-block" id="srsSeed" style="margin-top:10px">Volcar mis ' + failsN.length + ' fallos al repaso espaciado</button>' : "") + '</div>';
    const g = $("#srsGo");
    if (g) g.onclick = () => { SR = { ids: shuffle(due).slice(0, 20), i: 0, flip: false }; vSRS(); };
    const s = $("#srsSeed");
    if (s) s.onclick = () => { const now = Date.now(); failsN.forEach(id => { state.srs[id] = { b: 0, due: now }; }); save(); toast("Fallos añadidos al repaso 🧬"); vSRS(); };
    return;
  }
  if (SR.i >= SR.ids.length) {
    view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar">←</a><h1>Repaso espaciado 🧬</h1></div><div class="card center"><h3>Sesión completada 🎉</h3><p>Volverán por el camino programado: lo difícil mañana, lo fácil más tarde.</p><a class="btn btn-green" href="#/entrenar">Hecho</a></div>';
    SR = null; return;
  }
  const q = byId[SR.ids[SR.i]];
  view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar" id="srsQuit">✕</a><h1>Repaso 🧬</h1><span class="badge" style="margin-left:auto">' + (SR.i + 1) + "/" + SR.ids.length + '</span></div>' +
    '<div class="t-progress" style="margin-bottom:12px"><i style="width:' + Math.round(100 * SR.i / SR.ids.length) + '%"></i></div>' +
    '<div class="q-card"><div><span class="badge">' + esc(q.t) + '</span> <span class="pill-diff d' + q.d + '">' + diffLabel(q.d) + '</span></div><p class="q-text">' + esc(q.q) + "</p>" +
    (SR.flip ? '<div class="explain"><b>' + esc(q.o[q.a]) + "</b><br>" + esc(q.x) + '<span class="ref">📖 ' + esc(q.r) + "</span></div>" : "") + '</div>' +
    '<div class="t-nav" style="justify-content:center">' + (SR.flip
      ? '<button class="btn btn-green" id="srGood">✅ Lo sabía</button><button class="btn btn-ghost" id="srBad">❌ No lo sabía</button>'
      : '<button class="btn btn-gold" id="srFlip">Ver respuesta</button>') + "</div>";
  $("#srsQuit").onclick = () => { SR = null; };
  if (SR.flip) {
    $("#srGood").onclick = () => {
      const cur = state.srs[q.id] || { b: 0, due: 0 };
      cur.b = Math.min(4, cur.b + 1);
      cur.due = Date.now() + Math.pow(2, cur.b) * 864e5;
      state.srs[q.id] = cur; state.xp += 3; save(); SR.i++; SR.flip = false; vSRS();
    };
    $("#srBad").onclick = () => { state.srs[q.id] = { b: 0, due: Date.now() + 3600e3 }; save(); SR.i++; SR.flip = false; vSRS(); };
  } else $("#srFlip").onclick = () => { SR.flip = true; vSRS(); };
}

/* ---- MARATÓN (3 vidas, infinito) ---- */
let M = null;
function vMaraton() {
  if (!M) M = { list: shuffle(bank(state.course)), i: 0, lives: 3, ok: 0, re: 0 };
  const end = M.lives <= 0 || M.i >= M.list.length;
  if (end) {
    const total = M.ok + M.re;
    const acc = total ? Math.round(100 * M.ok / total) : 0;
    if (M.ok + M.re > 0) {
      state.history.push({ d: Date.now(), course: state.course, mode: "Maratón", n: total, acc, score: M.ok, RA: M.ok, RE: M.re, BL: 0, byTopic: {}, byDiff: {} });
      save(); checkAch();
    }
    const win = M.ok >= 15;
    if (win) { setTimeout(confetti, 200); fanfare(); }
    view().innerHTML = '<div class="score-hero"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">Maratón · ' + COURSES[state.course].badge + '</span><div class="num">' + M.ok + '<small style="font-size:1.1rem"> aciertos</small></div><div><b>' + (win ? "¡Corredor de fondo! 🏅" : "Buen ritmo 💪") + "</b></div>" +
      '<div class="small" style="margin-top:8px;opacity:.85">' + (M.lives <= 0 ? "Sin vidas: 3 fallos" : "Ronda agotada") + " · Precisión " + acc + '%</div></div>' +
      '<div class="t-nav" style="justify-content:center"><button class="btn btn-gold" id="mAgain">Otra ronda</button><a class="btn btn-ghost" href="#/entrenar">Salir</a></div>';
    $("#mAgain").onclick = () => { M = null; vMaraton(); };
    M = null;
    return;
  }
  const q = M.list[M.i];
  view().innerHTML = '<div class="view-head"><a class="back" href="#/entrenar" id="mtQuit">✕</a><h1 style="font-size:1.05rem">Maratón 🏃</h1><span class="badge" style="margin-left:auto">' + "❤️".repeat(M.lives) + " · " + M.ok + '</span></div>' +
    '<div class="t-progress" style="margin-bottom:12px"><i style="width:' + Math.round(100 * M.i / M.list.length) + '%"></i></div>' +
    '<div class="q-card"><div><span class="badge">' + esc(q.t) + '</span></div><p class="q-text">' + esc(q.q) + '</p><div id="mopts">' +
    q.o.map((op, i) => '<button class="opt" data-o="' + i + '"><b>' + "ABCD"[i] + ".</b> " + esc(op) + "</button>").join("") + '</div><div id="mres"></div></div>';
  $("#mtQuit").onclick = () => { M = null; };
  $$("#mopts .opt").forEach(btn => btn.onclick = () => {
    const i = parseInt(btn.getAttribute("data-o"), 10), ok = i === q.a;
    if (ok) { M.ok++; state.xp += 2; sfxGood(); } else { M.lives--; M.re++; sfxBad(); }
    save();
    $$("#mopts .opt").forEach((b2, j) => { b2.disabled = true; if (j === q.a) b2.classList.add("ok"); else if (j === i) b2.classList.add("ko"); });
    $("#mres").innerHTML = (ok ? "" : '<div class="explain"><b>❌ ' + esc(q.x) + ' <span class="ref">📖 ' + esc(q.r) + "</span></div>") +
      '<div class="t-nav" style="margin-top:10px"><button class="btn btn-green" id="mNext">' + (M.lives <= 0 ? "Ver resultado 🏁" : "Siguiente →") + "</button></div>";
    $("#mNext").onclick = () => { M.i++; vMaraton(); };
  });
}

/* ---- ESQUEMAS (resúmenes por bloque) ---- */
function vEsquemas() {
  const list = (window.ESQUEMAS || {})[state.course] || [];
  const blocks = list.map((b, bi) => '<details class="acc" open><summary>' + esc(b.t) + '</summary><div class="acc-body"><ul class="list-clean">' +
    b.lines.map(l => "<li>▸ " + esc(l) + "</li>").join("") + '</ul><button class="btn btn-ghost btn-sm" data-spk="' + bi + '">🔊 Escuchar</button> <button class="btn btn-ghost btn-sm" data-prn="' + bi + '">🖨️ PDF</button></div></details>').join("");
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Esquemas 🗂️</h1><span class="badge badge-gold" style="margin-left:auto">vigente sept-2026</span></div>' +
    '<p class="small muted">Lo esencial de cada bloque, con la normativa vigente. Estudia aquí y remata con los tests. Curso en audio incluido: escucha cada esquema en guardias o marchas.</p>' +
    '<button class="btn btn-green btn-sm" id="schDown" style="margin-bottom:12px">⬇️ Descargar todos los esquemas (.txt)</button>' + blocks;
  $("#schDown").onclick = () => {
    const txt = "ESQUEMAS A LA ORDEN · " + COURSES[state.course].name + " · vigente sept-2026\n\n" +
      list.map(b => "== " + b.t + " ==\n" + b.lines.map(l => "- " + l).join("\n")).join("\n\n");
    descargaArchivo("galon-esquemas-" + state.course + ".txt", txt, "text/plain");
    toast("⬇️ Esquemas descargados");
  };
  $$("[data-prn]").forEach(btn => btn.onclick = () => {
    const b = list[parseInt(btn.getAttribute("data-prn"), 10)];
    const w = window.open("", "_blank");
    if (!w) { toast("Permite las ventanas emergentes para imprimir"); return; }
    w.document.write("<!doctype html><html lang='es'><head><meta charset='utf-8'><title>A LA ORDEN · " + b.t + "</title><style>body{font-family:system-ui,Arial;max-width:720px;margin:24px auto;color:#1d2a21}h1{color:#143d26;font-size:1.3rem}li{margin:6px 0}</style></head><body><h1>▲ " + b.t + "</h1><ul>" + b.lines.map(l => "<li>" + l + "</li>").join("") + "</ul><p style='color:#5f6f63'>A LA ORDEN · esquema vigente sept-2026 · imprime o guarda como PDF</p><script>window.print()<\/script></body></html>");
    w.document.close();
  });
  $$("[data-spk]").forEach(btn => btn.onclick = () => {
    const b = list[parseInt(btn.getAttribute("data-spk"), 10)];
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(b.t + ". " + b.lines.join(". "));
      u.lang = "es-ES"; u.rate = 1;
      speechSynthesis.speak(u);
      toast("🔊 Reproduciendo el esquema… cambia de pantalla para parar");
    } catch (e) { toast("Audio no disponible en este dispositivo"); }
  });
}

/* ---- NORMATIVA VIGENTE ---- */
function vNormas() {
  const TAGS = { "NUEVO": "badge-gold", "VIGENTE": "badge-green", "EN TRÁMITE": "badge" };
  const rows = (window.NORMS || []).map(n => '<div class="card" style="margin-bottom:10px"><div class="topic-row"><span><b>' + esc(n.t) + '</b><br><span class="small muted">📅 ' + esc(n.d) + " · " + esc(n.ref) + " · " + (n.c === "general" ? "General" : COURSES[n.c] ? esc(COURSES[n.c].badge) : esc(n.c)) + '</span></span><span class="badge ' + (TAGS[n.tag] || "badge") + '">' + esc(n.tag) + "</span></div><p>" + esc(n.x) + "</p></div>").join("");
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Normativa vigente ⚖️</h1></div>' +
    '<div class="card" style="margin-bottom:12px"><span class="badge badge-green">Contenido A LA ORDEN verificado: 19-sep-2026</span><p class="small muted">Revisamos el BOD/BOE y actualizamos banco, esquemas y changelog. Si algo cambia, aparece aquí primero.</p></div>' + rows;
}

/* ---- CONSULTA: resuelve dudas buscando SOLO en el banco verificado (sin inventar nada) ---- */
function cNorm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
const C_STOP = new Set("el la los las un una unos unas de del al a ante bajo con contra desde durante entre hacia hasta mediante para por segun sin sobre tras y o u e ni que se su sus mi mis tu tus le les lo me te nos os yo el ella ellos ellas nosotros vosotros es son sera ser fue ha han hay hubo era como cuando donde cual cuales quien cuanto porque mas menos muy pero si no tampoco ya aun tambien solo tan tanto este esta estos estas ese esa esos esas aquel aquella tiene tienen puede pueden hacer hace hay va voy debes debe".split(" "));
function consultaBuscar(txt) {
  const toks = cNorm(txt).split(/[^a-z0-9ñ°º]+/).filter(t => t.length > 2 && !C_STOP.has(t));
  if (!toks.length) return [];
  const res = [];
  for (const q of BANK) {
    const qn = cNorm(q.q), tn = cNorm(q.t), xn = cNorm(q.x || ""), rn = cNorm(q.r || "");
    const ons = (q.o || []).map(cNorm);
    let sc = 0, hits = 0;
    for (const t of toks) {
      let w = 0;
      if (qn.includes(t)) w += 3;
      if (tn.includes(t)) w += 2;
      if (rn.includes(t)) w += 2;
      if (xn.includes(t)) w += 1.5;
      for (const o of ons) if (o.includes(t)) { w += 1; break; }
      if (w) hits++;
      sc += w;
    }
    if (sc >= 3) { sc = sc * Math.pow(hits / toks.length, 1.5); if (sc >= 1.5) res.push({ q, sc }); }
  }
  return res.sort((a, b) => b.sc - a.sc).slice(0, 8);
}
function vConsulta() {
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Consulta 💬</h1></div>' +
    '<div class="card" style="margin-bottom:12px"><b>Pregunta lo que te trabas</b>' +
    '<p class="small muted" style="margin:6px 0 8px">Busco en las <b>' + BANK.length + ' preguntas verificadas</b> del banco (con su respuesta, explicación y norma). Si no hay nada verificado sobre eso, te lo digo claro: <b>no te voy a inventar una respuesta</b> — te mando a la fuente oficial.</p>' +
    '<input type="search" id="cq" placeholder="Ej.: ¿puedo cumplir una orden delictiva? · alcance del PR4G · profundidad RCP" style="width:100%">' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">' +
    ["orden manifiestamente delictiva", "alcance del PR4G", "profundidad compresiones", "acimut inverso", "jornada de marcha", "curvas de nivel"].map(k => '<button class="btn btn-ghost btn-sm c-ej">' + k + '</button>').join("") + '</div></div>' +
    '<div id="cRes"></div>';
  let tId = null;
  const busca = () => {
    const txt = $("#cq").value.trim();
    const cont = $("#cRes"); if (!cont) return;
    if (txt.length < 3) { cont.innerHTML = '<p class="small muted center">Escribe al menos 3 letras…</p>'; return; }
    const r = consultaBuscar(txt);
    if (!r.length) {
      cont.innerHTML = '<div class="card"><b>🤷 Sin respuesta verificada en la base</b>' +
        '<p class="small muted">Sobre eso no tengo nada contrastado y <b>no invento</b>. Consulta la fuente oficial:</p>' +
        '<div class="t-nav" style="justify-content:center"><a class="btn btn-sm" href="https://www.boe.es/buscar/" target="_blank" rel="noopener">BOE ↗</a>' +
        '<a class="btn btn-sm" href="https://ejercito.defensa.gob.es/" target="_blank" rel="noopener">Ejército ↗</a></div>' +
        '<p class="small muted" style="margin:8px 0 0">Prueba con otras palabras (norma, cifra, nombre propio).</p></div>';
      return;
    }
    cont.innerHTML = '<p class="small muted" style="margin:2px 0 8px">' + r.length + ' respuesta' + (r.length > 1 ? "s" : "") + ' verificada' + (r.length > 1 ? "s" : "") + ':</p>' +
      r.map(x => '<div class="card" style="margin-bottom:10px"><span class="badge">' + esc(x.q.t) + " · " + diffLabel(x.q.d) + '</span><p class="q-text" style="margin:6px 0"><b>' + esc(x.q.q) + '</b></p>' +
        '<p style="margin:2px 0;color:var(--green,#0a6b3d)"><b>✔ ' + esc(x.q.o[x.q.a]) + '</b></p>' +
        '<p class="small muted" style="margin:4px 0 0">' + esc(x.q.x || "") + '<br><b>Ref:</b> ' + esc(x.q.r || "") + '</p></div>').join("") +
      '<div class="t-nav" style="justify-content:center"><button class="btn btn-gold" id="cPracticar">💪 Practicar estas (' + r.length + ')</button></div>';
    $("#cPracticar").onclick = () => startTest({ course: state.course, fixed: r.map(x => x.q.id), mode: "study", label: "Consulta · dudas" });
  };
  $("#cq").addEventListener("input", () => { clearTimeout(tId); tId = setTimeout(busca, 250); });
  $$(".c-ej").forEach(b => b.onclick = () => { $("#cq").value = b.textContent; busca(); });
  $("#cRes").innerHTML = '<p class="small muted center">Escribe tu duda arriba 👆</p>';
}

/* ---- APOYA: meta de la tropa + muro de apoyos (datos reales, sin contraprestación) ---- */
async function vApoya() {
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Apoya ☕</h1></div>' +
    '<div id="apoyaCuerpo"><p class="small muted center">Cargando…</p></div>';
  let A = { recaudado: 0, cafes: 0, fundadores: [], fundadores_limite: 100 };
  try { A = await (await fetch("/api/apoyos")).json(); } catch (e) {}
  const D0 = window.GALON_DONATE || {};
  const metaAnual = (D0.monthlyCost || 1) * 12;
  const pct = Math.min(100, Math.round(100 * (A.recaudado || 0) / metaAnual));
  const url = donaURL();
  const ya = (state.donation || {}).off;
  $("#apoyaCuerpo").innerHTML =
    '<div class="card" style="margin-bottom:12px"><b>🎯 Meta de la tropa (este año)</b>' +
    '<p class="small muted" style="margin:6px 0">A LA ORDEN es gratis y lo seguirá siendo. El servidor y el dominio los pone la propia tropa con cafés voluntarios.</p>' +
    '<div class="t-progress" style="margin:8px 0"><i style="width:' + pct + '%"></i></div>' +
    '<p class="small" style="margin:0"><b>' + (A.recaudado || 0) + " €</b> de " + metaAnual + " € · " + pct + '%</p>' +
    '<p class="small muted" style="margin:6px 0 0">Cifras reales, sin humo: solo cuentan cafés verificados.</p></div>' +
    (url ? '<div class="t-nav" style="justify-content:center;margin-bottom:12px"><a class="btn btn-gold" href="' + esc(url) + '" target="_blank" rel="noopener">☕ Apoyar en Ko-fi</a></div>'
         : '<p class="small muted center" style="margin-bottom:12px">🎫 Ko-fi se activará con la URL definitiva (Render). Mientras tanto: Bizum por el canal de Telegram.</p>') +
    '<div class="card" style="margin-bottom:12px"><b>🏅 Fundadores (de por vida)</b>' +
    '<p class="small muted" style="margin:6px 0">Los primeros ' + (A.fundadores_limite || 100) + ' cuentas: galón para siempre, pase lo que pase.</p>' +
    '<p style="margin:4px 0 0">' + (A.fundadores || []).map(f => '<span class="badge badge-gold">🏅 ' + esc(f) + '</span>').join(" ") + '</p></div>' +
    '<div class="card" style="margin-bottom:12px"><b>☕ Muro de apoyos</b>' +
    '<p class="small" style="margin:6px 0 0">' + (A.cafes ? A.cafes + ' café' + (A.cafes > 1 ? "s" : "") + ' verificado' + (A.cafes > 1 ? "s" : "") + ' hasta hoy. Los cafeteros llevan su ☕ en la app.' : 'Aún sin cafés: el primero será histórico.') + '</p></div>' +
    '<div class="card" style="margin-bottom:12px"><b>Sin trampas, sin regalos raros</b>' +
    '<p class="small muted" style="margin:6px 0 0">No vendemos ventajas (el estudio no se puede comprar) ni hacemos sorteos (eso es juego y tiene ley). Quien apoya recibe <b>reconocimiento</b>: muro, insignia y fundadores de por vida. Nada más, y eso es lo bonito.</p></div>' +
    (!ya ? '<div class="t-nav" style="justify-content:center"><button class="btn btn-ghost btn-sm" id="apoyaYa">🫡 Ya colaboro (callar avisos)</button></div>' : '<p class="small muted center">🫡 Marcado como colaborador: los avisos quedan callados.</p>');
  const yb = $("#apoyaYa"); if (yb) yb.onclick = () => { state.donation = state.donation || {}; state.donation.off = Date.now(); save(); toast("🫡 ¡Gracias de corazón!"); vApoya(); };
}

/* ---- BIBLIOTECA: cuadernos A LA ORDEN propios (PDF) + fuentes oficiales gratuitas ---- */
function vBiblio() {
  const CUADERNOS = [
    ["galon-cabo-01-reales-ordenanzas.pdf", "Reales Ordenanzas", "RD 96/2009"],
    ["galon-cabo-02-regimen-disciplinario.pdf", "Régimen Disciplinario", "LO 8/2014"],
    ["galon-cabo-03-codigo-penal-militar.pdf", "Código Penal Militar", "LO 85/1998 · LO 14/2015"],
    ["galon-cabo-04-derechos-y-deberes.pdf", "Derechos y deberes", "Ley 39/2007"],
    ["galon-cabo-05-organizacion-defensa.pdf", "Organización de la Defensa", "Ley 5/2005"],
    ["galon-cabo-06-carrera-militar.pdf", "Carrera militar", "Ley 39/2007"],
    ["galon-cabo-07-organizacion-et.pdf", "Organización del ET", "RD 847/2015 · DEF/708/2020"],
    ["galon-cabo-08-ensenanza-militar.pdf", "Enseñanza militar", "RD 416/2014"],
    ["galon-cabo-09-transmisiones.pdf", "Transmisiones (PR4G)", "Fichas oficiales ET"],
    ["galon-cabo-10-topografia.pdf", "Topografía", "IGN · RD 1071/2007"],
    ["galon-cabo-11-primeros-auxilios.pdf", "Primeros auxilios", "ERC 2025 · Cruz Roja"],
    ["galon-cabo-12-constitucion.pdf", "Constitución", "CE 1978 + 4 reformas"],
    ["galon-cabo-13-instruccion-combatiente.pdf", "Instrucción del combatiente", "Doctrina + Defensa NBQ"],
    ["galon-cabo-14-otan-y-ue.pdf", "OTAN y UE", "Exteriores · La Moncloa · UE"],
    ["galon-cabo-15-armamento-y-tiro.pdf", "Armamento y tiro", "Ficha oficial ET · G36 · USP"],
    ["galon-cabo-16-logistica.pdf", "Logística", "BRILOG · AALOG · clases OTAN"],
    ["galon-cabo-17-instruccion-civica.pdf", "Instrucción cívica", "Himno · patronas · San Fernando"]
  ];
  const OFICIALES = [
    ["https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229", "Constitución Española (texto consolidado)", "BOE"],
    ["https://www.boe.es/buscar/act.php?id=BOE-A-2005-17040", "Ley 5/2005, de la Defensa Nacional", "BOE"],
    ["https://www.boe.es/buscar/act.php?id=BOE-A-2009-2074", "Reales Ordenanzas (RD 96/2009)", "BOE"],
    ["https://www.boe.es/buscar/act.php?id=BOE-A-2014-9719", "LO 8/2014, Régimen Disciplinario FAS", "BOE"],
    ["https://www.boe.es/buscar/act.php?id=BOE-A-2007-19880", "Ley 39/2007, de la Carrera Militar", "BOE"],
    ["https://www.boe.es/buscar/doc.php?id=BOE-A-2024-3099", "Reforma del art. 49 CE (discapacidad, 2024)", "BOE"],
    ["https://ejercito.defensa.gob.es/materiales/transmisiones/Radiotelefono.html", "Ficha oficial PR4G", "Ejército de Tierra"]
  ];
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Biblioteca 📚</h1></div>' +
    '<div class="card" style="margin-bottom:12px"><b>Material 100% legal y gratis</b>' +
    '<p class="small muted" style="margin:6px 0 0">Cuadernos elaborados por A LA ORDEN (nuestras 700 preguntas del lote examinador, con respuesta y referencia) y textos OFICIALES del BOE y del Ejército, que son públicos. Los temarios de webs de terceros (InfoTroPa, academias…) son de sus autores: no se redistribuyen aquí.</p></div>' +
    '<h3 style="margin:4px 0 8px">🛠️ Cuadernos A LA ORDEN (PDF · 50 preguntas c/u)</h3>' +
    CUADERNOS.map(c => '<div class="card" style="margin-bottom:8px"><div class="topic-row"><span><b>' + esc(c[1]) + '</b><br><span class="small muted">' + esc(c[2]) + '</span></span><a class="btn btn-gold btn-sm" href="pdf/' + c[0] + '" download>Descargar PDF</a></div></div>').join("") +
    '<h3 style="margin:12px 0 8px">🏛️ Fuentes oficiales (gratis, siempre vigentes)</h3>' +
    OFICIALES.map(o => '<div class="card" style="margin-bottom:8px"><div class="topic-row"><span><b>' + esc(o[1]) + '</b><br><span class="small muted">' + esc(o[2]) + ' · enlazado, no copiado</span></span><a class="btn btn-sm" href="' + o[0] + '" target="_blank" rel="noopener">Abrir ↗</a></div></div>').join("");
}

/* ---- MÁS / AJUSTES ---- */

function vMas() {
  view().innerHTML = '<div class="view-head"><h1>Más</h1></div><div class="grid2">' +
    '<a class="mode" href="#/ranking"><span class="mi">🏆</span><b>Ranking</b><span>Tu posición en la liga</span></a>' +
    '<a class="mode" href="#/apoya"><span class="mi">☕</span><b>Apoya</b><span>Meta de la tropa</span></a>' +
    '<a class="mode" href="#/consulta"><span class="mi">💬</span><b>Consulta</b><span>Pregunta tus dudas</span></a>' +
    '<a class="mode" href="#/biblio"><span class="mi">📚</span><b>Biblioteca</b><span>Cuadernos PDF y BOE</span></a>' +
    '<a class="mode" href="#/rincon"><span class="mi">📌</span><b>Mi rincón</b><span>Cuaderno, preguntas ⭐, progreso y descargas</span></a>' +
    '<a class="mode" href="#/tramita"><span class="mi">🧾</span><b>Mi presentación</b><span>Checklist y dossier para la convocatoria</span></a>' +
    '<a class="mode" href="#/baremo"><span class="mi">🧮</span><b>Baremo</b><span>Calcula tu NCO de Cabo</span></a>' +
    '<a class="mode" href="#/fisicas"><span class="mi">🏅</span><b>Físicas</b><span>Pruebas de permanencia</span></a>' +
    '<a class="mode" href="#/cards"><span class="mi">🃏</span><b>Flashcards</b><span>Repasa con tarjetas</span></a>' +
    '<a class="mode" href="#/exams"><span class="mi">📜</span><b>Exámenes oficiales</b><span>Históricos + convocatorias</span></a>' +
    '<a class="mode" href="#/duelo"><span class="mi">⚔️</span><b>Duelo 1vs1</b><span>Retar a un rival</span></a>' +
    '<a class="mode" href="#/logros"><span class="mi">🏅</span><b>Logros</b><span>Tu vitrina de medallas</span></a>' +
    '<a class="mode" href="#/esquemas"><span class="mi">🗂️</span><b>Esquemas</b><span>Resúmenes por bloque</span></a>' +
    '<a class="mode" href="#/normas"><span class="mi">⚖️</span><b>Normativa vigente</b><span>Actualizada a sept-2026</span></a>' +
    '<a class="mode" href="#/plan"><span class="mi">📅</span><b>Plan de estudio</b><span>6 semanas a tu ritmo</span></a>' +
    '<a class="mode" href="#/cuenta"><span class="mi">👤</span><b>Mi cuenta</b><span>Plan, facturas y sincronización</span></a>' +
    '<a class="mode" href="#/ajustes"><span class="mi">⚙️</span><b>Ajustes</b><span>Perfil, modo oscuro, reset</span></a></div>' +
    '<div class="card" style="margin-top:12px"><h3>📡 Alertas BOD</h3><div id="bodList" class="small"></div></div>' +
    '<div class="card center" style="margin-top:12px"><h3>☕ A LA ORDEN es gratis… y lo será</h3><p>Si la app te ayuda a conseguir el galón, invita a un café: paga el servidor y las mejoras. Sin ventajas por donar: solo fundadores de por vida.</p><a class="btn btn-gold" id="donateApp" href="index.html#precios">Apoyar el proyecto ☕</a><p class="small muted" style="margin-top:8px" id="donateInfo"></p></div>';
  const D0 = window.GALON_DONATE;
  if (D0) {
    const info = $("#donateInfo");
    if (info) info.textContent = "Coste real este mes: " + (D0.monthlyCost || 6) + " € · cubierto: " + Math.round(D0.raised || 0) + " €";
    const da = $("#donateApp");
    const url = D0.kofi || D0.paypal;
    if (url) { da.setAttribute("href", url); da.setAttribute("target", "_blank"); da.setAttribute("rel", "noopener"); da.textContent = "☕ Invitar a un café"; }
    else { da.textContent = "☕ Cafetera en instalación · únete al canal mientras tanto"; if (D0.telegram) { da.setAttribute("href", D0.telegram); da.setAttribute("target", "_blank"); da.setAttribute("rel", "noopener"); } }
  }
  renderBOD();
}
function renderBOD() {
  const el = $("#bodList");
  if (!el) return;
  const B = window.GALON_BOD;
  if (!B || !B.alerts || !B.alerts.length) {
    el.innerHTML = '<p class="muted">Cada novedad del BOD que afecte a tu ascenso (plazas, convocatorias, resoluciones) aparecerá aquí, filtrada y explicada.</p>';
    return;
  }
  const seen = +localStorage.getItem("galon_bod_seen") || 0;
  const fresh = B.alerts.filter(a => (a.ts || 0) > seen).length;
  const tg = (window.GALON_DONATE || {}).telegram;
  let h = '<p class="muted" style="margin:2px 0 6px">Lo que importa del Boletín Oficial de Defensa para ascenso a Cabo, Cabo 1º y permanencia. Actualizado: ' + B.updated +
    (fresh ? ' · <b style="color:#e0b13e">' + fresh + ' nueva(s)</b>' : '') +
    (tg ? ' · <a href="' + tg + '" target="_blank" rel="noopener">🔔 canal Telegram</a>' : '') + '</p>';
  h += B.alerts.slice(0, 30).map(a => {
    const chip = a.tag ? '<span style="background:rgba(224,177,62,.15);color:#e0b13e;border-radius:6px;padding:1px 6px;font-size:.72rem;white-space:nowrap">' + a.tag + '</span> ' : '';
    const link = a.url ? ' <a href="' + a.url + '" target="_blank" rel="noopener">fuente ↗</a>' : '';
    return '<div style="border-top:1px solid rgba(255,255,255,.08);padding:8px 0">' + chip + '<b>' + a.t + '</b><br><span class="muted small">' + a.d + ' · ' + a.x + link + '</span></div>';
  }).join("");
  el.innerHTML = h;
  try { localStorage.setItem("galon_bod_seen", String(Math.max.apply(null, [0].concat(B.alerts.map(a => +a.ts || 0))))); } catch (e) {}
}
function vAjustes() {
  view().innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Ajustes</h1></div><div class="card">' +
    '<label class="f">Tu nombre o alias</label><input type="text" id="setName" value="' + esc(state.name) + '" maxlength="24">' +
    '<div class="switch-row"><span><b>🌙 Modo oscuro</b></span><button class="btn btn-ghost btn-sm" id="setDark">' + (document.documentElement.classList.contains("dark") ? "Desactivar" : "Activar") + "</button></div>" +
    '<div class="switch-row"><span><b>🔊 Efectos de sonido</b></span><button class="btn btn-ghost btn-sm" id="setSound">' + (state.sound === false ? "Activar" : "Desactivar") + "</button></div>" +
    '<div class="switch-row"><span><b>⏩ Avanzar solo al acertar</b><br><span class="small muted">En estudio: acierto → siguiente en 1 s; fallo → pausa para leer. Los simulacros nunca avanzan solos.</span></span><button class="btn btn-ghost btn-sm" id="setAuto">' + (state.opts && state.opts.auto === false ? "Activar" : "Desactivar") + "</button></div>" +
    '<div class="switch-row"><span><b>🗑️ Borrar mi progreso</b><br><span class="small muted">XP, racha, fallos e historial</span></span><button class="btn btn-ghost btn-sm" id="setReset">Borrar</button></div>' +
    '<p class="small muted">A LA ORDEN v1.0 · Banco auditado con 0 incidencias (acta pública). Sin anuncios. Tu progreso queda en tu dispositivo y, si creas cuenta, se sincroniza cifrado.</p></div>';
  $("#setName").onchange = e => { state.name = e.target.value.trim() || "Recluta"; save(); toast("¡A la orden, " + state.name + "!"); };
  $("#setDark").onclick = () => { const d = document.documentElement.classList.toggle("dark"); store.set("dark", d); vAjustes(); };
  $("#setSound").onclick = () => { state.sound = (state.sound === false) ? true : false; save(); vAjustes(); };
  $("#setAuto").onclick = () => { state.opts = state.opts || {}; state.opts.auto = (state.opts.auto === false) ? true : false; save(); vAjustes(); toast(state.opts.auto ? "⏩ Avance activado: al acertar, sola" : "Avance manual: tú das a Siguiente"); };
  $("#setReset").onclick = () => { if (confirm("¿Borrar todo tu progreso en este dispositivo?")) { store.del("state"); location.reload(); } };
}

/* ---- router ---- */
const TABS = { home: "home", entrenar: "entrenar", test: "entrenar", results: "entrenar", tema: "entrenar", bloque: "entrenar", fallos: "entrenar", temario: "temario", stats: "stats", mas: "mas", ranking: "mas", baremo: "mas", fisicas: "mas", ajustes: "mas", cards: "mas", exams: "mas", plan: "mas", duelo: "mas", logros: "mas", diario: "entrenar", custom: "entrenar", srs: "entrenar", maraton: "entrenar", esquemas: "mas", normas: "mas", biblio: "mas", consulta: "mas", apoya: "mas", cuenta: "mas" };
/* ===== ☕ aviso de apoyo (suave, con permiso y en el momento justo) =====
   - Solo si hay URL de donación REAL y el usuario no ha apoyado (flag del servidor o su palabra).
   - Nunca antes de 3 sesiones (primero damos, luego pedimos).
   - Máx. 1 vez cada 7 días; "ya colaboro" lo calla 90; nunca interrumpe un test. */
function donaURL() { const D = window.GALON_DONATE || {}; return D.kofi || D.paypal || ""; }
function donaPuede() {
  if (!donaURL()) return false;
  if (window.soyCafetero) return false;
  const d = state.donation || {};
  const hoy = Date.now();
  if (d.off && hoy - d.off < 90 * 864e5) return false;
  if ((d.later && hoy - d.later < 7 * 864e5) || (d.last && hoy - d.last < 7 * 864e5)) return false;
  if (Object.keys(state.history || {}).length < 3) return false;
  return true;
}
function donaTarjeta() {
  if (!donaPuede()) return;
  const host = $("#view");
  if (!host || $("#donaCard")) return;
  const c = document.createElement("div");
  c.className = "card"; c.id = "donaCard";
  c.style.cssText = "margin-top:14px;border-left:4px solid var(--gold)";
  c.innerHTML = '<h3>☕ Que el que venga detrás lo tenga igual</h3>' +
    '<p class="small">A LA ORDEN es gratis y lo seguirá siendo: sin muros ni planes. Lo sostiene la propia tropa — los que ya llevan galón o van a por él — con un café voluntario. Tu café paga el dominio y el servidor; el estudio, gratis de por vida.</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
    '<button class="btn btn-gold btn-sm" id="donaSi">☕ Invitar a un café</button>' +
    '<button class="btn btn-ghost btn-sm" id="donaYa">🫡 Ya colaboro</button>' +
    '<button class="btn btn-ghost btn-sm" id="donaNo">Ahora no</button></div>';
  host.appendChild(c);
  $("#donaSi").onclick = () => { state.donation.last = Date.now(); save(); window.open(donaURL(), "_blank", "noopener"); c.remove(); toast("☕ ¡Gracias de corazón!"); };
  $("#donaYa").onclick = () => { state.donation.off = Date.now(); save(); c.remove(); toast("🫡 De corazón. Aquí seguirá todo gratis."); };
  $("#donaNo").onclick = () => { state.donation.later = Date.now(); save(); c.remove(); };
}

function descargaArchivo(nombre, contenido, tipo) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  a.download = nombre; a.click();
}
/* ===== Mi presentación (tramitador de convocatoria) =====
   Honestidad: A LA ORDEN NO tramita oficialmente (la instancia se presenta en la sede
   electrónica de Defensa). Aquí preparamos: fechas reales, checklist personal,
   tus datos y un dossier imprimible. Oficial vs previsto (~) siempre distinguido. */
const TRAMITA = {
  cabo: {
    ico: "🪖", nombre: "Ascenso a Cabo (ET)",
    estado: "PREPARA YA · la I/27 se prevé con bases en otoño 2026 y examen ~febrero 2027. El que llega con el dossier hecho, no corre.",
    prev: true,
    items: [
      { id: "dni", t: "DNI o TIP en vigor", s: "míralo HOY: si caduca antes del examen, pide cita ya" },
      { id: "instancia", t: "Instancia: modelo oficial de las bases", s: "se publica con la convocatoria en el BOD y se presenta por vía electrónica — aviso automático aquí y en @galon_cabo el día que salga" },
      { id: "foto", t: "Fotografía tipo carné", s: "las bases suelen pedir 1 foto reciente; tenla hecha" },
      { id: "servicios", t: "Justificantes de servicios y destino", s: "patrón de años anteriores: se piden a la unidad; localízalos con tiempo" },
      { id: "plan", t: "Plan de estudio en marcha", s: "examen tipo I/25: 50 preguntas (Formación Común + FSE, Geografía e Historia, inglés). Entrena con el Simulacro" }
    ]
  },
  cabo1: {
    ico: "⭐", nombre: "Ascenso a Cabo 1º (ET)",
    estado: "I/26 EN CURSO (oficial): fase presencial en Academias hasta el 9-oct-2026. La siguiente (I/27) se prevé ~1er trimestre 2027.",
    prev: false,
    items: [
      { id: "presencial", t: "Si estás en la fase presencial I/26", s: "presentación uniforme diario «C» antes de las 09:00 (oficial, Res. 551/04582/26)" },
      { id: "dni", t: "DNI o TIP en vigor", s: "míralo HOY: si caduca antes del examen, pide cita ya" },
      { id: "instancia", t: "Instancia: modelo oficial de las bases I/27", s: "aún sin publicar — aviso automático en cuanto salga en el BOD (canal @galon_cabo1)" },
      { id: "foto", t: "Fotografía tipo carné", s: "las bases suelen pedir 1 foto reciente; tenla hecha" },
      { id: "servicios", t: "Justificantes de servicios y destino", s: "patrón de años anteriores: se piden a la unidad; localízalos con tiempo" }
    ]
  },
  perm: {
    ico: "🎯", nombre: "Permanencia (Tropa y Marinería)",
    estado: "SOLICITUDES 2026 CERRADAS (oficial: 18-jun → 7-jul). Examen a la espera de citación oficial. La próxima convocatoria se prevé ~junio 2027.",
    prev: false,
    items: [
      { id: "citacion", t: "Vigila la citación del examen", s: "se publica en el BOD y llega por SEM — aviso automático en @galon_permanencia" },
      { id: "dni", t: "DNI o TIP en vigor", s: "míralo HOY: si caduca antes del examen, pide cita ya" },
      { id: "compromiso", t: "Compromiso de larga duración", s: "la condición de militar de carrera se adquiere el 31-dic-2026 (lo ya convocado, oficial)" },
      { id: "instancia27", t: "Instancia 2027", s: "patrón: convocatoria ~junio 2027; el modelo oficial vendrá en el BOD" },
      { id: "plan", t: "Plan de estudio en marcha", s: "examen de 100 preguntas en 120 min — entrena con el Simulacro de Permanencia" }
    ]
  }
};

function tramitaDe(curso) {
  state.tramita[curso] = state.tramita[curso] || { checks: {}, datos: {} };
  state.tramita[curso].checks = state.tramita[curso].checks || {};
  state.tramita[curso].datos = state.tramita[curso].datos || {};
  return state.tramita[curso];
}

function convosDe(id) {
  const C = window.GALON_CONVOS || { cursos: [] };
  return C.cursos.filter(x => x.id === id)[0] || null;
}

function vTramita() {
  const cards = Object.keys(TRAMITA).map(id => {
    const T = TRAMITA[id], tr = tramitaDe(id), C = convosDe(id);
    const done = T.items.filter(it => tr.checks[it.id]).length;
    const hito1 = C && C.hitos && C.hitos[0] ? esc(C.hitos[0].k) + ": " + esc(C.hitos[0].d) + (C.hitos[0].est ? " ~" : "") : "";
    return '<a class="mode" href="#/tramita/' + id + '"><span class="mi">' + T.ico + '</span><b>' + esc(T.nombre) + '</b><span>' +
      (T.prev ? '⚠️ ' : '') + esc(hito1) + ' · checklist ' + done + '/' + T.items.length + '</span></a>';
  }).join("");
  view().innerHTML =
    '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Mi presentación 🧾</h1></div>' +
    '<p class="small muted">Lo de presentarte a la convocatoria sin agobios: fechas reales, checklist documental, tus datos y un dossier imprimible. A LA ORDEN te prepara y te avisa; la instancia oficial se presenta siempre en la sede electrónica de Defensa.</p>' +
    '<div class="grid2">' + cards + '</div>';
}

function vTramitaCurso(id) {
  const T = TRAMITA[id];
  if (!T) { location.hash = "#/tramita"; return; }
  const tr = tramitaDe(id), C = convosDe(id);
  const done = T.items.filter(it => tr.checks[it.id]).length;
  const INPUT = 'style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:inherit;padding:10px;box-sizing:border-box"';
  const CAMPOS = [["nombre", "Nombre y apellidos"], ["dni", "DNI / TIP"], ["empleo", "Empleo actual"], ["unidad", "Unidad / destino"], ["email", "Email (el del SEM mejor)"], ["telefono", "Teléfono"]];
  const fechas = C && C.hitos ? C.hitos.map(h2 => {
    const ico = h2.ahora ? "⏳" : (h2.est ? "📅" : "✅");
    return '<li style="list-style:none;display:flex;gap:8px;padding:6px 0;border-top:1px dashed var(--line)"><span>' + ico + '</span><div><b>' + esc(h2.k) + '</b><div style="color:var(--muted);font-weight:700;font-size:.92rem">' + esc(h2.d) + (h2.est ? " ~" : "") + '</div></div></li>';
  }).join("") : "";
  view().innerHTML =
    '<div class="view-head"><a class="back" href="#/tramita">←</a><h1>' + T.ico + ' ' + esc(T.nombre) + '</h1></div>' +
    '<div class="card" style="border-left:4px solid ' + (T.prev ? "var(--gold)" : "var(--ok)") + '"><b>' + esc(T.estado) + '</b></div>' +
    (fechas ? '<div class="card" style="margin-top:12px"><h3>🗓 Fechas (' + esc((C || {}).actualizado || "") + ')</h3><ul style="margin:0;padding:0">' + fechas + '</ul><p class="small muted" style="margin-top:8px">~ = prevista según el calendario de años anteriores. Las oficiales, en el BOD.</p></div>' : '') +
    '<div class="card" style="margin-top:12px"><h3>✅ Mi checklist documental (' + done + '/' + T.items.length + ')</h3>' +
    T.items.map(it => '<label style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-top:1px dashed var(--line);cursor:pointer"><input type="checkbox" data-ck="' + it.id + '"' + (tr.checks[it.id] ? " checked" : "") + ' style="margin-top:3px;width:18px;height:18px;accent-color:var(--gold)"><span><b>' + esc(it.t) + '</b><br><span class="small muted">' + esc(it.s) + '</span></span></label>').join("") +
    '</div>' +
    '<div class="card" style="margin-top:12px"><h3>👤 Mis datos (para el dossier)</h3>' +
    CAMPOS.map(p => '<div style="margin-top:8px"><label class="small muted">' + p[1] + '</label><input ' + INPUT + ' data-dt="' + p[0] + '" value="' + esc(tr.datos[p[0]] || "") + '" placeholder="' + p[1] + '"></div>').join("") +
    '<p class="small muted" style="margin-top:6px">Se guarda solo' + (window.cloudUser && window.cloudUser() ? " · y viaja contigo con la cuenta ☁️" : " · en este dispositivo") + '.</p></div>' +
    '<div class="card" style="margin-top:12px"><button class="btn btn-gold btn-sm" id="btnDossier">📄 Descargar mi dossier de presentación (.html)</button>' +
    '<p class="small muted" style="margin-top:6px">Un documento con tus fechas, tu checklist y tus datos: para imprimir, guardar como PDF o enseñar en la unidad. Se actualiza cuando tú actualizas esto.</p></div>' +
    '<p class="small muted" style="margin:14px 4px">⚠️ A LA ORDEN te prepara y te avisa, pero <b>no tramita nada oficialmente</b>: la instancia se presenta en la sede electrónica de Defensa con el modelo de las bases. Cuando salga tu convocatoria, te avisamos aquí y por Telegram.</p>';

  $$("#view [data-ck]").forEach(cb => cb.onchange = () => {
    const tr2 = tramitaDe(id);
    if (cb.checked) tr2.checks[cb.dataset.ck] = 1; else delete tr2.checks[cb.dataset.ck];
    save();
    const n = T.items.filter(it => tr2.checks[it.id]).length;
    toast(n === T.items.length ? "🎉 Checklist completa — dossier listo" : "Checklist " + n + "/" + T.items.length);
  });
  $$("#view [data-dt]").forEach(inp => inp.oninput = () => { tramitaDe(id).datos[inp.dataset.dt] = inp.value.trim(); save(); });
  $("#btnDossier").onclick = () => { descargaArchivo("dossier-presentacion-" + id + ".html", dossierHTML(id), "text/html"); toast("📄 Dossier descargado"); };
}

function dossierHTML(id) {
  const T = TRAMITA[id], tr = tramitaDe(id), C = convosDe(id), d = tr.datos;
  const hoy = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const fechas = C && C.hitos ? C.hitos.map(h2 => "<li style='margin:5px 0'>" + (h2.ahora ? "⏳" : (h2.est ? "📅" : "✅")) + " <b>" + esc(h2.k) + ":</b> " + esc(h2.d) + (h2.est ? " (prevista ~)" : "") + "</li>").join("") : "";
  const checks = T.items.map(it => "<tr>" +
    "<td style='padding:9px 8px;border-bottom:1px solid #e8e2d2;font-size:19px;width:34px'>" + (tr.checks[it.id] ? "✅" : "☐") + "</td>" +
    "<td style='padding:9px 8px;border-bottom:1px solid #e8e2d2'><b>" + esc(it.t) + "</b><br><span style='color:#6f675a;font-size:.9em'>" + esc(it.s) + "</span></td></tr>").join("");
  const datos = [["Nombre y apellidos", d.nombre], ["DNI / TIP", d.dni], ["Empleo actual", d.empleo], ["Unidad / destino", d.unidad], ["Email", d.email], ["Teléfono", d.telefono]]
    .map(p => "<tr><th style='text-align:left;padding:8px;border-bottom:1px solid #e8e2d2;white-space:nowrap;color:#4c5b43'>" + p[0] + "</th><td style='padding:8px;border-bottom:1px solid #e8e2d2'>" + esc(p[1] || "—") + "</td></tr>").join("");
  return "<!doctype html><html lang='es'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Dossier de presentación · " + esc(T.nombre) + "</title></head>" +
    "<body style='margin:0;background:#f4f1e8;color:#2b2b26;font-family:Georgia,serif'>" +
    "<div style='max-width:760px;margin:0 auto;padding:26px 18px'>" +
    "<div style='background:#2f3e2e;color:#fff;border-radius:14px;padding:22px 20px'>" +
    "<div style='font-size:.85rem;letter-spacing:.14em;color:#d9b64e'>A LA ORDEN · TU ACADEMIA DE TROPA</div>" +
    "<h1 style='margin:6px 0 4px;font-size:1.5rem'>" + T.ico + " Mi dossier de presentación</h1>" +
    "<div style='opacity:.9'>" + esc(T.nombre) + "</div></div>" +
    "<div style='background:#fff;border:1px solid #e8e2d2;border-radius:14px;padding:18px;margin-top:14px'><b>" + esc(T.estado) + "</b></div>" +
    (fechas ? "<h2 style='font-size:1.05rem;margin:20px 0 8px;color:#4c5b43'>🗓 Fechas clave</h2><ul style='padding-left:18px;margin:0'>" + fechas + "</ul>" : "") +
    "<h2 style='font-size:1.05rem;margin:20px 0 8px;color:#4c5b43'>✅ Checklist documental</h2>" +
    "<table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8e2d2;border-radius:12px'>" + checks + "</table>" +
    "<h2 style='font-size:1.05rem;margin:20px 0 8px;color:#4c5b43'>👤 Mis datos</h2>" +
    "<table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8e2d2;border-radius:12px'>" + datos + "</table>" +
    "<p style='color:#6f675a;font-size:.88em;margin-top:18px'>Documento de trabajo generado por A LA ORDEN el " + hoy + ". <b>No es una instancia oficial</b> ni sustituye a la presentación en la sede electrónica de Defensa: usa siempre el modelo de las bases publicadas en el Boletín Oficial de Defensa. Las fechas marcadas con ~ son previstas según el calendario de años anteriores.</p>" +
    "</div></body></html>";
}

function vRincon() {
  const c = COURSES[state.course];
  const lvl = level();
  const weak = weakTopics(state.course).slice(0, 3);
  const ids = Object.keys(state.stars).filter(id => state.stars[id] && byId[id] && byId[id].c === state.course);
  const nota = (state.notes[state.course] || "");
  view().innerHTML =
    '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Mi rincón 📌</h1></div>' +
    '<div class="score-hero" style="padding:18px"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">' + esc(c.badge) + ' · NIVEL ' + lvl + '</span>' +
    '<div class="num" style="font-size:1.5rem">' + state.xp + ' XP</div>' +
    '<div class="small" style="opacity:.85">🔥 ' + state.streak + ' días de racha · ' + Object.keys(state.history).length + ' sesiones registradas</div></div>' +
    '<div class="card" style="margin-top:12px"><h3>⭐ Mis preguntas guardadas (' + ids.length + ')</h3>' +
    (ids.length ? '<p class="small muted">Las que marcaste con ☆ durante los tests: tu lista personal de las que más se te resisten.</p><button class="btn btn-gold btn-sm" id="btnStars">Estudiar mis ⭐ (' + Math.min(ids.length, 30) + ')</button>' : '<p class="small muted">Durante un test, pulsa ☆ Guardar y la pregunta aparecerá aquí para repasarla cuando quieras.</p>') + '</div>' +
    '<div class="card" style="margin-top:12px"><h3>⚠️ Por donde voy flojo</h3>' +
    (weak.length ? weak.map(w => '<div class="topic-row"><span>· ' + esc(w.t) + ' (' + w.acc + '%)</span></div>').join("") : '<p class="small muted">Sin datos aún: haz un test y aquí verás tus temas flojos.</p>') + '</div>' +
    '<div class="card" style="margin-top:12px"><h3>📓 Mi cuaderno</h3>' +
    '<textarea id="notas" rows="7" placeholder="Apunta lo que te cueste: reglas mnemotécnicas, cifras, dudas para el sargento…" style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:inherit;padding:10px;box-sizing:border-box">' + esc(nota) + '</textarea>' +
    '<p class="small muted" id="notasOk" style="margin-top:6px">Se guarda solo · ' + (window.cloudUser && window.cloudUser() ? "y viaja contigo con la cuenta ☁️" : "en este dispositivo (con cuenta, viaja a la nube)") + '</p></div>' +
    '<div class="card" style="margin-top:12px"><h3>⬇️ Descargas de estudio</h3>' +
    '<button class="btn btn-green btn-sm" id="btnResumen">📄 Mi resumen de estudio (.html)</button>' +
    '<p class="small muted" style="margin-top:6px">Tu progreso, tus temas flojos, tu cuaderno y tus ⭐ con la respuesta correcta, en un documento que puedes abrir, imprimir o guardar como PDF. Los esquemas también se descargan desde <a href="#/esquemas">Esquemas</a>.</p></div>';
  if (ids.length) $("#btnStars").onclick = () => startTest({ course: state.course, fixed: ids.slice(0, 30), mode: "study", label: "Mis ⭐" });
  const ta = $("#notas");
  let tId = null;
  ta.oninput = () => { clearTimeout(tId); tId = setTimeout(() => { state.notes[state.course] = ta.value; save(); const ok = $("#notasOk"); if (ok) ok.innerHTML = "Guardado ✔ · " + (window.cloudUser && window.cloudUser() ? "se sincroniza con tu cuenta ☁️" : "guardado en este dispositivo"); }, 500); };
  $("#btnResumen").onclick = () => {
    const d = new Date().toLocaleDateString("es-ES");
    const estrella = ids.map(id => { const q = byId[id]; return "<li><b>" + esc(q.q) + "</b><br>✔ " + esc(q.o[q.a]) + "<br><i>" + esc(q.x || "") + "</i></li>"; }).join("");
    const html = "<!doctype html><html lang='es'><head><meta charset='utf-8'><title>A LA ORDEN · Mi resumen de estudio</title>" +
      "<style>body{font-family:system-ui,Arial;max-width:720px;margin:24px auto;padding:0 16px;color:#1d2a21}h1{color:#143d26}h2{border-bottom:2px solid #c9971f;padding-bottom:4px;margin-top:28px}li{margin:10px 0}i{color:#5f6f63}.muted{color:#5f6f63}</style></head><body>" +
      "<h1>▲ A LA ORDEN · Mi resumen de estudio</h1><p class='muted'>" + esc(c.name) + " · " + d + " · Nivel " + lvl + " · " + state.xp + " XP · racha " + state.streak + " días</p>" +
      "<h2>Por donde voy flojo</h2>" + (weak.length ? "<ul>" + weak.map(w => "<li>" + esc(w.t) + " — " + w.acc + "% de acierto</li>").join("") + "</ul>" : "<p>Sin datos aún.</p>") +
      "<h2>Mi cuaderno</h2><pre style='white-space:pre-wrap;font-family:inherit'>" + esc(nota || "(vacío)") + "</pre>" +
      "<h2>Mis preguntas guardadas (" + ids.length + ")</h2>" + (estrella ? "<ul>" + estrella + "</ul>" : "<p>Ninguna todavía.</p>") +
      "<p class='muted'>Generado por A LA ORDEN · gratis siempre, con auditoría pública de calidad.</p></body></html>";
    descargaArchivo("galon-resumen-" + state.course + ".html", html, "text/html");
    toast("📄 Resumen descargado: ábrelo y, si quieres, imprímelo en PDF");
  };
}

function render() {
  const h = (location.hash || "#/home").replace("#/", "");
  stopTimer();
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  $$("#tabbar a").forEach(a => a.classList.toggle("on", a.getAttribute("data-tab") === (TABS[h] || "home")));
  window.scrollTo(0, 0);
  if (h === "home") vHome();
  else if (h === "entrenar") vTrain();
  else if (h === "tema") vPick("tema");
  else if (h === "bloque") vPick("bloque");
  else if (h === "fallos") vFallos();
  else if (h === "test") vTest();
  else if (h === "results") { vResults(); donaTarjeta(); }
  else if (h === "stats") vStats();
  else if (h === "temario") vTemario();
  else if (h === "ranking") vRanking();
  else if (h === "baremo") vBaremo();
  else if (h === "rincon") vRincon();
  else if (h.indexOf("tramita") === 0) (h.indexOf("/") > 0 ? vTramitaCurso(h.split("/")[1]) : vTramita());
  else if (h === "fisicas") vFisicas();
  else if (h === "mas") vMas();
  else if (h === "ajustes") vAjustes();
  else if (h === "cards") vCards();
  else if (h === "exams") vExams();
  else if (h === "plan") vPlan();
  else if (h === "duelo") vDuelo();
  else if (h === "trivial") {
    if (window.vTrivial) { try { window.vTrivial(); } catch (e) { toast("Fallo en el trivial: " + (e && e.message ? e.message : "?")); } }
    else if (!window.__cargandoTrivial) { /* sin bucles: inyecta el módulo y reintenta UNA vez */
      window.__cargandoTrivial = true;
      toast("Cargando el trivial…");
      const sc = document.createElement("script");
      sc.src = "js/trivial.js?v=70";
      sc.onload = () => { window.__cargandoTrivial = false; render(); };
      sc.onerror = () => { window.__cargandoTrivial = false; toast("Cierra y abre la app para actualizar la caché"); };
      document.head.appendChild(sc);
    }
  }
  else if (h === "logros") vLogros();
  else if (h === "diario") vDiario();
  else if (h === "custom") vCustom();
  else if (h === "srs") vSRS();
  else if (h === "maraton") vMaraton();
  else if (h === "esquemas") vEsquemas();
  else if (h === "normas") vNormas();
  else if (h === "biblio") vBiblio();
  else if (h === "consulta") vConsulta();
  else if (h === "apoya") vApoya();
  else if (h === "cuenta" && window.vCuenta) window.vCuenta();
  else vHome();
}
window.addEventListener("hashchange", render);
paintChips();
if (window.GalonCloudInit) window.GalonCloudInit();
render();
})();
