/* MICABO · TRIVIAL DE LA TROPA v2 — tablero clásico retocado
   · SIEMPRE eliges casilla tú: el dado saca un COLOR y tú tocas la casilla que brilla (aunque haya solo una).
   · La pregunta SIEMPRE se abre en ventana central (estilos propios inyectados: no depende del CSS de la app).
   · Tablero completo dentro del lienzo (nada cortado por abajo), ficha con movimiento suave.
   Solitario o por código (misma semilla: mismo dado y mismas preguntas; gana quien acabe en menos tiradas). */
(function () {
  /* CAPTURA PEREZOSA del puente: este módulo carga ANTES que app.js (que crea window.AO),
     así que el puente se resuelve en cada uso, no al cargar el fichero. */
  const AOg = () => window.AO || {};
  const st = () => { const A = AOg(); return A.stateRef ? A.stateRef() : null; };
  const view = () => { const A = AOg(); return A.view ? A.view() : document.querySelector("#view"); };
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = t => String(t == null ? "" : t).replace(/[&<>\"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- estilos propios del módulo (inyectados una vez: a prueba de cachés y CSS externo) ---- */
  if (!document.getElementById("tv2-style")) {
    const s = document.createElement("style"); s.id = "tv2-style";
    s.textContent =
      ".tv-wrap{max-width:470px;margin:0 auto;padding:4px 8px 30px;display:flex;flex-direction:column;align-items:center}" +
      ".tv-board{width:min(94vw,440px);height:auto;display:block;filter:drop-shadow(0 12px 26px rgba(0,0,0,.45));border-radius:24px}" +
      ".tv-cell rect{transition:opacity .25s}" +
      ".tv-cell{cursor:default}.tv-cell.dest{cursor:pointer}" +
      ".tv-cell.dest rect{stroke:#fff;stroke-width:3.4;animation:tvPulse .95s ease-in-out infinite;filter:drop-shadow(0 0 7px rgba(255,255,255,.85))}" +
      ".tv-cell.dim{opacity:.22}" +
      "@keyframes tvPulse{0%,100%{opacity:1}50%{opacity:.55}}" +
      "#tvTok{transition:transform .45s cubic-bezier(.22,.9,.32,1.25)}" +
      ".tv-hud{width:100%;margin-top:12px;display:flex;flex-direction:column;align-items:center;gap:8px}" +
      ".tv-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}" +
      ".tv-chip{display:inline-flex;align-items:center;gap:4px;border:1.5px solid var(--line,#33406b);border-radius:999px;padding:3px 10px;font-size:.68rem;font-weight:700;background:rgba(255,255,255,.03)}" +
      ".tv-chip.on{color:#101830!important;border-color:transparent}" +
      ".tv-stats{font-size:.86rem;color:var(--muted,#9fb0d8);text-align:center}" +
      ".tv-log{min-height:26px;text-align:center;font-size:.94rem;margin-top:2px;line-height:1.4}" +
      ".tv-dado{width:78px;height:78px;border:none;border-radius:22px;cursor:pointer;font-size:2.1rem;line-height:1;" +
      "background:linear-gradient(145deg,#ffffff,#d9e1f2);color:#101830;position:relative;" +
      "box-shadow:0 9px 22px rgba(0,0,0,.45),inset 0 -4px 0 rgba(0,0,0,.12),inset 0 2px 0 rgba(255,255,255,.9);" +
      "transition:transform .12s,box-shadow .12s}" +
      ".tv-dado:active{transform:scale(.9) rotate(-4deg);box-shadow:0 4px 10px rgba(0,0,0,.4)}" +
      ".tv-dado:disabled{filter:grayscale(.75);opacity:.55}" +
      ".tv-dado small{display:block;font-size:.56rem;font-weight:800;letter-spacing:.12em;color:#5a6a95;margin-top:2px}" +
      ".tv-rival{text-align:center;margin-top:2px}" +
      /* ---- ventana de pregunta (auto-suficiente) ---- */
      ".tv-bg{position:fixed;inset:0;z-index:9999;background:rgba(4,9,22,.74);backdrop-filter:blur(5px);" +
      "display:flex;align-items:center;justify-content:center;padding:18px;animation:tvFade .18s;touch-action:none}" +
      ".tv-card{width:100%;max-width:432px;max-height:86vh;overflow-y:auto;overscroll-behavior:contain;" +
      "background:linear-gradient(180deg,#1a2549,#101830 62%);border:1.5px solid rgba(217,182,78,.55);border-radius:20px;" +
      "box-shadow:0 26px 70px rgba(0,0,0,.6);animation:tvPop .22s cubic-bezier(.2,.9,.3,1.25)}" +
      ".tv-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:18px 18px 0 0}" +
      ".tv-head .ico{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex:0 0 34px}" +
      ".tv-head .nm{font-weight:800;font-size:.98rem;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.35)}" +
      ".tv-head .no{margin-left:auto;font-size:.66rem;font-weight:800;letter-spacing:.14em;background:rgba(0,0,0,.28);color:#ffe9a8;border-radius:999px;padding:4px 10px}" +
      ".tv-q{padding:13px 18px 2px;margin:0;font-size:1.04rem;font-weight:700;line-height:1.45;color:#f2f5ff}" +
      ".tv-opts{padding:10px 14px 4px;display:flex;flex-direction:column;gap:8px}" +
      ".tv-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px 12px;border-radius:13px;" +
      "background:#1b2a55;border:1.5px solid rgba(255,255,255,.11);color:#eef2ff;font-weight:600;font-size:.95rem;line-height:1.35;cursor:pointer;transition:transform .07s}" +
      ".tv-opt:active{transform:scale(.98)}" +
      ".tv-opt .lt{flex:0 0 27px;height:27px;border-radius:50%;background:rgba(255,255,255,.13);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.82rem}" +
      ".tv-opt.ok{background:linear-gradient(180deg,#1d7a46,#155c34);border-color:#38cf82}" +
      ".tv-opt.ko{background:linear-gradient(180deg,#7c2130,#5c1622);border-color:#e2556b;animation:tvShake .35s}" +
      ".tv-opt:disabled{cursor:default;opacity:.92}" +
      "@keyframes tvShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}60%{transform:translateX(5px)}}" +
      ".tv-expl{margin:6px 14px 0;background:rgba(217,182,78,.09);border:1px solid rgba(217,182,78,.38);border-radius:13px;padding:11px 13px;font-size:.9rem;line-height:1.55;color:#e8ecfa}" +
      ".tv-expl b{color:#ffd97a}" +
      ".tv-expl .fuente{display:block;margin-top:6px;font-size:.72rem;color:#9fb0d8}" +
      ".tv-foot{padding:13px 14px 16px;display:flex;justify-content:center;gap:10px}" +
      ".tv-btn{border:none;border-radius:13px;padding:12px 22px;font-weight:800;font-size:.95rem;cursor:pointer;color:#101830;" +
      "background:linear-gradient(145deg,#ffe08a,#d9b64e);box-shadow:0 6px 16px rgba(217,182,78,.35);transition:transform .1s}" +
      ".tv-btn:active{transform:scale(.95)}" +
      ".tv-btn.green{background:linear-gradient(145deg,#4fd68f,#2aa163);color:#07230f}" +
      "@keyframes tvFade{from{opacity:0}to{opacity:1}}" +
      "@keyframes tvPop{from{opacity:0;transform:scale(.9) translateY(12px)}to{opacity:1;transform:none}}" +
      "";
    document.head.appendChild(s);
  }

  /* ---- categorías (colores tipo tablero clásico, temas del examen) ---- */
  const CATS = [
    { n: "Armamento", c: "#d84b9b", c2: "#8f2b64", e: "🪖", t: ["Armamento y tiro", "Armamento", "Tiro"] },
    { n: "Primeros auxilios", c: "#37a86b", c2: "#1f6f45", e: "🚑", t: ["Primeros auxilios", "NBQ"] },
    { n: "OTAN y UE", c: "#8a5a3b", c2: "#5c3a24", e: "🌍", t: ["OTAN y UE", "Logística", "Instrucción cívica"] },
    { n: "Topografía", c: "#2f9de2", c2: "#1c6395", e: "🧭", t: ["Topografía"] },
    { n: "Transmisiones", c: "#e2762d", c2: "#964a17", e: "📡", t: ["Transmisiones"] },
    { n: "Reales Ordenanzas", c: "#f2c11b", c2: "#a8840e", e: "📜", t: ["Reales Ordenanzas", "Carrera militar", "Régimen Disciplinario"] }
  ];

  /* ---- tablero: hub + 6 radios × 6 casillas + anillo de 18 — TODO dentro del lienzo 440×440 ---- */
  const C = 220, RADS = [58, 84, 110, 136, 162, 188];   /* última casilla a 188: +19 de alto = 427 < 440, nada se corta */
  const NODES = {};
  function addNode(id, cat, x, y, opts) { NODES[id] = Object.assign({ id, cat, x, y, adj: [], hq: false, hub: false, ang: 0 }, opts || {}); }
  function link(a, b) { if (NODES[a] && NODES[b]) { NODES[a].adj.push(b); NODES[b].adj.push(a); } }
  (function build() {
    addNode("H", -1, C, C, { hub: true });
    for (let k = 0; k < 6; k++) {
      const a = (-90 + k * 60) * Math.PI / 180;
      for (let i = 1; i <= 6; i++) {
        const id = "s" + k + "_" + i;
        const cat = i === 6 ? k : (k + i) % 6;             /* el radio k termina en la sede de la cat k */
        addNode(id, cat, C + Math.cos(a) * RADS[i - 1], C + Math.sin(a) * RADS[i - 1], { hq: i === 6, ang: -90 + k * 60 });
        if (i === 1) link("H", id); else link("s" + k + "_" + (i - 1), id);
      }
      /* anillo: 3 casillas entre sede k y sede k+1 */
      for (let j = 1; j <= 3; j++) {
        const id = "r" + k + "_" + j;
        const ang = -90 + k * 60 + j * 15;
        const rad = ang * Math.PI / 180;
        addNode(id, (k + j * 2) % 6, C + Math.cos(rad) * 188, C + Math.sin(rad) * 188, { ang: ang + 90 });
        if (j === 1) link("s" + k + "_6", id); else link("r" + k + "_" + (j - 1), id);
        if (j === 3) link(id, "s" + ((k + 1) % 6) + "_6");
      }
    }
  })();

  /* ---- azar determinista (misma semilla = misma partida para los dos rivales) ---- */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  let G = null, SV = null;

  /* FALLBACK AUTOSUFICIENTE: si el puente no da preguntas (app vieja, puente ausente…),
     el trivial lee los bancos crudos directamente (mismos filtros que el motor). */
  function bancoCrudo(curso) {
    const V = window.VERDICTS || {};
    return [].concat(window.QUESTIONS || [], window.QUESTIONS2 || [], window.QUESTIONS3 || [], window.QUESTIONS4 || [], window.QUESTIONS5 || [], window.QUESTIONS6 || [], window.QUESTIONS7 || [], window.QUESTIONS8 || [], window.QUESTIONS9 || [], window.QUESTIONS10 || [], window.QUESTIONS11 || [], window.QUESTIONS12 || [], window.QUESTIONS13 || [], window.QUESTIONS14 || [], window.QUESTIONS15 || [], window.QUESTIONS16 || [], window.QUESTIONS17 || [], window.QUESTIONS18 || [], window.QUESTIONS19 || [], window.QUESTIONS20 || [], window.QUESTIONS21 || [], window.QUESTIONS22 || [], window.QUESTIONS23 || [], window.QUESTIONS24 || [], window.QUESTIONS25 || [], window.QUESTIONS26 || [], window.QUESTIONS27 || [], window.QUESTIONS28 || [])
      .filter((q, i, a) => a.findIndex(x => x && x.id === q.id) === i)
      .filter(q => q && q.c === curso && q.o && q.o.length === 4 && typeof q.a === "number" && q.status !== "borrador" && q.gen !== true && !(V[q.id] && V[q.id].v === "ko"));
  }
  function poolsFor(curso) {
    const A = AOg();
    const cur = curso || (st() && st().course) || "cabo";
    let all = ((A.bank && st()) ? A.bank(cur) : []);
    if (!all || !all.length) all = bancoCrudo(cur);   /* red de seguridad definitiva */
    all = all.filter(q => q.o && q.o.length === 4);
    const pools = CATS.map(c => all.filter(q => c.t.indexOf(q.t) >= 0));
    const total = pools.reduce((s, p) => s + p.length, 0);
    if (total < 60) { /* curso con pocos temas: reparto equitativo de todo el banco */
      const rep = CATS.map(() => []);
      all.forEach((q, i) => rep[i % 6].push(q));
      return rep;
    }
    return pools;
  }

  function nuevaPartida(modo, sala) {
    G = {
      modo: modo || "solo",
      sala: sala || null,          /* {codigo, rol, seed, curso} */
      seed: sala ? sala.seed : Math.floor(Math.random() * 2147483647),
      rng: null, tirada: 0, dado: null, dests: null, destElegida: null, posPrev: null, abierto: false,
      pos: "s0_1", wedges: {}, aciertos: 0, preguntas: 0, usadas: {},
      fin: false, gano: false, enviadoFin: false, pollT: null
    };
    G.rng = mulberry32(G.seed);
    G.curso = (st() && st().course) || "cabo";   /* pureza: TODO el trivial usa el curso de la partida */
    G.pools = poolsFor(G.curso);
    renderBoard();
  }

  /* ---- dado y movimiento: el dado saca COLOR, el jugador ELIGE casilla siempre ---- */
  function tirar() {
    if (!G || G.fin || G.dado != null || G.abierto) return;
    if (document.querySelector(".tv-bg")) return;
    G.tirada++;
    const v = G.rng();
    G.dado = Math.floor(v * 6);
    G.preguntas++; /* cada tirada trae su pregunta (secuencia fijada por la semilla) */
    pintarDado();
    G.dests = destinos(G.pos, G.dado);
    if (!G.dests.length) {
      toastT("Sin casillas de ese color alcanzable: tirada perdida");
      G.dado = null; refrescaHUD();
      return;
    }
    marcarDests(true);
    const lg = $("#tvLog");
    if (lg) lg.innerHTML = "Dado: <b style='color:" + CATS[G.dado].c + "'>" + CATS[G.dado].e + " " + esc(CATS[G.dado].n) + "</b> · <b>toca TÚ</b> la casilla que brilla " + (G.dests.length > 1 ? "(" + G.dests.length + " posibles)" : "(solo hay una, pero la eliges tú)");
  }
  function destinos(desde, color) {
    const conTodas = Object.keys(G.wedges).length >= 6;
    const seen = {}, out = [], cola = [[desde, 0]];
    seen[desde] = 1;
    while (cola.length && out.length < 4) {
      const [id, d] = cola.shift();
      for (const nb of NODES[id].adj) {
        if (seen[nb]) continue;
        seen[nb] = 1;
        const N = NODES[nb];
        const ok = N.hub ? conTodas : (N.cat === color);
        if (ok) { out.push(nb); if (out.length >= 4) break; continue; } /* aterriza: no se atraviesa */
        if (!N.hub) cola.push([nb, d + 1]); /* el centro solo se pisa con los 6 quesitos */
      }
    }
    return out;
  }
  function elegirDest(id) {
    if (!G || G.fin || G.abierto || G.dado == null) return;
    if (!G.dests || G.dests.indexOf(id) < 0) return;
    if (document.querySelector(".tv-bg")) return;      /* una pregunta cada vez: NUNCA doble ventana */
    G.abierto = true;
    G.destElegida = id;
    marcarDests(false);
    G.posPrev = G.pos;
    G.pos = id;            /* la ficha avanza YA: si fallas, vuelve atrás */
    moverToken();
    preguntar(G.dado);
  }

  /* ---- preguntas ---- */
  function preguntar(cat) {
    /* red de seguridad: si TODOS los pools están vacíos (puente no disponible al empezar), reconstruir ahora */
    if (!G.pools.some(pp => pp && pp.length)) G.pools = poolsFor(G.curso);
    let pool = G.pools[cat] && G.pools[cat].length ? G.pools[cat] : G.pools[(cat + 3) % 6];
    if (!pool || !pool.length) pool = CATS.map((c, i) => G.pools[i]).find(p2 => p2.length) || [];
    if (!pool.length) { G.abierto = false; G.dado = null; toastT("Sin preguntas disponibles para ese curso"); return; }
    let idx = Math.floor(G.rng() * pool.length);
    let q = pool[idx % pool.length];
    const clave = cat + ":" + q.id;
    if (G.usadas[clave]) { q = pool[(idx + 1 + Math.floor(G.rng() * (pool.length - 1 || 1))) % pool.length]; }
    G.usadas[clave] = 1;
    G.q = q; G.qCat = cat;
    const orden = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(G.rng() * (i + 1)); const t = orden[i]; orden[i] = orden[j]; orden[j] = t; }
    G.orden = orden;
    abreModal({
      titulo: "Pregunta " + G.preguntas,
      cat, q, orden,
      alResponder: (elegida) => responder(elegida, q, cat)
    });
  }
  function abreModal(o) {
    cierraModal();
    const bg = document.createElement("div");
    bg.className = "tv-bg";
    bg.innerHTML = '<div class="tv-card" role="dialog" aria-modal="true">' +
      '<div class="tv-head" style="background:linear-gradient(90deg,' + CATS[o.cat].c2 + "," + CATS[o.cat].c + ')">' +
      '<span class="ico">' + CATS[o.cat].e + '</span><span class="nm">' + esc(CATS[o.cat].n) + '</span><span class="no">' + esc(o.titulo) + "</span></div>" +
      '<p class="tv-q">' + esc(o.q.q) + "</p>" +
      '<div class="tv-opts">' + o.orden.map((oi, pos) => '<button class="tv-opt" data-o="' + oi + '"><span class="lt">' + "ABCD"[pos] + "</span><span>" + esc(o.q.o[oi]) + "</span></button>").join("") + "</div>" +
      '<div id="tvExpl"></div><div class="tv-foot" id="tvFoot"></div></div>';
    document.body.appendChild(bg);
    $$(".tv-bg .tv-opt").forEach(b => b.onclick = () => {
      $$(".tv-bg .tv-opt").forEach(x => { x.disabled = true; });
      o.alResponder(parseInt(b.getAttribute("data-o"), 10));
    });
  }
  function cierraModal() { $$(".tv-bg").forEach(b => b.remove()); }
  function pintaResultado(q, ok, elegida, extra, boton, alCont) {
    $$(".tv-bg .tv-opt").forEach(b => {
      const i = parseInt(b.getAttribute("data-o"), 10);
      if (i === q.a) b.classList.add("ok"); else if (i === elegida) b.classList.add("ko");
    });
    const ex = $("#tvExpl");
    if (ex) ex.innerHTML = '<div class="tv-expl"><b>' + (ok ? "¡Correcta! ✅" : "❌ Fallada — la buena es la " + "ABCD"[q.a] + ": " + esc(q.o[q.a])) + "</b>" + (extra || "") + "<br>" + esc(q.x) + '<span class="fuente">📖 ' + esc(q.r || "Banco MICABO") + "</span></div>";
    const ft = $("#tvFoot");
    if (ft) { ft.innerHTML = '<button class="tv-btn ' + (ok ? "green" : "") + '" id="tvGo">' + boton + "</button>"; $("#tvGo").onclick = alCont; }
  }
  function responder(elegida, q, cat) {
    const ok = elegida === q.a;
    if (ok) { G.aciertos++; try { sfxGood(); } catch (e) {} } else { try { sfxBad(); } catch (e) {} }
    const N = NODES[G.destElegida];
    let extra = "";
    if (ok) {
      if (N.hq) { G.wedges[N.cat] = 1; extra = "<br>🧩 <b>Quesito conseguido: " + esc(CATS[N.cat].n) + "!</b>"; }
      if (N.hub) { pintaResultado(q, true, elegida, "", "🏆 Pregunta final", () => { cierraModal(); G.abierto = false; final(); }); refrescaHUD(); if (G.modo === "sala") informa(); return; }
    } else {
      G.pos = G.posPrev != null ? G.posPrev : G.pos;   /* fallo: la ficha vuelve a su casilla */
      moverToken();
    }
    pintaResultado(q, ok, elegida, extra, ok ? "🎲 Tira de nuevo" : "➡️ Siguiente tirada", () => {
      cierraModal();
      G.abierto = false; G.dado = null; G.destElegida = null;
      if (G.tirada >= 60 && !G.fin) finPartida(false, true);
      else if (G.modo === "sala") informa();
      refrescaHUD();
      const lg = $("#tvLog");
      if (lg && !G.fin) lg.textContent = ok ? "¡Otra tirada! 🎲" : "Turno siguiente… 🎲";
    });
    refrescaHUD();
    if (G.modo === "sala") informa();
  }
  function final() {
    const cat = Math.floor(G.rng() * 6);
    const pool = G.pools[cat].length ? G.pools[cat] : G.pools[0];
    const q = pool[Math.floor(G.rng() * pool.length)];
    G.q = q;
    abreModal({
      titulo: "🎖️ PREGUNTA FINAL", cat, q, orden: [0, 1, 2, 3],
      alResponder: (elegida) => {
        const ok = elegida === q.a;
        pintaResultado(q, ok, elegida, "", ok ? "Ver victoria 🏆" : "Ver resultado", () => { cierraModal(); G.abierto = false; finPartida(ok, false); });
      }
    });
  }

  /* ---- fin y servidor ---- */
  function finPartida(gano, cap) {
    G.fin = true; G.gano = !!gano; G.dado = null;
    const msg = gano ? "🏆 ¡VICTORIA! Tablero completo en " + G.tirada + " tiradas" : (cap ? "⏱️ Fin: 60 tiradas · " + Object.keys(G.wedges).length + "/6 quesitos" : "😞 La final te ha caído… ¡otra ronda!");
    const lg = $("#tvLog"); if (lg) lg.innerHTML = "<b>" + msg + "</b>";
    const btn = $("#tvDado"); if (btn) btn.disabled = true;
    if (st()) { st().xp += gano ? 50 : 5; const A = AOg(); if (A.save) A.save(); }
    if (G.modo === "sala") { G.enviadoFin = true; informa(true); }
    else {
      try {
        const best = parseInt(localStorage.getItem("trivialBest") || "999", 10);
        if (gano && G.tirada < best) { localStorage.setItem("trivialBest", String(G.tirada)); if (lg) lg.innerHTML += "<br>🥇 ¡Tu mejor marca! (" + G.tirada + " tiradas)"; }
      } catch (e) {}
      if (lg) lg.innerHTML += '<br><button class="tv-btn" id="tvOtra" style="margin-top:8px">🔁 Otra partida</button>';
      const ot = $("#tvOtra"); if (ot) ot.onclick = () => nuevaPartida("solo");
    }
    refrescaHUD();
  }
  function informa(fin) {
    if (!G || G.modo !== "sala" || !G.sala) return;
    fetch("/api/trivial/estado", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo: G.sala.codigo, jugador: (st() && st().name) || "Anónimo", wedges: Object.keys(G.wedges).length, tiradas: G.tirada, aciertos: G.aciertos, fin: !!fin || G.fin }) }).catch(() => {});
  }
  function sondear() {
    if (!G || G.modo !== "sala" || !G.sala) return;
    fetch("/api/trivial/ver?codigo=" + encodeURIComponent(G.sala.codigo) + "&u=" + encodeURIComponent((st() && st().name) || "")).then(r => r.json()).then(v => {
      if (!v || v.error) return;
      const riv = G.sala.rol === "de" ? v.para : v.de;
      const el = $("#tvRival");
      if (el && riv) el.innerHTML = "⚔️ <b>" + esc(riv.nombre) + "</b>: 🧩 " + riv.wedges + "/6 · " + riv.tiradas + " tiradas" + (riv.fin ? " · ¡TERMINÓ!" : "");
      if (v.ganador && G.fin) {
        const empate = v.ganador === "";
        const lg = $("#tvLog");
        if (lg) lg.innerHTML = empate ? "🤝 ¡Empate táctico!" : (v.ganador === ((st() && st().name) || "Anónimo") ? "🏆 ¡VICTORIA en " + G.tirada + " tiradas!" : "😔 Ganó " + esc(v.ganador) + " · revancha cuando quieras");
      }
    }).catch(() => {});
  }

  /* ---- pintado ---- */
  function pie(k, r0, r1, a0, a1, fill, op) {
    const p = (r, a) => (C + Math.cos(a) * r).toFixed(1) + " " + (C + Math.sin(a) * r).toFixed(1);
    return '<path d="M' + p(r1, a0) + " A" + r1 + " " + r1 + " 0 0 1 " + p(r1, a1) + " L" + p(r0, a1) + " A" + r0 + " " + r0 + " 0 0 0 " + p(r0, a0) + ' Z" fill="' + fill + '"' + (op ? ' opacity="' + op + '"' : "") + "/>";
  }
  function cellSVG(N) {
    const k = N.cat;
    const w = N.hq ? 26 : (N.id[0] === "r" ? 24 : 22), h = N.hq ? 38 : (N.id[0] === "r" ? 24 : 30);
    const extra = N.hq ? '<text x="0" y="6" font-size="14" text-anchor="middle">⭐</text>' : "";
    return '<g id="n' + N.id + '" class="tv-cell" data-id="' + N.id + '" transform="translate(' + N.x.toFixed(1) + "," + N.y.toFixed(1) + ") rotate(" + (N.ang || 0) + ')">' +
      '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="6.5" fill="url(#tg' + k + ')" stroke="rgba(4,10,26,.55)" stroke-width="1.6"/>' + extra + "</g>";
  }
  function renderBoard() {
    let caminos = "";
    Object.values(NODES).forEach(N => N.adj.forEach(nb => {
      if (nb === "H" || N.id < nb) { const M = NODES[nb]; caminos += '<line x1="' + N.x.toFixed(1) + '" y1="' + N.y.toFixed(1) + '" x2="' + M.x.toFixed(1) + '" y2="' + M.y.toFixed(1) + '"/>'; }
    }));
    let cells = "";
    Object.values(NODES).forEach(N => { if (!N.hub) cells += cellSVG(N); });
    let wedges = "";
    for (let k = 0; k < 6; k++) {
      const on = G && G.wedges[k];
      wedges += pie(k, 13, 38, (-90 + k * 60 - 30) * Math.PI / 180, (-90 + k * 60 + 30) * Math.PI / 180, CATS[k].c, on ? 1 : 0.3);
      if (on) {
        const am = (-90 + k * 60) * Math.PI / 180, rm = 25;
        wedges += '<circle cx="' + (C + Math.cos(am) * rm).toFixed(1) + '" cy="' + (C + Math.sin(am) * rm).toFixed(1) + '" r="6.5" fill="#fff"/>';
      }
    }
    const defs = "<defs>" +
      CATS.map((c, i) => '<linearGradient id="tg' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.c + '"/><stop offset="1" stop-color="' + c.c2 + '"/></linearGradient>').join("") +
      '<radialGradient id="tbg" cx="50%" cy="42%"><stop offset="0" stop-color="#18244d"/><stop offset="1" stop-color="#0a1226"/></radialGradient>' +
      '<radialGradient id="tok" cx="35%" cy="30%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cdd8f0"/></radialGradient>' +
      "</defs>";
    const tok = NODES[G.pos];
    view().innerHTML =
      '<div class="view-head"><button class="back" id="tvSalir">✕</button><h1 style="font-size:1.05rem">🎡 Trivial · ' + (G.modo === "sala" ? "vs código" : "Solitario") + "</h1>" +
      '<span class="badge" style="margin-left:auto">🎓 ' + esc((AOg().COURSES || {})[G.curso] ? ((AOg().COURSES[G.curso].name || AOg().COURSES[G.curso].nombre)) : G.curso) + "</span>" +
      (G.modo === "sala" ? '<span class="badge">código ' + esc(G.sala.codigo) + "</span>" : "") + "</div>" +
      '<div class="tv-wrap">' +
      '<svg viewBox="0 0 440 440" class="tv-board" id="tvBoard">' + defs +
        '<circle cx="220" cy="220" r="214" fill="url(#tbg)" stroke="rgba(217,182,78,.4)" stroke-width="2"/>' +
        '<circle cx="220" cy="220" r="196" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10"/>' +
        '<g stroke="rgba(255,255,255,.10)" stroke-width="5.5" stroke-linecap="round">' + caminos + "</g>" +
        cells +
        '<circle cx="220" cy="220" r="42" fill="#0a1226" stroke="rgba(217,182,78,.7)" stroke-width="2"/>' + wedges +
        '<text x="220" y="226" font-size="17" text-anchor="middle">🎖️</text>' +
        '<g id="tvTok" style="transform:translate(' + tok.x + "px," + tok.y + 'px)"><circle r="9.5" fill="url(#tok)" stroke="#d9b64e" stroke-width="3"/></g>' +
      "</svg>" +
      '<div class="tv-hud"><div class="tv-chips" id="tvChips"></div><div class="tv-stats" id="tvStats"></div><div id="tvRival" class="tv-rival small muted"></div></div>' +
      '<div class="tv-log" id="tvLog">Pulsa el dado: saca un COLOR y <b>tú eliges</b> la casilla 🎯</div>' +
      '<button class="tv-dado" id="tvDado" aria-label="Tirar el dado"><span id="tvDadoF">🎲</span><small>TIRAR</small></button>' +
      "</div>";
    SV = $("#tvBoard");
    const d = $("#tvDado");
    d.onclick = tirar;
    const sx = $("#tvSalir"); if (sx) sx.onclick = () => { if (G && G.pollT) clearInterval(G.pollT); cierraModal(); G = null; location.hash = "#/entrenar"; };
    /* UN solo listener de tablero: resuelve la casilla destino más cercana al toque (nada de doble disparo) */
    SV.addEventListener("click", ev => {
      if (typeof ev.clientX !== "number") return;
      if (!G || G.fin || G.dado == null || !G.dests || !G.dests.length) return;
      if (document.querySelector(".tv-bg")) return;
      const r = SV.getBoundingClientRect();
      const x = (ev.clientX - r.left) * 440 / (r.width || 440), y = (ev.clientY - r.top) * 440 / (r.height || 440);
      let best = null, bd = 1e9;
      G.dests.forEach(id => { const N = NODES[id]; const dd = (N.x - x) * (N.x - x) + (N.y - y) * (N.y - y); if (dd < bd) { bd = dd; best = id; } });
      if (best != null && bd <= 36 * 36) elegirDest(best);
    });
    refrescaHUD();
    if (G.modo === "sala") { G.pollT = setInterval(sondear, 8000); sondear(); }
  }
  function marcarDests(on) {
    $$("#tvBoard .tv-cell").forEach(g => { g.classList.remove("dest"); g.classList.remove("dim"); });
    if (on && G.dests) {
      $$("#tvBoard .tv-cell").forEach(g => { if (G.dests.indexOf(g.getAttribute("data-id")) < 0) g.classList.add("dim"); });
      G.dests.forEach(id => { const g = $("#n" + id); if (g) g.classList.add("dest"); });
    }
  }
  function moverToken() {
    const N = NODES[G.pos], t = $("#tvTok");
    if (t) t.style.transform = "translate(" + N.x + "px," + N.y + "px)";
  }
  function pintarDado() {
    const f = $("#tvDadoF");
    if (f && G.dado != null) { f.textContent = CATS[G.dado].e; f.style.background = "linear-gradient(145deg," + CATS[G.dado].c + "," + CATS[G.dado].c2 + ")"; f.style.borderRadius = "14px"; f.style.padding = "8px 10px"; f.style.display = "inline-block"; }
  }
  function refrescaHUD() {
    if (!G) return;
    const q = $("#tvChips");
    if (q) q.innerHTML = CATS.map((c, i) => '<span class="tv-chip' + (G.wedges[i] ? " on" : "") + '" style="border-color:' + c.c + (G.wedges[i] ? ";background:" + c.c + ";color:#101830" : "") + '">' + c.e + " " + esc(c.n) + (G.wedges[i] ? " ✓" : "") + "</span>").join("");
    const s = $("#tvStats");
    if (s) s.textContent = "🎯 " + G.aciertos + "/" + G.preguntas + " (" + (G.preguntas ? Math.round(100 * G.aciertos / G.preguntas) : 0) + "%) · tiradas " + G.tirada + "/60 · 🧩 " + Object.keys(G.wedges).length + "/6";
  }
  function toastT(m) { const A = AOg(); try { A.toast(m); } catch (e) { const lg = $("#tvLog"); if (lg) lg.textContent = m; } }

  /* ---- vistas ---- */
  function vTrivial() {
    view().innerHTML =
      '<div class="view-head"><h1>🎡 Trivial de la Tropa</h1></div>' +
      '<div class="card" style="margin-bottom:12px"><span class="badge badge-gold">La ruleta del examen</span><h3>6 categorías, 6 quesitos, 1 pregunta final</h3>' +
      "<p>Tira el dado: sale un <b>color</b> y <b>TÚ eliges</b> a qué casilla de ese color moverte (siempre, aunque solo haya una). La pregunta se abre en pantalla al aterrizar: acierta y avanzas; falla y la ficha <b>retrocede</b>. En las casillas ⭐ de cada radio ganas el <b>quesito</b> de esa categoría. Con los 6, al centro: pregunta final y victoria.</p>" +
      '<div class="tleg">' + CATS.map(c => '<span class="tq" style="border-color:' + c.c + '">' + c.e + " " + esc(c.n) + "</span>").join("") + "</div></div>" +
      '<div class="grid2">' +
      '<div class="card"><h3>🎲 Solitario</h3><p>Partida libre contra el tablero. <b>Solo preguntas de tu curso</b>: nada de mezclas. Tu mejor marca se guarda.</p><button class="btn btn-green btn-block" id="tSolo">Jugar ya</button></div>' +
      '<div class="card"><h3>⚔️ Por código</h3><p>Mismo tablero y mismos dados para los dos. Gana quien acabe en menos tiradas.</p>' +
      '<button class="btn btn-gold btn-block" id="tCrear">Crear código</button>' +
      '<input id="tCodIn" inputmode="text" autocapitalize="characters" placeholder="CÓDIGO" style="width:100%;margin-top:8px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);text-transform:uppercase;text-align:center;letter-spacing:.2em;font-weight:800">' +
      '<button class="btn btn-ghost btn-block" id="tUnir" style="margin-top:8px">Entrar con código</button></div>' +
      "</div>";
    $("#tSolo").onclick = () => nuevaPartida("solo");
    $("#tCrear").onclick = async () => {
      try {
        const r = await fetch("/api/trivial/crear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ de: (st() && st().name) || "Anónimo", curso: (st() && st().course) || "cabo" }) });
        const v = await r.json();
        if (v.error) return toastT(v.error);
        entrarSala(v, "de");
      } catch (e) { toastT("Sin conexión con el servidor"); }
    };
    $("#tUnir").onclick = async () => {
      const codigo = ($("#tCodIn").value || "").trim().toUpperCase();
      if (!codigo) return toastT("Escribe el código que te han pasado");
      try {
        const r = await fetch("/api/trivial/unir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo, jugador: (st() && st().name) || "Anónimo" }) });
        const v = await r.json();
        if (v.error) return toastT(v.error);
        entrarSala(v, "para");
      } catch (e) { toastT("Sin conexión con el servidor"); }
    };
  }
  function entrarSala(v, rol) {
    const msg = "🎡 ¡Trivial de la Tropa! Mi código: " + v.codigo + " — mismo tablero, mismos dados, gana el que acabe en menos tiradas. Entra: " + (typeof PUBLIC_URL !== "undefined" ? PUBLIC_URL : location.origin);
    const bg = document.createElement("div");
    bg.className = "sheet-bg";
    bg.innerHTML = '<div class="tmodal"><h3 style="text-align:center">Código de partida</h3>' +
      '<div style="font-size:2rem;font-weight:800;letter-spacing:.35em;text-align:center;font-family:ui-monospace,monospace">' + esc(v.codigo) + "</div>" +
      '<p class="small muted center">Compartido por WhatsApp, tu rival entra con este código y jugáis la MISMA partida (misma semilla).</p>' +
      '<div class="t-nav" style="justify-content:center"><a class="btn btn-green" href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">📲 Enviar por WhatsApp</a>' +
      '<button class="btn btn-gold" id="tYa">Ya está dentro ▶</button></div></div>';
    document.body.appendChild(bg);
    $("#tYa").onclick = () => { bg.remove(); nuevaPartida("sala", { codigo: v.codigo, rol, seed: v.seed, curso: v.curso }); };
  }

  window.vTrivial = vTrivial;
})();
