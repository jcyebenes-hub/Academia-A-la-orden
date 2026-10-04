/* MICABO — Cliente de nube: cuentas, plan, sincronización de progreso (localStorage ⇄ servidor) */
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
    chip.id = "cloudChip"; chip.href = "javascript:void(0)";
    const bar = document.querySelector(".app-top .wrap");
    if (bar) bar.appendChild(chip);
  }
  if (C.user) {
    chip.className = "xp-chip";
    chip.textContent = "👤 " + C.user.name.split(" ")[0] + (C.user.plan !== "free" ? " · " + C.user.plan.toUpperCase() : "");
    chip.onclick = abrirPerfil;   /* v75: tocar TU chip = perfil + ajustes */
  } else {
    chip.className = "auth-cta";
    chip.innerHTML = "🔑 <b>Entrar / Registrarse</b>";
    chip.onclick = () => { if (location.hash === "#/cuenta") render(); else location.hash = "#/cuenta"; };
  }
}
/* ventana de perfil: tocar tu usuario arriba = perfil + ajustes */
window.estaDentro = function () { return !!C.user; }; /* portero: ¿hay sesión iniciada? */
function nombreCurso(id) { return { cabo: "Ascenso a Cabo", cabo1: "Cabo 1º", perm: "Tropa Permanente" }[id] || id; }
function aplicaCursoCuenta(user) {
  /* el curso de la CUENTA manda al entrar: así viaja entre dispositivos */
  if (user && user.curso && window.AO && window.AO.stateRef) {
    const sr = window.AO.stateRef();
    if (sr.course !== user.curso) { sr.course = user.curso; if (window.AO.save) window.AO.save(); }
  }
}
window.setCursoCuenta = function (curso) { /* al cambiar de curso con sesión, el servidor lo apunta en la cuenta */
  api("POST", "/api/curso", { curso: curso }).then(d => { if (d.user) { C.user = d.user; paintChip(); } }).catch(() => {});
};
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
    api("POST", "/api/logout").then(() => { C.user = null; paintChip(); toast("Sesión cerrada. ¡A su mando!"); if (location.hash === "#/cuenta") render(); });
  };
};

/* --- vista #/cuenta --- */
window.vCuenta = async function () {
  const view = $("#view");
  if (!C.user) {
    const logo = '<div class="auth-logo"><svg viewBox="0 0 48 48" width="52" height="52" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 3 41 9v13c0 10-7 17.5-17 23C14 39.5 7 32 7 22V9Z"/><path d="M24 13l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2-4.5-4.3 6.3-.9Z"/></svg><b>MICABO</b></div>' +
      '<p class="auth-sub">Tu academia a la orden · gratis y sin trampas</p>';
    const pin = (id, ico, ph, ac) => '<div class="inrow"><span class="in-ico">' + ico + '</span><input type="' + (ac.indexOf("password") >= 0 ? "password" : ac === "email" ? "email" : "text") + '" id="' + id + '" autocomplete="' + ac + '" placeholder="' + ph + '" required' + (ac === "new-password" ? ' minlength="8"' : "") + '>' + (ac.indexOf("password") >= 0 ? '<button type="button" class="eye" data-for="' + id + '" tabindex="-1">👁</button>' : "") + '</div>';
    view.innerHTML = '<div class="auth-hero"><div class="auth-card">' + logo +
      '<div class="t-nav auth-tabs" style="margin:16px 0 14px"><button class="btn btn-green" id="tabIn">🔑 Entrar</button><button class="btn btn-ghost" id="tabUp">✚ Crear cuenta</button></div>' +
      '<form id="formIn" class="auth-form">' +
      '<label class="f">Email</label>' + pin("inEmail", "✉️", "tucorreo@ejemplo.es", "email") +
      '<label class="f" style="margin-top:10px">Contraseña</label>' + pin("inPass", "🔐", "Tu contraseña", "current-password") +
      '<button class="btn btn-gold btn-block auth-cta">⚔️ Entrar</button></form>' +
      '<form id="formUp" class="auth-form" style="display:none">' +
      '<label class="f">Tu nombre o alias</label>' + pin("upName", "🪖", "Cómo te verán en el ranking", "name") +
      '<label class="f" style="margin-top:10px">Email</label>' + pin("upEmail", "✉️", "tucorreo@ejemplo.es", "email") +
      '<label class="f" style="margin-top:10px">Contraseña (mín. 8)</label>' + pin("upPass", "🔐", "Mínimo 8 caracteres", "new-password") +
      '<p class="small muted" style="margin:14px 0 6px"><b>¿Qué vas a estudiar?</b> <span class="muted">(podrás cambiarlo en tu perfil y te acompañará en cualquier dispositivo)</span></p>' +
      '<div class="curso-cards">' +
        '<label class="up-curso sel"><input type="radio" name="upCurso" value="cabo" checked><span class="uc-ico">🎖️</span><span class="uc-txt"><b>Ascenso a Cabo</b><span class="small muted">Ejército de Tierra · oposición</span></span><span class="uc-check">✔</span></label>' +
        '<label class="up-curso"><input type="radio" name="upCurso" value="cabo1"><span class="uc-ico">⭐</span><span class="uc-txt"><b>Cabo 1º</b><span class="small muted">oposición + fase a distancia</span></span><span class="uc-check">✔</span></label>' +
        '<label class="up-curso"><input type="radio" name="upCurso" value="perm"><span class="uc-ico">🛡️</span><span class="uc-txt"><b>Permanente</b><span class="small muted">FAS · 100 preguntas</span></span><span class="uc-check">✔</span></label>' +
      '</div>' +
      '<button class="btn btn-gold btn-block auth-cta">🚀 Crear cuenta gratis</button></form>' +
      '<div id="gsiBox" style="display:none"><div class="auth-div"><span>o</span></div><div id="gsiBtn" class="gsi-btn"></div></div>' +
      '<p class="small muted center" id="cErr" style="color:#b3261e;display:none;margin-top:10px"></p>' +
      '<p class="small muted center" style="margin-top:12px">Cuenta gratis: ranking global <b>real</b>, punto 🟢 en línea y tu progreso en todos tus dispositivos. Datos mínimos y cifrados.</p>' +
      '<p class="small muted center" style="margin:8px 0 0">🎓 ' + ((window.__bancoCurado || 0) > 0 ? '<b>' + window.__bancoCurado.toLocaleString("es-ES") + '</b> preguntas auditadas · ' : "") + '3 cursos · exámenes oficiales · duelos 1vs1.<br>Academias de pago: 25-50 € por convocatoria (o 39 €/mes). MICABO: <b>0 €</b>, sin premium.</p></div></div>';
    const err = m => { const e = $("#cErr"); e.textContent = m; e.style.display = "block"; };
    const tabs = [$("#tabIn"), $("#tabUp")], forms = [$("#formIn"), $("#formUp")];
    const marca = i => { tabs.forEach((t, j) => { t.className = "btn " + (j === i ? "btn-green" : "btn-ghost"); forms[j].style.display = j === i ? "block" : "none"; }); };
    $("#tabIn").onclick = () => marca(0);
    $("#tabUp").onclick = () => marca(1);
    /* ojito mostrar/ocultar contraseña */
    document.querySelectorAll(".eye").forEach(b => b.onclick = () => { const i = document.getElementById(b.dataset.for); if (!i) return; const ver = i.type === "password"; i.type = ver ? "text" : "password"; b.textContent = ver ? "🙈" : "👁"; });
    /* tarjetas de curso: la marcada se ilumina */
    document.querySelectorAll(".up-curso input").forEach(r => r.addEventListener("change", () => document.querySelectorAll(".up-curso").forEach(l => l.classList.toggle("sel", l.querySelector("input").checked))));
    const entra = (user, esRegistro) => {
      C.user = user; paintChip(); aplicaCursoCuenta(user);
      if (esRegistro) { toast("🎓 Curso: " + nombreCurso(user.curso) + " · ¡a estudiar!"); if (location.hash !== "#/entrenar") location.hash = "#/entrenar"; }
      else if (typeof window.abrirCursos === "function") setTimeout(() => window.abrirCursos(true), 450);
      try { window.cloudSync(true); } catch (e) {}
      if (!esRegistro) { try { window.vCuenta(); } catch (e) {} }
    };
    $("#formIn").onsubmit = ev => { ev.preventDefault(); api("POST", "/api/login", { email: $("#inEmail").value, password: $("#inPass").value }).then(d => entra(d.user, false)).catch(e => err(e.message)); };
    $("#formUp").onsubmit = ev => { ev.preventDefault(); const curso = (document.querySelector("input[name=upCurso]:checked") || {}).value || "cabo"; api("POST", "/api/register", { name: $("#upName").value, email: $("#upEmail").value, password: $("#upPass").value, curso: curso }).then(d => entra(d.user, true)).catch(e => err(e.message)); };
    /* botón «Continuar con Google» (solo si el servidor tiene GOOGLE_CLIENT_ID) */
    (async () => {
      try {
        if (!C.cfg) C.cfg = await api("GET", "/api/config").catch(() => null);
        const gcid = C.cfg && C.cfg.gcid;
        const box = $("#gsiBox");
        if (!gcid || !box) return; /* sin Google activado: el bloque ni aparece */
        box.style.display = "block";
        if (!window.google || !window.google.accounts) {
          if (!document.getElementById("gsiScript")) {
            const s = document.createElement("script"); s.id = "gsiScript"; s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true;
            document.head.appendChild(s);
          }
          await new Promise(r => { const t0 = Date.now(); const t = setInterval(() => { if ((window.google && window.google.accounts) || Date.now() - t0 > 4000) { clearInterval(t); r(); } }, 150); });
        }
        if (window.google && window.google.accounts && !box.dataset.montado) {
          box.dataset.montado = "1";
          google.accounts.id.initialize({ client_id: gcid, callback: async resp => {
            try { const d = await api("POST", "/api/google", { credential: resp.credential }); entra(d.user, false); toast("🎓 Curso: " + nombreCurso(d.user.curso)); }
            catch (e) { err(e.message); }
          }});
          google.accounts.id.renderButton($("#gsiBtn"), { theme: "outline", size: "large", shape: "pill", text: "continue_with", logo_alignment: "left", width: 300, locale: "es" });
        }
      } catch (e) {}
    })();
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
    api("POST", "/api/privacy/delete").then(() => { C.user = null; paintChip(); toast("Cuenta eliminada. Un saludo, y hasta pronto."); setTimeout(() => location.href = "/app.html", 1200); }).catch(e => toast("No se pudo eliminar: " + e.message));
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
  api("GET", "/api/me").then(d => { C.user = d.user; paintChip(); aplicaCursoCuenta(d.user); window.cloudSync(false); beat(); }).catch(() => { paintChip(); beat(); });
};
})();
