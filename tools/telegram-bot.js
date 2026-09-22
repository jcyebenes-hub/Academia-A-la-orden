#!/usr/bin/env node
/* ============================================================
   A LA ORDEN · BOT DE TELEGRAM (interactivo, cero dependencias)
   ------------------------------------------------------------
   Un solo bot sirve toda la comunidad (y puede administrar los
   3 canales). Comandos reales, datos reales del banco auditado:
     /start · /ayuda          → menú
     /pregunta [cabo|cabo1|perm] → pregunta real, respuesta en SPOILER
     /online                  → quién está en línea (presencia real del servidor)
     /ranking                 → top 5 real por XP
     /stats                   → el banco, de viva voz
   Arranque:  TELEGRAM_BOT_TOKEN=xxxx node tools/telegram-bot.js
   (lee galon/.env si existe). Sin token imprime las instrucciones.
   Como módulo exporta utilidades para bod-check.js (--pregunta).
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

/* ---- carga .env si existe (sin pisar variables ya exportadas) ---- */
(function () {
  try {
    for (const line of fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch (e) { /* sin .env, vale */ }
})();

const TOK = process.env.TELEGRAM_BOT_TOKEN;
const API = (process.env.BOT_API_URL || "http://localhost:8000").replace(/\/$/, "");
/* URL pública de la app: SOLO cuando exista de verdad (PUBLIC_URL en .env). Cero enlaces inventados. */
const APP = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
const APPLINK = APP ? APP + "/app.html" : null;

/* ---- banco auditado (mismo cargador que la app) ---- */
const W = {};
try {
  const src = ["data", "bank2", "bank3", "bank4", "study", "bank5", "bank7", "verdicts", "convocatorias"]
    .map(f => fs.readFileSync(path.join(ROOT, "js", f + ".js"), "utf8")).join("\n;\n");
  new Function("window", "var document={readyState:'complete',addEventListener:function(){},getElementById:function(){return null;}};" + src + "; window.QUESTIONS = QUESTIONS; window.COURSES = COURSES;")(W);
} catch (e) { console.error("banco no disponible:", e.message); }
const ALL = [].concat(W.QUESTIONS || [], W.QUESTIONS2 || [], W.QUESTIONS3 || [], W.QUESTIONS4 || [], W.QUESTIONS5 || [], W.QUESTIONS6 || [], W.QUESTIONS7 || []);
const VERD = W.VERDICTS || {};
const BANK = ALL.filter(q => { const v = VERD[q.id]; return !(v && v.v === "ko"); });
const CURSOS = { cabo: "Cabo (ET)", cabo1: "Cabo 1º (ET)", perm: "Permanencia" };

/* ---- estado del bot (preguntas ya servidas, para no repetir) ---- */
const SFILE = path.join(ROOT, "tools", ".bot-state.json");
let BST = {};
try { BST = JSON.parse(fs.readFileSync(SFILE, "utf8")); } catch (e) { BST = {}; }
const saveBST = () => { try { fs.writeFileSync(SFILE, JSON.stringify(BST)); } catch (e) {} };

function pregunta(curso) {
  const pool = BANK.filter(q => !curso || q.c === curso);
  if (!pool.length) return null;
  const key = curso || "all";
  const used = new Set((BST.used || {})[key] || []);
  let libres = pool.filter(q => !used.has(q.id));
  if (!libres.length) { used.clear(); libres = pool; }
  const q = libres[Math.floor(Math.random() * libres.length)];
  used.add(q.id);
  BST.used = BST.used || {};
  BST.used[key] = [...used].slice(-400);
  saveBST();
  return q;
}

/* texto + respuesta oculta con entidad spoiler (offsets UTF-16; sin emojis en el texto) */
function textoPregunta(q) {
  const L = "ABCD";
  let txt = "PREGUNTA A LA ORDEN (" + CURSOS[q.c] + ")\n\n" + q.q + "\n\n";
  q.o.forEach((o, i) => { txt += L[i] + ") " + o + "\n"; });
  txt += "\nRespuesta: ";
  const off = txt.length;
  const spo = L[q.a] + ") " + q.o[q.a];
  txt += spo;
  txt += "\n\nExplicación: " + (q.x || "") + "\nRef: " + (q.r || "banco A LA ORDEN") + (APPLINK ? "\nPractícalo gratis: " + APPLINK : "");
  return { text: txt, entities: [{ type: "spoiler", offset: off, length: spo.length }] };
}

/* ---- api de telegram ---- */
async function api(method, payload) {
  const r = await fetch("https://api.telegram.org/bot" + TOK + "/" + method, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {})
  });
  const d = await r.json().catch(() => ({ ok: false, description: "respuesta no JSON" }));
  if (!d.ok) throw new Error(d.description || ("HTTP " + r.status));
  return d.result;
}

/* ---- datos reales del servidor ---- */
async function online() {
  try { const r = await fetch(API + "/api/online"); const d = await r.json();
    return "🟢 En línea ahora: " + d.total + (d.users && d.users.length ? "\n👤 " + d.users.slice(0, 10).join(", ") : "") +
      (d.anon ? "\n Stealth: " + d.anon + " sin cuenta (se cuentan, no se identifican)" : "");
  } catch (e) { return "El servidor no responde ahora mismo."; }
}
async function ranking() {
  try {
    const r = await fetch(API + "/api/ranking"); const d = await r.json();
    if (!d.users || !d.users.length) return "Aún no hay nadie con cuenta en el ranking global. ¡Sé el primero!";
    return "🏆 TOP REAL por XP:\n" + d.users.slice(0, 5).map((u, i) => (i + 1) + ". " + u.name + " — " + u.xp + " XP").join("\n") + "\n\nSin bots, sin humo: XP de cuentas reales.";
  } catch (e) { return "El servidor no responde ahora mismo."; }
}
function stats() {
  const n = c => BANK.filter(q => q.c === c).length;
  return "📚 Banco auditado: " + BANK.length + " preguntas (0 incidencias, acta pública)\n· Cabo: " + n("cabo") + "\n· Cabo 1º: " + n("cabo1") + "\n· Permanencia: " + n("perm") + "\n\nVerificadas contra BOE/BOD y norma vigente. Gratis para siempre.";
}

const KB = {
  keyboard: [
    [{ text: "🎲 Pregunta" }, { text: "📚 Elegir curso" }, { text: "🗓 Exámenes" }],
    [{ text: "🟢 En línea" }, { text: "🏆 Ranking" }, { text: "❓ Ayuda" }]
  ],
  resize_keyboard: true, is_persistent: true,
  input_field_placeholder: "O escribe: «pregunta de cabo»…"
};
const kbCursos = {
  inline_keyboard: [[
    { text: "🪖 Cabo (ET)", callback_data: "q:cabo" },
    { text: "⭐ Cabo 1º", callback_data: "q:cabo1" },
    { text: "🎯 Permanencia", callback_data: "q:perm" }
  ]]
};
const kbOtra = {
  inline_keyboard: [[
    { text: "🎲 Otra", callback_data: "q" },
    { text: "📚 Elegir curso", callback_data: "cursos" }
  ]]
};
const AYUDA = [
  "🎖 A LA ORDEN · cómo funciona (todo gratis)",
  "",
  "1) «🎲 Pregunta» → pregunta real de examen. La respuesta viene oculta: toca el velo negro y se revela.",
  "2) «📚 Elegir curso» → Cabo, Cabo 1º o Permanencia.",
  "3) «🗓 Exámenes» → fechas de convocatorias (distinguiendo oficial de prevista).",
  "4) «🟢 En línea» / «🏆 Ranking» → datos reales de la plataforma, nada inventado.",
  "",
  "También me puedes escribir en cristiano: «pregunta de permanencia», «cuándo es el examen», «gracias»…",
  "",
  APPLINK ? "App completa (temas, simulacros, tu rincón): " + APPLINK : "App web completa: muy pronto (estamos en lanzamiento)",
  "Todo gratis; se mantiene con cafés ☕ voluntarios."
].join("\n");

function textoConvos() {
  const C = W.GALON_CONVOS;
  if (!C || !C.cursos) return "Ahora mismo no tengo las fechas a mano — están en la app → Convocatorias" + (APPLINK ? ": " + APPLINK : " (app web muy pronto)");
  const L = ["🗓 Convocatorias (revisadas el " + C.actualizado + ")", ""];
  for (const c of C.cursos) {
    L.push("▸ " + c.nombre + " · " + c.badge);
    for (const h of (c.hitos || []).slice(0, 3)) L.push("   • " + h.k + ": " + h.d + (h.est ? " (~ prevista)" : ""));
  }
  L.push("", APPLINK ? "Detalle completo en la app → Convocatorias. " + APPLINK : "Detalle completo en la app → Convocatorias (app web muy pronto).");
  return L.join("\n");
}

/* ---- procesar un mensaje ---- */
async function despacha(chatId, text) {
  const raw = (text || "").trim();
  /* quita emojis (textos de los botones) y normaliza; conserva letras, números y / */
  const t = raw.toLowerCase().replace(/[^\p{L}\p{N}\s\/:¿?¡!'-]/gu, " ").replace(/\s+/g, " ").trim();
  const cursoDe = (x) => /cabo ?1|cabo1|primero/.test(x) ? "cabo1" : /(^|\s)perm/.test(x) ? "perm" : /(^|\s)cabo/.test(x) ? "cabo" : null;

  if (t.startsWith("/start")) {
    return api("sendMessage", { chat_id: chatId, reply_markup: KB, text: "🎖 ¡Hola! Soy el bot de A LA ORDEN, tu academia de tropa.\n\nPreguntas reales de los exámenes de ascenso — gratis y sin registro. Toca un botón de abajo 👇 (en cada pregunta, la respuesta viene oculta: tócala y se revela)." });
  }
  if (t.startsWith("/ayuda") || t === "/help" || /^(ayuda|help)\b/.test(t)) {
    return api("sendMessage", { chat_id: chatId, reply_markup: KB, text: AYUDA });
  }
  const curso = cursoDe(t);
  const pedir = (c) => {
    const q = pregunta(c || (BST.chat || {})[chatId]);
    if (!q) return api("sendMessage", { chat_id: chatId, text: "No hay preguntas disponibles ahora mismo." });
    BST.chat = BST.chat || {}; BST.chat[chatId] = q.c; saveBST();
    return api("sendMessage", Object.assign({ chat_id: chatId, reply_markup: kbOtra }, textoPregunta(q)));
  };
  if (t.startsWith("/pregunta") || /^(otra|siguiente|dame|repite|vamos|aleatoria|ya)\b/.test(t) || /^(pregunta|test)\b/.test(t)) return pedir(curso);
  if (t.startsWith("/cursos") || /elegir curso|^cursos?\b/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: "¿De qué curso la quieres? 🎯", reply_markup: kbCursos });
  }
  if (t.startsWith("/online") || /^en l(i|í)nea\b|^qui(e|é)n est(a|á) (conectado|en l(i|í)nea|online)/.test(t)) {
    api("sendChatAction", { chat_id: chatId, action: "typing" });
    return api("sendMessage", { chat_id: chatId, text: await online() });
  }
  if (t.startsWith("/ranking") || /ranking|^top\b|mejores/.test(t)) {
    api("sendChatAction", { chat_id: chatId, action: "typing" });
    return api("sendMessage", { chat_id: chatId, text: await ranking() });
  }
  if (t.startsWith("/stats") || /^banco\b|^el banco\b|cu(a|á)ntas preguntas/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: stats() });
  }
  if (t.startsWith("/examen") || /ex(a|á)men|convocatoria|cu(a|á)ndo|fechas/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: textoConvos() });
  }
  if (/gracias|thank/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: "¡Para eso estamos! Suerte en el ascenso 💪🎖" });
  }
  if (/^(adios|chao|hasta luego|nos vemos|hasta pronto)\b/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: "🫡 ¡Hasta pronto! Aquí me quedo: toca «🎲 Pregunta» cuando vuelvas." });
  }
  if (/gratis|precio|pagar|pago|donaci|donar|cuesta|coste|caf(e|é)/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: "Todo A LA ORDEN es gratis y sin registro: ni muros de pago ni funciones bloqueadas. Se mantiene con donaciones voluntarias (un café ☕) — quien no colabora tiene exactamente lo mismo." + (APPLINK ? "\n\nApp completa: " + APPLINK : "") });
  }
  if (/qui(e|é)n (eres|es galon|es alaorden)|que (es galon|es alaorden|eres)|qui(e|é)nes sois/.test(t)) {
    return api("sendMessage", { chat_id: chatId, text: "Soy el bot de A LA ORDEN 🎖 — la academia gratuita para ascender a Cabo, Cabo 1º o Permanencia en el Ejército de Tierra. Pregunto, tú contestas, subes de nivel.\n\nToca «🎲 Pregunta» y lo vemos." });
  }
  if (t.startsWith("/")) {
    return api("sendMessage", { chat_id: chatId, reply_markup: KB, text: "No conozco ese comando. Toca «❓ Ayuda» para ver todo lo que sé hacer." });
  }
  /* lenguaje natural que no encaja → respuesta útil SIEMPRE */
  return api("sendMessage", {
    chat_id: chatId,
    reply_markup: kbOtra,
    text: "Eso se me escapa 😅 — donde de verdad brillo es en tu ascenso:\n\n• «pregunta» o el botón 🎲 → te pongo a prueba\n• «exámenes» → fechas de convocatorias\n• «ranking» → quiénes van arriba\n\nApp completa (temas, simulacros, tu rincón): " + (APPLINK || "muy pronto, estamos en lanzamiento")
  });
}

/* ---- bucle long-polling (solo si se ejecuta directamente) ---- */
if (require.main === module) {
  if (!TOK) {
    console.log([
      "Falta el token del bot. Se consigue en 2 minutos:",
      "  1) Telegram → busca @BotFather → /newbot",
      "  2) Nombre: A LA ORDEN · Tu academia de tropa",
      "  3) Username: debe acabar en 'bot' (p. ej. alaorden_bot)",
      "  4) Copia el token (123456789:AA...) y:",
      "       export TELEGRAM_BOT_TOKEN=el-token",
      "       node tools/telegram-bot.js",
      "  (o pégalo en galon/.env: TELEGRAM_BOT_TOKEN=el-token)"
    ].join("\n"));
    process.exit(1);
  }
  let offset = 0;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  (async function loop() {
    console.log("🤖 Bot A LA ORDEN en marcha. Comandos: /pregunta /online /ranking /stats /ayuda");
    for (;;) {
      try {
        const ups = await api("getUpdates", { offset: offset, timeout: 25 });
        for (const u of ups) {
          offset = u.update_id + 1;
          /* el bot entra en un canal → se presenta y lo registra solo */
          const mc = u.my_chat_member;
          if (mc && mc.chat && mc.chat.type === "channel") {
            const st = (mc.new_chat_member || {}).status;
            if (st === "administrator" || st === "member") {
              BST.channels = BST.channels || {};
              BST.channels[String(mc.chat.id)] = { u: mc.chat.username || "", t: mc.chat.title || "", f: Date.now() };
              saveBST();
              try { await api("sendMessage", { chat_id: mc.chat.id, text: "✅ A LA ORDEN conectado a este canal: alertas BOD y pregunta del día, gratis. /pregunta tambien aqui en privado." }); }
              catch (e) { console.log("· saludo al canal falló:", e.message); }
              console.log("📣 añadido a canal @" + (mc.chat.username || mc.chat.id) + " (" + (mc.chat.title || "") + ")");
            }
            continue;
          }
          const cb = u.callback_query;
          if (cb && cb.data && cb.message && cb.message.chat) {
            try { await api("answerCallbackQuery", { callback_query_id: cb.id }); } catch (e2) {}
            const d = cb.data === "q" ? "/pregunta" : (cb.data.indexOf("q:") === 0 ? "/pregunta " + cb.data.slice(2) : "/" + cb.data);
            try { await despacha(cb.message.chat.id, d); } catch (e3) { console.log("· botón falló:", e3.message); }
            continue;
          }
          const m = u.message;
          if (!m || !m.text) continue;
          try { await despacha(m.chat.id, m.text); }
          catch (e) { console.log("· fallo respondiendo:", e.message); }
        }
      } catch (e) { console.log("· getUpdates:", e.message, "— reintento en 5s"); await sleep(5000); }
    }
  })();
}

/* ---- export para bod-check.js (--pregunta) ---- */
module.exports = { BANK, CURSOS, pregunta, textoPregunta, api, stats };
