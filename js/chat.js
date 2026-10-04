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
  burbuja("bot", "¡A sus órdenes, soldado! 🎖️ Pregúntame lo que quieras: dudas del temario o de alguna pregunta de test, cómo va el examen, cómo apoyar al proyecto… o si prefieres hablar con una persona, te digo cómo.");
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
function pregunta(txt) {
  ocupado = true;
  const esp = burbuja("bot", "…");
  esp.classList.add("chat-espera");
  fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msg: txt, curso: (window.AO && AO.stateRef && AO.stateRef().course) || "" }) })
    .then(r => r.json().then(d => { if (!r.ok) throw new Error(d.error || "HTTP " + r.status); return d; }))
    .then(d => {
      esp.remove();
      burbuja("bot", d.text || "…");
      (d.fuentes || []).slice(0, 3).forEach(f => {
        const b = document.createElement("div"); b.className = "chat-fuente";
        b.textContent = "📎 " + (f.id || "") + (f.t ? " · " + f.t : "");
        $("#chatMsgs").appendChild(b);
      });
      const ms = $("#chatMsgs"); if (ms) ms.scrollTop = ms.scrollHeight;
    })
    .catch(e => { esp.remove(); burbuja("bot", "Se me ha ido la conexión con el cuartel (" + e.message + "). Inténtalo otra vez en un momento. 📡"); })
    .finally(() => { ocupado = false; });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", monta); else monta();
})();
