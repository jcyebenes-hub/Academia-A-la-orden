#!/usr/bin/env node
/* ============================================================
   A LA ORDEN · Motor de ALERTAS BOD + vigía de Telegram (zero deps)
   ------------------------------------------------------------
   ¿Qué hace?
   1. Lee los EXTRACTOS PÚBLICOS del BOD que publica ATME
      (www.atme.es/category/bod, asociación de Tropa y Marinería)
      y filtra lo que afecta a ascenso a Cabo / Cabo 1º / permanencia.
   2. Mezcla con las semillas verificadas (tools/bod-seed.js).
   3. Genera js/bod-data.js (panel "📡 Alertas BOD" de la app).
   4. Genera tools/bod-outbox.txt con los textos listos para pegar
      en Telegram/WhatsApp/foros.
   5. Con --post y las variables TELEGRAM_BOT_TOKEN + TELEGRAM_CHANNEL,
      publica él solo las alertas nuevas en tu canal (api.telegram.org).
   6. VIGÍA TELEGRAM: revisa canales públicos (t.me/s/...) y si aparece
      una pregunta de test la cosecha en tools/tg-harvest.json para
      extraer hechos verificados después.

   Uso:
     node tools/bod-check.js            # actualizar datos + outbox
     node tools/bod-check.js --post     # + publicar nuevas en Telegram
   ============================================================ */
"use strict";
const fs = require("fs");
/* carga galon/.env si existe (sin pisar variables ya exportadas) */
try {
  for (const line of fs.readFileSync(require("path").join(__dirname, "..", ".env"), "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
} catch (e) {}
const path = require("path");
const R = p => path.join(__dirname, p);

/* ---------------- configuración ---------------- */
const CAT = "https://www.atme.es/category/bod/";
const MAX_ARTICULOS = 3;              // últimos N números a procesar por pasada
const MAX_ALERTAS = 40;               // cap en el panel
const VIGIA = ["ascenso_a_cabo", "CursoCaboEt2020"]; // canales t.me/s/ vigilados
const GATE = /ascenso a cabo|cabo primero|cabo 1º|curso de actualización|permanencia|permanente 20|plazas|concurso-oposición|prueba f[íi]sica|tiempo de permanencia|ascenso/i;
const STATE_PATH = R(".bod-state.json");
const OUT_APP = R("../js/bod-data.js");
const OUT_BOX = R("bod-outbox.txt");
const HARVEST = R("tg-harvest.json");
const BASE_URL = (process.env.PUBLIC_URL || "").replace(/\/$/, ""); // solo dominio real

/* ---------------- utilidades ---------------- */
function stripHtml(h) {
  return h
    .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;|&rsquo;/g, "'").replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú").replace(/&ntilde;/g, "ñ").replace(/&#8211;|&#8220;|&#8221;/g, "-");
}
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function bonito(iso) { const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]}-${MESES[+m[2]-1]}-${m[1]}` : iso; }
async function get(u) {
  const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (GALON alerts)" } });
  if (!r.ok) throw new Error(u + " -> HTTP " + r.status);
  return r.text();
}
function loadState() { try { return JSON.parse(fs.readFileSync(STATE_PATH, "utf8")); } catch { return { alerts: [], posted: [], tgSeen: [] }; } }
function saveState(s) { fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 1)); }
function tagDe(txt) {
  if (/cabo primero|cabo 1º/i.test(txt)) return "Cabo 1º";
  if (/ascenso a cabo(?! primero)|curso de cabo(?! primero)/i.test(txt)) return "Cabo";
  if (/permanencia|permanente/i.test(txt)) return "Permanente";
  if (/mariner[ií]a|tropa/i.test(txt)) return "TyM";
  return "BOD";
}

/* ---------------- 1 · ATME: extractos públicos del BOD ---------------- */
/* El extracto íntegro va en <meta property="og:description"> del artículo,
   separado por saltos de línea. Filtramos lo que afecta a ascensos/permanencia;
   si un número no trae nada relevante, generamos "latido" (BOD revisado). */
const FUERTE = /ascenso|cabo primero|cabo 1º|permanencia|permanente|plazas|concurso-oposición|curso de actualización|prueba f[íi]sica/i;
async function rascarAtme(state) {
  const html = await get(CAT);
  const arts = [...html.matchAll(/<article[\s\S]*?<\/article>/gi)].map(a => a[0]);
  const items = [];
  for (const a of arts) {
    const url = (a.match(/<a[^>]*href="(https:\/\/www\.atme\.es\/[^"]+)"/) || [])[1];
    const dt = (a.match(/datetime="(\d{4}-\d{2}-\d{2})/) || [])[1];
    const tit = stripHtml((a.match(/<h2[\s\S]*?<\/h2>/) || [""])[0]).replace(/\s+/g, " ").trim();
    if (url && dt) items.push({ url, dt, tit });
  }
  items.sort((x, y) => y.dt.localeCompare(x.dt));
  const alerts = [];
  for (const it of items.slice(0, MAX_ARTICULOS)) {
    let og = "";
    try {
      const h = await get(it.url);
      const m = h.match(/<meta property="og:description" content="([\s\S]*?)"/i);
      og = m ? stripHtml(m[1]) : "";
    } catch (e) { console.log("  · art. fallido:", e.message); continue; }
    const lineas = og.split(/\n+/).map(t => t.replace(/\s+/g, " ").trim())
      .filter(t => t.length >= 25 && t.length <= 300);
    const fuertes = [...new Set(lineas.filter(l => FUERTE.test(l)))].slice(0, 4);
    if (fuertes.length) {
      for (const l of fuertes) alerts.push({ ts: Date.parse(it.dt + "T09:00:00Z"), d: bonito(it.dt), tag: tagDe(l), t: it.tit, x: l, url: it.url });
    } else {
      const muestra = (lineas.find(l => /tropa|mariner/i.test(l) && !/^EXTRACTO DEL BOD/i.test(l)) || "Extracto del BOD sobre temas que afectan a Tropa y Marinería.");
      alerts.push({ ts: Date.parse(it.dt + "T09:00:00Z"), d: bonito(it.dt), tag: "BOD", t: it.tit, x: "Revisado: sin novedades que afecten a ascensos. " + muestra.slice(0, 180), url: it.url });
    }
  }
  return alerts;
}

/* ---------------- 2 · vigía de Telegram (cosecha de preguntas) ---------------- */
async function vigiarTelegram(state) {
  let hav = [];
  try { hav = JSON.parse(fs.readFileSync(HARVEST, "utf8")); } catch { hav = []; }
  let nuevas = 0;
  for (const user of VIGIA) {
    try {
      const html = await get("https://t.me/s/" + user);
      const msgs = [...html.matchAll(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g)].map(m => stripHtml(m[1]).replace(/\s+/g, " ").trim());
      for (const m of msgs) {
        const clave = user + "|" + m.slice(0, 80);
        if (state.tgSeen.includes(clave)) continue;
        state.tgSeen.push(clave);
        if (/pregunta|test|examen|cabo|cuesti[oó]n/i.test(m) && m.length > 40) {
          hav.push({ user, fecha: new Date().toISOString().slice(0, 10), text: m });
          nuevas++;
        }
      }
    } catch (e) { console.log("  · vigía @" + user + ":", e.message); }
  }
  if (state.tgSeen.length > 500) state.tgSeen = state.tgSeen.slice(-500);
  if (nuevas) fs.writeFileSync(HARVEST, JSON.stringify(hav.slice(-200), null, 1));
  return nuevas;
}

/* ---------------- 3 · salida ---------------- */
function escribir(alertas) {
  alertas.sort((a, b) => b.ts - a.ts);
  const data = { updated: bonito(new Date().toISOString().slice(0, 10)), alerts: alertas.slice(0, MAX_ALERTAS) };
  fs.writeFileSync(OUT_APP, "/* A LA ORDEN · Alertas BOD — generado por tools/bod-check.js · NO editar a mano */\nwindow.GALON_BOD = " + JSON.stringify(data, null, 1) + ";\n");
  return data;
}
function rutasTelegram() {
  const out = [];
  if (process.env.TELEGRAM_CHANNEL) out.push({ tag: null, chat: process.env.TELEGRAM_CHANNEL.trim() });
  for (const par of (process.env.TELEGRAM_ROUTES || "").split(";")) {
    const m = /^\s*([^=@]+?)\s*=\s*(@\S+)\s*$/.exec(par);
    if (m) out.push({ tag: m[1].trim(), chat: m[2].trim() });
  }
  return out;
}
async function publicarTelegram(nuevas) {
  const tok = process.env.TELEGRAM_BOT_TOKEN;
  const rutas = rutasTelegram();
  if (!tok || !rutas.length) {
    console.log("\n› Publicación automática DESACTIVADA. Para activarla:\n" +
      "  1) @BotFather en Telegram → /newbot → copia el token.\n" +
      "  2) Crea canal(es) y añade tu bot como administrador.\n" +
      "  3) En galon/.env:\n" +
      "       TELEGRAM_BOT_TOKEN=xxx\n" +
      "       TELEGRAM_CHANNEL=@galon_alertas            (canal general)\n" +
      "       TELEGRAM_ROUTES=Cabo=@galon_cabo;Cabo 1º=@galon_cabo1;Permanente=@galon_perm  (opcional, 1 canal por curso)\n" +
      "  4) node tools/bod-check.js --post        (alertas)\n" +
      "     node tools/bod-check.js --pregunta    (pregunta del día por curso)\n" +
      "  (mientras tanto: textos listos en tools/bod-outbox.txt)");
    return;
  }
  let enviadas = 0;
  for (const a of nuevas.slice(0, 8)) {
    const txt = `📡 <b>${a.tag}: ${a.t}</b>\n${a.x}\n🗓 ${a.d} · <a href="${a.url || "https://www.atme.es/category/bod/"}">fuente</a>\n— A LA ORDEN · tu ascenso, gratis${BASE_URL ? ": " + BASE_URL : ""}`;
    for (const r of rutas) {
      if (r.tag && r.tag.toLowerCase() !== a.tag.toLowerCase()) continue;
      try {
        const resp = await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: r.chat, text: txt, parse_mode: "HTML" })
        });
        if (resp.ok) enviadas++; else console.log("  · TG KO en " + r.chat + ":", resp.status);
      } catch (e) { console.log("  · TG error en " + r.chat + ":", e.message); }
    }
  }
  console.log("› Telegram: " + enviadas + " envíos a " + rutas.length + " canal(es) configurado(s)");
}

/* pregunta del día: una por canal de curso (o aleatoria en el general) */
async function preguntaDelDia() {
  const TG = require("./telegram-bot.js");
  const tok = process.env.TELEGRAM_BOT_TOKEN;
  const rutas = rutasTelegram();
  if (!tok || !rutas.length) { console.log("› --pregunta: sin TELEGRAM_BOT_TOKEN ni canales configurados (ver --post para instrucciones)"); return; }
  const mapa = { "Cabo": "cabo", "Cabo 1º": "cabo1", "Permanente": "perm" };
  const vistos = new Set();
  for (const r of rutas) {
    const curso = r.tag ? mapa[r.tag] : ["cabo", "cabo1", "perm"][Math.floor(Math.random() * 3)];
    if (!curso || vistos.has(r.chat)) continue;
    vistos.add(r.chat);
    const q = TG.pregunta(curso);
    if (!q) continue;
    const msg = TG.textoPregunta(q);
    try {
      const resp = await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ chat_id: r.chat }, msg))
      });
      console.log("  · pregunta (" + TG.CURSOS[curso] + ") → " + r.chat + ": " + (resp.ok ? "OK" : "KO " + resp.status));
    } catch (e) { console.log("  · TG error en " + r.chat + ":", e.message); }
  }
}

/* ---------------- main ---------------- */
(async () => {
  const state = loadState();
  const semillas = require("./bod-seed.js").map(s => ({ ts: Date.parse(s.dateISO + "T09:00:00Z"), d: bonito(s.dateISO), tag: s.tag, t: s.t, x: s.x, url: s.url || "" }));
  let vivas = [];
  try { vivas = await rascarAtme(state); console.log("› ATME: " + vivas.length + " alertas de los últimos números"); }
  catch (e) { console.log("› ATME no accesible (" + e.message + ") — salgo con histórico+semillas"); }
  const K = a => a.t + "|" + a.x;
  const mapa = new Map();
  vivas.concat(state.alerts || []).forEach(a => { if (!mapa.has(K(a))) mapa.set(K(a), a); });
  state.alerts = [...mapa.values()].sort((a, b) => b.ts - a.ts).slice(0, 100);
  const todas = state.alerts.concat(semillas.filter(s2 => !mapa.has(K(s2))));
  const data = escribir(todas);
  console.log("› js/bod-data.js: " + data.alerts.length + " alertas (actualizado " + data.updated + ")");

  /* outbox: textos listos para pegar (solo las nuevas de esta pasada) */
  const previas = new Set(state.posted);
  const nuevasOut = data.alerts.filter(a => !previas.has(K(a)));
  const outbox = nuevasOut.map(a => `📡 ${a.tag}: ${a.t}\n${a.x}\n🗓 ${a.d} · fuente: ${a.url || "extracto BOD (ATME)"}\n— A LA ORDEN · tu ascenso, gratis${BASE_URL ? ": " + BASE_URL : ""}\n`).join("\n");
  if (nuevasOut.length) fs.writeFileSync(OUT_BOX, outbox);
  console.log("› outbox: " + nuevasOut.length + " textos listos en tools/bod-outbox.txt");

  const tgNuevas = await vigiarTelegram(state);
  console.log("› vigía Telegram: " + tgNuevas + " mensajes con posibles preguntas → tools/tg-harvest.json");

  if (state.posted.length > 400) state.posted = state.posted.slice(-400);
  saveState(state);
  if (process.argv.includes("--pregunta")) await preguntaDelDia();
  if (process.argv.includes("--post")) {
    await publicarTelegram(nuevasOut);
    state.posted.push(...nuevasOut.map(K));
    saveState(state);
  }
})();
