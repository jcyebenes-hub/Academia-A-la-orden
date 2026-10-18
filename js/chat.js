/* MICABO — Sargento MICABO: chat de ayuda con IA (temario, examen, proyecto, contacto) */
(function () {
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const linkify = t => t.replace(/(https:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--gold-d);text-decoration:underline">$1</a>').replace(/\n/g, "<br>");
let abierto = false, ocupado = false, WA = "";
const CHIPS = ["¿Cómo es el examen de Cabo?", "¿Cómo apoyo al proyecto?", "¿Qué es un centinela?", "Hablar con vosotros"];

function monta() {
  const fab = document.createElement("button");
  fab.id = "chatFab"; fab.type = "button"; fab.setAttribute("aria-label", "Abrir chat de ayuda");
  fab.innerHTML = "🎖️<span class=\"chat-fab-txt\">Dudas</span>";
  fab.onclick = () => { abierto = !abierto; if (abierto) { $("#chatWin").classList.add("on"); const i = $("#chatIn"); if (i) i.focus(); } else $("#chatWin").classList.remove("on"); };
  document.body.appendChild(fab);

  const win = document.createElement("div");
  win.id = "chatWin";
  win.innerHTML =
    '<div class="chat-head"><div class="chat-avatar">🎖️</div><div class="chat-hd"><b>Sargento MICABO</b><span>temario · examen · proyecto · nosotros</span></div><button type="button" id="chatX" aria-label="Cerrar">✕</button></div>' +
    '<div class="chat-msgs" id="chatMsgs"></div>' +
    '<div class="chat-chips" id="chatChips"></div>' +
    '<form class="chat-in" id="chatForm"><input id="chatIn" type="text" maxlength="400" placeholder="Escribe tu duda…" autocomplete="off"><button class="chat-send" type="submit" aria-label="Enviar">➤</button></form>';
  document.body.appendChild(win);
  $("#chatX").onclick = () => { abierto = false; win.classList.remove("on"); };
  CHIPS.forEach(c => {
    const b = document.createElement("button"); b.type = "button"; b.className = "chat-chip"; b.textContent = c;
    b.onclick = () => { $("#chatIn").value = c; $("#chatForm").dispatchEvent(new Event("submit")); };
    $("#chatChips").appendChild(b);
  });
  $("#chatForm").onsubmit = ev => {
    ev.preventDefault();
    const inp = $("#chatIn"), txt = inp.value.trim();
    if (!txt || ocupado) return;
    inp.value = "";
    burbuja("yo", txt);
    pregunta(txt);
  };
  const nm = (window.AO && AO.stateRef && AO.stateRef().name) || "";
  const saludo = nm && nm !== "Recluta" ? "¡A sus órdenes, " + nm + "! 🎖️" : "¡A sus órdenes, soldado! 🎖️";
  const wb = burbuja("bot", "");
  teclea(wb, saludo + " Pregúntame lo que quieras: dudas del temario o de alguna pregunta de test, cómo va el examen, cómo apoyar al proyecto… o si prefieres hablar con una persona, te digo cómo.");
  fetch("/api/config").then(r => r.json()).then(d => { WA = (d && d.wa) || ""; }).catch(() => {});
}
function burbuja(quien, html) {
  const m = document.createElement("div");
  m.className = "chat-msg " + (quien === "yo" ? "chat-yo" : "chat-bot");
  m.innerHTML = quien === "yo" ? esc(html) : linkify(esc(html));
  const ms = $("#chatMsgs"); if (!ms) return;
  ms.appendChild(m); ms.scrollTop = ms.scrollHeight;
  return m;
}
/* v189: el Sargento EJECUTA — el server devuelve command y aquí se obra */
function ejecuta(c) {
  try {
    if (c.type === "nav" && c.to) { location.hash = c.to; return; }
    const st = (window.AO && AO.stateRef && AO.stateRef()) || { course: "cabo" };
    const curso = ["cabo", "cabo1", "perm"].includes(st.course) ? st.course : "cabo";
    const CC = (typeof COURSES !== "undefined" && COURSES[curso] && COURSES[curso].exam) ? COURSES[curso].exam : { questions: 50, minutes: 70 };
    if (c.type === "test") {
      if (c.topic) startTest({ course: curso, filter: "tema", topic: c.topic, n: 999, mode: "study", label: "Test · " + c.topic });
      else startTest({ course: curso, filter: "all", n: 10, mode: "study", label: "Test rápido (chat)" });
      return;
    }
    if (c.type === "simulacro") { startTest({ course: curso, filter: "all", n: CC.questions || 50, mode: "exam", minutes: CC.minutes || 70, label: "Simulacro oficial", simulacro: true }); return; }
    if (c.type === "examen25") { startTest({ course: curso, filter: "all", n: 25, mode: "exam", minutes: 30, label: "Modo examen (chat)" }); return; }
  } catch (e) {}
}
/* v192: escritura progresiva (tipo chatbot real) + botones de acción «pincha aquí» */
function teclea(el, txt, fin) {
  const ms = $("#chatMsgs");
  const span = document.createElement("span");
  el.textContent = ""; el.appendChild(span);
  const paso = Math.max(2, Math.ceil(txt.length / 140)); /* ~2,2 s máximo siempre */
  let i = 0;
  (function tira() {
    i = Math.min(txt.length, i + paso);
    span.textContent = txt.slice(0, i);
    if (ms) ms.scrollTop = ms.scrollHeight;
    if (i < txt.length) setTimeout(tira, 16);
    else { el.innerHTML = linkify(esc(txt)); if (fin) fin(); if (ms) ms.scrollTop = ms.scrollHeight; }
  })();
}
function añadeAcciones(accs) {
  const ms = $("#chatMsgs"); if (!ms) return;
  const box = document.createElement("div"); box.className = "chat-acc";
  accs.slice(0, 4).forEach(a => {
    const b = document.createElement("button"); b.type = "button"; b.className = "chat-chip";
    b.textContent = a.l || "Ir";
    b.onclick = () => { if (window.AO) ejecuta(a.c); else burbuja("bot", "Dale a «Abrir la app» y pídemelo dentro: te lo ejecuto al momento. 🫡"); };
    box.appendChild(b);
  });
  ms.appendChild(box); ms.scrollTop = ms.scrollHeight;
}
function pregunta(txt) {
  ocupado = true;
  const esp = burbuja("bot", "…");
  esp.classList.add("chat-espera");
  fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msg: txt, curso: (window.AO && AO.stateRef && AO.stateRef().course) || "" }) })
    .then(r => r.json().then(d => { if (!r.ok) throw new Error(d.error || "HTTP " + r.status); return d; }))
    .then(d => {
      esp.remove();
      const mb = burbuja("bot", "");
      teclea(mb, d.text || "…", () => {
        if (d.command) { if (window.AO) setTimeout(() => ejecuta(d.command), 350); else burbuja("bot", "Para que pueda ejecutártelo, dale a «Abrir la app» y pídemelo dentro. 🫡"); }
        if (d.acciones && d.acciones.length) añadeAcciones(d.acciones);
        (d.fuentes || []).slice(0, 3).forEach(f => {
          const b = document.createElement("div"); b.className = "chat-fuente";
          b.textContent = "📎 " + (f.id || "") + (f.t ? " · " + f.t : "");
          $("#chatMsgs").appendChild(b);
        });
        const ms = $("#chatMsgs"); if (ms) ms.scrollTop = ms.scrollHeight;
      });
    })
    .catch(e => { esp.remove(); burbuja("bot", "Se me ha ido la conexión con el cuartel (" + e.message + "). Inténtalo otra vez en un momento. 📡"); })
    .finally(() => { ocupado = false; });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", monta); else monta();
})();
