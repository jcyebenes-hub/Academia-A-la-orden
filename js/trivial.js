/* A LA ORDEN · TRIVIAL DE LA TROPA — ruleta de 6 categorías estilo clásico
   Solitario o por código de invitación (misma semilla: mismo dado y mismas preguntas para ambos; gana quien acabe en menos tiradas).
   Marca y tablero propios (el Trivial Pursuit es marca de Hasbro: aquí mandan los galones). */
(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- categorías (colores tipo tablero clásico, temas del examen) ---- */
  const CATS = [
    { n: "Armamento", c: "#d84b9b", e: "🪖", t: ["Armamento y tiro", "Armamento", "Tiro"] },
    { n: "Primeros auxilios", c: "#37a86b", e: "🚑", t: ["Primeros auxilios", "NBQ"] },
    { n: "OTAN y UE", c: "#8a5a3b", e: "🌍", t: ["OTAN y UE", "Logística", "Instrucción cívica"] },
    { n: "Topografía", c: "#2f9de2", e: "🧭", t: ["Topografía"] },
    { n: "Transmisiones", c: "#e2762d", e: "📡", t: ["Transmisiones"] },
    { n: "Reales Ordenanzas", c: "#f2c11b", e: "📜", t: ["Reales Ordenanzas", "Carrera militar", "Régimen Disciplinario"] }
  ];

  /* ---- tablero: hub + 6 radios × 6 casillas + anillo de 18 ---- */
  const NODES = {};
  function addNode(id, cat, x, y, opts) { NODES[id] = Object.assign({ id, cat, x, y, adj: [], hq: false, hub: false, ang: 0 }, opts || {}); }
  (function build() {
    addNode("H", -1, 200, 200, { hub: true });
    const R = [45, 76, 107, 138, 169, 198];
    for (let k = 0; k < 6; k++) {
      const a = (-90 + k * 60) * Math.PI / 180;
      for (let i = 1; i <= 6; i++) {
        const id = "s" + k + "_" + i;
        const cat = i === 6 ? k : (k + i) % 6;             /* el radio k termina en la sede de la cat k */
        addNode(id, cat, 200 + Math.cos(a) * R[i - 1], 200 + Math.sin(a) * R[i - 1], { hq: i === 6, ang: -90 + k * 60 });
        if (i === 1) link("H", id); else link("s" + k + "_" + (i - 1), id);
      }
      /* anillo: 3 casillas entre sede k y sede k+1 */
      for (let j = 1; j <= 3; j++) {
        const id = "r" + k + "_" + j;
        const ang = -90 + k * 60 + j * 15;
        const rad = ang * Math.PI / 180;
        addNode(id, (k + j * 2) % 6, 200 + Math.cos(rad) * 198, 200 + Math.sin(rad) * 198, { ang: ang + 90 });
        if (j === 1) link("s" + k + "_6", id); else link("r" + k + "_" + (j - 1), id);
        if (j === 3) link(id, "s" + ((k + 1) % 6) + "_6");
      }
    }
    function link(a, b) { if (NODES[a] && NODES[b]) { NODES[a].adj.push(b); NODES[b].adj.push(a); } }
  })();

  /* ---- azar determinista (misma semilla = misma partida para los dos rivales) ---- */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  let G = null; /* estado de partida */

  function poolsFor() {
    const all = (typeof bank === "function" ? bank(state.course) : []).filter(q => q.o && q.o.length === 4);
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
      rng: null, tirada: 0,
      pos: "s0_1", wedges: {}, aciertos: 0, preguntas: 0, usadas: {},
      fin: false, gano: false, enviadoFin: false, pollT: null
    };
    G.rng = mulberry32(G.seed);
    G.pools = poolsFor();
    renderBoard();
  }

  /* ---- dado y movimiento ---- */
  function tirar() {
    if (!G || G.fin || G.dado) return;
    G.tirada++;
    const v = G.rng();
    G.dado = Math.floor(v * 6);
    G.preguntas++; /* cada tirada trae su pregunta (secuencia fijada por la semilla) */
    pintarDado();
    const dests = destinos(G.pos, G.dado);
    if (!dests.length) { toastT("Sin casillas de ese color: tirada perdida"); G.dado = null; refrescaHUD(); return; }
    G.dests = dests;
    marcarDests(true);
    $("#tLog").innerHTML = "Dado: <b style='color:" + CATS[G.dado].c + "'>" + CATS[G.dado].e + " " + esc(CATS[G.dado].n) + "</b> · toca una casilla brillante";
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
    if (!G || !G.dests || G.dests.indexOf(id) < 0) return;
    marcarDests(false);
    G.destElegida = id;
    preguntar(G.dado);
  }

  /* ---- preguntas ---- */
  function preguntar(cat) {
    const pool = G.pools[cat] && G.pools[cat].length ? G.pools[cat] : G.pools[(cat + 3) % 6];
    let idx = Math.floor(G.rng() * pool.length);
    let q = pool[idx % pool.length];
    const clave = cat + ":" + q.id;
    if (G.usadas[clave]) { q = pool[(idx + 1 + Math.floor(G.rng() * (pool.length - 1 || 1))) % pool.length]; }
    G.usadas[clave] = 1;
    G.q = q; G.qCat = cat;
    const orden = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(G.rng() * (i + 1)); const t = orden[i]; orden[i] = orden[j]; orden[j] = t; }
    G.orden = orden;
    const bg = document.createElement("div");
    bg.id = "tqBg"; bg.className = "sheet-bg";
    bg.innerHTML = '<div class="sheet"><div style="padding:0 18px"><span class="badge" style="background:' + CATS[cat].c + ';color:#101830;font-weight:800">' + CATS[cat].e + " " + esc(CATS[cat].n) + '</span></div>' +
      '<p class="q-text" style="padding:8px 18px 0;margin:0">' + esc(q.q) + "</p>" +
      '<div id="tqOpts" style="padding:10px 16px">' + orden.map((oi, pos) => '<button class="opt" data-o="' + oi + '" style="text-align:left"><b>' + "ABCD"[pos] + '.</b> ' + esc(q.o[oi]) + "</button>").join("") + "</div>" +
      '<div id="tqExpl" style="padding:0 16px"></div></div>';
    document.body.appendChild(bg);
    $$("#tqOpts .opt").forEach(b => b.onclick = () => responder(parseInt(b.getAttribute("data-o"), 10)));
  }
  function responder(elegida) {
    const q = G.q, ok = elegida === q.a;
    $$("#tqOpts .opt").forEach(b => {
      const i = parseInt(b.getAttribute("data-o"), 10);
      b.disabled = true;
      if (i === q.a) b.classList.add("ok"); else if (i === elegida) b.classList.add("ko");
    });
    if (ok) { G.aciertos++; try { sfxGood(); } catch (e) {} } else try { sfxBad(); } catch (e) {}
    const N = NODES[G.destElegida];
    let extra = "";
    if (ok) {
      G.pos = G.destElegida;
      moverToken();
      if (N.hq) { G.wedges[N.cat] = 1; extra = "<br>🧩 <b>Quesito conseguido: " + esc(CATS[N.cat].n) + "!</b>"; }
      if (N.hub) { return final(); }
    }
    $("#tqExpl").innerHTML = '<div class="explain"><b>' + (ok ? "¡Correcta! ✅" : "Fallada ❌ — correcta: " + "ABCD"[q.a] + ") " + esc(q.o[q.a])) + "</b><br>" + esc(q.x) + "</div>" +
      '<div class="t-nav" style="justify-content:center"><button class="btn ' + (ok ? "btn-green" : "btn-ghost") + '" id="tqGo">' + (ok ? "🎲 Tira de nuevo" : "➡️ Siguiente tirada") + "</button></div>";
    $("#tqGo").onclick = () => {
      const bg = $("#tqBg"); if (bg) bg.remove();
      G.dado = null; G.destElegida = null;
      if (G.tirada >= 60 && !G.fin) finPartida(false, true);
      else if (G.modo === "sala") informa();
      refrescaHUD();
      if (!G.fin) { $("#tLog").textContent = ok ? "¡Otra tirada!" : "Turno siguiente…"; }
    };
    if (G.modo === "sala") informa();
    refrescaHUD();
  }
  function final() {
    const cat = Math.floor(G.rng() * 6);
    const pool = G.pools[cat].length ? G.pools[cat] : G.pools[0];
    const q = pool[Math.floor(G.rng() * pool.length)];
    G.q = q;
    const bg = $("#tqBg"); if (bg) bg.remove();
    const b2 = document.createElement("div");
    b2.id = "tqBg"; b2.className = "sheet-bg";
    b2.innerHTML = '<div class="sheet"><h3 style="text-align:center">🎖️ PREGUNTA FINAL</h3><div style="padding:0 18px"><span class="badge" style="background:' + CATS[cat].c + ';color:#101830;font-weight:800">' + CATS[cat].e + " " + esc(CATS[cat].n) + '</span></div>' +
      '<p class="q-text" style="padding:8px 18px 0;margin:0">' + esc(q.q) + "</p>" +
      '<div id="tqOpts" style="padding:10px 16px">' + [0, 1, 2, 3].map(i => '<button class="opt" data-o="' + i + '" style="text-align:left"><b>' + "ABCD"[i] + '.</b> ' + esc(q.o[i]) + "</button>").join("") + "</div>" +
      '<div id="tqExpl" style="padding:0 16px"></div></div>';
    document.body.appendChild(b2);
    $$("#tqOpts .opt").forEach(btn => btn.onclick = () => {
      const i = parseInt(btn.getAttribute("data-o"), 10), ok = i === q.a;
      $$("#tqOpts .opt").forEach(x => { x.disabled = true; const xi = parseInt(x.getAttribute("data-o"), 10); if (xi === q.a) x.classList.add("ok"); else if (xi === i) x.classList.add("ko"); });
      $("#tqExpl").innerHTML = '<div class="explain"><b>' + (ok ? "¡CORRECTA! 🏆" : "Fallada ❌ — correcta: " + "ABCD"[q.a]) + "</b><br>" + esc(q.x) + "</div>" +
        '<div class="t-nav" style="justify-content:center"><button class="btn btn-gold" id="tqGo">Ver resultado</button></div>';
      $("#tqGo").onclick = () => { const b = $("#tqBg"); if (b) b.remove(); finPartida(ok, false); };
    });
  }

  /* ---- fin y servidor ---- */
  function finPartida(gano, cap) {
    G.fin = true; G.gano = !!gano; G.dado = null;
    const msg = gano ? "🏆 ¡VICTORIA! Tablero completo en " + G.tirada + " tiradas" : (cap ? "⏱️ Fin: 60 tiradas · " + Object.keys(G.wedges).length + "/6 quesitos" : "😞 La final te ha caído… ¡otra ronda!");
    $("#tLog").innerHTML = "<b>" + msg + "</b>";
    const btn = $("#tDado"); if (btn) btn.disabled = true;
    if (typeof state !== "undefined" && state) { state.xp += gano ? 50 : 5; if (typeof save === "function") save(); }
    if (G.modo === "sala") { G.enviadoFin = true; informa(true); }
    else {
      try {
        const best = parseInt(localStorage.getItem("trivialBest") || "999", 10);
        if (gano && G.tirada < best) { localStorage.setItem("trivialBest", String(G.tirada)); $("#tLog").innerHTML += "<br>🥇 ¡Tu mejor marca! (" + G.tirada + " tiradas)"; }
      } catch (e) {}
    }
    refrescaHUD();
  }
  function informa(fin) {
    if (!G || G.modo !== "sala" || !G.sala) return;
    fetch("/api/trivial/estado", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo: G.sala.codigo, jugador: state.name || "Anónimo", wedges: Object.keys(G.wedges).length, tiradas: G.tirada, aciertos: G.aciertos, fin: !!fin || G.fin }) }).catch(() => {});
  }
  function sondear() {
    if (!G || G.modo !== "sala" || !G.sala) return;
    fetch("/api/trivial/ver?codigo=" + encodeURIComponent(G.sala.codigo) + "&u=" + encodeURIComponent(state.name || "")).then(r => r.json()).then(v => {
      if (!v || v.error) return;
      const mio = G.sala.rol === "de" ? v.de : v.para, riv = G.sala.rol === "de" ? v.para : v.de;
      const el = $("#tRival");
      if (el && riv) el.innerHTML = "⚔️ <b>" + esc(riv.nombre) + "</b>: 🧩 " + riv.wedges + "/6 · " + riv.tiradas + " tiradas" + (riv.fin ? " · ¡TERMINÓ!" : "");
      if (v.ganador && G.fin) {
        const empate = v.ganador === "";
        $("#tLog").innerHTML = empate ? "🤝 ¡Empate táctico!" : (v.ganador === (state.name || "Anónimo") ? "🏆 ¡VICTORIA en " + G.tirada + " tiradas!" : "😔 Ganó " + esc(v.ganador) + " · revancha cuando quieras");
      }
    }).catch(() => {});
  }

  /* ---- pintado ---- */
  function cellSVG(N) {
    const c = N.hub ? "#14224a" : (N.cat >= 0 ? CATS[N.cat].c : "#333");
    const w = N.hq ? 30 : 22, h = N.hq ? 40 : 30;
    const extra = N.hq ? '<text x="0" y="6" font-size="13" text-anchor="middle">⭐</text>' : "";
    return '<g id="n' + N.id + '" class="tcell" data-id="' + N.id + '" transform="translate(' + N.x.toFixed(1) + "," + N.y.toFixed(1) + ") rotate(" + (N.ang || 0) + ')">' +
      '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + c + '" stroke="#0e1830" stroke-width="2"/>' + extra + "</g>";
  }
  function renderBoard() {
    let cells = "";
    Object.values(NODES).forEach(N => { if (!N.hub) cells += cellSVG(N); });
    const ques = CATS.map((c, i) => {
      const a = (-90 + i * 60 - 30) * Math.PI / 180;
      const x = 200 + Math.cos(a) * 20, y = 200 + Math.sin(a) * 20;
      const on = G && G.wedges[i];
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" fill="' + (on ? c.c : "#26355e") + '" stroke="' + (on ? "#fff" : "#0e1830") + '" stroke-width="2"/>';
    }).join("");
    const tok = NODES[G.pos];
    view().innerHTML =
      '<div class="view-head"><button class="back" id="tSalir">✕</button><h1 style="font-size:1.05rem">🎡 Trivial · ' + (G.modo === "sala" ? "vs código" : "Solitario") + "</h1>" +
      (G.modo === "sala" ? '<span class="badge" style="margin-left:auto">código ' + esc(G.sala.codigo) + "</span>" : "") + "</div>" +
      '<div class="trivial-wrap">' +
      '<svg viewBox="0 0 400 400" class="twheel" id="twheel">' +
        '<circle cx="200" cy="200" r="196" fill="#0d1730"/>' +
        cells +
        '<circle cx="200" cy="200" r="36" fill="#14224a" stroke="#d9b64e" stroke-width="3"/>' + ques +
        '<text x="200" y="205" font-size="16" text-anchor="middle">🎖️</text>' +
        '<circle id="tTok" cx="0" cy="0" r="10" fill="#fff" stroke="#d9b64e" stroke-width="3" style="transform:translate(' + tok.x + "px," + tok.y + 'px)"/>' +
      "</svg>" +
      '<div class="thud"><div id="tQuesitos"></div><div class="tstats" id="tStats"></div><div id="tRival" class="small muted"></div></div>' +
      '<div class="t-log" id="tLog">Pulsa el dado para empezar 🎲</div>' +
      '<div class="tdado-row"><button class="tdado" id="tDado"><span id="tDadoF">🎲</span></button></div>' +
      "</div>";
    const d = $("#tDado");
    d.onclick = tirar;
    const sx = $("#tSalir"); if (sx) sx.onclick = () => { if (G && G.pollT) clearInterval(G.pollT); G = null; location.hash = "#/entrenar"; };
    $$("#twheel .tcell").forEach(g => g.addEventListener("click", () => elegirDest(g.getAttribute("data-id"))));
    refrescaHUD();
    if (G.modo === "sala") { G.pollT = setInterval(sondear, 8000); sondear(); }
  }
  function marcarDests(on) {
    $$("#twheel .tcell").forEach(g => g.classList.remove("dest"));
    if (on && G.dests) G.dests.forEach(id => { const g = $("#n" + id); if (g) g.classList.add("dest"); });
  }
  function moverToken() {
    const N = NODES[G.pos], t = $("#tTok");
    if (t) t.style.transform = "translate(" + N.x + "px," + N.y + "px)";
  }
  function pintarDado() {
    const f = $("#tDadoF");
    if (f && G.dado != null) { f.textContent = CATS[G.dado].e; f.style.background = CATS[G.dado].c; f.style.borderRadius = "50%"; }
  }
  function refrescaHUD() {
    if (!G) return;
    const q = $("#tQuesitos");
    if (q) q.innerHTML = CATS.map(c => { const i = CATS.indexOf(c); return '<span class="tq" style="border-color:' + c.c + (G.wedges[i] ? ";background:" + c.c + ";color:#101830" : "") + '">' + c.e + " " + esc(c.n) + (G.wedges[i] ? " ✓" : "") + "</span>"; }).join(" ");
    const s = $("#tStats");
    if (s) s.textContent = "🎯 " + G.aciertos + "/" + G.preguntas + " (" + (G.preguntas ? Math.round(100 * G.aciertos / G.preguntas) : 0) + "%) · tiradas " + G.tirada + " · 🧩 " + Object.keys(G.wedges).length + "/6";
  }
  function toastT(m) { try { toast(m); } catch (e) { $("#tLog").textContent = m; } }

  /* ---- vistas ---- */
  function vTrivial() {
    view().innerHTML =
      '<div class="view-head"><h1>🎡 Trivial de la Tropa</h1></div>' +
      '<div class="card" style="margin-bottom:12px"><span class="badge badge-gold">La ruleta del examen</span><h3>6 categorías, 6 quesitos, 1 pregunta final</h3>' +
      '<p>Tira el dado, elige casilla del color que salga y acierta para moverte. En las casillas ⭐ de cada radio ganas el <b>quesito</b> de esa categoría. Con los 6, al centro: pregunta final y victoria.</p>' +
      '<div class="tleg">' + CATS.map(c => '<span class="tq" style="border-color:' + c.c + '">' + c.e + " " + esc(c.n) + "</span>").join("") + "</div></div>" +
      '<div class="grid2">' +
      '<div class="card"><h3>🎲 Solitario</h3><p>Partida libre contra el tablero. Tu mejor marca se guarda.</p><button class="btn btn-green btn-block" id="tSolo">Jugar ya</button></div>' +
      '<div class="card"><h3>⚔️ Por código</h3><p>Mismo tablero y mismos dados para los dos. Gana quien acabe en menos tiradas.</p>' +
      '<button class="btn btn-gold btn-block" id="tCrear">Crear código</button>' +
      '<input id="tCodIn" inputmode="text" autocapitalize="characters" placeholder="CÓDIGO" style="width:100%;margin-top:8px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);text-transform:uppercase;text-align:center;letter-spacing:.2em;font-weight:800">' +
      '<button class="btn btn-ghost btn-block" id="tUnir" style="margin-top:8px">Entrar con código</button></div>' +
      "</div>";
    $("#tSolo").onclick = () => nuevaPartida("solo");
    $("#tCrear").onclick = async () => {
      try {
        const r = await fetch("/api/trivial/crear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ de: state.name || "Anónimo", curso: state.course }) });
        const v = await r.json();
        if (v.error) return toast(v.error);
        entrarSala(v, "de");
      } catch (e) { toast("Sin conexión con el servidor"); }
    };
    $("#tUnir").onclick = async () => {
      const codigo = ($("#tCodIn").value || "").trim().toUpperCase();
      if (!codigo) return toast("Escribe el código que te han pasado");
      try {
        const r = await fetch("/api/trivial/unir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo, jugador: state.name || "Anónimo" }) });
        const v = await r.json();
        if (v.error) return toast(v.error);
        entrarSala(v, "para");
      } catch (e) { toast("Sin conexión con el servidor"); }
    };
  }
  function entrarSala(v, rol) {
    const msg = "🎡 ¡Trivial de la Tropa! Mi código: " + v.codigo + " — mismo tablero, mismos dados, gana el que acabe en menos tiradas. Entra: " + (typeof PUBLIC_URL !== "undefined" ? PUBLIC_URL : location.origin);
    const bg = document.createElement("div");
    bg.id = "sheetBg"; bg.className = "sheet-bg";
    bg.innerHTML = '<div class="sheet"><h3 style="text-align:center">Código de partida</h3>' +
      '<div style="font-size:2rem;font-weight:800;letter-spacing:.35em;text-align:center;font-family:ui-monospace,monospace">' + esc(v.codigo) + "</div>" +
      '<p class="small muted center">Compartido por WhatsApp, tu rival entra con este código y jugáis la MISMA partida (misma semilla).</p>' +
      '<div class="t-nav" style="justify-content:center"><a class="btn btn-green" href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">📲 Enviar por WhatsApp</a>' +
      '<button class="btn btn-gold" id="tYa">Ya está dentro ▶</button></div></div>';
    document.body.appendChild(bg);
    $("#tYa").onclick = () => { bg.remove(); nuevaPartida("sala", { codigo: v.codigo, rol, seed: v.seed, curso: v.curso }); };
  }

  window.vTrivial = vTrivial;
})();
