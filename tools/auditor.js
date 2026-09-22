#!/usr/bin/env node
/* ============================================================
   A LA ORDEN · EL ALUMNO AGENTE — auditor automático del banco
   ------------------------------------------------------------
   Se "examina" de TODAS las preguntas del banco y comprueba que
   cada respuesta es correcta/coherente contra una tabla de verdad
   normativa (verificada manualmente contra BOE/defensa.gob.es en
   la sesión de trabajo del 20-sep-2026). Marca:
     · NORMA    — pregunta de "qué ley regula X" con ley incorrecta
     · EQUIV    — equivalencia de empleos incorrecta
     · FORMATO  — formato de examen que no coincide con las bases
     · FUGA     — la respuesta aparece literalmente en la pregunta
     · ESTRUCT  — estructura rota (opciones, índice, longitud…)
     · DUPLI    — opciones repetidas dentro de la misma pregunta
   Salida: resumen en consola + data/auditoria.json (para AUDITORIA.md)
   Uso: node tools/auditor.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

/* ---- cargar el banco EXACTAMENTE como la app ---- */
const w = {};
["data", "bank2", "bank3", "bank4", "study", "bank5", "verdicts"]
  .forEach(f => new Function("window", fs.readFileSync(path.join(ROOT, "js", f + ".js"), "utf8"))(w));
const { QUESTIONS } = new Function("window",
  fs.readFileSync(path.join(ROOT, "js", "data.js"), "utf8") + "; return { QUESTIONS };")(w);
const ALL = [].concat(QUESTIONS, w.QUESTIONS2 || [], w.QUESTIONS3 || [], w.QUESTIONS4 || [], w.QUESTIONS5 || [], w.QUESTIONS6 || []);
const V = w.VERDICTS || {};
const BANK = ALL.filter(q => { const v = V[q.id]; return !(v && v.v === "ko"); });

/* ---- TABLA DE VERDAD (normativa vigente, verificada) ---- */
/* clave = regex sobre pregunta+respuesta correcta; ok = la respuesta DEBE casar; bad = NO puede aparecer ahí */
const NORMAS = [
  { nombre: "LODN vigente", si: /ley org[áa]nica de la defensa nacional|siglas LODN/i, ok: /5\s*\/\s*2005/, bad: /39\s*\/\s*2015|39\/2007/ },
  { nombre: "RROO vigentes", si: /reales ordenanzas.*(aprob|vigentes)|rroo.*(aprob|vigentes)/i, ok: /96\s*\/\s*2009/, bad: /149\s*\/\s*2009|502\s*\/\s*2009/ },
  { nombre: "Carrera militar", si: /ley de la carrera militar es|carrera militar se regula/i, ok: /39\s*\/\s*2007/, bad: /39\s*\/\s*2005|39\s*\/\s*2006/ },
  { nombre: "Tropa y Marinería", si: /qu[ée] ley regula la tropa y mariner[íi]a|tropa y mariner[íi]a se regula/i, ok: /8\s*\/\s*2006/, bad: /39\s*\/\s*2007/ },
  { nombre: "Derechos y deberes FAS", si: /regula.*(derechos y deberes.*FAS|derechos y deberes de los miembros)/i, ok: /9\s*\/\s*2011/ },
  { nombre: "Régimen disciplinario", si: /r[ée]gimen disciplinario.*(regula|clasifica|ley)/i, ok: /8\s*\/\s*2014/, bad: /8\s*\/\s*2015/ },
  { nombre: "Código Penal Militar", si: /c[óo]digo penal militar.*(aprob|vigente)/i, ok: /14\s*\/\s*2015/, bad: /14\s*\/\s*2007/ },
  { nombre: "Seguridad Nacional", si: /ley.*(regula|seguridad nacional).*seguridad nacional|seguridad nacional se regula/i, ok: /36\s*\/\s*2015/, bad: /36\s*\/\s*2005/ },
  { nombre: "ESN 2021", si: /estrategia de seguridad nacional 2021.*(aprob|rd)/i, ok: /1150\s*\/\s*2021/, bad: /1150\s*\/\s*2020/ },
  { nombre: "Procedimiento administrativo", si: /procedimiento administrativo com[úu]n.*(regula|ley)/i, ok: /39\s*\/\s*2015/, bad: /5\s*\/\s*2005|30\/1992/ },
  { nombre: "Organización del ET", si: /organizaci[óo]n b[áa]sica del ej[ée]rcito de tierra.*(establece|rd)/i, ok: /847\s*\/\s*2015/ },
  { nombre: "Igualdad", si: /igualdad (efectiva )?(de )?mujeres y hombres.*(regula|lo)/i, ok: /3\s*\/\s*2007/ }
];
const EQUIV = [
  { si: /teniente general.*equivale.*armada|equivale.*armada.*teniente general/i, ok: /almirante general/i, bad: /capit[áa]n de nav[íi]o|almirante(?! general)/i },
  { si: /capit[áa]n de nav[íi]o.*equivale.*(ej[ée]rcito de tierra|et)/i, ok: /coronel/i, bad: /comandante|teniente coronel/i },
  { si: /comandante.*equivale.*armada/i, ok: /capit[áa]n de fragata/i, bad: /capit[áa]n de corbeta|capit[áa]n de nav[íi]o/i }
];
/* formatos oficiales de examen (bases I/24-I/26 + convocatoria permanencia 2026) */
const FORMATOS = [
  { si: /examen de ascenso a cabo(?! primero| 1º).*consta|consta.*examen.*ascenso a cabo(?! primero| 1º)/i, curso: "cabo", ok: /50\s*preguntas\s*\+\s*5|50 \+ 5/, bad: /100\s*preguntas/ },
  { si: /(prueba de conocimientos|examen).*(permanencia|permanente).*consta|permanencia.*(100\s*preguntas)/i, curso: "perm", ok: /100/, bad: /50\s*\+\s*5/ },
  { si: /examen.*(cabo primero|cabo 1º).*preguntas|cabo primero.*examen.*(50|preguntas)/i, curso: "cabo1", ok: /50/, bad: /100\s*preguntas/ }
];

/* ---- el examen ---- */
const flags = [];
const avisos = [];
const nota = (q, regla, detalle) => flags.push({ id: q.id, curso: q.c, tema: q.t, regla, detalle, pregunta: q.q, respuesta: q.o ? q.o[q.a] : undefined });
let okEstruct = 0;
const dist = [0, 0, 0, 0];

for (const q of BANK) {
  /* ESTRUCTURA */
  if (!q.q || q.q.length < 10 || q.q.length > 300) { nota(q, "ESTRUCT", "longitud de pregunta fuera de rango"); continue; }
  if (!Array.isArray(q.o) || q.o.length !== 4) { nota(q, "ESTRUCT", "no tiene exactamente 4 opciones"); continue; }
  if (typeof q.a !== "number" || q.a < 0 || q.a > 3) { nota(q, "ESTRUCT", "índice de respuesta inválido"); continue; }
  const ans = q.o[q.a];
  if (!ans || ans.length < 1 || ans.length > 200) { nota(q, "ESTRUCT", "respuesta vacía o desproporcionada"); continue; }
  const lower = q.o.map(o => String(o).trim().toLowerCase());
  if (new Set(lower).size !== 4) { nota(q, "DUPLI", "opciones repetidas: " + JSON.stringify(q.o)); continue; }
  if (/(ninguna|todas) de las anteriores/i.test(ans)) nota(q, "ESTRUCT", "respuesta del tipo «ninguna/todas las anteriores»");
  if (/___|\bundefined\b|\[object/.test(ans + " " + (q.x || ""))) nota(q, "ESTRUCT", "hueco o placeholder sin rellenar en respuesta/explicación");
  okEstruct++;
  dist[q.a]++;

  /* FUGA: la respuesta no puede estar literal en la pregunta */
  const nq = q.q.toLowerCase(), na = ans.toLowerCase();
  const esHueco = q.q.includes("___");
  if (!esHueco && na.length >= 8 && nq.includes(na)) nota(q, "FUGA", "la respuesta («" + ans + "») aparece en el enunciado");

  /* NORMAS */
  const combinado = (esHueco ? q.q.replace("___", ans) : q.q + " " + ans).replace(/\s+/g, " ");
  for (const n of NORMAS) {
    if (n.si.test(q.q)) {
      if (n.ok && !n.ok.test(combinado)) nota(q, "NORMA", n.nombre + ": se esperaba " + n.ok + " y la respuesta es «" + ans + "»");
      if (n.bad && n.bad.test(ans) && !esHueco) nota(q, "NORMA", n.nombre + ": la respuesta contiene una norma descartada («" + ans + "»)");
    }
  }
  /* la confusión clásica: presentar la 39/2015 como LODN (error ya cazado una vez) */
  if (/defensa nacional/i.test(q.q) && /39\s*\/\s*2015/.test(ans) && !/procedimiento/i.test(q.q))
    nota(q, "NORMA", "posible LODN mal atribuida a la Ley 39/2015");
  if (/procedimiento administrativo/i.test(q.q) && /5\s*\/\s*2005/.test(ans))
    nota(q, "NORMA", "posible procedimiento administrativo mal atribuido a la LO 5/2005");

  /* EQUIVALENCIAS */
  for (const e of EQUIV) {
    if (e.si.test(q.q)) {
      if (!e.ok.test(combinado)) nota(q, "EQUIV", "equivalencia esperada " + e.ok + " no presente en «" + ans + "»");
      if (!esHueco && e.bad.test(ans)) nota(q, "EQUIV", "equivalencia incorrecta en «" + ans + "»");
    }
  }

  /* FORMATOS DE EXAMEN */
  const parcial = /Formaci[óo]n (Militar|Sociocultural)|reserva|alternativas/i.test(q.q);
  if (!parcial) for (const f of FORMATOS) {
    if (f.si.test(q.q)) {
      if (!f.ok.test(combinado)) nota(q, "FORMATO", "formato oficial no presente en «" + ans + "»");
      if (f.bad.test(combinado)) nota(q, "FORMATO", "formato de OTRO curso en «" + ans + "»");
    }
  }

  /* EXPLICACIÓN (x) sin huecos y coherente si repite la respuesta */
  if (q.x && /___/.test(q.x)) nota(q, "ESTRUCT", "explicación con hueco sin rellenar");
  if (q.x && na.length >= 8 && q.x.toLowerCase().includes(na) === false && new RegExp(na.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(q.x) === false) {
    /* la explicación no repite la respuesta literal: solo aviso si ni siquiera comparte 1 cifra clave */
    const cifra = na.match(/\d+([.,]\d+)?/);
    if (cifra && !q.x.includes(cifra[0])) avisos.push({ id: q.id, curso: q.c, regla: "AVISO-X", detalle: "explicación sin la cifra clave (" + cifra[0] + ") · " + q.q });
  }
}

/* ---- distribución de respuestas ---- */
const total = BANK.length;
const pct = dist.map(n => Math.round(100 * n / total));
const skew = pct.some(p => p > 40);

/* ---- resumen ---- */
const resumen = {
  fecha: new Date().toISOString().slice(0, 10),
  total: total,
  examinadasOk: okEstruct,
  flags: flags.length,
  porRegla: flags.reduce((m, f) => (m[f.regla] = (m[f.regla] || 0) + 1, m), {}),
  distribucion: { A: dist[0], B: dist[1], C: dist[2], D: dist[3], porcentaje: pct, sesgo40: skew }
};
console.log("=== EL ALUMNO AGENTE · acta del examen ===");
console.log("Preguntas examinadas:", total, "· estructura correcta:", okEstruct);
console.log("Incidencias:", flags.length, JSON.stringify(resumen.porRegla));
console.log("Distribución A/B/C/D:", dist.join("/"), "(" + pct.join("%/") + "%)" + (skew ? "  ⚠ sesgo > 40%" : "  ✓"));
const por = {};
flags.forEach(f => { por[f.curso] = (por[f.curso] || 0) + 1; });
console.log("Por curso:", JSON.stringify(por));
flags.slice(0, 40).forEach(f => console.log("  •", f.regla, "[" + f.id + "]", f.detalle));

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data", "auditoria.json"), JSON.stringify({ resumen, flags }, null, 1));
console.log("Avisos informativos (explicación sin cifra literal):", avisos.length);
fs.writeFileSync(path.join(ROOT, "data", "auditoria-avisos.json"), JSON.stringify(avisos, null, 1));
console.log("→ data/auditoria.json");
