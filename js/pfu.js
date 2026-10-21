/* MICABO · PRUEBAS FÍSICAS UNIFICADAS (PFU)
   -------------------------------------------------------------------------
   Calculadora oficial a partir de la Orden DEF/15/2026 (BOE núm. 19, 21-ene-2026).
   Los baremos NO están escritos a mano: los saca tools/extrae-pfu.py del XML del
   BOE y los deja en js/pfu-data.js (window.PFU).

   Qué hace:
     · puntos 0-100 de cada prueba según edad y sexo (Anexo II)
     · APTO / NO APTO contra la marca mínima del proceso que elijas (Anexo III)
     · modo objetivo: qué marca necesitas para X puntos
     · guarda tus marcas y te dice cuánto has mejorado
   ------------------------------------------------------------------------- */
"use strict";
(function () {
  const P = () => window.PFU;
  const S = () => (window.AO && AO.stateRef ? AO.stateRef() : {});
  const save = () => { try { window.AO.save(); } catch (e) {} };
  const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- utilidades de tiempo ---------- */
  // "11:54" → 714 · "2:00" → 120 · "1:05" → 65 · "" → null
  function aSegundos(txt) {
    const t = String(txt || "").trim()
      .replace(/[′’´'`]/g, ":")      // primas y apóstrofos → minutos
      .replace(/[″”"]/g, "")         // dobles primas → fuera
      .replace(/\s/g, "");
    if (!t) return null;
    if (t.indexOf(":") >= 0) {
      const p = t.split(":");
      const m = parseInt(p[0], 10), s = parseInt(p[1], 10);
      if (isNaN(m) || isNaN(s)) return null;
      return m * 60 + s;
    }
    const n = parseFloat(t.replace(",", "."));
    return isNaN(n) ? null : n;
  }
  function aMMSS(seg) {
    if (seg == null || isNaN(seg)) return "—";
    const s = Math.round(seg);
    const m = Math.floor(s / 60), r = s % 60;
    return m + ":" + String(r).padStart(2, "0");
  }
  const fmtMarca = (prueba, v) => prueba === "flexiones" ? v + " rep"
    : prueba === "cav" ? String(v).replace(".", ",") + " s"
    : aMMSS(v);

  /* ---------- grupo de edad (Anexo II) ---------- */
  const CORTES = [[25, "17-25"], [30, "26-30"], [35, "31-35"], [40, "36-40"], [45, "41-45"],
                  [50, "46-50"], [55, "51-55"], [59, "56-59"], [200, "60+"]];
  function grupoEdad(edad) {
    for (const [max, g] of CORTES) if (edad <= max) return g;
    return "60+";
  }

  /* ---------- puntos de una prueba (0-100) ---------- */
  /* el CAV solo se evalúa por debajo de 45 años (art. 10.1), por eso su tabla
     llega hasta el grupo 41-45; por encima no se pide. */
  function aplica(prueba, edad) {
    return !(prueba === "cav" && edad > 45);
  }

  function puntos(prueba, marca, edad, sexo) {
    const D = P();
    if (!D || marca == null || isNaN(marca)) return null;
    const pr = D.pruebas[prueba];
    if (!pr || !aplica(prueba, edad)) return null;
    const g = grupoEdad(edad);
    const grupo = pr.baremo.some(f => f.p[g]) ? g : "41-45";
    const mejorCorta = pr.tipo === "desc";   // carrera y CAV: menos es mejor
    /* No se recorre la tabla en orden (el BOE tiene alguna fila descolocada):
       se busca el umbral que corresponde a la marca.
       · repeticiones / plancha: la fila más alta que no supere la marca
       · tiempos: la fila más baja que no baje de la marca */
    let umbral = null;
    for (const fila of pr.baremo) {
      const v = fila.marca.indexOf(":") >= 0 ? aSegundos(fila.marca)
        : parseFloat(String(fila.marca).replace(",", "."));
      if (v == null || isNaN(v)) continue;
      if (fila.p[grupo] == null) continue;
      if (mejorCorta ? marca <= v : marca >= v) {
        if (umbral == null || (mejorCorta ? v < umbral : v > umbral)) umbral = v;
      }
    }
    if (umbral == null) return 0;
    for (const fila of pr.baremo) {
      const v = fila.marca.indexOf(":") >= 0 ? aSegundos(fila.marca)
        : parseFloat(String(fila.marca).replace(",", "."));
      if (v === umbral && fila.p[grupo]) return fila.p[grupo][sexo] ?? null;
    }
    return 0;
  }

  /* ---------- qué marca hace falta para X puntos ---------- */
  function marcaParaPuntos(prueba, objetivo, edad, sexo) {
    const D = P();
    const pr = D.pruebas[prueba];
    if (!aplica(prueba, edad)) return null;
    const g = grupoEdad(edad);
    const grupo = pr.baremo.some(f => f.p[g]) ? g : "41-45";
    let elegida = null;
    for (const fila of pr.baremo) {          // de mejor a peor: la última que aún llega
      if ((fila.p[grupo][sexo] ?? 0) >= objetivo) elegida = fila;
    }
    if (!elegida) return null;
    return elegida.marca;
  }

  /* ---------- evaluación periódica: 20 puntos en CADA prueba (art. 12.1) ---------- */
  function aptoPeriodica() {
    const min = (P().regla_apto && P().regla_apto.puntos_por_prueba) || 20;
    return min;
  }

  /* ---------- marcas mínimas del proceso ---------- */
  const CLAVE_PRUEBA = {
    flexiones: "Potencia tren superior.",
    plancha: "Fuerza abdominal.",
    carrera: "Prueba de resistencia. 2.000 m.",
    cav: "Circuito de agilidad-velocidad.",
    soltura: "Soltura acuática."
  };
  /* OJO: en los baremos del Anexo II la columna «M» es masculino, pero en las
     tablas de marcas mínimas del Anexo III el BOE usa «H» (hombre) y «M» (mujer).
     Aquí se traduce: nuestra app usa M = hombre, F = mujer. */
  const sx = sexo => (sexo === "M" ? "H" : "M");

  function minimoProceso(proceso, prueba, sexo, columna) {
    const D = P();
    const pr = D.procesos[proceso];
    if (!pr || !pr.marcas) return null;
    const fila = pr.marcas[CLAVE_PRUEBA[prueba]];
    if (!fila) return null;
    const col = columna || (pr.columnas && pr.columnas[0]);
    const v = fila[col] && fila[col][sx(sexo)];
    return v == null ? null : v;
  }
  function valorMinimo(txt, prueba) {
    if (txt == null) return null;
    const t = String(txt).trim();
    if (prueba === "flexiones") return parseInt(t, 10);
    // formatos del BOE: «11´54´´» → 714 · «40´´» → 40 · «15,4´´» → 15,4
    let m = t.match(/^(\d+)\s*[´'’′]\s*(\d{1,2})/);
    if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    m = t.match(/^(\d+(?:[.,]\d+)?)\s*[´'’′]*\s*[″"]*$/);
    if (m) return parseFloat(m[1].replace(",", "."));
    return null;
  }

  // ¿la marca cumple el mínimo? (en tiempos, menos es mejor)
  function cumple(prueba, marca, min) {
    if (marca == null || min == null) return null;
    return prueba === "flexiones" || prueba === "plancha" ? marca >= min : marca <= min;
  }

  /* ---------- permanencia: 0-5 por prueba ---------- */
  function bandasPuntos(prueba, marca, sexo) {
    const D = P();
    const pr = D.procesos.permanencia;
    if (!pr || !pr.bandas_puntos || marca == null) return null;
    const arr = pr.bandas_puntos[CLAVE_PRUEBA[prueba]] && pr.bandas_puntos[CLAVE_PRUEBA[prueba]][sx(sexo)];
    if (!arr) return null;
    const esTiempo = prueba !== "flexiones";
    const num = s => {
      const m = String(s).match(/(\d+)[,.](\d+)/);
      return m ? parseFloat(m[1] + "." + m[2]) : parseFloat(s);
    };
    for (const b of arr) {                      // de más a menos puntos
      const t = b.banda.trim();
      let ok = false;
      if (t.startsWith("+")) ok = esTiempo ? marca >= aSegundos(t.slice(1)) : marca >= num(t.slice(1));
      else if (t.startsWith("-")) ok = esTiempo ? marca < aSegundos(t.slice(1)) : marca < num(t.slice(1));
      else {
        const [a, z] = t.split("-").map(x => x.trim());
        const va = esTiempo ? aSegundos(a) : num(a), vz = esTiempo ? aSegundos(z) : num(z);
        // en tiempos la banda puede venir de mayor a menor: se ordena
        ok = marca >= Math.min(va, vz) && marca <= Math.max(va, vz);
      }
      if (ok) return b.puntos;
    }
    return 0;
  }

  /* ---------- estado ---------- */
  function datos() {
    const st = S();
    if (!st.pfu) st.pfu = { sexo: "", edad: null, proceso: "", marcas: {}, historial: [], vista: "calc", objetivo: 60 };
    if (!st.pfu.marcas) st.pfu.marcas = {};
    if (!st.pfu.historial) st.pfu.historial = [];
    return st.pfu;
  }

  const PRUEBAS = [
    { id: "flexiones", ico: "💪", tipo: "reps", ph: "p. ej. 24", ayuda: "Flexiones en 2 minutos" },
    { id: "plancha", ico: "🧘", tipo: "tiempo", ph: "p. ej. 2:10", ayuda: "Plancha isométrica: aguanta" },
    { id: "carrera", ico: "🏃", tipo: "tiempo", ph: "p. ej. 11:30", ayuda: "2.000 m cronometrados" },
    { id: "cav", ico: "⚡", tipo: "seg", ph: "p. ej. 15,4", ayuda: "Circuito de agilidad-velocidad" },
    { id: "soltura", ico: "🏊", tipo: "tiempo", ph: "p. ej. 1:00", ayuda: "Solo oficiales y suboficiales" }
  ];

  /* =====================================================================
     PANTALLA
     ===================================================================== */
  window.vFisicas = function () {
    const D = P();
    const v = document.getElementById("view");
    if (!D) {
      v.innerHTML = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Pruebas físicas</h1></div>' +
        '<div class="card"><p>No he podido cargar los baremos oficiales. Recarga la página.</p></div>';
      return;
    }
    const d = datos();
    const sexo = d.sexo, edad = d.edad;
    const listo = sexo && edad && edad >= 16;

    /* --- cabecera --- */
    let html = '<div class="view-head"><a class="back" href="#/mas">←</a><h1>Pruebas físicas 🏅</h1></div>' +
      '<p class="small muted" style="margin:-4px 0 10px">Baremo oficial · ' + esc(D.fuente) + '</p>';

    /* --- datos personales --- */
    html += '<div class="card"><h3 style="margin-top:0">Tus datos</h3>' +
      '<p class="small muted" style="margin:0 0 8px">El baremo cambia con la edad y el sexo. Se guarda en tu perfil.</p>' +
      '<div class="pfu-seg" id="pfuSexo">' +
        '<button class="' + (sexo === "M" ? "on" : "") + '" data-sexo="M">Hombre</button>' +
        '<button class="' + (sexo === "F" ? "on" : "") + '" data-sexo="F">Mujer</button></div>' +
      '<div class="pfu-row" style="margin-top:10px">' +
        '<label class="small muted" for="pfuEdad">Edad</label>' +
        '<input id="pfuEdad" type="number" min="16" max="70" inputmode="numeric" value="' + (edad || "") + '" placeholder="años">' +
      '</div>' +
      (listo ? '<p class="small muted" style="margin:8px 0 0">Grupo de edad: <b>' + grupoEdad(edad) + '</b></p>'
             : '<p class="small muted" style="margin:8px 0 0">Pon tu edad para calcular los puntos.</p>') +
      '</div>';

    if (!listo) { v.innerHTML = html + pieFuente(); bindDatos(); return; }

    /* --- pestañas --- */
    const vista = d.vista || "calc";
    html += '<div class="pfu-tabs">' +
      ["calc", "min", "obj"].map(k => '<button data-vista="' + k + '" class="' + (vista === k ? "on" : "") + '">' +
        ({ calc: "Simulador", min: "Marcas mínimas", obj: "Qué necesito" })[k] + '</button>').join("") + '</div>';

    /* --- proceso --- */
    if (vista === "calc" || vista === "min") {
      const proc = d.proceso || "periodica";
      html += '<div class="card"><label class="small muted" for="pfuProc">¿Para qué proceso?</label>' +
        '<select id="pfuProc"><option value="periodica"' + (proc === "periodica" ? " selected" : "") + '>Evaluación periódica anual (desde 1-ene-2027)</option>' + Object.keys(D.procesos).map(k =>
          '<option value="' + k + '"' + (k === proc ? " selected" : "") + '>' + esc(D.procesos[k].nombre) + '</option>').join("") +
        '</select></div>';
      d.proceso = proc;
    }

    /* ---------- SIMULADOR ---------- */
    if (vista === "calc") {
      html += '<div class="card"><h3 style="margin-top:0">Tus marcas</h3>';
      const idsVista = IDS(edad, d.proceso);
      PRUEBAS.filter(pr => idsVista.indexOf(pr.id) >= 0).forEach(pr => {
        const m = d.marcas[pr.id];
        const pts = (D.pruebas[pr.id] && D.pruebas[pr.id].baremo && D.pruebas[pr.id].baremo.length)
          ? puntos(pr.id, m, edad, sexo) : null;
        const esPer = d.proceso === "periodica";
        const min = esPer ? null : minimoProceso(d.proceso, pr.id, sexo);
        const minV = esPer ? null : valorMinimo(min, pr.id);
        const ok = esPer ? (pts == null ? null : pts >= aptoPeriodica()) : cumple(pr.id, m, minV);
        const marcaMin = esPer ? marcaParaPuntos(pr.id, aptoPeriodica(), edad, sexo) : null;
        html += '<div class="pfu-p">' +
          '<div class="pfu-ph"><span class="pfu-ico">' + pr.ico + '</span><b>' + D.pruebas[pr.id].corto + '</b>' +
            (pts != null ? '<span class="pfu-pts ' + (ok === false ? "bad" : ok ? "good" : "") + '">' + pts + '<small>/100</small></span>' : '') +
          '</div>' +
          '<div class="pfu-in">' +
            '<input data-pr="' + pr.id + '" inputmode="' + (pr.tipo === "reps" ? "numeric" : "text") + '" placeholder="' + pr.ph + '" value="' + (m != null ? (pr.id === "flexiones" ? m : pr.tipo === "seg" ? String(m).replace(".", ",") : aMMSS(m)) : "") + '">' +
            '<button class="pfu-crono" data-crono="' + pr.id + '" title="Cronómetro">⏱</button>' +
          '</div>' +
          '<div class="pfu-meta">' + pr.ayuda +
            (minV != null ? ' · mínimo: <b>' + esc(fmtMarca(pr.id, minV)) + '</b>' : '') +
            (marcaMin ? ' · para los ' + aptoPeriodica() + ' puntos: <b>' + esc(marcaMin + (pr.id === "flexiones" ? " rep" : pr.id === "cav" ? " s" : "")) + '</b>' : '') +
            (ok === true ? ' <span class="pfu-tag ok">APTO</span>' : ok === false ? ' <span class="pfu-tag ko">NO APTO</span>' : '') +
          '</div></div>';
      });
      html += '</div>';

      /* total (se rellena en pintaTotal, que se refresca al teclear) */
      html += '<div class="card pfu-total" id="pfuTotal"></div>';
      if (d.proceso === "permanencia") html += '<div id="pfuPerm"></div>';
        html += '<button class="btn btn-green btn-block" id="pfuGuardar" style="margin-top:2px">💾 Guardar mis marcas de hoy</button>' +
        '<button class="btn btn-ghost btn-block" id="pfuCompartir" style="margin-top:8px">📤 Compartir mis marcas</button>' +
        '<button class="btn btn-ghost btn-block" id="pfuDescargar" style="margin-top:8px">⬇️ Descargar mi hoja de marcas</button>';
      html += cronoHTML();
    }

    /* ---------- MARCAS MÍNIMAS ---------- */
    if (vista === "min" && d.proceso === "periodica") {
      const lim = aptoPeriodica();
      html += '<div class="card"><h3 style="margin-top:0">Evaluación periódica anual</h3>' +
        '<p class="small muted" style="margin:0 0 10px">' + esc(D.regla_apto.texto) + ' En vigor desde el ' +
        new Date(D.regla_apto.en_vigor).toLocaleDateString("es-ES") + '.</p>' +
        '<table class="pfu-tabla"><thead><tr><th>Prueba</th><th>Marca para ' + lim + ' puntos</th></tr></thead><tbody>' +
        PRUEBAS.filter(pr => IDS(edad, "periodica").indexOf(pr.id) >= 0).map(pr => {
          const m = marcaParaPuntos(pr.id, lim, edad, sexo);
          return '<tr><td>' + pr.ico + " " + esc(D.pruebas[pr.id].corto) + '</td><td><b>' +
            (m == null ? "—" : esc(m + (pr.id === "flexiones" ? " rep" : pr.id === "cav" ? " s" : ""))) + '</b></td></tr>';
        }).join("") + '</tbody></table>' +
        '<p class="small muted" style="margin:10px 0 0">Grupo <b>' + grupoEdad(edad) + '</b> · ' + (sexo === "F" ? "mujer" : "hombre") +
        '. Por debajo de esa marca, esa prueba no se supera.</p></div>';
    }

    if (vista === "min" && d.proceso !== "periodica") {
      const pr = D.procesos[d.proceso];
      html += '<div class="card"><h3 style="margin-top:0">' + esc(pr.nombre) + '</h3>' +
        '<p class="small muted" style="margin:0 0 10px">Lo que hay que alcanzar para no quedar fuera. ' +
        (pr.nota ? esc(pr.nota) : '') + '</p>';
      if (pr.marcas) {
        html += '<table class="pfu-tabla"><thead><tr><th>Prueba</th>' +
          pr.columnas.map(c => '<th>' + esc(abrevia(c)) + '</th>').join("") + '</tr></thead><tbody>' +
          Object.keys(CLAIVE()).map(k => {
            const fila = pr.marcas[CLAIVE()[k]];
            if (!fila) return "";
            return '<tr><td>' + esc(D.pruebas[k].corto) + '</td>' +
              pr.columnas.map(c => {
                const x = fila[c] && fila[c][sx(sexo)];
                return '<td>' + (x ? esc(x) : "—") + '</td>';
              }).join("") + '</tr>';
          }).join("") + '</tbody></table>';
      } else if (pr.bandas_puntos) {
        html += '<table class="pfu-tabla"><thead><tr><th>Prueba</th>' + [5, 4, 3, 2, 1, 0].map(p => "<th>" + p + " pt</th>").join("") + '</tr></thead><tbody>' +
          Object.keys(CLAIVE()).map(k => {
            const arr = pr.bandas_puntos[CLAIVE()[k]] && pr.bandas_puntos[CLAIVE()[k]][sx(sexo)];
            if (!arr) return "";
            return '<tr><td>' + esc(D.pruebas[k].corto) + '</td>' + arr.map(b => '<td>' + esc(b.banda) + '</td>').join("") + '</tr>';
          }).join("") + '</tbody></table>';
      }
      html += '<p class="small muted" style="margin:10px 0 0">Mostrando marcas de <b>' + (sexo === "F" ? "mujer" : "hombre") + '</b>. Cambia arriba si no es tu caso.</p></div>';
    }

    /* ---------- QUÉ NECESITO ---------- */
    if (vista === "obj") {
      const obj = d.objetivo || 60;
      html += '<div class="card"><h3 style="margin-top:0">¿Qué marca necesito?</h3>' +
        '<p class="small muted" style="margin:0 0 8px">Elige los puntos que quieres sacar en cada prueba y te digo la marca mínima.</p>' +
        '<div class="pfu-obj"><input id="pfuObj" type="range" min="10" max="100" step="5" value="' + obj + '">' +
        '<b id="pfuObjTxt">' + obj + ' puntos</b></div>' +
        '<div class="pfu-list">' + PRUEBAS.filter(pr => IDS(edad, d.proceso).indexOf(pr.id) >= 0).map(pr => {
          const m = marcaParaPuntos(pr.id, obj, edad, sexo);
          return '<div class="pfu-objrow"><span>' + pr.ico + " " + D.pruebas[pr.id].corto + '</span><b>' +
            (m == null ? "fuera de tabla" : esc(m + (pr.id === "flexiones" ? " rep" : pr.id === "cav" ? " s" : ""))) + '</b></div>';
        }).join("") + '</div>' +
        '<p class="small muted" style="margin:10px 0 0">Con el grupo de edad <b>' + grupoEdad(edad) + '</b> y ' +
        (sexo === "F" ? "mujer" : "hombre") + '. Los 100 puntos son la marca máxima de la tabla.</p></div>';
    }

    /* ---------- HISTORIAL ---------- */
    if (d.historial.length) {
      html += '<div class="card"><h3 style="margin-top:0">Tu progreso</h3>' +
        '<div class="pfu-hist">' + d.historial.slice(-6).reverse().map((h, i, arr) => {
          const ant = arr[i + 1];
          const dif = ant ? h.media - ant.media : null;
          return '<div class="pfu-hrow"><span>' + new Date(h.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) + '</span>' +
            '<b>' + h.media + '<small>/100</small></b>' +
            (dif == null ? '<span class="small muted">primera</span>' :
              '<span class="' + (dif > 0 ? "pfu-up" : dif < 0 ? "pfu-down" : "small muted") + '">' + (dif > 0 ? "+" + dif : dif) + '</span>') +
            '</div>';
        }).join("") + '</div>' +
        '<button class="btn btn-ghost btn-sm" id="pfuBorrarHist" style="margin-top:8px">Borrar historial</button></div>';
    }

    v.innerHTML = html + cronoHTML() + pieFuente();
    bindDatos();
    bindSimulador();
    pintaTotal();
  };

  function CLAIVE() { return CLAVE_PRUEBA; }
  function abrevia(c) {
    return c.replace("Al finalizar la fase de formación militar general", "Fin formación general")
      .replace("Al finalizar la enseñanza de formación", "Fin enseñanza")
      .replace("Ingreso carrera y complemento", "Ingreso").replace("Curso ", "C");
  }
  function pieFuente() {
    return '<p class="small muted center" style="margin:14px 0 4px">Fuente: <a href="' +
      esc(P().url) + '" target="_blank" rel="noopener">Orden DEF/15/2026 · BOE</a>. ' +
      'Calculadora orientativa: manda el tribunal.</p>';
  }
  function cronoHTML() {
    return '<div class="pfu-cronobox" id="pfuCronoBox" hidden>' +
      '<div class="pfu-crononum" id="pfuCronoT">0:00.0</div>' +
      '<div class="pfu-cronobtns"><button class="btn btn-green btn-sm" id="pfuCronoGo">▶︎ Empezar</button>' +
      '<button class="btn btn-ghost btn-sm" id="pfuCronoReset">Reiniciar</button>' +
      '<button class="btn btn-gold btn-sm" id="pfuCronoUse">Usar este tiempo</button></div>' +
      '<p class="small muted center" id="pfuCronoPara" style="margin:6px 0 0"></p></div>';
  }

  /* ---------- eventos ---------- */
  function bindDatos() {
    const d = datos();
    const seg = document.getElementById("pfuSexo");
    if (seg) seg.querySelectorAll("button").forEach(b => b.onclick = () => {
      d.sexo = b.getAttribute("data-sexo"); save(); window.vFisicas();
    });
    const ed = document.getElementById("pfuEdad");
    if (ed) ed.onchange = () => {
      const n = parseInt(ed.value, 10);
      d.edad = isNaN(n) ? null : Math.max(16, Math.min(70, n)); save(); window.vFisicas();
    };
  }

  function bindSimulador() {
    const d = datos();
    const proc = document.getElementById("pfuProc");
    if (proc) proc.onchange = () => { d.proceso = proc.value; save(); window.vFisicas(); };

    document.querySelectorAll("[data-pr]").forEach(inp => {
      inp.oninput = () => {
        const pr = inp.getAttribute("data-pr");
        const raw = inp.value.trim();
        let v = null;
        if (raw) v = pr === "flexiones" ? parseInt(raw, 10) : aSegundos(raw);
        if (v != null && isNaN(v)) v = null;
        d.marcas[pr] = v;
        save();
        actualizaPuntos();
      };
    });

    document.querySelectorAll("[data-vista]").forEach(b => b.onclick = () => {
      d.vista = b.getAttribute("data-vista"); save(); window.vFisicas();
    });

    const g = document.getElementById("pfuGuardar");
    if (g) g.onclick = () => {
      const ids = IDS(d.edad, d.proceso);
      const val = ids.map(k => puntos(k, d.marcas[k], d.edad, d.sexo)).filter(x => x != null);
      if (!val.length) { AO.toast("Pon alguna marca primero"); return; }
      const media = Math.round(val.reduce((a, b) => a + b, 0) / val.length);
      d.historial.push({ fecha: Date.now(), media: media, marcas: Object.assign({}, d.marcas) });
      if (d.historial.length > 40) d.historial.shift();
      save(); AO.toast("💾 Guardado · " + media + "/100"); window.vFisicas();
    };
    const comp = document.getElementById("pfuCompartir");
    if (comp) comp.onclick = async () => {
      const ids = IDS(d.edad, d.proceso);
      const D2 = P();
      const lineas = ids.map(k => {
        const m = d.marcas[k];
        if (m == null) return null;
        return D2.pruebas[k].corto + ": " + (k === "flexiones" ? m + " rep" : k === "cav" ? String(m).replace(".", ",") + " s" : aMMSS(m)) +
          (puntos(k, m, d.edad, d.sexo) != null ? " · " + puntos(k, m, d.edad, d.sexo) + "/100" : "");
      }).filter(Boolean);
      const texto = "Mis pruebas físicas (MICABO)\n" + (d.sexo === "F" ? "Mujer" : "Hombre") + " · " + d.edad +
        " años · grupo " + grupoEdad(d.edad) + "\n" + lineas.join("\n") +
        "\nBaremo: Orden DEF/15/2026 (BOE)";
      try {
        if (navigator.share) { await navigator.share({ title: "Mis pruebas físicas · MICABO", text: texto }); }
        else { await navigator.clipboard.writeText(texto); AO.toast("📋 Copiado: pégalo donde quieras"); }
      } catch (e) { /* el usuario ha cancelado: no hay nada que hacer */ }
    };
    const desc = document.getElementById("pfuDescargar");
    if (desc) desc.onclick = async () => {
      const D2 = P(), ids = IDS(d.edad, d.proceso);
      const qr = await window.qrDataURI();
      const filas = ids.map(k => {
        const m = d.marcas[k];
        const pts = puntos(k, m, d.edad, d.sexo);
        const hecha = m != null;
        return '<tr><td><b>' + esc(D2.pruebas[k].nombre) + '</b><br><span class="muted">' + esc(D2.pruebas[k].detalle) + '</span></td>' +
          '<td>' + (hecha ? esc(k === "flexiones" ? m + " rep" : k === "cav" ? String(m).replace(".", ",") + " s" : aMMSS(m)) : "—") + '</td>' +
          '<td>' + (pts != null ? pts + "/100" : "—") + '</td></tr>';
      }).join("");
      const html = "<!doctype html><html lang='es'><head><meta charset='utf-8'><title>Mis pruebas físicas · MICABO</title>" +
        "<style>body{font-family:system-ui,Arial;max-width:760px;margin:24px auto;padding:0 16px;color:#1d2a21;line-height:1.45}" +
        "h1{color:#143d26}h2{border-bottom:2px solid #c9971f;padding-bottom:4px;margin-top:26px}" +
        "table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #dfe5dd;padding:9px 6px;text-align:left;font-size:.92em}" +
        "th{color:#5f6f63;font-size:.8em;text-transform:uppercase;letter-spacing:.04em}.muted{color:#5f6f63;font-size:.85em}" +
        ".hd{display:flex;gap:16px;align-items:center;justify-content:space-between}.qrbox img{width:96px;height:96px}" +
        ".kpi{display:flex;gap:18px;margin-top:10px}.kpi div{background:#faf7ee;border:1px solid #e8e2d2;border-radius:10px;padding:10px 16px;text-align:center}" +
        ".kpi b{font-size:1.5em;color:#143d26;display:block}header{border:2px solid #143d26;border-radius:10px;padding:10px 14px}" +
        "@media print{body{margin:8mm auto}}</style></head><body><header><div class='hd'><div><h1>▲ MICABO · Mis pruebas físicas</h1>" +
        "<p class='muted'>" + (d.sexo === "F" ? "Mujer" : "Hombre") + " · " + d.edad + " años · grupo " + grupoEdad(d.edad) +
        " · " + esc(D2.fuente) + " · generado el " + new Date().toLocaleDateString("es-ES") + "</p></div>" +
        (qr ? "<div class='qrbox'><img src='" + qr + "' alt='QR MICABO'></div>" : "") + "</div></header>" +
        "<h2>Mis marcas</h2><table><thead><tr><th>Prueba</th><th>Marca</th><th>Puntos</th></tr></thead><tbody>" + filas + "</tbody></table>" +
        "<h2>Qué significa</h2><p>En la evaluación periódica hacen falta <b>" + aptoPeriodica() + " puntos en cada prueba</b> para ser apto (art. 12.1 de la Orden DEF/15/2026). " +
        "En los procesos de acceso, cada prueba tiene su marca mínima (Anexo III).</p>" +
        "<p class='muted'>Calculadora orientativa de MICABO · la nota definitiva la fija el tribunal. Fuente: <a href='" + D2.url + "'>BOE-A-2026-1379</a>.</p>" +
        "</body></html>";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = "micabo-pruebas-fisicas-" + new Date().toISOString().slice(0, 10) + ".html";
      document.body.appendChild(a); a.click(); a.remove();
      AO.toast("📄 Hoja descargada: ábrela e imprímela");
    };
    const bh = document.getElementById("pfuBorrarHist");
    if (bh) bh.onclick = () => { d.historial = []; save(); window.vFisicas(); };

    const obj = document.getElementById("pfuObj");
    if (obj) obj.oninput = () => { d.objetivo = parseInt(obj.value, 10); document.getElementById("pfuObjTxt").textContent = obj.value + " puntos"; };
    if (obj) obj.onchange = () => { d.objetivo = parseInt(obj.value, 10); save(); window.vFisicas(); };

    crono();
  }

  /* el CAV no se evalúa a partir de 46 años (art. 10.1); la soltura acuática solo
     aparece cuando el proceso elegido la exige (oficiales/suboficiales y +45). */
  function IDS(edad, proceso) {
    const base = ["flexiones", "plancha", "carrera", "cav"].filter(k => aplica(k, edad));
    if (proceso && P().procesos[proceso] && P().procesos[proceso].marcas &&
        P().procesos[proceso].marcas["Soltura acuática."]) base.push("soltura");
    return base;
  }

  function pintaTotal() {
    const d = datos();
    const caja = document.getElementById("pfuTotal");
    if (!caja) return;
    const ids = IDS(d.edad, d.proceso);
    const val = ids.map(k => puntos(k, d.marcas[k], d.edad, d.sexo)).filter(x => x != null);
    if (!val.length) {
      caja.innerHTML = '<div class="pfu-num">—<small>/100</small></div><div><b>Pon tus marcas</b>' +
        '<div class="small muted">Los puntos salen del baremo oficial de tu edad y sexo</div></div>';
      return;
    }
    const proceso = d.proceso || "periodica";
    const faltan = ids.filter(k => d.marcas[k] == null).length;
    const esPer = proceso === "periodica";

    /* permanencia: su tarjeta aparte (0-5 por prueba) */
    const perm = document.getElementById("pfuPerm");
    if (perm) {
      const b = ids.map(k => bandasPuntos(k, d.marcas[k], d.sexo)).filter(x => x != null);
      perm.innerHTML = b.length
        ? '<div class="card"><div class="topic-row"><span><b>Aptitud psicofísica (permanencia)</b><br>' +
          '<span class="small muted">0-5 por prueba</span></span>' +
          '<span class="pfu-pts">' + Math.min(15, b.reduce((a, c) => a + c, 0)) + '<small>/15</small></span></div>' +
          '<div class="small muted" style="margin-top:6px">Puntos: ' + ids.map(k => {
            const x = bandasPuntos(k, d.marcas[k], d.sexo);
            return x == null ? "" : esc(P().pruebas[k].corto) + ": <b>" + x + "</b>";
          }).filter(Boolean).join(" · ") + '</div></div>'
        : "";
    }

    if (esPer) {
      const lim = aptoPeriodica();
      const porDebajo = ids.filter(k => d.marcas[k] != null && (puntos(k, d.marcas[k], d.edad, d.sexo) || 0) < lim);
      const minimo = Math.min.apply(null, val);
      caja.innerHTML = '<div class="pfu-num">' + minimo + '<small>/100</small></div>' +
        '<div><b>' + (faltan ? "Te faltan " + faltan + " prueba" + (faltan > 1 ? "s" : "")
          : porDebajo.length ? "⚠️ " + porDebajo.length + " prueba" + (porDebajo.length > 1 ? "s" : "") + " por debajo de " + lim
          : "✅ APTO (evaluación periódica)") + '</b>' +
        '<div class="small muted">Tu prueba más floja · hacen falta <b>' + lim + ' puntos en cada prueba</b> (art. 12.1)</div></div>';
      return;
    }

    const todas = ids.every(k => {
      const minV = valorMinimo(minimoProceso(proceso, k, d.sexo), k);
      return cumple(k, d.marcas[k], minV) !== false;
    });
    const media = Math.round(val.reduce((a, b) => a + b, 0) / val.length);
    caja.innerHTML = '<div class="pfu-num">' + media + '<small>/100</small></div>' +
      '<div><b>' + (faltan ? "Te faltan " + faltan + " prueba" + (faltan > 1 ? "s" : "")
        : todas ? "✅ APTO en el proceso" : "⚠️ Hay pruebas por debajo del mínimo") + '</b>' +
      '<div class="small muted">' + esc(P().procesos[proceso].nombre) + '</div></div>';
  }

  /* recalcula puntos sin repintar (así el teclado no se cierra) */
  function actualizaPuntos() {
    const d = datos();
    const ids = IDS(d.edad, d.proceso);
    ids.forEach(k => {
      const caja = document.querySelector('[data-pr="' + k + '"]');
      if (!caja) return;
      const fila = caja.closest(".pfu-p");
      const ph = fila.querySelector(".pfu-pts");
      const pts = puntos(k, d.marcas[k], d.edad, d.sexo);
      const esPer = (d.proceso || "periodica") === "periodica";
      const minV = esPer ? null : valorMinimo(minimoProceso(d.proceso, k, d.sexo), k);
      const ok = esPer ? (pts == null ? null : pts >= aptoPeriodica()) : cumple(k, d.marcas[k], minV);
      if (pts == null) { if (ph) ph.remove(); return; }
      /* refresca también la etiqueta APTO / NO APTO mientras se escribe */
      const meta = fila.querySelector(".pfu-meta");
      if (meta) {
        const base = meta.innerHTML.split(' <span class="pfu-tag')[0];
        meta.innerHTML = base + (ok === true ? ' <span class="pfu-tag ok">APTO</span>'
          : ok === false ? ' <span class="pfu-tag ko">NO APTO</span>' : "");
      }
      const cls = "pfu-pts " + (ok === false ? "bad" : ok ? "good" : "");
      if (ph) { ph.className = cls; ph.innerHTML = pts + "<small>/100</small>"; }
      else fila.querySelector(".pfu-ph").insertAdjacentHTML("beforeend",
        '<span class="' + cls + '">' + pts + '<small>/100</small></span>');
    });
    pintaTotal();
  }

  /* ---------- cronómetro ---------- */
  let t0 = 0, tick = null, paraQuien = null;
  function crono() {
    const box = document.getElementById("pfuCronoBox");
    if (!box) return;
    document.querySelectorAll("[data-crono]").forEach(b => b.onclick = () => {
      paraQuien = b.getAttribute("data-crono");
      box.hidden = false;
      document.getElementById("pfuCronoPara").textContent = "Cronómetro para " + P().pruebas[paraQuien].corto;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const num = document.getElementById("pfuCronoT");
    const pinta = () => {
      const s = (Date.now() - t0) / 1000;
      num.textContent = Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") + "." + Math.floor((s * 10) % 10);
    };
    document.getElementById("pfuCronoGo").onclick = e => {
      if (tick) { clearInterval(tick); tick = null; e.target.textContent = "▶︎ Seguir"; }
      else { if (!t0) t0 = Date.now(); else t0 = Date.now() - (parseFloat(num.dataset.ms || 0)); tick = setInterval(pinta, 100); e.target.textContent = "⏸ Parar"; }
      num.dataset.ms = Date.now() - t0;
    };
    document.getElementById("pfuCronoReset").onclick = () => {
      clearInterval(tick); tick = null; t0 = 0; num.textContent = "0:00.0";
      document.getElementById("pfuCronoGo").textContent = "▶︎ Empezar";
    };
    document.getElementById("pfuCronoUse").onclick = () => {
      clearInterval(tick); tick = null;
      const s = Math.round((Date.now() - t0) / 1000);
      const d = datos();
      d.marcas[paraQuien] = paraQuien === "flexiones" ? s : (paraQuien === "cav" ? s : s);
      save(); window.vFisicas();
    };
  }

  /* API por si otro módulo quiere los puntos */
  window.PFUcalc = { puntos: puntos, marcaParaPuntos: marcaParaPuntos, grupoEdad: grupoEdad, aSegundos: aSegundos };
})();
