/* A LA ORDEN · arranque único para Render: un servicio gratis = los 3 motores
   (web+cuentas, bot interactivo, agenda). Reanteca un motor si muere,
   con límite anti-bucle. Local: mejor cada uno por separado (npm run …). */
const { spawn } = require("child_process");
const path = require("path");

const MOTORES = ["server.js", "tools/telegram-bot.js", "tools/agenda-telegram.js"];
const hijos = new Map();
const nacimientos = {};
let saliendo = false;

function arranca(f) {
  if (saliendo) return;
  const ahora = Date.now();
  nacimientos[f] = (nacimientos[f] || []).filter(t => ahora - t < 120e3);
  nacimientos[f].push(ahora);
  if (nacimientos[f].length > 5) { console.error("[arranque]", f, "se cae en bucle — lo dejo descansar. Revisa su config."); return; }
  const p = spawn(process.execPath, [path.join(__dirname, "..", f)], { stdio: ["ignore", "inherit", "inherit"] });
  hijos.set(f, p);
  console.log("[arranque] ▶", f, "(pid", p.pid + ")");
  p.on("exit", c => {
    hijos.delete(f);
    if (saliendo) return;
    console.log("[arranque] ✝", f, "murió (" + c + ") — relanzo en 5 s");
    setTimeout(() => arranca(f), 5000);
  });
}

MOTORES.forEach(arranca);

for (const s of ["SIGTERM", "SIGINT"]) process.on(s, () => {
  if (saliendo) return;
  saliendo = true;
  console.log("[arranque] parando los 3 motores…");
  hijos.forEach(p => { try { p.kill("SIGTERM"); } catch (e) {} });
  /* 10 s de gracia: el servidor sube el volcado de datos a GitHub antes de morir */
  setTimeout(() => process.exit(0), 10000);
});

setInterval(() => {}, 60e3); // el padre se queda vivo
