/* A LA ORDEN — Generador de banco de preguntas (Node >= 18)
   Lee la base de hechos (tools/facts-*.js) y produce js/bank5.js con control de calidad:
   · deduplicación (normalizando acentos/mayúsculas) contra el banco nuevo y el existente
   · validación estructural (4 opciones, respuesta correcta, referencias)
   · informe de cobertura por curso/bloque/tema contra el temario de data.js
   Uso: node tools/generate.js  */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const W = {};
function load(rel) {
  const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const got = new Function("window", code + "; return typeof COURSES !== 'undefined' ? { COURSES: COURSES, QUESTIONS: QUESTIONS } : {};")(W);
  Object.assign(W, got);
}
load("js/data.js");
load("tools/facts-cabo.js");
load("tools/facts-cabo1.js");
load("tools/facts-perm.js");
load("tools/facts-cabo2.js");
load("tools/facts-cabo3.js");
load("tools/facts-civica.js");
load("tools/facts-lote5.js");
load("tools/facts-lote6.js");
load("tools/facts-cabo1b.js");
load("tools/facts-perm2.js");
load("tools/facts-cabo1c.js");
load("tools/facts-cabo1d.js");
load("tools/facts-perm3.js");
load("tools/facts-perm4.js");

const FACTS = [].concat(W.FACTS_CABO || [], W.FACTS_CABO1 || [], W.FACTS_PERM || [], W.FACTS_CABO2 || [], W.FACTS_CABO3 || [], W.FACTS_CIVICA || [], W.FACTS_LOTE5 || [], W.FACTS_LOTE6 || [], W.FACTS_CABO1B || [], W.FACTS_PERM2 || [], W.FACTS_CABO1C || [], W.FACTS_CABO1D || [], W.FACTS_PERM3 || [], W.FACTS_PERM4 || []);
const COURSES = W.COURSES;

/* --- utilidades --- */
let seed = 20260920; // semilla fija: el banco es reproducible
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/* --- generación --- */
const out = [];
const errores = [];
let cross = 0;
const W0 = {};
const _d = fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8");
const _e = new Function("window", _d + "; return { QUESTIONS: QUESTIONS };")({});
const EXQ0 = (_e.QUESTIONS || []);
const exSet = new Set();
for (const rel of ["js/data.js", "js/bank2.js", "js/bank3.js", "js/bank4.js", "js/study.js"]) {
  try {
    const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
    new Function("window", code)(W0);
  } catch (e) {}
}
for (const q of [].concat(EXQ0, W0.QUESTIONS2 || [], W0.QUESTIONS3 || [], W0.QUESTIONS4 || [], W0.QUESTIONS5 || [])) exSet.add(norm(q.q));
const seenQ = new Map(); // norma → primer id (deduplicación)
let nFacts = 0, nGroups = 0;

for (const f of FACTS) {
  if (!Array.isArray(f) || f.length < 8) { errores.push("Hecho malformado: " + JSON.stringify(f).slice(0, 60)); continue; }
  const [c, b, t, d, r, ...rest] = f;
  if (!COURSES[c]) { errores.push("Curso desconocido: " + c); continue; }
  const bl = (COURSES[c].syllabus || []).find(x => x.code === b);
  if (!bl) { errores.push("Bloque desconocido: " + c + "/" + b); continue; }
  if (!bl.topics.includes(t)) { errores.push("Tema no está en el temario: " + c + "/" + t); continue; }
  nFacts++;
  // grupos: (texto, respuesta, [3 distractores]) repetidos
  let gi = 0;
  for (let p = 0; p + 2 < rest.length + 1 && p < rest.length; p += 3) {
    const texto = rest[p], correcta = rest[p + 1], dis = rest[p + 2];
    if (typeof texto !== "string" || typeof correcta !== "string" || !Array.isArray(dis) || dis.length !== 3) {
      errores.push("Grupo inválido en hecho " + nFacts + " (" + r + "): " + JSON.stringify([texto, correcta]).slice(0, 70));
      continue;
    }
    nGroups++;
    const key = norm(texto);
    if (seenQ.has(key)) { errores.push("DUPLICADO (omitido): «" + texto.slice(0, 60) + "» repite " + seenQ.get(key)); continue; }
    if (exSet.has(key)) { cross++; continue; }
    seenQ.set(key, texto.slice(0, 40));
    const opts = shuffle([correcta].concat(dis));
    out.push({
      c, b, t, d,
      q: texto,
      o: opts,
      a: opts.indexOf(correcta),
      x: (texto.includes("___") ? "Completado: " : "Respuesta: ") + correcta + ".",
      r,
      id: "g" + (1000 + out.length + 1),
      gen: true,
      status: "borrador"
    });
    gi++;
  }
}

/* --- banco existente (para el informe) --- */
const EXQ = [].concat(EXQ0, W0.QUESTIONS2 || [], W0.QUESTIONS3 || [], W0.QUESTIONS4 || [], W0.QUESTIONS5 || []);

/* --- cobertura --- */
const cobertura = {};
for (const cid of Object.keys(COURSES)) {
  cobertura[cid] = COURSES[cid].syllabus.map(b => ({
    bloque: b.code,
    temas: b.topics.map(t => ({ t, n: out.filter(q => q.c === cid && q.b === b.code && q.t === t).length }))
  }));
}

/* --- escritura --- */
const total = EXQ.length + out.length;
const header =
"/* A LA ORDEN — bank5 · GENERADO AUTOMÁTICAMENTE por tools/generate.js — NO EDITAR A MANO\n" +
"   Hechos base: " + nFacts + " · Preguntas generadas: " + out.length + " · Banco total tras fusión: " + total + "\n" +
"   Estado de cada pregunta: 'borrador' hasta validación de experto en revisar.html\n" +
"   (los veredictos viven en js/verdicts.js; las rechazadas no se sirven) */\n";
fs.writeFileSync(path.join(ROOT, "js/bank5.js"),
  header + "window.QUESTIONS6 = " + JSON.stringify(out, null, 0) + ";\n");

const informe = {
  fecha: new Date().toISOString(),
  hechos: nFacts, grupos: nGroups, generadas: out.length,
  existentes: EXQ.length, total: total,
  duplicadosInternosOmitidos: nGroups - out.length,
  crucesConBancoExistente: cross,
  errores, cobertura
};
fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data/generacion-informe.json"), JSON.stringify(informe, null, 2));

/* --- consola --- */
console.log("== A LA ORDEN · generador de banco ==");
console.log("Hechos procesados:", nFacts, "· Preguntas generadas:", out.length);
console.log("Banco existente:", EXQ.length, "· TOTAL tras fusión:", total);
if (cross) console.log("⚠ Solapamientos con el banco existente:", cross);
if (errores.length) { console.log("⚠ Incidencias:"); errores.slice(0, 15).forEach(e => console.log("  -", e)); }
for (const cid of Object.keys(cobertura)) {
  const n = out.filter(q => q.c === cid).length;
  const vacios = [];
  cobertura[cid].forEach(b => b.temas.forEach(t => { if (t.n === 0) vacios.push(b.bloque + "/" + t.t); }));
  console.log("  " + cid + ": +" + n + " generadas" + (vacios.length ? " · temas nuevos sin generar: " + vacios.join(", ") : " · cobertura completa"));
}
console.log("Escrito: js/bank5.js · Informe: data/generacion-informe.json");
