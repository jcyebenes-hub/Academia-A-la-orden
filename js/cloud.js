/* A LA ORDEN — Cliente de nube: cuentas, plan, sincronización de progreso (localStorage ⇄ servidor) */
(function () {
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const C = { user: null, lastSync: 0 };

/* --- transporte --- */
function api(method, path, body) {
  const opt = { method: method, headers: {} };
  if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
  return fetch(path, opt).then(async r => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || ("HTTP " + r.status));
    return d;
  });
}

/* --- estado local (mismo store que app.js) --- */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem("galon_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return (k in mem) ? mem[k] : d; } },
  set(k, v) { try { localStorage.setItem("galon_" + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
  del(k) { try { localStorage.removeItem("galon_" + k); } catch (e) {} delete mem[k]; }
};

/* --- fusión de estados (local + servidor) --- */
window.mergeStates = function (local, remote) {
  if (!remote) return JSON.parse(JSON.stringify(local));
  const out = JSON.parse(JSON.stringify(local));
  out.xp = Math.max(local.xp || 0, remote.xp || 0);
  out.streak = Math.max(local.streak || 0, remote.streak || 0);
  out.lastDay = (local.lastDay || "") >= (remote.lastDay || "") ? local.lastDay : remote.lastDay;
  out.fails = Object.assign({}, remote.fails || {});
  Object.keys(local.fails || {}).forEach(id => { out.fails[id] = Math.max(out.fails[id] || 0, local.fails[id] || 0); });
  ["blanks", "srs", "seen"].forEach(k => { out[k] = Object.assign({}, remote[k] || {}, local[k] || {}); });
  if ((remote.daily || {}).done && remote.daily.date === new Date().toDateString()) out.daily = remote.daily;
  const seen = {}, all = (remote.history || []).concat(local.history || []);
  out.history = all.filter(h => { const k = h.d + "|" + h.mode + "|" + h.n + "|" + h.score; if (seen[k]) return false; seen[k] = 1; return true; })
    .sort((a, b) => a.d - b.d).slice(-60);
  if ((local.ach || {}) && (remote.ach || {})) out.ach = Object.assign({}, remote.ach, local.ach);
  else out.ach = Object.assign({}, (local.ach || {}), (remote.ach || {}));
  out.tramita = Object.assign({}, remote.tramita || {}, local.tramita || {});
  for (const k of new Set([].concat(Object.keys(remote.tramita || {}), Object.keys(local.tramita || {})))) {
    const a = (local.tramita || {})[k] || {}, b = (remote.tramita || {})[k] || {};
    out.tramita[k] = { checks: Object.assign({}, b.checks || {}, a.checks || {}), datos: Object.assign({}, b.datos || {}, a.datos || {}) };
  }
  out.stars = Object.assign({}, remote.stars || {}, local.stars || {});
  out.notes = Object.assign({}, remote.notes || {});
  Object.keys(local.notes || {}).forEach(k => {
    const a = local.notes[k] || "", b = remote.notes[k] || "";
    out.notes[k] = a.length >= b.length ? a : b;
  });
  return out;
};

/* --- sincronización --- */
let syncing = false;
window.cloudSync = async function (manual) {
  if (!C.user || syncing) return;
  if (!manual && Date.now() - C.lastSync < 30000) return;
  syncing = true;
  try {
    const local = store.get("state", {});
    const r = await api("GET", "/api/progress");
    if (r.supporter) window.soyCafetero = true; // ha apoyado: el aviso del café no se le muestra
    const merged = window.mergeStates(local, r.state);
    await api("POST", "/api/progress", { state: merged });
    store.set("state", merged);
    C.lastSync = Date.now();
    paintChip();
    if (window.render && manual) window.render();
    toast("☁️ Sincronizado · " + merged.xp + " XP en la nube");
  } catch (e) {
    if (manual) toast("No se pudo sincronizar: " + e.message);
  } finally { syncing = false; }
};
function toast(msg) { const t = $("#toast"); if (t) { t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2600); } }

/* --- presencia real: latido + quién está en línea --- */
const ANON = (() => { let a = store.get("anon", null); if (!a) { a = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2); store.set("anon", a); } return a; })();
window.GALON_ONLINE = { total: 0, users: [], anon: 0 };
window.cloudUser = function () { return C.user; };
function paintOnline() {
  const O = window.GALON_ONLINE;
  const chip = $("#onlineChip");
  if (chip) chip.innerHTML = "🟢 <b>" + O.total + "</b> en línea" + (O.users && O.users.length ? " · " + O.users.slice(0, 4).map(n => esc(n)).join(", ") + (O.users.length > 4 ? "…" : "") : "");
  const list = $("#onlineList");
  if (list) list.innerHTML = (O.users && O.users.length)
    ? O.users.map(n => '<div class="rank-row"><span>🟢</span><span><b>' + esc(n) + "</b></span><span class=\"small muted\">conectado</span></div>").join("") +
      (O.anon ? '<p class="small muted">+ ' + O.anon + " conectado(s) sin cuenta (se cuentan, no se identifican)</p>" : "") +
      '<p class="small muted" style="margin-top:6px">Presencia real: latidos de los últimos 2 minutos. Sin números inventados.</p>'
    : '<p class="small muted">Nadie más conectado en este momento. Presencia real: latidos de los últimos 2 minutos.</p>';
}
async function beat() {
  try {
    const r = await fetch("/api/beat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ anon: C.user ? undefined : ANON }) });
    if (r.ok) { window.GALON_ONLINE = await r.json(); paintOnline(); }
  } catch (e) { /* sin conexión: no pasa nada */ }
}
setInterval(beat, 45000);
window.cloudBeat = beat;

/* --- chip de cuenta en la cabecera --- */
function paintChip() {
  let chip = $("#cloudChip");
  if (!chip) {
    chip = document.createElement("a");
    chip.id = "cloudChip"; chip.href = "javascript:void(0)"; chip.className = "xp-chip";
    const bar = document.querySelector(".app-top .wrap");
    if (bar) bar.appendChild(chip);
  }
  chip.textContent = C.user ? ("👤 " + C.user.name.split(" ")[0] + (C.user.plan !== "free" ? " · " + C.user.plan.toUpperCase() : "")) : "👤 Entrar";
  chip.onclick = abrirPerfil;
}
/* ventana de perfil: tocar tu usuario arriba = perfil + ajustes */
window.abrirPerfil = function () {
  const old = $("#sheetBg"); if (old) old.remove();
  const u = C.user;
  const inicial = (u && u.name ? u.name : "?").trim().charAt(0).toUpperCase();
  const fila = (ico, txt, sub, id) => '<button class="opt" id="' + id + '" style="text-align:left"><b style="margin-right:8px">' + ico + '</b><span style="flex:1"><b>' + txt + '</b>' + (sub ? '<br><span class="small muted">' + sub + '</span>' : "") + "</span><span style='color:var(--gold);font-weight:800'>›</span></button>";
  const bg = document.createElement("div");
  bg.id = "sheetBg"; bg.className = "sheet-bg";
  bg.innerHTML = '<div class="sheet">' +
    '<div style="display:flex;align-items:center;gap:12px;padding:14px 18px 6px">' +
      '<div style="width:52px;height:52px;border-radius:50%;background:var(--gold);color:#101830;font-weight:900;font-size:1.5rem;display:flex;align-items:center;justify-content:center">' + inicial + "</div>" +
      '<div style="flex:1;min-width:0"><b style="font-size:1.05rem">' + (u ? esc(u.name) : "Sin cuenta") + "</b>" +
      '<div class="small muted">' + (u ? (u.plan === "free" ? "Plan Recluta · gratis" + (u.founder ? " · 🏅 fundador" : "") : esc(u.planLabel)) : "Toca entrar para sincronizar tu progreso") + "</div></div>" +
      (u ? '<div style="text-align:right"><b>' + (typeof state !== "undefined" ? state.xp : 0) + ' XP</b><div class="small muted">Nv ' + (typeof level === "function" ? level() : 1) + "</div></div>" : "") +
    "</div>" +
    '<div style="display:flex;flex-direction:column;gap:8px;padding:8px 16px 18px">' +
      (u ? fila("👤", "Mi perfil", "Datos de la cuenta, facturas y salir", "pfCuenta") : fila("🔑", "Entrar o crear cuenta", "Gratis: ranking real y sync", "pfCuenta")) +
      fila("⚙️", "Ajustes", "Modo oscuro, sonido, auto-avance…", "pfAjustes") +
      (typeof COURSES !== "undefined" ? fila("🎓", "Cambiar de curso", "Cabo · Cabo 1º · Permanente", "pfCurso") : "") +
      (u ? fila("🚪", "Cerrar sesión", "", "pfSalir") : "") +
    "</div></div>";
  document.body.appendChild(bg);
  bg.onclick = e => { if (e.target === bg) bg.remove(); };
  const ir = h => { bg.remove(); if (location.hash === h) render(); else location.hash = h; };
  const el = id => document.getElementById(id);
  if (el("pfCuenta")) el("pfCuenta").onclick = () => ir("#/cuenta");
  if (el("pfAjustes")) el("pfAjustes").onclick = () => ir("#/ajustes");
  if (el("pfCurso")) el("pfCurso").onclick = () => { bg.remove(); if (typeof window.abrirCursos === "function") window.abrirCursos(false); };
  if (el("pfSalir")) el("pfSalir").onclick = () => {
    if (!confirm("¿Cerrar sesión? Tu progreso local se queda guardado.")) return;
    bg.remove();
    api("POST", "/api/logout").then(() => { C.user = null; paintChip(); toast("A la orden. Sesión cerrada"); if (location.hash === "#/cuenta") render(); });
  };
};

/* --- vista #/cuenta --- */
window.vCuenta = async function () {
  const view = $("#view");
  if (!C.user) {
    view.innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Mi cuenta</h1></div>' +
      '<div class="card"><div class="t-nav" style="margin:0 0 14px"><button class="btn btn-green" id="tabIn">Entrar</button><button class="btn btn-ghost" id="tabUp">Crear cuenta</button></div>' +
      '<form id="formIn">' +
      '<label class="f">Email</label><input type="email" id="inEmail" autocomplete="email" required>' +
      '<label class="f">Contraseña</label><input type="password" id="inPass" autocomplete="current-password" required>' +
      '<button class="btn btn-gold btn-block" style="margin-top:12px">Entrar</button></form>' +
      '<form id="formUp" style="display:none">' +
      '<label class="f">Tu nombre o alias</label><input type="text" id="upName" maxlength="24" required>' +
      '<label class="f">Email</label><input type="email" id="upEmail" autocomplete="email" required>' +
      '<label class="f">Contraseña (mín. 8)</label><input type="password" id="upPass" autocomplete="new-password" minlength="8" required>' +
      '<p class="small muted">Cuenta gratis y sin trampas: ranking global <b>real</b>, punto 🟢 en línea y tu progreso en todos tus dispositivos. Datos mínimos, cifrados.</p>' +
      '<button class="btn btn-gold btn-block" style="margin-top:12px">Crear cuenta gratis</button></form>' +
      '<p class="small muted center" id="cErr" style="color:#b3261e;display:none;margin-top:10px"></p>' +
      '<p class="small muted center" style="margin-top:8px">Crear cuenta es gratis y sincroniza tu progreso entre dispositivos.</p></div>';
    const err = m => { const e = $("#cErr"); e.textContent = m; e.style.display = "block"; };
    $("#tabIn").onclick = () => { $("#formIn").style.display = "block"; $("#formUp").style.display = "none"; };
    $("#tabUp").onclick = () => { $("#formIn").style.display = "none"; $("#formUp").style.display = "block"; };
    $("#formIn").onsubmit = ev => { ev.preventDefault(); api("POST", "/api/login", { email: $("#inEmail").value, password: $("#inPass").value }).then(d => { C.user = d.user; paintChip(); window.cloudSync(true); window.vCuenta(); if (typeof window.abrirCursos === "function") setTimeout(() => abrirCursos(true), 450); }).catch(e => err(e.message)); };
    $("#formUp").onsubmit = ev => { ev.preventDefault(); api("POST", "/api/register", { name: $("#upName").value, email: $("#upEmail").value, password: $("#upPass").value }).then(d => { C.user = d.user; paintChip(); window.cloudSync(true); window.vCuenta(); if (typeof window.abrirCursos === "function") setTimeout(() => abrirCursos(true), 450); }).catch(e => err(e.message)); };
    return;
  }
  // con sesión
  let invoicesHtml = '<p class="small muted">Cargando facturas…</p>';
  view.innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Mi cuenta</h1></div>' +
    '<div class="score-hero" style="padding:22px"><span class="badge" style="background:rgba(255,255,255,.15);color:#ffe9a8">' + (C.user.plan === "free" ? "PLAN RECLUTA · gratis" : esc(C.user.planLabel)) + '</span>' +
    '<div class="num" style="font-size:1.6rem">' + esc(C.user.name) + '</div>' +
    '<div class="small" style="opacity:.85">' + esc(C.user.email) + (C.user.founder ? " · 🏅 <b>FUNDADOR</b>" : "") + '</div>' +
    (C.user.plan !== "free" && C.user.planEnds ? '<div class="small" style="margin-top:6px;opacity:.85">Renueva: ' + new Date(C.user.planEnds).toLocaleDateString("es-ES") + "</div>" : '<div class="small" style="margin-top:6px"><a class="btn btn-gold btn-sm" href="/index.html#precios" style="text-decoration:none">☕ Apoyar el proyecto</a></div>') + "</div>" +
    '<div class="card" style="margin-bottom:12px"><div class="topic-row"><span>☁️ <b>Sincronización</b><br><span class="small muted">Tu progreso viaja contigo: cuartel, casa y móvil</span></span><button class="btn btn-green btn-sm" id="btnSync">Sincronizar</button></div></div>' +
    '<div class="card" style="margin-bottom:12px"><h3>🟢 En línea ahora</h3><div id="onlineList"></div></div>' +
    '<div class="card" style="margin-bottom:12px"><h3>🧾 Facturas</h3><div id="invBox">' + invoicesHtml + "</div></div>" +
    '<div class="card"><div class="topic-row"><span>🔒 <b>Tus derechos (RGPD)</b><br><span class="small muted">Portabilidad y supresión, al instante</span></span></div>' +
    '<button class="btn btn-ghost btn-block" id="btnExport">⬇️ Descargar mis datos</button>' +
    '<button class="btn btn-ghost btn-block" id="btnDelete" style="color:#b3261e;margin-top:8px">🗑️ Eliminar mi cuenta</button>' +
    '<button class="btn btn-ghost btn-block" id="btnOut" style="margin-top:8px">Cerrar sesión</button>' +
    '<p class="small muted center" style="margin-top:10px">Demo: los pagos no son reales. RGPD: puedes pedir la eliminación de tu cuenta escribiendo a privacidad@galon.app</p></div>';
  $("#btnSync").onclick = () => window.cloudSync(true);
  paintOnline();
  $("#btnOut").onclick = () => api("POST", "/api/logout").then(() => { C.user = null; paintChip(); window.vCuenta(); });
  $("#btnExport").onclick = () => api("GET", "/api/privacy/export").then(d => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }));
    a.download = "galon-mis-datos.json"; a.click();
    toast("📦 Datos exportados (art. 20 RGPD)");
  }).catch(e => toast("No se pudo exportar: " + e.message));
  $("#btnDelete").onclick = () => {
    if (!confirm("Esto elimina tu cuenta, tu progreso en la nube y tus datos, sin posibilidad de recuperación. ¿Continuar?")) return;
    if (!confirm("Última confirmación: ¿eliminar definitivamente tu cuenta?")) return;
    api("POST", "/api/privacy/delete").then(() => { C.user = null; paintChip(); toast("Cuenta eliminada. Un saludo, y hasta la orden."); setTimeout(() => location.href = "/app.html", 1200); }).catch(e => toast("No se pudo eliminar: " + e.message));
  };
  api("GET", "/api/invoices").then(d => {
    const box = $("#invBox");
    if (!d.invoices.length) { box.innerHTML = '<p class="small muted">Aún no hay pagos. Si te pasas a PRO aparecerán aquí.</p>'; return; }
    box.innerHTML = d.invoices.map(f => '<div class="topic-row"><span>' + new Date(f.date).toLocaleDateString("es-ES") + " · " + esc(f.plan) + " (" + f.cycle + ")</span><b>" + (Math.round(f.amount * 100) / 100).toFixed(2).replace(".", ",") + ' €</b></div>').join("") +
      '<p class="small muted">Tarjeta terminada en ' + esc(d.invoices[0].last4 || "••••") + "</p>";
  }).catch(() => {});
};

/* --- arranque --- */
window.GalonCloudInit = function () {
  api("GET", "/api/me").then(d => { C.user = d.user; paintChip(); window.cloudSync(false); beat(); }).catch(() => { paintChip(); beat(); });
};
})();
