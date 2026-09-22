/* A LA ORDEN · agenda de Telegram: pregunta diaria + vigilancia BOD (proceso de larga vida)
   - 09:00 (hora de España) → node bod-check.js --pregunta  (una por canal de curso)
   - 00/06/12/18         → node bod-check.js --post         (alertas BOD nuevas, enrutadas)
   Estado en tools/.agenda-state.json → no duplica si se reinicia. */
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");

const SFILE = path.join(__dirname, ".agenda-state.json");
let ST = {};
try { ST = JSON.parse(fs.readFileSync(SFILE, "utf8")); } catch (e) { ST = {}; }
const save = () => { try { fs.writeFileSync(SFILE, JSON.stringify(ST)); } catch (e) {} };

const run = (args) => {
  try {
    const out = execFileSync("node", [path.join(__dirname, "bod-check.js"), ...args], { encoding: "utf8", cwd: path.join(__dirname, "..") });
    console.log("[" + new Date().toISOString() + "] → " + args.join(" ") + "\n" + out.split("\n").filter(l => /pregunta|publicad|Telegram|alerta|env[ií]o/i.test(l)).join("\n"));
  } catch (e) { console.log("[" + new Date().toISOString() + "] fallo " + args.join(" ") + ": " + e.message); }
};

const tick = () => {
  const d = new Date();
  const dia = d.toLocaleDateString("sv", { timeZone: "Europe/Madrid" });
  const hm = d.toLocaleTimeString("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false });
  const h = parseInt(hm.split(":")[0], 10), m = parseInt(hm.split(":")[1], 10);
  if (h === 9 && m < 2 && ST.pregunta !== dia) { ST.pregunta = dia; save(); run(["--pregunta"]); }
  if ([0, 6, 12, 18].indexOf(h) >= 0 && m < 2 && ST.post !== dia + "-" + h) { ST.post = dia + "-" + h; save(); run(["--post"]); }
};

console.log("⏰ Agenda A LA ORDEN: 🎲 pregunta diaria 09:00 (España) · 📡 vigilancia BOD a las 00/06/12/18");
tick();
setInterval(tick, 60 * 1000);
