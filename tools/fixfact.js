#!/usr/bin/env node
/* Normalizador universal de ficheros FACTS (formato plano 11 campos).
   1) Repara filas con déficit de cierre ']'   2) Repara la última fila
   3) Aplana huecos anidados                    4) Valida 11 campos
   Uso: node tools/fixfact.js tools/facts-XXX.js FACTS_XXX        */
"use strict";
const fs = require("fs");
const [file, varName] = [process.argv[2], process.argv[3]];
if (!file || !varName) { console.error("uso: node fixfact.js <fichero> <VAR>"); process.exit(2); }

/* --- 1+2 · reparar corchetes por fila --- */
let lines = fs.readFileSync(file, "utf8").split("\n");
for (let it = 0; it < 80; it++) {
  let depth = 0, fixed = false;
  const starts = lines.map(l => /^\[\"/.test(l.trim()));
  for (let n = 0; n < lines.length; n++) {
    const l = lines[n].replace(/\/\*[\s\S]*?\*\//g, "");
    let opens = 0, closes = 0;
    for (const ch of l) { if (ch === "[") opens++; else if (ch === "]") closes++; }
    if (starts[n]) {
      if (opens > closes) {
        const t = lines[n].trimEnd();
        const deficit = "]".repeat(opens - closes);
        if (t.endsWith(",")) lines[n] = t.slice(0, -1) + deficit + ",";
        else lines[n] = t + deficit;
        fixed = true; break;
      }
      if (opens === closes && closes > 0) { /* fila bien */ }
      if (opens < closes) { console.error("ANOMALIA linea " + (n + 1) + ": cierra de más"); process.exit(1); }
    }
  }
  if (!fixed) break;
}
fs.writeFileSync(file, lines.join("\n"));

/* --- 3+4 · cargar, aplanar, validar, reescribir --- */
let w = {};
try { new Function("window", fs.readFileSync(file, "utf8"))(w); }
catch (e) { console.error("aún no parsea tras reparar:", e.message); process.exit(1); }
if (!w[varName]) { console.error("no encontrada " + varName); process.exit(1); }
let facts = w[varName].map(f => {
  if (f.length === 9 && Array.isArray(f[8]) && Array.isArray(f[8][2])) return [...f.slice(0, 8), ...f[8]];
  if (f.length === 10 && Array.isArray(f[8]) && Array.isArray(f[8][2]) && typeof f[9] === "string") return [...f.slice(0, 8), ...f[8]];
  return f;
});
const bad = facts.filter(f => f.length !== 11);
if (bad.length) {
  console.error("MAL (" + bad.length + "):");
  bad.slice(0, 10).forEach(f => console.error("  len=" + f.length + " :: " + f[5]));
  process.exit(1);
}
fs.writeFileSync(file, "/* normalizado por tools/fixfact.js */\nwindow." + varName + " = " + JSON.stringify(facts, null, 1) + ";\n");
console.log("OK · " + facts.length + " hechos × 11 campos · " + file);
