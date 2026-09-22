/* A LA ORDEN — Servidor de PRODUCCIÓN (Node >= 18, sin dependencias obligatorias)
   ═══════════════════════════════════════════════════════════════════════════
   · Pagos: Stripe Checkout REAL (con STRIPE_SECRET_KEY) o Redsys REAL (TPV
     español, firma HMAC-SHA256 + 3DES del estándar v1.0). Sin claves → modo
     pruebas etiquetado, nunca cobra.
   · Seguridad: cabeceras, rate-limit por IP, bloqueo por fuerza bruta,
     comprobación de origen en POST, cookies Secure bajo HTTPS, scrypt.
   · Cuentas: verificación de email y restablecimiento (Resend con API key;
     sin clave, el token se registra en el log del servidor).
   · RGPD operativo: exportación y eliminación de cuenta por el interesado.
   · Contenido: endpoint /health, registro de auditoría, panel interno
     (revisar.html) protegido por ADMIN_TOKEN cuando se define.
   ═══════════════════════════════════════════════════════════════════════════ */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

/* ---------- configuración (.env opcional) ---------- */
const ROOT = __dirname;
(function loadEnv() {
  try {
    const txt = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
    txt.split("\n").forEach(l => {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(l);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    });
  } catch (e) {}
})();
const ENV = {
  PORT: parseInt(process.env.PORT || "8000", 10),
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || "",          // si se define, protege revisar.html y /api/admin
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",   // sk_live_... / sk_test_...
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "", // whsec_...
  STRIPE_PRICE: {                                        // price_xxx del panel Stripe
    "pro:monthly": process.env.PRICE_PRO_MONTHLY || "",
    "pro:single": process.env.PRICE_PRO_SINGLE || "",
    "carrera:monthly": process.env.PRICE_CARRERA_MONTHLY || "",
    "carrera:single": process.env.PRICE_CARRERA_SINGLE || ""
  },
  STRIPE_COUPON: process.env.STRIPE_COUPON_CABO10 || "",   // id de cupón 10% en Stripe
  REDSYS_MERCHANT_CODE: process.env.REDSYS_MERCHANT_CODE || "", // FUC 999999999 en pruebas
  REDSYS_TERMINAL: process.env.REDSYS_TERMINAL || "1",
  REDSYS_SECRET_KEY: process.env.REDSYS_SECRET_KEY || "",   // KC del TPV (base64)
  REDSYS_ENV: process.env.REDSYS_ENV || "test",             // test | prod
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  MAIL_FROM: process.env.MAIL_FROM || "A LA ORDEN <hola@alaorden.es>",
  PUBLIC_URL: (process.env.PUBLIC_URL || "").replace(/\/$/, ""),
  FORCE_SECURE_COOKIES: process.env.FORCE_SECURE_COOKIES === "1",
  CONTENT_STRICT: process.env.CONTENT_STRICT === "1"        // servir solo contenido aprobado por experto
};
const DATA = path.join(ROOT, "data");
for (const d of [DATA, path.join(DATA, "progress")]) fs.mkdirSync(d, { recursive: true });

/* ---------- utilidades ---------- */
const uid = () => crypto.randomBytes(9).toString("hex");
const now = () => Date.now();
const log = (...a) => console.log(new Date().toISOString(), ...a);
function jread(f, d) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } }
function jsave(f, o) { const t = f + ".tmp"; fs.writeFileSync(t, JSON.stringify(o)); fs.renameSync(t, f); }
function audit(action, ip, uidv, extra) {
  fs.appendFileSync(path.join(DATA, "audit.log"), JSON.stringify({ t: now(), action, ip, uid: uidv || null, extra: extra || null }) + "\n");
}
const users = jread(path.join(DATA, "users.json"), {});
const tokens = jread(path.join(DATA, "tokens.json"), {});
const payments = jread(path.join(DATA, "payments.json"), []);
/* ---------- DUELOS 1vs1 asíncronos (mismo examen para ambos; el servidor compara) ---------- */
const duelos = jread(path.join(DATA, "duelos.json"), {});
function saveDuelos() {
  try {
    const corte = now() - 7 * 24 * 3600 * 1000; // TTL 7 días
    for (const k of Object.keys(duelos)) if (duelos[k].creado < corte) delete duelos[k];
    fs.writeFileSync(path.join(DATA, "duelos.json"), JSON.stringify(duelos));
  } catch (e) {}
}
function normName(s) { return String(s || "").trim().toLowerCase(); }
function dueloVista(d, quien) {
  const rol = normName(quien) === normName(d.de) ? "de" : "para";
  const rival = rol === "de" ? "para" : "de";
  return { id: d.id, de: d.de, para: d.para, codigo: d.codigo, azar: !!d.azar, curso: d.curso, estado: d.estado, ganador: d.ganador, creado: d.creado, ids: d.ids, rol, mi: d.res[rol] != null ? d.res[rol] : null, rival: d.res[rival] != null ? d.res[rival] : null };
}
function nuevoCodigo() {
  const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin I,L,O,0,1 (no confundibles)
  let c = "";
  do {
    c = "";
    for (let i = 0; i < 6; i++) c += ABC[Math.floor(Math.random() * ABC.length)];
  } while (Object.values(duelos).some(d => d.codigo === c && d.estado === "pendiente"));
  return c;
}
const BANK_IDS_CACHE = {};
/* ---------- TRIVIAL DE LA TROPA (solitario o por código: misma semilla para ambos) ---------- */
const triviales = jread(path.join(DATA, "triviales.json"), {});
function saveTriviales() {
  try {
    const corte = now() - 7 * 24 * 3600 * 1000; // TTL 7 días
    for (const k of Object.keys(triviales)) if (triviales[k].creado < corte) delete triviales[k];
    fs.writeFileSync(path.join(DATA, "triviales.json"), JSON.stringify(triviales));
  } catch (e) {}
}
function trivialVista(t, quien) {
  const rol = normName(quien) === normName(t.de) ? "de" : "para";
  return { id: t.id, de: t.de, para: t.para, codigo: t.codigo, curso: t.curso, seed: t.seed, estado: t.estado, ganador: t.ganador, creado: t.creado, rol,
    de_res: t.res.de || null, para_res: t.res.para || null };
}
function bankIdsCurso(curso) {
  if (BANK_IDS_CACHE[curso]) return BANK_IDS_CACHE[curso];
  const out = [];
  for (const f of ["data", "bank2", "bank3", "bank4", "study", "bank5", "bank7"]) {
    try {
      const txt = fs.readFileSync(path.join(ROOT, "js", f + ".js"), "utf8");
      for (const m of txt.matchAll(/\{[^{}]*\}/g)) {
        const o = m[0];
        const c = (o.match(/[{,]\s*c\s*:\s*"([^"]+)"/) || o.match(/"c"\s*:\s*"([^"]+)"/) || [])[1];
        const id = (o.match(/[{,]\s*id\s*:\s*"([a-z0-9]+)"/) || o.match(/"id"\s*:\s*"([a-z0-9]+)"/) || [])[1];
        if (c === curso && id) out.push(id);
      }
    } catch (e) {}
  }
  BANK_IDS_CACHE[curso] = out;
  return out;
}
const checkouts = jread(path.join(DATA, "checkouts.json"), {});
const saveUsers = () => jsave(path.join(DATA, "users.json"), users);
const saveTokens = () => jsave(path.join(DATA, "tokens.json"), tokens);
const savePayments = () => jsave(path.join(DATA, "payments.json"), payments);
const saveCheckouts = () => jsave(path.join(DATA, "checkouts.json"), checkouts);

const PLANS = {
  pro: { id: "pro", label: "PRO · un curso", monthly: 14.99, single: 79 },
  carrera: { id: "carrera", label: "CARRERA TOTAL · 3 cursos", monthly: 19.99, single: 149 }
};
const COUPONS = {
  CABO10: { type: "pct", value: 10, label: "10% de descuento" },
  FUNDADOR: { type: "freeMonth", label: "1er mes gratis (fundadores)", founderOnly: true }
};
const FOUNDER_LIMIT = 100;

/* ---------- contraseñas, sesiones, seguridad ---------- */
function hashPass(p, salt) { return crypto.scryptSync(p, salt, 64).toString("hex"); }
function safeEq(a, b) { const A = Buffer.from(String(a)), B = Buffer.from(String(b)); return A.length === B.length && crypto.timingSafeEqual(A, B); }
/* apoyos (Ko-fi): emails que han invitado a un café — solo para no molestar
     con el aviso y dar las gracias; NUNCA da ventajas (modelo sin contraprestación) */
let SUPPORTERS = new Set(Object.keys(jread(path.join(DATA, "supporters.json"), {})));
function isSupporter(email) { return !!(email && SUPPORTERS.has(String(email).trim().toLowerCase())); }
function makeToken() { return crypto.randomBytes(24).toString("hex"); }
function userFromReq(req) {
  const m = /(?:^|;\s*)galon_token=([a-f0-9]+)/.exec(req.headers.cookie || "");
  const t = m && tokens[m[1]];
  if (!t || now() - t.created > 30 * 864e5) return t ? (delete tokens[m[1]], saveTokens(), null) : null;
  return users[t.uid] || null;
}
function publicUser(u) {
  const s = activeSub(u);
  return { id: u.id, name: u.name, email: u.email, plan: s ? s.plan : "free", planLabel: s ? PLANS[s.plan].label : "RECLUTA · gratis", planEnds: s ? s.ends : null, founder: !!u.founder, supporter: isSupporter(u.email), emailVerified: !!u.emailVerified, createdAt: u.createdAt };
}
function activeSub(u) {
  if (!u.subscriptions || !u.subscriptions.length) return null;
  const s = u.subscriptions[u.subscriptions.length - 1];
  return s && s.ends > now() ? s : null;
}
function isHttps(req) { return ENV.FORCE_SECURE_COOKIES || (req.headers["x-forwarded-proto"] || "").includes("https"); }

/* rate-limit en memoria: { ip: { n, reset } } */
const RL = new Map();
function rateLimit(req, bucket, max, windowMs) {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
  const key = bucket + "|" + ip;
  const e = RL.get(key);
  const t = now();
  if (!e || e.reset < t) { RL.set(key, { n: 1, reset: t + windowMs }); return true; }
  e.n++;
  return e.n <= max;
}
/* ---------- persistencia duradera para Render (disco efímero) ----------
   En el plan gratis de Render los ficheros se reinician en cada despliegue.
   Si defines GITHUB_TOKEN y GITHUB_REPO (repo PRIVADO), el servidor mantiene
   un volcado de data/ en el repo (data/bundle.json):
     · al arrancar restaura lo que falte (nunca pisa datos locales vivos)
     · cada 10 min sube el volcado, y también al recibir SIGTERM
   Sin esas variables, todo funciona igual con ficheros locales. */
const GH = { tok: process.env.GITHUB_TOKEN || "", repo: process.env.GITHUB_REPO || "", br: process.env.GITHUB_BRANCH || "main" };
const GH_PATH = "data/bundle.json";
function ghHeaders() { return { Authorization: "Bearer " + GH.tok, Accept: "application/vnd.github+json", "User-Agent": "galon-server" }; }
function ghBundle() {
  const progress = {};
  try { for (const f of fs.readdirSync(path.join(DATA, "progress"))) if (f.endsWith(".json")) progress[f.replace(/\.json$/, "")] = jread(path.join(DATA, "progress", f), null); } catch (e) {}
  return JSON.stringify({ savedAt: now(), users, tokens, payments, checkouts, supporters: jread(path.join(DATA, "supporters.json"), {}), progress });
}
async function ghGetBundle() {
  try {
    const r = await fetch("https://api.github.com/repos/" + GH.repo + "/contents/" + GH_PATH + "?ref=" + GH.br, { headers: ghHeaders() });
    if (!r.ok) return null;
    const j = await r.json();
    return JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
  } catch (e) { return null; }
}
function ghRestore(b) {
  if (!b || typeof b !== "object") return 0;
  let n = 0;
  try {
    if (b.users && Object.keys(b.users).length && !Object.keys(users).length) { Object.assign(users, b.users); saveUsers(); n += Object.keys(b.users).length; }
    if (b.tokens && Object.keys(b.tokens).length && !Object.keys(tokens).length) { Object.assign(tokens, b.tokens); saveTokens(); }
    if (Array.isArray(b.payments) && b.payments.length && !payments.length) { payments.push(...b.payments); savePayments(); }
    if (b.checkouts && Object.keys(b.checkouts).length && !Object.keys(checkouts).length) { Object.assign(checkouts, b.checkouts); saveCheckouts(); }
    if (b.supporters && Object.keys(b.supporters).length) { jsave(path.join(DATA, "supporters.json"), b.supporters); SUPPORTERS = new Set(Object.keys(b.supporters)); }
    if (b.progress) for (const k of Object.keys(b.progress)) {
      const f = path.join(DATA, "progress", k + ".json");
      if (b.progress[k] && !fs.existsSync(f)) { jsave(f, b.progress[k]); n++; }
    }
    if (n) log("♻️ datos restaurados del volcado:", n, "piezas");
  } catch (e) { log("restauración de datos:", e.message); }
  return n;
}
async function ghPush() {
  if (!GH.tok || !GH.repo) return;
  try {
    const cur = await fetch("https://api.github.com/repos/" + GH.repo + "/contents/" + GH_PATH + "?ref=" + GH.br, { headers: ghHeaders() });
    const sha = cur.ok ? (await cur.json()).sha : undefined;
    const r = await fetch("https://api.github.com/repos/" + GH.repo + "/contents/" + GH_PATH, {
      method: "PUT", headers: Object.assign(ghHeaders(), { "Content-Type": "application/json" }),
      body: JSON.stringify({ message: "volcado automático de datos A LA ORDEN", content: Buffer.from(ghBundle()).toString("base64"), branch: GH.br, sha: sha })
    });
    if (r.ok) log("☁️ volcado de datos subido al repo"); else log("volcado de datos KO:", r.status);
  } catch (e) { log("volcado de datos:", e.message); }
}
(async () => {
  if (!GH.tok || !GH.repo) return log("persistencia: ficheros locales (en Render: GITHUB_TOKEN + GITHUB_REPO)");
  ghRestore(await ghGetBundle());
  setTimeout(ghPush, 5000);
  setInterval(ghPush, 2 * 60e3); /* cada 2 min: en Render free el disco es efímero */
  process.on("SIGTERM", () => { ghPush().finally(() => process.exit(0)); setTimeout(() => process.exit(0), 4000); });
  log("persistencia GitHub activa →", GH.repo);
})();

/* bloqueo de fuerza bruta por email */
const LOCK = new Map();
function locked(email) { const e = LOCK.get(email); return e && e.until > now() ? e : null; }
function registerFail(email) {
  const e = LOCK.get(email) || { n: 0, until: 0 };
  e.n++;
  if (e.n >= 5) { e.until = now() + 15 * 60e3; e.n = 0; }
  LOCK.set(email, e);
}

/* ---------- email real (Resend) o log ---------- */
async function sendMail(to, subject, text) {
  if (ENV.RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + ENV.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ from: ENV.MAIL_FROM, to, subject, text })
      });
      if (!r.ok) throw new Error("Resend " + r.status);
      return true;
    } catch (e) { log("MAIL ERROR", e.message); }
  }
  log("[MAIL:sin-clave] Para:", to, "·", subject, "· texto:", text.slice(0, 200));
  return false;
}

/* ---------- respuestas ---------- */
function send(res, code, obj, headers) {
  res.writeHead(code, Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, headers || {}));
  res.end(typeof obj === "string" ? obj : JSON.stringify(obj));
}
const bad = (res, msg) => send(res, 400, { error: msg });
/* ---------- presencia real: latidos de los últimos 2 minutos ---------- */
const PRESENCE = new Map(); // clave → { name, ts }
setInterval(() => { const t = Date.now(); for (const [k, v] of PRESENCE) if (t - v.ts > 120000) PRESENCE.delete(k); }, 60000).unref();
function presenceSnapshot() {
  const t = now(), users = []; let anon = 0;
  for (const v of PRESENCE.values()) {
    if (t - v.ts > 120000) continue;
    if (v.name) users.push(v.name); else anon++;
  }
  return { total: users.length + anon, users: users.slice(0, 20), anon };
}
function setCookie(req, res, tok) {
  const parts = ["galon_token=" + tok, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=" + 30 * 86400];
  if (isHttps(req)) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
/* CSRF práctico: POST /api exige mismo origen si el navegador envía Origin */
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true; // clientes no-navegador (curl/app móvil)
  try {
    const h = req.headers.host;
    const xf = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
    return new URL(o).host === h || (xf && new URL(o).host === xf) || o.includes("localhost") || /\.e2b\.app$/.test(new URL(o).host) || /\.trycloudflare\.com$/.test(new URL(o).host);
  } catch (e) { return false; }
}

/* ---------- PAGOS: Stripe real ---------- */
async function stripeCreateCheckout(u, planKey, couponId, amountKnown) {
  const price = ENV.STRIPE_PRICE[planKey];
  if (!price) throw new Error("Falta PRICE_" + planKey.toUpperCase().replace(/:/g, "_") + " en .env");
  const isSub = planKey.endsWith(":monthly");
  const params = {
    mode: isSub ? "subscription" : "payment",
    "line_items[0][price]": price,
    "line_items[0][quantity]": 1,
    success_url: (ENV.PUBLIC_URL || "") + "/app.html#/cuenta?bienvenida=pro",
    cancel_url: (ENV.PUBLIC_URL || "") + "/index.html#precios",
    client_reference_id: u.id,
    "metadata[uid]": u.id,
    "metadata[planKey]": planKey
  };
  if (couponId) params["discounts[0][coupon]"] = couponId;
  if (amountKnown === 0 && isSub) { /* FUNDADOR: 1er mes gratis se configura en Stripe como coupon trial */ }
  const body = new URLSearchParams(params).toString();
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + ENV.STRIPE_SECRET_KEY, "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Stripe: " + (d.error && d.error.message || r.status));
  return d;
}
function stripeVerifyWebhook(raw, sigHeader) {
  if (!ENV.STRIPE_WEBHOOK_SECRET) return false;
  const parts = {};
  sigHeader.split(",").forEach(p => { const [k, v] = p.split("="); parts[k] = v; });
  if (!parts.t || !parts.v1) return false;
  const mac = crypto.createHmac("sha256", ENV.STRIPE_WEBHOOK_SECRET).update(parts.t + "." + raw).digest("hex");
  return safeEq(mac, parts.v1);
}

/* ---------- PAGOS: Redsys real (estándar v1.0) ---------- */
function redsysUrl() {
  return ENV.REDSYS_ENV === "prod" ? "https://sis.redsys.es/sis/realizePayment" : "https://sis-t.redsys.es:25443/sis/realizePayment";
}
function redsysDeriveKey(order) {
  const key = Buffer.from(ENV.REDSYS_SECRET_KEY, "base64");
  const pad = Buffer.alloc((8 - (order.length % 8)) % 8 + order.length);
  pad.write(order, 0, "binary");
  const c = crypto.createCipheriv("des-ede3-ecb", key, null);
  c.setAutoPadding(false);
  return c.update(pad).concat(c.final());
}
function redsysSign(paramsB64, order) {
  const k = redsysDeriveKey(order);
  return crypto.createHmac("sha256", k).update(paramsB64).digest("base64");
}
function b64url(s) { return String(s).replace(/-/g, "+").replace(/_/g, "/"); }
function redsysCheckNotify(bodyParams) {
  try {
    const data = JSON.parse(Buffer.from(b64url(bodyParams.Ds_MerchantParameters || ""), "base64").toString("utf8"));
    const sig = b64url(bodyParams.Ds_Signature || "");
    const calc = redsysSign(bodyParams.Ds_MerchantParameters, String(data.Ds_Order || data.DS_MERCHANT_ORDER || ""));
    return { ok: safeEq(calc, sig), data };
  } catch (e) { return { ok: false, data: {} }; }
}

/* ---------- API ---------- */
const api = {
  "GET /api/health": (req, res) => send(res, 200, { ok: true, uptime: process.uptime(), users: Object.keys(users).length }),
  "GET /api/config": (req, res) => {
    const founders = Object.keys(users).filter(k => users[k].founder).length;
    const payMode = ENV.STRIPE_SECRET_KEY ? "stripe" : ENV.REDSYS_SECRET_KEY ? "redsys" : "sandbox";
    send(res, 200, {
      plans: Object.values(PLANS).map(p => ({ id: p.id, label: p.label, monthly: p.monthly, single: p.single })),
      coupons: Object.keys(COUPONS), founderSlotsLeft: Math.max(0, FOUNDER_LIMIT - founders),
      payMode, contentStrict: ENV.CONTENT_STRICT, demoMode: payMode === "sandbox"
    });
  },
  "POST /api/register": async (req, res, b, u, q, ip) => {
    const name = String(b.name || "").trim().slice(0, 24);
    const email = String(b.email || "").trim().toLowerCase();
    const pass = String(b.password || "");
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad(res, "Nombre o email no válidos");
    if (pass.length < 8) return bad(res, "La contraseña necesita al menos 8 caracteres");
    if (Object.keys(users).some(k => users[k].email === email)) return send(res, 409, { error: "Ese email ya tiene cuenta" });
    const founders = Object.keys(users).filter(k => users[k].founder).length;
    const salt = crypto.randomBytes(16).toString("hex");
    const id = uid();
    const vtok = makeToken();
    /* sin API de email (modo pruebas) la cuenta nace verificada; con Resend, verificación real por enlace */
    users[id] = { id, name, email, salt, passHash: hashPass(pass, salt), founder: founders < FOUNDER_LIMIT, createdAt: now(), subscriptions: [], emailVerified: !ENV.RESEND_API_KEY, verifyToken: vtok };
    saveUsers();
    const tok = makeToken(); tokens[tok] = { uid: id, created: now() }; saveTokens();
    setCookie(req, res, tok);
    sendMail(email, "Confirma tu cuenta de A LA ORDEN", "¡A la orden, " + name + "! Confirma tu email: " + (ENV.PUBLIC_URL || "") + "/api/verify?t=" + vtok).catch(() => {});
    audit("register", ip, id);
    send(res, 200, { ok: true, user: publicUser(users[id]) });
  },
  "GET /api/verify": (req, res, b, u, q) => {
    const t = q.get("t");
    const id = Object.keys(users).find(k => users[k].verifyToken === t);
    if (!id) return send(res, 404, { error: "Enlace no válido o ya usado" });
    users[id].emailVerified = true; delete users[id].verifyToken; saveUsers();
    res.writeHead(302, { Location: "/app.html#/cuenta" }); res.end();
  },
  "POST /api/login": (req, res, b, u, q, ip) => {
    const email = String(b.email || "").trim().toLowerCase();
    const pass = String(b.password || "");
    const lk = locked(email);
    if (lk) return send(res, 429, { error: "Demasiados intentos. Espera " + Math.ceil((lk.until - now()) / 60000) + " min" });
    const id = Object.keys(users).find(k => users[k].email === email);
    if (!id || !safeEq(users[id].passHash, hashPass(pass, users[id].salt))) { registerFail(email); audit("login_fail", ip, null, email); return send(res, 401, { error: "Email o contraseña incorrectos" }); }
    const tok = makeToken(); tokens[tok] = { uid: id, created: now() }; saveTokens();
    setCookie(req, res, tok); audit("login", ip, id);
    send(res, 200, { ok: true, user: publicUser(users[id]) });
  },
  "POST /api/logout": (req, res) => {
    const m = /(?:^|;\s*)galon_token=([a-f0-9]+)/.exec(req.headers.cookie || "");
    if (m) { delete tokens[m[1]]; saveTokens(); }
    res.setHeader("Set-Cookie", "galon_token=; Path=/; HttpOnly; Max-Age=0");
    send(res, 200, { ok: true });
  },
  "POST /api/reset-request": (req, res, b) => {
    const email = String(b.email || "").trim().toLowerCase();
    const id = Object.keys(users).find(k => users[k].email === email);
    if (id) {
      const t = makeToken();
      users[id].resetToken = t; users[id].resetUntil = now() + 3600e3; saveUsers();
      sendMail(email, "Recupera tu contraseña de A LA ORDEN", "Enlace (1h): " + (ENV.PUBLIC_URL || "") + "/reset.html?t=" + t).catch(() => {});
    }
    send(res, 200, { ok: true }); // no revela si existe
  },
  "POST /api/reset-confirm": (req, res, b) => {
    const t = String(b.token || ""), pass = String(b.password || "");
    if (pass.length < 8) return bad(res, "Mínimo 8 caracteres");
    const id = Object.keys(users).find(k => users[k].resetToken === t);
    if (!id || users[id].resetUntil < now()) return send(res, 400, { error: "Enlace caducado" });
    users[id].salt = crypto.randomBytes(16).toString("hex");
    users[id].passHash = hashPass(pass, users[id].salt);
    delete users[id].resetToken; saveUsers();
    send(res, 200, { ok: true });
  },
  "GET /api/me": (req, res, b, u) => send(res, 200, { user: publicUser(u) }),

  "POST /api/checkout": async (req, res, b, u) => {
    const plan = PLANS[b.plan]; if (!plan) return bad(res, "Plan no válido");
    const cycle = b.cycle === "single" ? "single" : "monthly";
    const coupon = b.coupon ? String(b.coupon).toUpperCase().trim() : null;
    let amount = plan[cycle], note = null, freeMonth = false, couponId = null;
    if (coupon) {
      const c = COUPONS[coupon];
      if (!c) return bad(res, "Cupón no válido");
      if (c.founderOnly && !u.founder) return bad(res, "Ese cupón es solo para fundadores");
      if (c.type === "pct") { amount = Math.round(amount * (100 - c.value)) / 100; couponId = ENV.STRIPE_COUPON || null; }
      if (c.type === "freeMonth" && cycle === "monthly") { amount = 0; freeMonth = true; }
      note = c.label;
    }
    const payMode = ENV.STRIPE_SECRET_KEY ? "stripe" : ENV.REDSYS_SECRET_KEY ? "redsys" : "sandbox";
    /* ── STRIPE REAL ── */
    if (payMode === "stripe") {
      try {
        const s = await stripeCreateCheckout(u, plan + ":" + cycle, couponId, amount);
        audit("checkout_stripe", req.socket.remoteAddress, u.id, plan + ":" + cycle);
        return send(res, 200, { ok: true, url: s.url, amount, note, payMode });
      } catch (e) { return send(res, 502, { error: "Pasarela Stripe: " + e.message }); }
    }
    /* ── REDSYS REAL ── */
    if (payMode === "redsys") {
      const order = "GAL" + Date.now().toString().slice(-10);
      const params = {
        DS_MERCHANT_AMOUNT: String(Math.round(amount * 100)),
        DS_MERCHANT_ORDER: order,
        DS_MERCHANT_MERCHANTCODE: ENV.REDSYS_MERCHANT_CODE,
        DS_MERCHANT_TERMINAL: ENV.REDSYS_TERMINAL,
        DS_MERCHANT_CURRENCY: "978",
        DS_MERCHANT_TRANSACTIONTYPE: "0",
        DS_MERCHANT_URLOK: (ENV.PUBLIC_URL || "") + "/app.html#/cuenta?bienvenida=pro",
        DS_MERCHANT_URLKO: (ENV.PUBLIC_URL || "") + "/index.html#precios",
        DS_MERCHANT_MERCHANTDATA: u.id + "|" + plan + ":" + cycle
      };
      const b64 = Buffer.from(JSON.stringify(params)).toString("base64");
      const sig = redsysSign(b64, order);
      checkouts[order] = { sid: order, uid: u.id, plan: plan.id, cycle, coupon, amount, freeMonth, status: "open", provider: "redsys", created: now() };
      saveCheckouts();
      return send(res, 200, { ok: true, redsys: true, url: redsysUrl(), sigVersion: "HMAC-SHA256-V1.0", merchantCode: ENV.REDSYS_MERCHANT_CODE, terminal: ENV.REDSYS_TERMINAL, order, paramsB64: b64, signature: sig, amount, note, payMode });
    }
    /* ── MODO PRUEBAS (sin claves) ── */
    const sid = crypto.randomBytes(12).toString("hex");
    checkouts[sid] = { sid, uid: u.id, plan: plan.id, cycle, coupon, amount, freeMonth, status: "open", provider: "sandbox", created: now() };
    saveCheckouts();
    send(res, 200, { ok: true, url: "/checkout.html?s=" + sid, amount, note, payMode: "sandbox" });
  },
  "GET /api/checkout/sid": (req, res, b, u, q) => {
    const s = checkouts[q.get("id")];
    if (!s || s.status !== "open") return send(res, 404, { error: "Sesión no encontrada" });
    send(res, 200, { plan: PLANS[s.plan].label, cycle: s.cycle, amount: s.amount, coupon: s.coupon, note: s.freeMonth ? "Primer mes gratis (fundador)" : null, provider: s.provider || "sandbox" });
  },
  "POST /api/checkout/confirm": (req, res, b, u) => {
    const s = checkouts[String(b.id || "")];
    if (!s || s.status !== "open") return send(res, 404, { error: "Sesión no encontrada" });
    if (s.uid !== u.id) return send(res, 403, { error: "Sesión de otro usuario" });
    if (s.provider && s.provider !== "sandbox") return bad(res, "Esta sesión se procesa en la pasarela bancaria");
    const digits = String(b.card && b.card.number || "").replace(/[\s-]/g, "");
    if (!/^\d{12,19}$/.test(digits)) return bad(res, "Número de tarjeta no válido (pruebas: 4242 4242 4242 4242)");
    activateSub(u, s.plan, s.cycle, s.amount, digits.slice(-4));
    s.status = "paid"; saveCheckouts();
    audit("payment_sandbox", req.socket.remoteAddress, u.id, s.amount + "€");
    send(res, 200, { ok: true, user: publicUser(u) });
  },
  /* Stripe webhook (pagos reales) */
  "POST /api/webhooks/stripe": (req, res, b, u, q, ip, raw) => {
    if (!stripeVerifyWebhook(raw, req.headers["stripe-signature"] || "")) return send(res, 400, { error: "Firma no válida" });
    const ev = b;
    if (ev.type === "checkout.session.completed") {
      const s = ev.data.object;
      const id = s.metadata && s.metadata.uid;
      const planKey = (s.metadata && s.metadata.planKey) || "";
      const uidv = id || s.client_reference_id;
      if (users[uidv]) {
        const [plan, cycle] = planKey.split(":");
        activateSub(users[uidv], plan, cycle || "monthly", (s.amount_total || 0) / 100, "stripe");
        recordPayment(uidv, users[uidv].email, plan, cycle || "monthly", (s.amount_total || 0) / 100, s.customer || "stripe", "stripe");
        audit("stripe_paid", ip, uidv, planKey);
      }
    } else if (ev.type === "invoice.paid") {
      log("stripe renovación", ev.data.object.id);
    } else if (ev.type === "customer.subscription.deleted") {
      log("stripe baja", ev.data.object.id);
    }
    send(res, 200, { received: true });
  },
  /* Redsys notificación (pagos reales) */
  "POST /api/webhooks/redsys": (req, res, b, u, q, ip) => {
    const chk = redsysCheckNotify(b);
    if (!chk.ok) { audit("redsys_bad_signature", ip, null, null); return send(res, 400, { error: "Firma no válida" }); }
    const d = chk.data;
    const code = parseInt(d.Ds_Response, 10);
    if (isNaN(code) || code < 0 || code > 99) { audit("redsys_ko", ip, null, d.Ds_Response); return send(res, 200, { received: true }); }
    const [uidv, planKey] = String(d.Ds_MerchantData || "").split("|");
    if (users[uidv] && checkouts[d.Ds_Order]) {
      const s = checkouts[d.Ds_Order];
      const [plan, cycle] = (planKey || s.plan + ":" + s.cycle).split(":");
      activateSub(users[uidv], plan, cycle, s.amount, "redsys");
      recordPayment(uidv, users[uidv].email, plan, cycle, s.amount, d.Ds_Order, "redsys");
      s.status = "paid"; saveCheckouts();
      audit("redsys_paid", ip, uidv, s.amount + "€");
    }
    send(res, 200, { received: true });
  },
  "GET /api/invoices": (req, res, b, u) => send(res, 200, { invoices: payments.filter(p => p.uid === u.id).map(p => ({ id: p.id, plan: p.plan, cycle: p.cycle, amount: p.amount, last4: p.last4, date: p.created })) }),

  "GET /api/progress": (req, res, b, u) => send(res, 200, { state: jread(path.join(DATA, "progress", u.id + ".json"), null), supporter: isSupporter(u.email) }),

  /* Ko-fi: avisa aquí cuando llega un café → el email queda como "apoyado"
     (en .env: KOFI_VERIFICATION_TOKEN; se configura en ko-fi.com → API/Webhooks) */
  "POST /api/webhooks/kofi": (req, res, b, u, q, ip, raw) => {
    try {
      const p = new URLSearchParams(raw || "");
      const d = JSON.parse(p.get("data") || "{}");
      if (!process.env.KOFI_VERIFICATION_TOKEN || d.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) return send(res, 200, { ok: true, ignored: "token" });
      if ((d.type === "Donation" || d.type === "Subscription") && d.email) {
        const SUP = jread(path.join(DATA, "supporters.json"), {});
        SUP[String(d.email).trim().toLowerCase()] = { d: now(), n: d.amount || null };
        fs.writeFileSync(path.join(DATA, "supporters.json"), JSON.stringify(SUP, null, 1));
        SUPPORTERS = new Set(Object.keys(SUP));
        console.log("☕ Café recibido de", d.email, "(", d.amount || "?", "€ )");
      }
      send(res, 200, { ok: true });
    } catch (e) { send(res, 200, { ok: true }); }
  },
  "POST /api/progress": (req, res, b, u) => {
    const st = b.state;
    if (!st || typeof st !== "object") return bad(res, "Estado no válido");
    st.updatedAt = now();
    jsave(path.join(DATA, "progress", u.id + ".json"), st);
    send(res, 200, { ok: true, updatedAt: st.updatedAt });
  },

  /* RGPD: portabilidad y supresión */
  "GET /api/privacy/export": (req, res, b, u) => {
    audit("rgpd_export", req.socket.remoteAddress, u.id);
    send(res, 200, { usuario: publicUser(u), suscripciones: u.subscriptions, progreso: jread(path.join(DATA, "progress", u.id + ".json"), null), pagos: payments.filter(p => p.uid === u.id) });
  },
  "POST /api/privacy/delete": (req, res, b, u, q, ip) => {
    audit("rgpd_delete", ip, u.id);
    delete users[u.id];
    jsave(path.join(DATA, "progress", u.id + ".anon.json"), { anonimizado: true, t: now() });
    try { fs.unlinkSync(path.join(DATA, "progress", u.id + ".json")); } catch (e) {}
    saveUsers();
    res.setHeader("Set-Cookie", "galon_token=; Path=/; HttpOnly; Max-Age=0");
    send(res, 200, { ok: true });
  },

  "GET /api/ranking": (req, res) => {
    const rows = [];
    Object.keys(users).forEach(k => {
      const st = jread(path.join(DATA, "progress", k + ".json"), null);
      if (st && st.xp > 0) rows.push({ name: users[k].name, xp: st.xp });
    });
    rows.sort((a, b) => b.xp - a.xp);
    send(res, 200, { total: rows.length, users: rows.slice(0, 50) });
  },
  "POST /api/beat": (req, res, b, u, q, ip) => {
    if (!rateLimit(req, "beat", 12, 60000)) return send(res, 429, { error: "Demasiados latidos" });
    const anon = String((b || {}).anon || "").replace(/[^a-f0-9]/gi, "").slice(0, 32);
    const key = u ? "u:" + u.id : "a:" + anon;
    if (key.length < 4) return send(res, 400, { error: "falta identificador" });
    PRESENCE.set(key, { name: u ? u.name : null, ts: now() });
    send(res, 200, presenceSnapshot());
  },
  "GET /api/online": (req, res) => send(res, 200, presenceSnapshot()),
  "GET /api/apoyos": (req, res) => {
    /* datos REALES: nada de cifras infladas — lo recaudado viene del webhook Ko-fi (supporters.json) */
    const SUP = jread(path.join(DATA, "supporters.json"), {});
    let recaudado = 0, cafes = 0;
    for (const k of Object.keys(SUP)) { cafes++; recaudado += Number(SUP[k].n) || 0; }
    const fundadores = Object.values(users).filter(x => x.founder).map(x => x.name);
    send(res, 200, { recaudado, cafes, fundadores, fundadores_limite: FOUNDER_LIMIT });
  },
  "POST /api/duelo/crear": (req, res, b) => {
    const de = String((b || {}).de || "").trim().slice(0, 24) || "Anónimo";
    const curso = String((b || {}).curso || "cabo").replace(/[^a-z0-9]/g, "").slice(0, 8) || "cabo";
    const pool = bankIdsCurso(curso);
    if (pool.length < 10) return send(res, 500, { error: "Banco insuficiente para ese curso" });
    /* cap 60 duelos pendientes por retador */
    const propios = Object.values(duelos).filter(d => d.estado === "pendiente" && normName(d.de) === normName(de)).length;
    if (propios >= 60) return send(res, 429, { error: "Tienes demasiados duelos pendientes lanzados" });
    const ids = pool.slice().sort(() => Math.random() - 0.5).slice(0, 10);
    const id = "D" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    duelos[id] = { id, de, para: null, codigo: nuevoCodigo(), curso, ids, res: {}, estado: "pendiente", terminado: 0, ganador: "", creado: now() };
    saveDuelos();
    send(res, 200, dueloVista(duelos[id], de));
  },
  "POST /api/duelo/unir": (req, res, b) => {
    const jugador = String((b || {}).jugador || "").trim().slice(0, 24) || "Anónimo";
    const codigo = String((b || {}).codigo || "").trim().toUpperCase();
    const d = Object.values(duelos).find(x => x.codigo === codigo);
    if (!d) return send(res, 404, { error: "Código no encontrado, revisa las letras" });
    if (normName(d.de) === normName(jugador)) return send(res, 400, { error: "Ese duelo es tuyo: está en tu lista de abajo" });
    if (d.para != null && normName(d.para) !== normName(jugador)) return send(res, 409, { error: "Ese código ya lo usó " + d.para });
    if (d.para == null) { d.para = jugador; saveDuelos(); }
    send(res, 200, dueloVista(d, jugador));
  },
  "POST /api/duelo/azar": (req, res, b) => {
    const jugador = String((b || {}).jugador || "").trim().slice(0, 24) || "Anónimo";
    const curso = String((b || {}).curso || "cabo").replace(/[^a-z0-9]/g, "").slice(0, 8) || "cabo";
    /* empareja con la primera partida al azar abierta de otro jugador en el mismo curso */
    const abierta = Object.values(duelos).find(d => d.azar && d.estado === "pendiente" && d.para == null && d.curso === curso && normName(d.de) !== normName(jugador));
    if (abierta) { abierta.para = jugador; saveDuelos(); return send(res, 200, { matched: true, duelo: dueloVista(abierta, jugador) }); }
    const pool = bankIdsCurso(curso);
    if (pool.length < 10) return send(res, 500, { error: "Banco insuficiente para ese curso" });
    const propios = Object.values(duelos).filter(d => d.estado === "pendiente" && normName(d.de) === normName(jugador)).length;
    if (propios >= 60) return send(res, 429, { error: "Tienes demasiados duelos pendientes lanzados" });
    const ids = pool.slice().sort(() => Math.random() - 0.5).slice(0, 10);
    const id = "D" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    duelos[id] = { id, de: jugador, para: null, codigo: nuevoCodigo(), curso, ids, res: {}, estado: "pendiente", terminado: 0, ganador: "", creado: now(), azar: true };
    saveDuelos();
    send(res, 200, { matched: false, duelo: dueloVista(duelos[id], jugador) });
  },
  "GET /api/duelo/mis": (req, res, b, u, q) => {
    const quien = String(q.get("u") || "").trim().slice(0, 24);
    if (!quien) return send(res, 200, { duelos: [] });
    const lista = Object.values(duelos)
      .filter(d => normName(d.de) === normName(quien) || normName(d.para) === normName(quien))
      .sort((a, b) => b.creado - a.creado).slice(0, 30)
      .map(d => dueloVista(d, quien));
    send(res, 200, { duelos: lista });
  },
  "POST /api/duelo/resultado": (req, res, b) => {
    const d = duelos[String((b || {}).id || "")];
    if (!d) return send(res, 404, { error: "Duelo no encontrado" });
    const jugador = String((b || {}).jugador || "").trim();
    const rol = normName(jugador) === normName(d.de) ? "de" : normName(jugador) === normName(d.para) ? "para" : null;
    if (!rol) return send(res, 403, { error: "No participas en este duelo" });
    if (d.res[rol] != null) return send(res, 200, dueloVista(d, jugador));
    d.res[rol] = Math.max(0, Math.min(10, parseInt((b || {}).aciertos, 10) || 0));
    if (d.res.de != null && d.res.para != null) {
      d.estado = "terminado";
      d.ganador = d.res.de === d.res.para ? "" : (d.res.de > d.res.para ? d.de : d.para);
      d.terminado = now();
    }
    saveDuelos();
    send(res, 200, dueloVista(d, jugador));
  },
  "GET /api/duelo/recientes": (req, res, b, u, q) => {
    const desde = parseInt(q.get("desde"), 10) || 0;
    const lista = Object.values(duelos).filter(d => d.estado === "terminado" && d.terminado > desde)
      .sort((a, b) => b.terminado - a.terminado).slice(0, 10)
      .map(d => ({ id: d.id, de: d.de, para: d.para, resDe: d.res.de, resPara: d.res.para, ganador: d.ganador, terminado: d.terminado }));
    send(res, 200, { duelos: lista });
  },
  "POST /api/trivial/crear": (req, res, b) => {
    const de = String((b || {}).de || "").trim().slice(0, 24) || "Anónimo";
    const curso = String((b || {}).curso || "cabo").replace(/[^a-z0-9]/g, "").slice(0, 8) || "cabo";
    const propios = Object.values(triviales).filter(t => t.estado === "pendiente" && normName(t.de) === normName(de)).length;
    if (propios >= 30) return send(res, 429, { error: "Tienes demasiadas partidas de trivial abiertas" });
    const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let codigo = "";
    do { codigo = ""; for (let i = 0; i < 6; i++) codigo += ABC[Math.floor(Math.random() * ABC.length)]; }
    while (Object.values(triviales).some(t => t.codigo === codigo && t.estado === "pendiente") || Object.values(duelos).some(d => d.codigo === codigo && d.estado === "pendiente"));
    const id = "T" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    triviales[id] = { id, de, para: null, codigo, curso, seed: Math.floor(Math.random() * 2147483647), res: {}, estado: "pendiente", ganador: "", creado: now() };
    saveTriviales();
    send(res, 200, trivialVista(triviales[id], de));
  },
  "POST /api/trivial/unir": (req, res, b) => {
    const jugador = String((b || {}).jugador || "").trim().slice(0, 24) || "Anónimo";
    const codigo = String((b || {}).codigo || "").trim().toUpperCase();
    const t = Object.values(triviales).find(x => x.codigo === codigo);
    if (!t) return send(res, 404, { error: "Código no encontrado, revisa las letras" });
    if (normName(t.de) === normName(jugador)) return send(res, 400, { error: "Esa partida es tuya: crea otra o comparte el código" });
    if (t.para != null && normName(t.para) !== normName(jugador)) return send(res, 409, { error: "Ese código ya lo usó " + t.para });
    if (t.para == null) { t.para = jugador; saveTriviales(); }
    send(res, 200, trivialVista(t, jugador));
  },
  "POST /api/trivial/estado": (req, res, b) => {
    const t = triviales[String((b || {}).id || "")] || Object.values(triviales).find(x => x.codigo === String((b || {}).codigo || "").trim().toUpperCase());
    if (!t) return send(res, 404, { error: "Partida no encontrada" });
    const jugador = String((b || {}).jugador || "").trim();
    const rol = normName(jugador) === normName(t.de) ? "de" : (t.para != null && normName(jugador) === normName(t.para)) ? "para" : null;
    if (!rol) return send(res, 403, { error: "No participas en esta partida" });
    t.res[rol] = { nombre: jugador, wedges: Math.max(0, Math.min(6, parseInt((b || {}).wedges, 10) || 0)), tiradas: Math.max(0, Math.min(200, parseInt((b || {}).tiradas, 10) || 0)), aciertos: Math.max(0, Math.min(200, parseInt((b || {}).aciertos, 10) || 0)), fin: !!(b || {}).fin, ts: now() };
    if (t.res.de && t.res.de.fin && t.res.para && t.res.para.fin && t.estado !== "terminado") {
      t.estado = "terminado";
      if (t.res.de.tiradas === t.res.para.tiradas) t.ganador = t.res.de.aciertos === t.res.para.aciertos ? "" : (t.res.de.aciertos > t.res.para.aciertos ? t.de : t.para);
      else t.ganador = t.res.de.tiradas < t.res.para.tiradas ? t.de : t.para;
    }
    saveTriviales();
    send(res, 200, trivialVista(t, jugador));
  },
  "GET /api/trivial/ver": (req, res, b, u, q) => {
    const codigo = String(q.get("codigo") || "").trim().toUpperCase();
    const quien = String(q.get("u") || "").trim().slice(0, 24);
    const t = Object.values(triviales).find(x => x.codigo === codigo);
    if (!t) return send(res, 404, { error: "Partida no encontrada" });
    send(res, 200, trivialVista(t, quien));
  },
  "GET /api/admin/stats": (req, res, b, u, q) => {
    if (!ENV.ADMIN_TOKEN || !safeEq(q.get("t"), ENV.ADMIN_TOKEN)) return send(res, 403, { error: "No autorizado" });
    const us = Object.values(users);
    const act = us.filter(x => activeSub(x)).length;
    const revenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const mrr = us.reduce((s, x) => { const a = activeSub(x); return a && a.cycle === "monthly" ? s + PLANS[a.plan].monthly : s; }, 0);
    send(res, 200, { users: us.length, founders: us.filter(x => x.founder).length, activeSubs: act, mrr, revenue, payments: payments.slice(-20).reverse() });
  }
};

function activateSub(u, plan, cycle, amount, last4) {
  u.subscriptions.push({ plan, cycle: cycle === "single" ? "single" : "monthly", starts: now(), ends: now() + (cycle === "single" ? 400 : 30) * 864e5, amount, last4 });
  saveUsers();
}
function recordPayment(uidv, email, plan, cycle, amount, last4, provider) {
  payments.push({ id: uid(), uid: uidv, email, plan, cycle, amount, coupon: null, last4, status: "paid", provider, created: now() });
  savePayments();
}

/* ---------- estáticos: gzip, ETag, caché, protección ---------- */
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json", ".sql": "text/plain; charset=utf-8", ".pdf": "application/pdf", ".txt": "text/plain; charset=utf-8" };
function serveStatic(req, res, pathname, search) {
  let p = decodeURIComponent(pathname);
  if (p === "/" || p === "") p = "/index.html";
  /* panel interno protegido en producción */
  if (p === "/revisar.html" && ENV.ADMIN_TOKEN && !safeEq(search.get("t"), ENV.ADMIN_TOKEN)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("403 — Panel interno. Accede con /revisar.html?t=TU_ADMIN_TOKEN");
  }
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Prohibido"); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("404 — no encontrado"); }
    const etag = '"' + crypto.createHash("sha1").update(buf).digest("hex").slice(0, 20) + '"';
    if (req.headers["if-none-match"] === etag) { res.writeHead(304); return res.end(); }
    const headers = { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": path.extname(file) === ".html" ? "no-cache" : "public, max-age=3600", ETag: etag, "X-Content-Type-Options": "nosniff" };
    if ((req.headers["accept-encoding"] || "").includes("gzip") && buf.length > 1200 && /text|json|javascript/.test(headers["Content-Type"])) {
      buf = zlib.gzipSync(buf);
      headers["Content-Encoding"] = "gzip";
    }
    headers["Content-Length"] = buf.length;
    res.writeHead(200, headers);
    res.end(buf);
  });
}

/* ---------- servidor ---------- */
const SEC = { "X-Content-Type-Options": "nosniff", "X-Frame-Options": "SAMEORIGIN", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "geolocation=(), microphone=(), camera=()" };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  const pathname = url.pathname;
  if (!pathname.startsWith("/api/")) {
    Object.entries(SEC).forEach(([k, v]) => res.setHeader(k, v));
    return serveStatic(req, res, pathname, url.searchParams);
  }
  let raw = "", over = false;
  req.on("data", c => { raw += c; if (raw.length > 1e6) { over = true; req.destroy(); } });
  req.on("end", async () => {
    if (over) return;
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
    if (!rateLimit(req, "api", 300, 60e3)) return send(res, 429, { error: "Demasiadas peticiones" });
    if (!rateLimit(req, pathname, 30, 60e3)) return send(res, 429, { error: "Demasiadas peticiones a este endpoint" });
    let body = {};
    if (raw && !/webhooks/.test(pathname)) { try { body = JSON.parse(raw); } catch (e) { return bad(res, "JSON no válido"); } }
    /* los webhooks (stripe/redsys/kofi) llegan urlencoded y parsean su raw dentro */
    const handler = api[req.method + " " + pathname];
    if (!handler) return send(res, 404, { error: "Endpoint no encontrado: " + req.method + " " + pathname });
    if (req.method === "POST" && !/webhooks|verify/.test(pathname) && !sameOrigin(req)) return send(res, 403, { error: "Origen no permitido" });
    const WEBHOOKS = ["POST /api/webhooks/stripe", "POST /api/webhooks/redsys", "POST /api/webhooks/kofi"];
    const PUBLIC = ["GET /api/health", "GET /api/config", "POST /api/register", "POST /api/login", "POST /api/logout", "POST /api/reset-request", "POST /api/reset-confirm", "GET /api/verify", "GET /api/ranking", "POST /api/beat", "GET /api/online", "GET /api/apoyos", "GET /api/checkout/sid", "GET /api/admin/stats", "POST /api/duelo/crear", "GET /api/duelo/mis", "POST /api/duelo/resultado", "GET /api/duelo/recientes", "POST /api/duelo/unir", "POST /api/duelo/azar", "POST /api/trivial/crear", "POST /api/trivial/unir", "POST /api/trivial/estado", "GET /api/trivial/ver"].concat(WEBHOOKS);
    const u = userFromReq(req);
    if (!PUBLIC.includes(req.method + " " + pathname) && !u) return send(res, 401, { error: "Sesión no iniciada" });
    try { await handler(req, res, body, u, url.searchParams, ip, raw); }
    catch (e) { console.error(e); send(res, 500, { error: "Error interno" }); }
  });
});
server.listen(ENV.PORT, "0.0.0.0", () => {
  const pm = ENV.STRIPE_SECRET_KEY ? "STRIPE REAL" : ENV.REDSYS_SECRET_KEY ? "REDSYS REAL" : "MODO PRUEBAS (sin claves de pago)";
  log("A LA ORDEN producción en :" + ENV.PORT, "· pagos:", pm, "· email:", ENV.RESEND_API_KEY ? "RESEND REAL" : "log", "· admin:", ENV.ADMIN_TOKEN ? "token definido" : "SIN token (defínelo en .env)");
});
