/* A LA ORDEN — TEMARIO OFICIAL de la oposición de ascenso a Cabo del Ejército de Tierra.
   Estructura según el temario MADOC distribuido en el Rincón de Tropa ("Temario para la
   Oposición de Ascenso a Cabo del ET"), confirmado con el análisis del examen real I/25
   (febrero 2026): 50 preguntas + 5 de reserva · 70 minutos · 0,20/acierto − 0,05/error.
   Reparto real I/25: normativa 20 · táctica 13 · armamento 6 · topografía 3 ·
   transmisiones 3 · liderazgo 3 · organización ET 2. */
"use strict";
window.TEMARIO = {
  examen: {
    preguntas: "50 preguntas + 5 de reserva", duracion: "70 minutos",
    formula: "0,20 por acierto · −0,05 por error · en blanco no penaliza · máx. 10 puntos",
    cortes: "I/25: 4,335 · I/24: 4,390 (convocatoria I/25: 3.200 plazas)",
    reparto: [["Normativa militar (Cap. 1)", 20], ["Instrucción táctica y combate (Cap. 2)", 13], ["Armamento y tiro", 6], ["Topografía", 3], ["Transmisiones", 3], ["Liderazgo", 3], ["Organización del ET", 2]]
  },
  bloques: [
  /* ===================== CAPÍTULO 1 — FORMACIÓN GENERAL MILITAR (~40% del examen) ===================== */
  { cap: 1, title: "Bloque I · Reales Ordenanzas para las FAS", peso: "~10% del examen · estrellas del bloque",
    intro: "RD 84/2015, de 13 de febrero. La «biblia» del militar: deberes, valores, virtudes, Código de Conducta y reglas de actuación. Bloque más preguntado junto al disciplinario.",
    oficial: ["Parte Primera «Del militar»: deberes fundamentales, valores y virtudes militares, Código de Conducta.", "Libro Segundo: reglas de actuación y uso de la fuerza.", "El militar como basamento de la disciplina y el espíritu de cuerpo."],
    esencial: ["<b>Objeto</b>: servir de guía permanente de conducta e inspirar el exacto cumplimiento del deber, «inspirado en el amor a España».",
      "<b>Deberes fundamentales</b>: defender a España, guardar y hacer guardar la Constitución como norma suprema, lealtad al Rey y obediencia a los superiores, cumplir y hacer cumplir las órdenes, no abandonar el puesto de servicio sin causa justificada.",
      "<b>Valor más preciado</b>: el honor (así lo fijan las Reales Ordenanzas y la Ley 39/2007).",
      "<b>Virtudes militares</b>: espíritu de sacrificio, prontitud en la obediencia, exactitud en el servicio, abnegación, valor, disciplina, cohesión.",
      "<b>Límite de la obediencia</b>: el militar NO está obligado a obedecer órdenes que entrañen la ejecución de actos constitutivos de delito; quien ejecuta una orden manifiestamente delictiva responde también.",
      "<b>Ejercicio de autoridad</b>: se ejerce con justicia, pericia y honor; el mando conlleva responsabilidad por todo lo que ordena y por lo que omite ordenar.",
      "<b>Uso de la fuerza</b>: solo cuando sea estrictamente necesario, de forma <b>gradual y proporcional</b>; nunca más de lo imprescindible.",
      "<b>Código de Conducta</b>: respeto a los DD. HH. y al Derecho Internacional Humanitario, prohibición absoluta de la tortura, trato digno a detenidos y prisioneros, protección de la población civil.",
      "Los deberes morales (honor, lealtad, disciplina) son la base de la <b>disciplina</b>: «la disciplina constituye la máxima garantía de la unidad de actuación»."],
    fuentes: [{ t: "RD 84/2015 (BOE)", u: "https://www.boe.es/eli/es/rd/2015/02/13/84" }, { t: "Ley 39/2007 (BOE)", u: "https://www.boe.es/eli/es/l/2007/11/19/39" }],
    temas: ["Reales Ordenanzas"] },

  { cap: 1, title: "Bloque II · Seguridad de las FAS y régimen interior", peso: "guardias y acuartelamiento",
    intro: "LO 4/2015 (protección de la seguridad de las FAS) y el régimen interior de acuartelamientos. En 2026 cayeron aquí varias preguntas de guardias y servicios.",
    oficial: ["LO 4/2015, de 30 de marzo, de protección de la seguridad de las Fuerzas Armadas.", "Normas de régimen interior: acuartelamientos, servicios, guardias.", "Medidas de protección de personas, instalaciones y medios."],
    esencial: ["<b>LO 4/2015</b>: protege a las FAS frente a actos ilícitos contra su seguridad; cataloga personas (protección especial), instalaciones y medios; establece medidas y régimen sancionador (multas) para civiles que las atenten.",
      "<b>Instalaciones con protección especial</b>: las declaradas de interés para la Defensa Nacional; el acceso se controla con identificación y registro.",
      "<b>Régimen interior</b>: regula el orden y la vida en acuartelamientos: control de accesos, régimen de armas, normas de guardia, comportamiento en zona interior.",
      "<b>El servicio de guardia</b>: garantiza la seguridad, el orden y la respuesta inmediata 24 h; se compone de mando de guardia y fuerza de guardia (cabo de guardia y centinelas).",
      "<b>Centinela</b>: su servicio es de honor y responsabilidad; no puede abandonar su puesto salvo por causas justificadas (fuego, ataque, auxilio imprescindible… dando aviso).",
      "<b>Armas en acuartelamiento</b>: reglamentadas (registro, custodia en armería); fuera de servicio, las armas van descargadas y custodiadas.",
      "El <b>cabo</b> ejerce mando directo sobre la guardia de su escala: reparto de centinelas, instrucción del relevo, parte de novedades."],
    fuentes: [{ t: "LO 4/2015 (BOE)", u: "https://www.boe.es/eli/es/lo/2015/03/30/4" }, { t: "RD 1109/2015 — reglamento de régimen interior (BOE)", u: "https://www.boe.es/eli/es/rd/2015/12/11/1109" }],
    temas: ["Régimen Interior"] },

  { cap: 1, title: "Bloque III · Régimen Disciplinario Militar (LO 8/2014)", peso: "20% del examen con Cap.1 entero",
    intro: "Ley Orgánica 8/2014, de 26 de septiembre. Faltas, sanciones y procedimiento sancionador. Peso enorme en el examen real.",
    oficial: ["Tipos de faltas: muy graves, graves y leves.", "Sanciones y su ejecución.", "Procedimiento sancionador y derechos del sancionado."],
    esencial: ["<b>Tres tipos de falta</b>: muy graves, graves y leves; la negligencia voluntaria o la reiteración agravian la sanción.",
      "<b>Sanciones</b>: pérdida de destino, suspensión de funciones, pérdida de empleo (muy graves, según caso), arresto de fin de semana (máx. <b>4</b>) y apercibimiento (leves).",
      "Para tropa y marinería las sanciones habituales son <b>apercibimiento</b> y <b>arresto de fin de semana</b>; las muy gravísimas conductas pueden acabar en pérdida de empleo.",
      "<b>Prescripción de faltas</b>: muy graves <b>3 años</b>, graves <b>2 años</b>, leves <b>6 meses</b>. La sanción prescribe en el mismo plazo que la falta.",
      "<b>El mando sanciona</b> dentro de su competencia: el cabo ejerce mando y puede imponer a sus subordinados sanciones por faltas leves (apercibimiento).",
      "<b>Derechos del sancionado</b>: audiencia previa, conocer el hecho que se le imputa, proponer pruebas y recurrir la sanción (alzada).",
      "No se puede sancionar dos veces por el mismo hecho (non bis in idem); si el hecho puede ser delito, actúa la jurisdicción militar (CPM).",
      "La anotación de sanciones puede prescribir o cancelarse; influye en la valoración de servicios y ascensos."],
    fuentes: [{ t: "LO 8/2014 (BOE)", u: "https://www.boe.es/eli/es/lo/2014/09/26/8" }],
    temas: ["Régimen Disciplinario"] },

  { cap: 1, title: "Bloque IV · Código Penal Militar (LO 14/2015)", peso: "delitos militares",
    intro: "Ley Orgánica 14/2015, de 13 de octubre. Qué es delito militar y qué penas acarrean. Suele preguntarse en una o dos cuestiones sutiles.",
    oficial: ["Delitos contra la Defensa Nacional.", "Delitos contra el servicio y deberes militares.", "Penas privativas de libertad y pérdida de empleo."],
    esencial: ["<b>Ámbito</b>: delitos cometidos por militares en acto de servicio y determinados delitos contra la Defensa Nacional aunque los cometa un civil; aplica también en operaciones y en tiempo de guerra.",
      "<b>Delitos contra la Defensa Nacional</b>: rebelión, espionaje y descubrimiento de secretos, traición, propaganda ilegal.",
      "<b>Delitos contra el servicio</b>: abandono del destino o del puesto de centinela/vigilancia, omisión de auxilio, abuso de mando, infracción de deberes del servicio.",
      "<b>El centinela que abandona su puesto</b> comete delito (además de la falta disciplinaria correspondiente).",
      "<b>Penas</b>: privativas de libertad (prisión), y la <b>pérdida de empleo</b> como pena principal en los delitos graves; también accesorias (suspensión, inhabilitación).",
      "En los delitos más graves en tiempo de guerra cabe <b>prisión permanente revisable</b>.",
      "La orden manifiestamente delictiva no exime de responsabilidad penal (coherente con el límite de la obediencia de las RO)."],
    fuentes: [{ t: "LO 14/2015 (BOE)", u: "https://www.boe.es/eli/es/lo/2015/10/13/14" }],
    temas: ["Código Penal Militar"] },

  { cap: 1, title: "Bloque V · Organización del ET y situaciones administrativas", peso: "estructura y Ley 39/2007",
    intro: "Instrucción 14/2021 del JEME (organización del ET, actualizada por ODEF 559/2024) y situaciones administrativas de la Ley 39/2007 de la Carrera Militar.",
    oficial: ["Tema 1: Instrucción 14/2021, del JEME, por la que se desarrolla la organización del ET (act. ODEF 559/2024).", "Tema 2: Situaciones administrativas del personal de las FAS. Ley 39/2007, de la Carrera Militar."],
    esencial: ["<b>Cima del ET</b>: el JEME (Jefe de Estado Mayor del Ejército de Tierra), bajo el Ministro de Defensa y el JEMAD.",
      "<b>Estructura orgánica</b>: Cuartel General Terrestre · Mando de Personal (MAPER) · Mando de Apoyo a la Maniobra (MAM) · Mando de Fuerzas Terrestres (MFT).",
      "<b>Fuerza principal</b>: la División «San Marcial» y las brigadas orgánicas (Brunete, Guzmán el Bueno, Galicia, Extremadura, Canarias, Aragón, Almogávares…), más Fuerzas de Apoyo y Servicios.",
      "<b>Armas</b>: Infantería, Caballería, Artillería, Ingenieros y Transmisiones. <b>Cuerpos</b>: generales (Intendencia, Veterinaria), técnicos (ITAM, ITCI) y especiales (Jurídico, Eclesiástico).",
      "<b>Escala orgánica</b>: regimiento/bandera → grupo/escuadrón → compañía/batería → pelotón → escuadra. La <b>escuadra</b> es la unidad elemental y la sección la unidad básica de combate.",
      "<b>Situaciones administrativas (Ley 39/2007)</b>: servicio activo, reserva y retiro.",
      "Dentro del <b>servicio activo</b>: en destino, disponible y en la reserva especial.",
      "La condición de militar se adquiere con el <b>nombramiento</b> (para tropa: la relación de servicios); el <b>empleo</b> se adquiere por ascenso y se pierde por sanción/pena o sentencia.",
      "El ascenso a Cabo exige: antigüedad y tiempo de servicio (4 años), aptitud física y profesional, y superar la oposición según la convocatoria."],
    fuentes: [{ t: "Ley 39/2007 (BOE)", u: "https://www.boe.es/eli/es/l/2007/11/19/39" }, { t: "Organización del ET (defensa.gob.es)", u: "https://www.defensa.gob.es/ejerciotierra/organizacion/" }],
    temas: ["Organización del ET", "Carrera militar"] },

  { cap: 1, title: "Bloque VI · LO 9/2011, derechos y deberes de los militares", peso: "iniciativas y quejas",
    intro: "Ley Orgánica 9/2011, de 5 de agosto, y el RD 176/2014 (iniciativas y quejas) con el Observatorio de la Vida Militar.",
    oficial: ["Tema 1: disposiciones generales de la LO 9/2011.", "Tema 4: del Observatorio de la Vida Militar.", "Tema 5: RD 176/2014, tramitación de iniciativas y quejas (5.1 iniciativas · 5.2 quejas)."],
    esencial: ["<b>LO 9/2011</b>: regula derechos y deberes de los militares con carácter propio (por la especificidad del puesto militar) y remite a la Ley 39/2007.",
      "<b>Derechos</b>: ejercicio de la acción sindical (asociaciones profesionales de militares), de reunión (recinto militar, con reglamento), libertad de expresión (con reservas por la neutralidad y el secreto), petición, iniciativas y quejas.",
      "<b>Deberes</b>: cumplir y hacer cumplir las órdenes, permanencia y disponibilidad, residencia cuando se ordene, formación continua, uniformidad y presentación, guarda del secreto, porte de armas cuando se ordene.",
      "<b>Iniciativas (RD 176/2014)</b>: propuestas o sugerencias para mejorar el régimen personal y las condiciones de vida; pueden ser individuales o colectivas.",
      "<b>Quejas</b>: expresión de disconformidad sobre régimen personal y condiciones de vida; son <b>individuales</b>; se tramitan por la vía jerárquica con plazos definidos y respuesta motivada.",
      "<b>Observatorio de la Vida Militar (OVM)</b>: órgano colegiado que analiza el clima y las condiciones de vida de los militares y publica un informe anual al Congreso.",
      "Ningún militar puede sufrir represalia por presentar iniciativas o quejas (garantía expresa)."],
    fuentes: [{ t: "LO 9/2011 (BOE)", u: "https://www.boe.es/eli/es/lo/2011/08/05/9" }, { t: "RD 176/2014 (BOE)", u: "https://www.boe.es/eli/es/rd/2014/03/14/176" }],
    temas: ["Derechos y deberes"] },

  { cap: 1, title: "Bloque VII · Liderazgo", peso: "3 preguntas en 2026",
    intro: "Modelo de Liderazgo K2 del ET y Mando Orientado a la Misión (MoM). El cabo es el primer mando: aquí se juega su perfil.",
    oficial: ["Tema 1: Modelo de liderazgo K2.", "Tema 2: Mando Orientado a la Misión (MoM)."],
    esencial: ["<b>Liderazgo K2</b>: capacidad de influir en las personas para conseguir la misión, mejorándolas y creando una organización cohesionada.",
      "<b>Niveles de liderazgo</b>: directo (el del cabo sobre su escuadra), organizacional y estratégico.",
      "<b>El líder</b> combina: atributos (carácter, intelecto, presencia) y competencias (liderar, desarrollar a los subordinados y la organización, conseguir resultados).",
      "<b>Mando Orientado a la Misión (MoM)</b>: el superior transmite su INTENCIÓN (el «para qué») y concede libertad de ejecución (el «cómo») al subordinado, con confianza mutua e iniciativa.",
      "El MoM exige órdenes claras y breves; la doctrina clásica estructura la orden en <b>5 párrafos</b>: situación, misión, ejecución, servicio/logística y mando-transmisiones.",
      "<b>El cabo, primer mando</b>: manda la escuadra/equipo, instruye, cuida el material y vela por el bienestar de sus militares; su ejemplo es su primera herramienta de mando.",
      "Disciplina y liderazgo no se oponen: el K2 busca subordinados que cumplen <b>por convicción</b>, no por miedo; el afán de superación permanente es marca del líder."],
    fuentes: [{ t: "Doctrina de liderazgo ET (MADOC/Rincón de Tropa)", u: "https://www.defensa.gob.es/ejerciotierra/" }],
    temas: ["Liderazgo"] },

  /* ===================== CAPÍTULO 2 — INSTRUCCIÓN TÁCTICA Y TÉCNICA (~60% del examen) ===================== */
  { cap: 2, title: "Bloque I · Instrucción técnica y táctica del combatiente", peso: "13 preguntas en 2026",
    intro: "El bloque técnico más grande: combate individual, NBQ, transmisiones básicas y táctica de escuadra/equipo.",
    oficial: ["Tema 1: instrucción técnica de combate — el terreno y su utilización; misiones individuales; NBQ; transmisiones (conocimientos básicos para transmitir).", "Tema 2: instrucción táctica — escuadra/equipo."],
    esencial: ["<b>El terreno</b>: se valora por coberturas (protegen del fuego), protecciones (del fuego Y de la observación…), observación y campos de tiro, obstáculos; el mando lo explota para progresar oculto.",
      "<b>Progresión en combate</b>: por saltos de equipo/base de fuego — un elemento dispara (base de fuego) y otro avanza; nunca todos a la vez.",
      "<b>Misiones individuales</b>: fusilero, granadero, tirador, señalero, percusor, centinela; cada una con su cometido dentro de la escuadra.",
      "<b>NBQ</b>: detección (síntomas, detectores), alarma y protección: máscara y traje de protección individual; descontaminación; primeros actos al pasar una zona contaminada.",
      "<b>Transmisiones básicas</b>: procedimiento radiofónico (llamada → cambio → mensaje → acuse), alfabeto fonético OTAN (Alpha, Bravo…), números dígito a dígito, señales visuales, acústicas y sonoras.",
      "<b>Escuadra/equipo</b>: la escuadra (mando: cabo) se articula en equipos de fuego; formaciones de marcha: columna, línea, cuña/rombo según terreno y amenaza.",
      "La <b>sección</b> es la unidad básica de combate; la escuadra, la elemental. El cabo mantiene: disciplina de fuego, control de la progresión y moral del equipo.",
      "Sectores de fuego y posiciones: cada combatiente recibe sector principal y suplementario; el fuego cruzado multiplica el efecto."],
    fuentes: [{ t: "Doctrina de instrucción ET (MADOC/Rincón de Tropa)", u: "https://www.defensa.gob.es/ejerciotierra/" }],
    temas: ["Instrucción del combatiente", "Transmisiones", "NBQ", "Instrucción NBQ"] },

  { cap: 2, title: "Bloque II · Topografía", peso: "3 preguntas en 2026",
    intro: "Cartografía, orientación y navegación. Tema muy agradecido: conceptos cerrados que repiten cada convocatoria.",
    oficial: ["Tema 1: cartografía.", "Tema 2: orientación.", "Tema 3: navegación."],
    esencial: ["<b>Cartografía</b>: el mapa militar básico es el MTN a escala <b>1:50.000</b>; la escala indica cuánto representa una medida del mapa (1:50.000 → 1 cm = 500 m).",
      "<b>Curvas de nivel</b>: unen puntos de igual altitud; la distancia vertical entre curvas es la <b>equidistancia</b>; permiten leer perfiles, pendientes y formas del terreno.",
      "<b>Coordenadas UTM</b>: la península está en los husos <b>29, 30 y 31</b> (Baleares 31; Canarias 28); se da zona + huso + Este + Norte; el sistema militar global es <b>MGRS</b>.",
      "<b>Tres nortes</b>: geográfico (verdadero), magnético (brújula) y de rejilla (mapa); la <b>declinación magnética</b> es la diferencia entre geográfico y magnético y se corrige al pasar mapa↔terreno.",
      "<b>Orientación</b>: con brújula (rumbo/azimut), con el mapa (orientar el mapa al terreno) y por medios naturales (sol, estrellas: la Polar con la Osa Mayor).",
      "<b>Azimut y retroazimut</b>: el retroazimut suma o resta 180°; sirve para volver sobre tus pasos.",
      "<b>Navegación</b>: rumbos por puntos de control, conteo de pasos (factor de paso personal × distancia), tiempos y velocidades; el GPS apoya (puntos vía, rutas, dato de posición) pero NUNCA sustituye a brújula y mapa.",
      "Símbolos convencionales: carreteras, vías férreas, cursos de agua, vegetación, edificios — aprende los básicos del MTN."],
    fuentes: [{ t: "Geográfico Nacional — cartografía militar", u: "https://www.ign.es" }],
    temas: ["Topografía"] },

  { cap: 2, title: "Bloque III · Armamento y teoría del tiro", peso: "6 preguntas en 2026",
    intro: "Normas de seguridad con armas, los tres sistemas reglamentarios y la teoría del disparo.",
    oficial: ["Tema 1: normas generales en el uso y manejo de las armas de fuego.", "Tema 2: fusil de asalto HK G-36.", "Tema 3: pistola USP Compact.", "Tema 4: ametralladora MG-42 (MG3).", "Tema 6: teoría del tiro."],
    esencial: ["<b>Normas de seguridad</b>: 1) toda arma se considera CARGADA; 2) nunca se dirige un arma hacia persona o cosa que no se quiera destruir; 3) el dedo fuera del gatillo salvo al disparar; 4) al cargar/descargar, comprobar recámara.",
      "<b>HK G36E</b>: fusil de asalto reglamentario del ET · calibre <b>5,56 × 45 OTAN</b> · cargador de <b>30</b> cartuchos · funcionamiento por toma de gases (embolada) · cadencia ~750 disparos/min · culata plegable · raíles para óptica. Variantes: G36E, G36KE (corta).",
      "<b>USP Compact</b>: pistola reglamentaria · calibre <b>9 × 19 Parabellum</b> (también .40 S&W) · cargador ~<b>13</b> cartuchos · funcionamiento de doble/semiautomática con palanca de seguro y desamartillado.",
      "<b>MG-42/MG3</b>: ametralladora de apoyo · calibre <b>7,62 × 51 OTAN</b> · alimentación por cinta · cadencia muy alta (~800-1.000 dpm) · dotación de 2-3 sirvientes (tirador y aprovicionador).",
      "<b>Teoría del tiro — fases del disparo</b>: posición estable → empuñadura/asimiento → puntería (línea de mira alineada: punto de mira, alza y objetivo) → respiración (se dispara en la <b>pausa respiratoria</b>) → presión del gatillo <b>uniforme y hacia atrás</b> (segunda fase) → seguimiento.",
      "Factores que desvían el tiro: viento, distancia, temperatura, posición defectuosa; errores típicos: anticipar el disparo y jalonear el gatillo.",
      "Ritmos y tipos de fuego: tiro a tiro, ráfagas cortas/medianas; el fuego se centra en el sector asignado y se concentra en los objetivos prioritarios.",
      "Mantenimiento de primera escala: desmontado básico, limpieza (según uso y tras cada tiro), lubricación ligera y revisión de funcionamientos."],
    fuentes: [{ t: "Armamento del ET (defensa.gob.es)", u: "https://www.defensa.gob.es/ejerciotierra/" }],
    temas: ["Armamento y tiro", "Armamento", "Tiro"] }
  ],
  complementarias: ["Constitución", "Organización de la Defensa", "OTAN y UE", "Primeros auxilios", "Logística", "Instrucción cívica", "Enseñanza militar"]
};

/* ---------- Dossier descargable (HTML imprimible → PDF) ---------- */
window.temarioDoc = function (bloques, titulo) {
  const hoy = new Date().toLocaleDateString("es-ES");
  const sec = bloques.map(b =>
    "<section><h2>" + b.title + ' <span style="font-weight:400;font-size:.85em;color:#5f6f63">(' + b.peso + ')</span></h2>' +
    "<p><i>" + b.intro + "</i></p>" +
    "<h3>Qué entra (oficial)</h3><ul>" + b.oficial.map(x => "<li>" + x + "</li>").join("") + "</ul>" +
    "<h3>Lo esencial para el examen</h3><ul>" + b.esencial.map(x => "<li>" + x + "</li>").join("") + "</ul>" +
    "<h3>Fuentes</h3><p class='muted'>" + b.fuentes.map(f => f.t + " — " + f.u).join("<br>") + "</p></section>"
  ).join("");
  return "<!doctype html><html lang='es'><head><meta charset='utf-8'><title>" + titulo + "</title>" +
    "<style>body{font-family:system-ui,Arial;max-width:760px;margin:24px auto;padding:0 16px;color:#1d2a21;line-height:1.45}h1{color:#143d26}h2{border-bottom:2px solid #c9971f;padding-bottom:4px;margin-top:30px}h3{color:#5f6f63;font-size:.95em;margin:14px 0 4px}li{margin:7px 0}.muted{color:#5f6f63;font-size:.85em}header{border:2px solid #143d26;border-radius:10px;padding:10px 14px;margin-bottom:8px}@media print{body{margin:8mm auto}}</style></head><body>" +
    "<header><h1>▲ A LA ORDEN · " + titulo + "</h1><p class='muted'>Temario oficial de ascenso a Cabo (ET) según el temario MADOC del Rincón de Tropa · examen: 50 preguntas + 5 reserva · 70 min · 0,20/acierto − 0,05/error · generado el " + hoy + "</p></header>" +
    sec +
    "<p class='muted'>Documento de estudio gratuito generado por A LA ORDEN · https://academia-a-la-orden.onrender.com · A LA ORDEN no es un organismo oficial; las normas citadas se enlazan al BOE.</p>" +
    "</body></html>";
};
window.descargarTemarioCompleto = function () {
  const T = window.TEMARIO;
  const html = window.temarioDoc(T.bloques, "Temario oficial · Ascenso a Cabo (ET) — completo");
  if (typeof descargaArchivo === "function") descargaArchivo("a-la-orden-temario-cabo-completo.html", html, "text/html");
};
window.descargarBloque = function (i) {
  const b = window.TEMARIO.bloques[i]; if (!b) return;
  const html = window.temarioDoc([b], b.title + " — dossier de examen");
  if (typeof descargaArchivo === "function") descargaArchivo("a-la-orden-bloque-" + (i + 1) + ".html", html, "text/html");
};
