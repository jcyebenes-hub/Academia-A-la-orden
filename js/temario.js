/* MICABO — TEMARIO OFICIAL de la oposición de ascenso a Cabo del Ejército de Tierra.
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
/* v195: TEMARIO PERMANENCIA — programa oficial (Anexo III · Orden DEF/1341/2017,
   confirmado por la convocatoria 2026) para el dossier descargable del curso perm */
window.TEMARIO_PERM = [
 {
  "title": "Bloque I · Organización",
  "peso": "6 temas · Anexo III DEF/1341/2017",
  "intro": "Los cimientos: el Estado, la Defensa y la estructura de las FAS. Es el bloque más «de cultura general»: sus preguntas suelen ser literales, así que conviene tenerlo muy atado.",
  "oficial": [
   "Tema 1. Constitución Española (1978): organización política y territorial del Estado; Título III (las Cortes Generales), Título IV (el Gobierno y la Administración), Título V (relaciones entre el Gobierno y las Cortes), Título VI (el Poder Judicial) y Título VIII (organización territorial).",
   "Tema 2. Defensa Nacional — LO 5/2005: regulación de la Defensa Nacional, bases de la organización militar, competencias de los órganos del Estado en materia de defensa.",
   "Tema 3. Régimen Jurídico del Sector Público — Ley 40/2015: disposiciones generales, órganos de las administraciones, Administración General del Estado, ministerios y relaciones interadministrativas.",
   "Tema 4. Ministerio de Defensa — RD 998/2017: estructura orgánica, organización y competencias de sus órganos principales.",
   "Tema 5. Organización básica de las Fuerzas Armadas — RD 872/2014 y ORDEN DEF/166/2015: organización general, principios básicos, estructura y desarrollo organizativo.",
   "Tema 6. Organización de los ejércitos: Estado Mayor de la Defensa · Ejército de Tierra · Armada · Ejército del Aire y del Espacio."
  ],
  "esencial": [
   "La convocatoria 2026 lo confirma literalmente: la oposición se ajusta al Anexo III de la Orden DEF/1341/2017 «y a las modificaciones o actualizaciones vigentes» en la fecha de publicación.",
   "En la app cada tema lleva su test con contador real: empieza por Constitución y Defensa Nacional, las materias con más preguntas del bloque.",
   "Truco de examen: aprende QUÉ NORMA va con QUÉ tema (Defensa→LO 5/2005 · Sector Público→L 40/2015 · MINISDEF→RD 998/2017 · FAS→RD 872/2014 + ORDEN DEF/166/2015). Caen como distractor constantemente."
  ],
  "fuentes": [
   {
    "t": "Orden DEF/1341/2017, Anexo III (programa oficial)",
    "u": "https://boe.es"
   },
   {
    "t": "Res. 452/08724/26 · BOD nº 116 (17-jun-2026) — convocatoria 2026",
    "u": "https://boe.es"
   }
  ]
 },
 {
  "title": "Bloque II · Jurídico-Social",
  "peso": "8 temas · Anexo III DEF/1341/2017",
  "intro": "El bloque de «ser militar»: condición y carrera, derechos y deberes, disciplina, igualdad y procedimiento administrativo. Muy normativo: aquí el artículo exacto vale punto.",
  "oficial": [
   "Tema 1. Régimen del personal militar profesional — Ley 39/2007 (carrera militar, categorías y empleos, situaciones administrativas) y Ley 8/2006 (régimen específico de tropa y marinería).",
   "Tema 2. Reales Ordenanzas para las FAS — RD 96/2009: principios básicos de comportamiento, disciplina, jerarquía, unidad de mando, deberes del militar, ejercicio del mando, relaciones entre militares y responsabilidad en el servicio.",
   "Tema 3. Derechos y deberes de los miembros de las FAS — LO 9/2011: derechos fundamentales, libertades públicas, derechos profesionales, deberes militares, asociaciones profesionales, participación y representación.",
   "Tema 4. Régimen disciplinario — LO 8/2014: principios generales, faltas, sanciones, competencias sancionadoras, procedimiento disciplinario y recursos.",
   "Tema 5. Iniciativas y quejas — RD 176/2014: presentación de iniciativas, tramitación de quejas, derechos del personal militar en este ámbito.",
   "Tema 6. Igualdad entre mujeres y hombres — LO 3/2007: principio de igualdad, igualdad de trato y oportunidades, discriminación, políticas públicas de igualdad e igualdad en el empleo público.",
   "Tema 7. Observatorio Militar para la Igualdad: funciones, igualdad en las FAS, prevención del acoso sexual y por razón de sexo, Unidades de Protección frente al Acoso (UPA).",
   "Tema 8. Procedimiento Administrativo Común — Ley 39/2015: derechos de los interesados, actos administrativos, plazos, notificaciones, recursos administrativos y revisión de actos."
  ],
  "esencial": [
   "Temas 1 a 5 son los clásicos: la app ya los machaca con tests por tema (Carrera militar, Tropa y marinería, Derechos y deberes…).",
   "Temas 6 a 8 (Igualdad, Observatorio/UPA y PAC) son los recién llegados del programa: tanda nueva de preguntas en camino. Apúntalos para el repaso final.",
   "El RD 176/2014 (iniciativas y quejas) comparte estructura con el régimen disciplinario (plazos y órganos): estúdialos en tándem y ahorrarás memoria."
  ],
  "fuentes": [
   {
    "t": "L 39/2007 · L 8/2006 · RD 96/2009 · LO 9/2011",
    "u": "https://boe.es"
   },
   {
    "t": "LO 8/2014 · RD 176/2014 · LO 3/2007 · L 39/2015",
    "u": "https://boe.es"
   }
  ]
 },
 {
  "title": "Bloque III · Seguridad Nacional, Acción Conjunta y Organizaciones Internacionales",
  "peso": "7 temas · Anexo III DEF/1341/2017",
  "intro": "El bloque geopolítico: España en el mundo y las organizaciones donde opera. Es el que más se nota de una convocatoria a otra (ESN vigente, misiones en curso): repásalo cerca del examen.",
  "oficial": [
   "Tema 1. Seguridad Nacional — Ley 36/2015: concepto, amenazas y riesgos, sistema de Seguridad Nacional y Estrategia de Seguridad Nacional vigente.",
   "Tema 2. Doctrina para la acción conjunta — PDC-01: entorno de seguridad, empleo de las FAS, mando y control, operaciones conjuntas, integración en estructuras multinacionales.",
   "Tema 3. ONU: historia y objetivos, Estados miembros, Asamblea General, Consejo de Seguridad, Secretaría General, Carta de las Naciones Unidas y participación de España.",
   "Tema 4. OTAN: historia y objetivos, Estados miembros, estructura política y militar, principales órganos, incorporación de España a la Alianza y participación española.",
   "Tema 5. OSCE: historia, objetivos, Estados participantes, estructura y participación española.",
   "Tema 6. Unión Europea: historia y evolución, instituciones y organismos (Parlamento Europeo, Consejo Europeo, Consejo de la UE, Comisión Europea), Política Común de Seguridad y Defensa y participación de España.",
   "Tema 7. España y las misiones internacionales: participación en operaciones internacionales, misiones de mantenimiento de la paz, operaciones de la ONU, OTAN y UE; misiones realizadas y en curso."
  ],
  "esencial": [
   "La prueba de conocimientos es 100 preguntas · 120 min · P = A − E/3 (los blancos no penalizan). Los ejercicios físicos van aparte, puntuados según la Orden DEF/15/2026.",
   "Para ONU/OTAN/UE/OSCE aprende la estructura de órganos como quien aprende un organigrama: quién es quién y quién manda en qué.",
   "Misiones en curso: el tema «Misiones» de la app se mantiene al día. Repásalo en la última semana, que es donde más cambian las preguntas con la actualidad."
  ],
  "fuentes": [
   {
    "t": "Ley 36/2015 · PDC-01 Doctrina para la acción conjunta",
    "u": "https://boe.es"
   },
   {
    "t": "Anexo III · Orden DEF/1341/2017",
    "u": "https://boe.es"
   }
  ]
 }
];

/* v195: el dossier se adapta al curso activo (Cabo o Permanencia) */
/* v196: TEMARIO CABO 1º — estructura real del curso de actualización (convocatoria I/26
   BOD nº 62: oposición 35+15 · Guía Docente CB1: módulos/UF de la fase presencial) */
window.TEMARIO_CB1 = [
 {
  "title": "Fase de Oposición · Formación Militar",
  "peso": "35 preguntas del examen",
  "intro": "El bloque grande de la oposición: dos tercios de la nota. Normativa pura — aquí el artículo exacto y la cifra exacta valen ascenso.",
  "oficial": [
   "Reales Ordenanzas para las FAS — RD 96/2009: principios generales y reglas de comportamiento, disciplina, jerarquía y unidad de mando, deberes del militar, ejercicio y responsabilidad del mando, relaciones entre militares, actuación en operaciones, cumplimiento de las órdenes y disponibilidad.",
   "Derechos y deberes — LO 9/2011: derechos fundamentales y libertades públicas, derechos profesionales, deberes militares, asociaciones profesionales, derecho de petición, participación y representación.",
   "Régimen disciplinario — LO 8/2014: faltas leves, graves y muy graves; sanciones; competencias para imponerlas; procedimiento disciplinario; cumplimiento; recursos.",
   "Código Penal Militar — LO 14/2015: ámbito de aplicación, delitos militares, delitos contra la disciplina, contra los deberes del servicio, contra la seguridad y defensa nacionales, penas.",
   "Organización del Ejército de Tierra: Cuartel General, Fuerza y Apoyo a la Fuerza, principales mandos y unidades, armas y especialidades.",
   "Seguridad y régimen interior — RD 194/2010 y OM 50/2011: organización del RI, responsabilidades del mando, servicios y guardias, seguridad de las instalaciones, obligaciones del personal de servicio.",
   "Liderazgo militar: concepto, responsabilidad del mando, toma de decisiones, comunicación, motivación y cohesión, ejemplo personal."
  ],
  "esencial": [
   "Reparto oficial del examen de oposición (convocatoria I/26): 35 preguntas de Formación Militar + 15 de Sociocultural = 50. Corrección NO = (0,2 × aciertos) − (0,05 × errores).",
   "El temario oficial de la fase de oposición está publicado en RINCÓN DE TROPA (lo dice la propia convocatoria). En la app tienes tests de todo esto por tema.",
   "Machaca primero Reales Ordenanzas y LO 8/2014: son el corazón del bloque y las gemelas del banco ya te preparan las trampas."
  ],
  "fuentes": [
   {
    "t": "Convocatoria I/26 (Res. 551/04582/26 · BOD nº 62)",
    "u": "https://boe.es"
   },
   {
    "t": "RD 96/2009 · LO 9/2011 · LO 8/2014 · LO 14/2015",
    "u": "https://boe.es"
   }
  ]
 },
 {
  "title": "Fase de Oposición · Formación Sociocultural",
  "peso": "15 preguntas del examen",
  "intro": "El tercio restante de la oposición: cultura general al nivel que pide el curso. Menos denso que Formación Militar, pero para sacar el corte cada punto cuenta.",
  "oficial": [
   "Constitución Española (1978): estructura de la Constitución, derechos y deberes fundamentales, la Corona, las Cortes Generales, el Gobierno, el Poder Judicial y la organización territorial del Estado.",
   "Organización del Estado: instituciones, Administración General del Estado, comunidades autónomas, provincias y municipios, funciones de las principales instituciones.",
   "Cultura general: conceptos básicos de historia y sociedad española, instituciones públicas, geografía física y política, acontecimientos históricos relevantes."
  ],
  "esencial": [
   "La Constitución es la madre de todas: Título preliminar + Títulos I a VIII bien atados sirven para la mayoría de las 15.",
   "La app tiene tests de Constitución y organización del Estado (heredados del bloque de Organización): sirven igual para esta fase.",
   "El temario sociocultural exacto lo publica el CEFOT 1 con la convocatoria: este bloque es la guía de estudio, contrasta con Rincón de Tropa."
  ],
  "fuentes": [
   {
    "t": "Convocatoria I/26 · BOD nº 62 (35+15)",
    "u": "https://boe.es"
   },
   {
    "t": "Constitución Española 1978",
    "u": "https://boe.es"
   }
  ]
 },
 {
  "title": "Fase a distancia",
  "peso": "Inglés ME7-029 · Geografía e Historia ME7-030",
  "intro": "La fase que se hace desde casa con examen telemático (CVCDEF). En la I/26 ya se celebró (31-ago → 11-sep, examen del Módulo de Formación Común el 14-sep): esta es la guía para la próxima convocatoria.",
  "oficial": [
   "Inglés — ME7-029: unidades con gramática (verbo to be, verbo to have, formas impersonales del verbo, afirmativa/negativa/interrogativa…), speaking y vocabulario civil y militar elemental.",
   "Geografía e Historia de España — ME7-030: geografía física (relieve, ríos, climas), geografía política (CCAA y capitales, provincias, ciudades autónomas) e historia de España (de Hispania a la Transición y la Constitución de 1978).",
   "Formación Común (JUL-22): los contenidos comunes del curso de actualización."
  ],
  "esencial": [
   "El examen de esta fase en la I/26: 50 preguntas + 5 de reserva · 60 minutos (celebrado el 14-sep-2026).",
   "El ME7-029 completo está en la Biblioteca de la app: aprende el vocabulario militar elemental por unidades — las preguntas de inglés caen de ahí.",
   "Para la I/27 (est. 1er trimestre 2027) conviene llegar con el inglés llevado: es la asignatura que más suspende."
  ],
  "fuentes": [
   {
    "t": "ME7-029 Inglés (extracto en la Biblioteca)",
    "u": ""
   },
   {
    "t": "ME7-030 Geografía e Historia",
    "u": ""
   },
   {
    "t": "Convocatoria I/26 · fase a distancia 31-ago→11-sep",
    "u": "https://boe.es"
   }
  ]
 },
 {
  "title": "Fase presencial en Academia",
  "peso": "14-sep → 9-oct-2026 · Módulos 1-3",
  "intro": "La fase en el CEFOT (en la I/26: 14-sep a 9-oct). Aquí no hay test: hay UFs con evaluación propia — y dos de ellas van a APTO/NO APTO.",
  "oficial": [
   "Módulo 1 · Formación Común: UF1 Seguridad en el entorno militar · UF2 Técnico administrativo y logístico · UF3 Técnicas de mando · UF4 Igualdad efectiva y protocolo de acoso.",
   "Módulo 2 · Formación específica: UF1 Orgánica de las unidades de Infantería (sección a batallón) · UF2 Abreviaturas, signos convencionales y croquis · UF3 Cometidos de pelotones/secciones INF/ILG/IMZ · UF4 Escuadras y equipos de armas de tiro directo · UF5 Armas de tiro indirecto · UF6 Defensa contracarro · UF7 Movimientos, reconocimiento y seguridad · UF8 Empleo de vehículos blindados/mecanizados/acorazados · UF9 Logística de pequeñas unidades.",
   "Módulo 3 · Instrucción y adiestramiento: UF1 Orden Cerrado · UF2 Educación física · UF3 Instrucción táctica de Infantería (la nota del módulo, de 0 a 10).",
   "Módulo de Técnicas de Apoyo: informática."
  ],
  "esencial": [
   "Orden Cerrado y Educación física van a APTO/NO APTO: hay que superarlas sí o sí para aprobar el módulo.",
   "La nota real del módulo la pone Instrucción Táctica (0-10, se exige ≥ 5).",
   "La UF1 de Orden Cerrado tiene Ev.1: prueba escrita sobre el REGLAMENTO de orden cerrado en vigor (necesitas un 5). El reglamento es material aparte del temario — consíguelo y la app te lo machaca (tandas OC en marcha)."
  ],
  "fuentes": [
   {
    "t": "Guía Docente CB1 (Módulos 1-3 y evaluación)",
    "u": ""
   },
   {
    "t": "Convocatoria I/26 · fase presencial 14-sep→9-oct",
    "u": "https://boe.es"
   }
  ]
 }
];

/* Convierte un temario por temas (TEMARIO_CABO26 / TEMARIO_CABO1 / TEMARIO_PERM26)
   al formato del imprimible. Conserva los temas, sus normas y sus contenidos. */
window.specADoc = function (spec) {
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const TEO = window.TEORIA || {};
  return spec.bloques.map(b => {
    const teo = TEO[b.teoriaKey] || {};
    const temas = b.temas.map(t => {
      const h = t.teoria || teo[t.n] || null;
      let cont = t.contenidos || [];
      if (!cont.length && h) {          /* la lista sale de los apartados de la teoría */
        const re = /<h[34][^>]*>(.*?)<\/h[34]>/g; let m;
        while ((m = re.exec(h)) && cont.length < 8) {
          const x = m[1].replace(/<[^>]+>/g, "").trim();
          if (x && !/^TEMA\s+\d+/i.test(x)) cont.push(x);
        }
      }
      return Object.assign({}, t, { teoria: h, contenidos: cont });
    });
    return {
      title: (b.cap ? "Cap. " + b.cap + " · " : "") + "Bloque " + (roman[b.n] || b.n) + " · " + b.titulo,
      peso: temas.length + " temas",
      intro: b.aviso || spec.fuente,
      temas: temas,
      oficial: [], esencial: [], fuentes: []
    };
  });
};

window.bloquesDeCurso = function () {
  const c = (window.AO && AO.stateRef && AO.stateRef().course) || "cabo";
  if (c === "cabo" && window.TEMARIO_CABO26) return {
    bloques: window.specADoc(window.TEMARIO_CABO26),
    titulo: "Temario oficial · Ascenso a Cabo (ET)",
    sub: "10 bloques · 33 temas · " + window.TEMARIO_CABO26.fuente + " ·",
    file: "a-la-orden-temario-cabo"
  };
  if (c === "cabo1" && window.TEMARIO_CABO1) return {
    bloques: window.specADoc(window.TEMARIO_CABO1),
    titulo: "Temario oficial · Ascenso a Cabo 1º (ET)",
    sub: "4 bloques · 16 temas · " + window.TEMARIO_CABO1.fuente + " ·",
    file: "a-la-orden-temario-cabo1"
  };
  if (c === "perm" && window.TEMARIO_PERM26) return {
    bloques: window.specADoc(window.TEMARIO_PERM26),
    titulo: "Temario oficial · Tropa Permanente",
    sub: "3 bloques · 21 temas · " + window.TEMARIO_PERM26.fuente + " ·",
    file: "a-la-orden-temario-permanente"
  };
  if (c === "perm" && window.TEMARIO_PERM) return {
    bloques: window.TEMARIO_PERM,
    titulo: "Temario oficial · Acceso a Tropa Permanente (FAS)",
    sub: "Programa oficial del Anexo III de la Orden DEF/1341/2017, confirmado por la convocatoria 2026 (Res. 452/08724/26 · BOD nº 116) · prueba: 100 preguntas · 120 min · P = A − E/3 · generado el ",
    file: "a-la-orden-temario-permanente"
  };
  if (c === "cabo1" && window.TEMARIO_CB1) return {
    bloques: window.TEMARIO_CB1,
    titulo: "Curso de actualización para el ascenso a Cabo 1º (ET)",
    sub: "Estructura oficial según la convocatoria I/26 (Res. 551/04582/26 · BOD nº 62): oposición 35 + 15 preguntas · fase a distancia (ME7-029/ME7-030) · fase presencial (Módulos 1-3) · generado el ",
    file: "a-la-orden-temario-cabo1"
  };
  return { bloques: window.TEMARIO.bloques, titulo: "Temario oficial · Ascenso a Cabo (ET) — completo", sub: null, file: "a-la-orden-temario-cabo" };
};

/* QR embebido como data URI: el documento descargado lo lleva dentro y
   funciona sin conexión y sin la carpeta de imágenes al lado. */
window.qrDataURI = async function () {
  try {
    const img = new Image();
    img.src = "img/qr-arte@2x.png";
    if (img.decode) { await img.decode(); }
    else { await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; }); }
    /* 320 px basta de sobra para imprimirlo a 96 px: el documento pesa
       una cuarta parte y el QR sigue leyéndose (probado a 110 px). */
    const L = 320;
    const c = document.createElement("canvas");
    c.width = L; c.height = L;
    const x = c.getContext("2d");
    x.fillStyle = "#fdfbf4"; x.fillRect(0, 0, L, L);
    x.imageSmoothingQuality = "high";
    x.drawImage(img, 0, 0, L, L);
    return c.toDataURL("image/jpeg", 0.92);  /* pesa la cuarta parte que el PNG */
  } catch (e) { return ""; }
};

window.temarioDoc = function (bloques, titulo, sub, qr) {
  const hoy = new Date().toLocaleDateString("es-ES");
  const sec = bloques.map(b => {
    /* temario por temas: cada tema con sus contenidos en viñetas */
    if (b.temas) {
      return "<section><h2>" + b.title + ' <span style="font-weight:400;font-size:.85em;color:#5f6f63">(' + b.peso + ')</span></h2>' +
        (b.intro ? "<p><i>" + b.intro + "</i></p>" : "") +
        b.temas.map(t => '<div class="t">' +
          "<h3>Tema " + t.n + " · " + t.titulo + "</h3>" +
          (t.normativa ? "<p class='muted'>" + t.normativa + "</p>" : "") +
          (t.nota ? "<p class='muted'><i>" + t.nota + "</i></p>" : "") +
          ((t.contenidos && t.contenidos.length)
            ? "<ul>" + t.contenidos.map(c => "<li>" + c + "</li>").join("") + "</ul>"
            : "") +
          (t.teoria ? "<div class='teo'>" + t.teoria + "</div>" : "") +
          "</div>").join("") + "</section>";
    }
    return "<section><h2>" + b.title + ' <span style="font-weight:400;font-size:.85em;color:#5f6f63">(' + b.peso + ')</span></h2>' +
      "<p><i>" + b.intro + "</i></p>" +
      "<h3>Qué entra (oficial)</h3><ul>" + b.oficial.map(x => "<li>" + x + "</li>").join("") + "</ul>" +
      (b.esencial && b.esencial.length ? "<h3>Lo esencial para el examen</h3><ul>" + b.esencial.map(x => "<li>" + x + "</li>").join("") + "</ul>" : "") +
      (b.fuentes && b.fuentes.length ? "<h3>Fuentes</h3><p class='muted'>" + b.fuentes.map(f => f.t + " — " + f.u).join("<br>") + "</p>" : "") + "</section>";
  }).join("");
  return "<!doctype html><html lang='es'><head><meta charset='utf-8'><title>" + titulo + "</title>" +
    "<style>body{font-family:system-ui,Arial;max-width:760px;margin:24px auto;padding:0 16px;color:#1d2a21;line-height:1.45}h1{color:#143d26}h2{border-bottom:2px solid #c9971f;padding-bottom:4px;margin-top:30px}h3{color:#5f6f63;font-size:.95em;margin:14px 0 4px}li{margin:7px 0}.hd{display:flex;gap:16px;align-items:center;justify-content:space-between}.qrbox{flex:0 0 auto;text-align:center;font-size:.62em;color:#5f6f63;line-height:1.25}.qrbox img{width:96px;height:96px;display:block;margin:0 auto 3px}.t{page-break-inside:avoid;margin-bottom:10px}.t h3{margin:16px 0 2px;color:#143d26;font-size:1em}.teo{border-left:3px solid #c9971f;background:#faf7ee;padding:8px 12px;margin:8px 0}.muted{color:#5f6f63;font-size:.85em}header{border:2px solid #143d26;border-radius:10px;padding:10px 14px;margin-bottom:8px}@media print{body{margin:8mm auto}}</style></head><body>" +
    "<header><div class='hd'>" +
      "<div><h1>▲ MICABO · " + titulo + "</h1><p class='muted'>" + (sub || "Temario oficial de ascenso a Cabo (ET) según el temario MADOC del Rincón de Tropa · examen: 50 preguntas + 5 reserva · 70 min · 0,20/acierto − 0,05/error ·") + " generado el " + hoy + "</p></div>" +
      (qr ? "<div class='qrbox'><img src='" + qr + "' alt='Código QR de MICABO'><span>Escanéalo y entrenas<br>en el móvil</span></div>" : "") +
    "</div></header>" +
    sec +
    "<p class='muted'>Documento de estudio gratuito generado por MICABO · https://micabo.es · MICABO no es un organismo oficial; las normas citadas se enlazan al BOE.</p>" +
    "</body></html>";
};
window.descargarTemarioCompleto = async function () {
  const D = window.bloquesDeCurso();
  const qr = await window.qrDataURI();
  const html = window.temarioDoc(D.bloques, D.titulo, D.sub, qr);
  if (typeof descargaArchivo === "function") descargaArchivo(D.file + "-completo.html", html, "text/html");
};
window.descargarBloque = async function (i) {
  const D = window.bloquesDeCurso();
  const b = D.bloques[i]; if (!b) return;
  const qr = await window.qrDataURI();
  const html = window.temarioDoc([b], b.title + " — dossier de examen", D.sub, qr);
  if (typeof descargaArchivo === "function") descargaArchivo(D.file + "-bloque-" + (i + 1) + ".html", html, "text/html");
};

/* ---- ESTRUCTURA POR CURSO (v120): ramas reales del banco, agrupadas por bloque oficial ---- */
window.TEMARIO_GRUPOS = {
  cabo: [
    { k: "C1", t: "🟨 CAPÍTULO 1 · Formación general militar", sub: "~40% del examen — empieza por aquí" },
    { k: "C2", t: "🟩 CAPÍTULO 2 · Instrucción y combate", sub: "táctica, armamento y técnicas" }
  ],
  perm: [
    { k: "B1", t: "📗 BLOQUE I · Organización", sub: "Constitución · Defensa Nacional (LO 5/2005) · RJSP (L 40/2015) · MINISDEF (RD 998/2017) · FAS (RD 872/2014 + ORDEN DEF/166/2015)" },
    { k: "B2", t: "📘 BLOQUE II · Jurídico-Social", sub: "Personal (L 39/2007 · L 8/2006) · ROFAS (RD 96/2009) · Derechos y deberes (LO 9/2011) · Disciplinario (LO 8/2014) · Iniciativas (RD 176/2014) · Igualdad (LO 3/2007) · PAC (L 39/2015)" },
    { k: "B3", t: "📙 BLOQUE III · Seguridad Nacional, Acción Conjunta y OII", sub: "Seguridad Nacional (L 36/2015) · PDC-01 · ONU · OTAN · OSCE · UE · Misiones · (Físicas: prueba de la convocatoria)" }
  ],
  cabo1: [
    { k: "B1", t: "📘 BLOQUE I · Fase de oposición", sub: "temario presencial del curso" },
    { k: "B2", t: "📙 BLOQUE II · Fase a distancia y sostenimiento", sub: "inglés (ME7-029), mando, administración" }
  ]
};
window.TEMARIO_ORDEN = {
  cabo: {
    C1: ["Reales Ordenanzas","Seguridad en las FAS","Régimen Disciplinario","Código Penal Militar","Organización de la Defensa","Organización del ET","Carrera militar","Derechos y deberes","Liderazgo","Constitución","Instrucción cívica","Formación Cívica y Humana","Enseñanza militar","OTAN y UE","Logística","Régimen Interior","El examen"],
    C2: ["Instrucción del combatiente","Transmisiones","Topografía","NBQ","Primeros auxilios","Armamento","Armamento y tiro"]
  },
  perm: {
    B1: ["El examen","Constitución","Defensa Nacional","MINISDEF","FAS"],
    B2: ["Derechos y deberes","Carrera militar","Tropa y marinería","Situaciones","Concurso"],
    B3: ["Seguridad Nacional","Doctrina","ESN","OTAN","OSCE","UE","ONU","Misiones","Físicas","Convocatoria"]
  },
  cabo1: {
    B1: ["El examen","Reales Ordenanzas","Organización","Mando y liderazgo","Régimen disciplinario","Código Penal Militar","Constitución","Documentación","Geografía","Historia","Tiro","Topografía","Primeros auxilios","NBQ","Logística","Seguridad"],
    B2: ["Inglés","NBQ","Técnicas de mando","Administración"]
  }
};
window.TEMARIO_EXAMEN_CURSO = {
  perm: {
    titulo: "🛡️ La prueba, tal cual es (Convocatoria 2026)",
    lineas: [
      "100 preguntas · 4 alternativas · 120 minutos",
      "Puntuación: P = A − [E / (n − 1)] · copiar anula (0 puntos)",
      "Eliminatoria: quedar por debajo de media − 1 desviación típica",
      "Corte normativo: normativa vigente a 1 de septiembre de 2026",
      "1.000 plazas de acceso a la condición de militar de tropa permanente"
    ],
    fuente: "Res. 452/08724/26 (BOD nº 116, 17-jun-2026) · temario: Anexo III de la O. DEF/1341/2017"
  },
  cabo1: {
    titulo: "🎖️ Tu camino, tal cual es (Convocatoria 2026)",
    lineas: [
      "Fase de oposición (examen y ejercicios) + fase a distancia + curso presencial",
      "Fase a distancia: inglés (ME7-029), geografía-historia (ME7-030), informática",
      "Curso presencial en la Academia de Infantería (Toledo)"
    ],
    fuente: "Convocatoria Cabo 1º 2026 y su modificación (BOD) · temario de abril-2026 del curso"
  }
};
