/* A LA ORDEN · Academia de Tropa — Datos demo (contenido de muestra pendiente de revisión experta) */
const COURSES = {
  cabo: {
    id: "cabo", name: "Ascenso a Cabo", army: "Ejército de Tierra", badge: "CABO ET",
    tagline: "50 preguntas + 5 reserva · 70 minutos",
    exam: { questions: 50, reserve: 5, minutes: 70, good: 0.2, bad: 0.05, max: 10, options: 4, formula: "NO = (0,2 × aciertos) − (0,05 × errores)" },
    cutoff: "4,335 (I/25)", color: "#1f5c38",
    syllabus: [
      { code: "C1", title: "Capítulo 1 · Formación General Militar", weight: "~40% del examen", topics: ["El examen", "Reales Ordenanzas", "Régimen Disciplinario", "Código Penal Militar", "Derechos y deberes", "Carrera militar", "Organización del ET", "Liderazgo",
        "Régimen Interior",
        "Seguridad en las FAS",
        "Formación Cívica y Humana"] },
      { code: "C2", title: "Capítulo 2 · Instrucción Táctica y Técnica", weight: "~60% del examen", topics: ["Armamento", "Topografía", "Transmisiones", "NBQ", "Primeros auxilios", "Instrucción del combatiente",
        "Tiro",
        "Orden Cerrado",
        "Escuadra y equipo"] }
    ],
    changelog: [{date:"06-jul-2026",ref:"BOD nº 129 · Res. 562/09759/26",text:"Ascendidos los APTOS del I/25. Próxima convocatoria I/26 esperada en otoño-2026."},
      { date: "2026-10", ref: "BOD nº 192 · Res. 551/14239/25", text: "Convocatoria I/25-I/26 revisada: formato 50+5 y penalización confirmados." },
      { date: "2026-06", ref: "Temario MADOC", text: "Revisión de armamento reglamentario y teoría del tiro." },
      { date: "2026-03", ref: "LO 8/2014 · LO 9/2011", text: "Verificación de cuadro de faltas y derechos/deberes." }
    ]
  },
  cabo1: {
    id: "cabo1", name: "Ascenso a Cabo 1º", army: "Ejército de Tierra", badge: "CABO 1º ET",
    tagline: "Oposición + fase a distancia",
    exam: { questions: 50, reserve: 5, minutes: 70, good: 0.2, bad: 0.05, max: 10, options: 4, formula: "Mismo sistema que Cabo (orientativo en demo)" },
    cutoff: "Según especialidad", color: "#7a5b00",
    syllabus: [
      { code: "B1", title: "Fase de oposición", weight: "Examen de clasificación", topics: ["El examen", "Mando y liderazgo", "Régimen disciplinario", "Documentación", "Logística", "Seguridad", "Tiro", "Topografía", "Organización", "Geografía", "Historia", "Primeros auxilios", "NBQ"] },
      { code: "B2", title: "Fase a distancia", weight: "Puesto de promoción", topics: ["Técnicas de mando", "Inglés", "Administración"] }
    ],
    changelog: [{date:"28-abr-2026",ref:"BOD nº 83 · Res. 551/01505/26 (BOD nº 23)",text:"Convocados el I/26 Concurso-Oposición y el I/26 Curso de Actualización (5T113 2026 001). Ascenso supeditado a obtención de destino."},
      { date: "2026-07", ref: "Temario MADOC", text: "Actualizados bloques de técnicas de mando y logística básica." },
      { date: "2026-02", ref: "Fase a distancia", text: "Incorporado módulo de evaluación entre iguales e inglés." }
    ]
  },
  perm: {
    id: "perm", name: "Tropa Permanente", army: "Fuerzas Armadas", badge: "PERMANENCIA FAS",
    tagline: "100 preguntas · 120 minutos",
    exam: { questions: 100, reserve: 0, minutes: 120, good: 1, bad: 1 / 3, max: 100, options: 4, formula: "P = Aciertos − Errores / (n−1)" },
    cutoff: "Media − desviación típica", color: "#8e1f1f",
    syllabus: [
      { code: "B1", title: "Bloque 1 · Organización", weight: "Temario común", topics: ["El examen", "Constitución", "Defensa Nacional", "MINISDEF", "FAS"] },
      { code: "B2", title: "Bloque 2 · Jurídico-Social", weight: "Temario común", topics: ["Carrera militar", "Tropa y marinería", "Derechos y deberes", "Situaciones", "Concurso"] },
      { code: "B3", title: "Bloque 3 · Seguridad Nacional", weight: "Temario común", topics: ["Seguridad Nacional", "ESN", "Doctrina", "ONU", "OTAN", "UE", "OSCE", "Misiones", "Físicas", "Convocatoria"] }
    ],
    changelog: [{date:"17-jun-2026",ref:"BOD nº 116 · Res. 452/08724/26",text:"Convocatoria Permanente 2026: 1.000 plazas (ET 540 · Armada 211 · EAyE 249). Plazo: 20 días naturales. Autorizada por RD 170/2026."},
      { date: "2025-07", ref: "BOE 141 · Instrucción 26/2025", text: "Modificada la organización de la Armada." },
      { date: "2025-03", ref: "BOE 86 · RD 268/2025", text: "Estructura orgánica básica del MINISDEF." },
      { date: "2024-07", ref: "PDC-01(B)", text: "Nueva Doctrina para el empleo de las FAS (JEMAD)." },
      { date: "2021-12", ref: "RD 1150/2021", text: "Estrategia de Seguridad Nacional 2021 vigente." }
    ]
  }
};

/* d = Fácil / Media / Difícil · a = índice respuesta correcta */
const QUESTIONS = [
/* ============ CABO ET ============ */
{c:"cabo",b:"C1",t:"El examen",d:"F",q:"El examen de ascenso a Cabo del ET consta de…",o:["50 preguntas + 5 de reserva en 70 minutos","100 preguntas en 120 minutos","40 preguntas en 60 minutos","60 preguntas sin límite de tiempo"],a:0,x:"Formato oficial: 50 test + 5 de reserva, 70 minutos.",r:"BOD · convocatoria"},
{c:"cabo",b:"C1",t:"El examen",d:"F",q:"En el examen de Cabo, cada respuesta errónea…",o:["Resta 0,05 puntos","Resta 0,20 puntos","No penaliza","Resta 1 punto"],a:0,x:"Cada acierto +0,20 y cada error −0,05. Las blancas no penalizan.",r:"Bases · NO=(0,2×RA)−(0,05×RE)"},
{c:"cabo",b:"C1",t:"El examen",d:"M",q:"La nota final del concurso-oposición (NCO) se calcula…",o:["NCO = (NC + NO) / 2","NCO = NC + NO","NCO = NO − NC","NCO = NC × NO / 10"],a:0,x:"El examen (NO) vale el 50% y el baremo (NC) el otro 50%.",r:"Bases convocatoria"},
{c:"cabo",b:"C1",t:"El examen",d:"M",q:"Para presentarse al curso de Cabo se exige, con carácter general…",o:["Al menos 4 años de servicio y TGCF superado","10 años de servicio","Ser cabo primero","Título universitario"],a:0,x:"Requisito típico: 4 años efectivos + TGCF e IPEC del año anterior.",r:"BOD · convocatoria"},
{c:"cabo",b:"C1",t:"Reales Ordenanzas",d:"F",q:"Las Reales Ordenanzas para las FAS vigentes se aprobaron por…",o:["Real Decreto 96/2009","Ley Orgánica 9/2011","Ley 39/2007","Real Decreto 205/2024"],a:0,x:"El RD 96/2009 aprueba las Reales Ordenanzas vigentes.",r:"RD 96/2009"},
{c:"cabo",b:"C1",t:"Derechos y deberes",d:"F",q:"La Ley Orgánica 9/2011, de 27 de julio, regula…",o:["Los derechos y deberes de los miembros de las FAS","El régimen disciplinario militar","La organización del ET","La seguridad nacional"],a:0,x:"LO 9/2011: derechos y deberes del militar.",r:"LO 9/2011"},
{c:"cabo",b:"C1",t:"Régimen Disciplinario",d:"F",q:"Según la LO 8/2014, las faltas disciplinarias se clasifican en…",o:["Leves, graves y muy graves","Leves y graves","Administrativas y penales","Simples y cualificadas"],a:0,x:"Triple clasificación clásica: leves, graves y muy graves.",r:"LO 8/2014"},
{c:"cabo",b:"C1",t:"Régimen Disciplinario",d:"M",q:"La Ley Orgánica del Régimen Disciplinario de las FAS es la…",o:["LO 8/2014","LO 9/2011","LO 5/2005","LO 14/2015"],a:0,x:"No confundir: 8/2014 disciplina, 9/2011 derechos, 14/2015 penal militar.",r:"LO 8/2014"},
{c:"cabo",b:"C1",t:"Código Penal Militar",d:"M",q:"El Código Penal Militar vigente fue aprobado por…",o:["LO 14/2015, de 14 de octubre","LO 8/2014","Ley 39/2007","LO 9/2011"],a:0,x:"El CPM vigente es la LO 14/2015.",r:"LO 14/2015"},
{c:"cabo",b:"C1",t:"Carrera militar",d:"F",q:"La Ley de la carrera militar es la…",o:["Ley 39/2007, de 19 de noviembre","Ley 8/2006, de 24 de abril","Ley 36/2015","LO 5/2005"],a:0,x:"39/2007 carrera militar; 8/2006 tropa y marinería.",r:"Ley 39/2007"},
{c:"cabo",b:"C1",t:"Carrera militar",d:"F",q:"La Ley de Tropa y Marinería es la…",o:["Ley 8/2006, de 24 de abril","Ley 39/2007","LO 9/2011","Ley 36/2015"],a:0,x:"Ley 8/2006, de 24 de abril, de Tropa y Marinería.",r:"Ley 8/2006"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"F",q:"El mando orgánico del Ejército de Tierra lo ostenta…",o:["El Jefe de Estado Mayor del ET (JEME)","El JEMAD","El Ministro de Defensa","El Presidente del Gobierno"],a:0,x:"Cada ejército tiene su JEME/JEMA/AJEMA; el JEMAD manda la estructura operativa.",r:"Organización FAS"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"M",q:"Las siglas MADOC corresponden a…",o:["Mando de Adiestramiento y Doctrina","Mando de Apoyo y Doctrina Operativa","Mando de Artillería de Costa","Material y Doctrina Conjunta"],a:0,x:"El MADOC elabora doctrina y el temario de referencia.",r:"Organización ET"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"F",q:"El empleo inmediatamente superior al de soldado es…",o:["Cabo","Cabo primero","Sargento","Cabo mayor"],a:0,x:"Soldado → Cabo → Cabo 1º → Cabo mayor.",r:"Empleos tropa"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"F",q:"Las siglas BOD corresponden a…",o:["Boletín Oficial de Defensa","Base Operativa de Defensa","Baremo Oficial de Destinos","Brigada de Operaciones"],a:0,x:"Las convocatorias se publican en el BOD.",r:"BOD"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"M",q:"Las siglas IPEC corresponden a…",o:["Informes Personales de Calificación","Instrucciones Permanentes de Evaluación del Combatiente","Informes de Progreso de la Enseñanza","Indicadores de Preparación Conjunta"],a:0,x:"Los IPEC puntúan en el concurso (grupo 1).",r:"IPEC"},
{c:"cabo",b:"C1",t:"Organización del ET",d:"F",q:"El TGCF es…",o:["El Test General de la Condición Física","El Tribunal General de Calificación Final","El Título General de Capacitación","El Turno General de Control"],a:0,x:"Hay que tenerlo superado para presentarse.",r:"TGCF"},
{c:"cabo",b:"C1",t:"Liderazgo",d:"M",q:"El liderazgo militar puede definirse como…",o:["La capacidad de influir en los subordinados para cumplir la misión","La imposición de sanciones ejemplares","La antigüedad en el empleo","El mando ejercido solo en operaciones"],a:0,x:"Influencia + ejemplo + misión: la base del mando.",r:"Liderazgo · MoM"},
{c:"cabo",b:"C2",t:"Armamento",d:"F",q:"El fusil HK G36 es de calibre…",o:["5,56 × 45 mm OTAN","7,62 × 51 mm OTAN","9 mm Parabellum","12,70 mm"],a:0,x:"Calibre OTAN estándar de fusil: 5,56×45.",r:"Armamento ET"},
{c:"cabo",b:"C2",t:"Armamento",d:"F",q:"La pistola USP reglamentaria es de calibre…",o:["9 mm Parabellum","5,56 mm","7,62 mm",".45 ACP"],a:0,x:"La USP Compact es de 9 mm Parabellum.",r:"Armamento ET"},
{c:"cabo",b:"C2",t:"Armamento",d:"M",q:"El fusil G36 es fabricado por la empresa…",o:["Heckler & Koch (Alemania)","FN Herstal (Bélgica)","Beretta (Italia)","Colt (EE. UU.)"],a:0,x:"H&K, Oberndorf (Alemania).",r:"Armamento ET"},
{c:"cabo",b:"C2",t:"Armamento",d:"M",q:"La línea de mira es…",o:["La recta que une alza, punto de mira y objetivo","La trayectoria curva del proyectil","El eje longitudinal del cañón","La distancia máxima eficaz"],a:0,x:"Alza–punto–blanco alineados: línea de mira.",r:"Teoría del tiro"},
{c:"cabo",b:"C2",t:"Topografía",d:"F",q:"En una carta, unas curvas de nivel muy próximas entre sí indican…",o:["Pendiente fuerte o relieve abrupto","Terreno completamente llano","Un cauce fluvial","El norte magnético"],a:0,x:"Juntas = pendiente; separadas = llano.",r:"Topografía"},
{c:"cabo",b:"C2",t:"Topografía",d:"M",q:"La Península Ibérica se sitúa principalmente en los husos UTM…",o:["29, 30 y 31","27, 28 y 29","30, 31 y 32","26, 27 y 28"],a:0,x:"Península 29-31; Canarias en el 28.",r:"Topografía · UTM"},
{c:"cabo",b:"C2",t:"Topografía",d:"M",q:"En una escala 1:50.000, un centímetro en el plano equivale a…",o:["500 metros sobre el terreno","50 metros","5 kilómetros","50 kilómetros"],a:0,x:"1 cm × 50.000 = 500 m.",r:"Topografía"},
{c:"cabo",b:"C2",t:"Transmisiones",d:"F",q:"En el alfabeto fonético OTAN, la letra «M» es…",o:["Mike","Mama","Metro","Mar"],a:0,x:"Lima-Mike-November-Oscar…",r:"Alfabeto OTAN"},
{c:"cabo",b:"C2",t:"Transmisiones",d:"F",q:"En procedimiento radio, la pro-palabra «CAMBIO» significa…",o:["Cedo la palabra y espero respuesta","Fin de la transmisión","Repita el mensaje","Mensaje recibido"],a:0,x:"Cambio = espero respuesta; Corto = fin.",r:"Transmisiones"},
{c:"cabo",b:"C2",t:"Transmisiones",d:"M",q:"En el alfabeto fonético OTAN, la letra «E» es…",o:["Echo","Eagle","España","Enero"],a:0,x:"Delta-Echo-Foxtrot…",r:"Alfabeto OTAN"},
{c:"cabo",b:"C2",t:"NBQ",d:"F",q:"Las siglas NBQ hacen referencia a la defensa…",o:["Nuclear, Biológica y Química","Naval, Balística y Química","Nocturna, Blindada y de Contención","Nuclear, Balística y de Precisión"],a:0,x:"A veces verás NRBQ (la R de radiológica).",r:"Instrucción NBQ"},
{c:"cabo",b:"C2",t:"Primeros auxilios",d:"F",q:"La conducta PAS en primeros auxilios significa…",o:["Proteger, Avisar y Socorrer","Parar, Auxiliar y Sanar","Prevenir, Actuar y Salvar","Proteger, Atender y Suturar"],a:0,x:"Primero tu seguridad (P), luego avisa (A) y socorre (S).",r:"Primeros auxilios"},
{c:"cabo",b:"C2",t:"Instrucción del combatiente",d:"F",q:"El binomio está formado por…",o:["Dos combatientes","Tres combatientes","Una escuadra","Un pelotón"],a:0,x:"El binomio es la célula mínima de combate.",r:"Escuadra / equipo"},
{c:"cabo",b:"C2",t:"Instrucción del combatiente",d:"M",q:"Un pelotón de fusiles se articula habitualmente en…",o:["Tres escuadras de fusileros","Dos secciones","Cuatro binomios sueltos","Diez equipos"],a:0,x:"Pelotón ≈ 3 escuadras + jefe de pelotón.",r:"Escuadra / equipo"},
/* ============ CABO 1º ============ */
{c:"cabo1",b:"B1",t:"El examen",d:"F",q:"Tras superar la oposición de Cabo 1º, la siguiente fase formativa es…",o:["La fase a distancia","La fase de mar","El curso de montaña","La academia general"],a:0,x:"Oposición primero; después, fase a distancia para el escalafón.",r:"Convocatoria"},
{c:"cabo1",b:"B1",t:"Mando y liderazgo",d:"F",q:"El mando se fundamenta, entre otros pilares, en…",o:["El ejemplo, la competencia y la responsabilidad","La antigüedad exclusivamente","La imposición del temor","El empleo superior"],a:0,x:"Se manda con ejemplo y competencia, no solo con galones.",r:"Técnicas de mando"},
{c:"cabo1",b:"B1",t:"Mando y liderazgo",d:"M",q:"En dinámica de grupos, el jefe de equipo debe fomentar…",o:["La cohesión y la comunicación","La rivalidad interna extrema","El individualismo","La dependencia total"],a:0,x:"Cohesión + comunicación = equipo que cumple la misión.",r:"Dinámica de grupos"},
{c:"cabo1",b:"B1",t:"Régimen disciplinario",d:"M",q:"La potestad disciplinaria sobre un subordinado corresponde…",o:["Al superior con competencia sancionadora","A cualquier compañero","Solo al JEME","A la jurisdicción civil"],a:0,x:"Solo quien tenga atribuida la potestad puede sancionar.",r:"LO 8/2014"},
{c:"cabo1",b:"B1",t:"Documentación",d:"M",q:"Un documento militar de uso interno entre órganos es…",o:["La nota interior","El exhorto","La ejecutoria","El emplazamiento"],a:0,x:"Nota interior: comunicación interna breve y formal.",r:"Documentación"},
{c:"cabo1",b:"B1",t:"Logística",d:"F",q:"La logística militar tiene por objeto…",o:["Dar a la fuerza los recursos para vivir, moverse y combatir","Solo el transporte de personal","La instrucción del combatiente","La justicia militar"],a:0,x:"Vivir, moverse y combatir: el tríptico logístico.",r:"Logística básica"},
{c:"cabo1",b:"B1",t:"Logística",d:"M",q:"Son funciones logísticas…",o:["Abastecimiento, mantenimiento, transporte y sanidad, entre otras","Solo la alimentación","El mando y el control","La disciplina y el orden cerrado"],a:0,x:"ABASTO + MTTO + TPT + SANIDAD como mínimo.",r:"Logística básica"},
{c:"cabo1",b:"B1",t:"Seguridad",d:"F",q:"La seguridad de una instalación militar se basa en…",o:["Medidas activas y pasivas coordinadas en un plan","Solo en la guardia armada","La antigüedad del personal","La suerte"],a:0,x:"Plan + medidas activas (guardia) y pasivas (vallas, CCTV…).",r:"Seguridad"},
{c:"cabo1",b:"B1",t:"Tiro",d:"M",q:"Un agrupamiento desplazado pero agrupado indica normalmente…",o:["Un error sistemático corregible con alza o puntería","Munición defectuosa siempre","Viento huracanado","Un defecto sin solución"],a:0,x:"Agrupado = constancia; desplazado = corrección pendiente.",r:"Tiro"},
{c:"cabo1",b:"B1",t:"Topografía",d:"M",q:"La declinación magnética es…",o:["El ángulo entre el norte geográfico y el norte magnético","La pendiente del terreno","La escala de la carta","El rumbo inverso"],a:0,x:"Sin corregir declinación, el rumbo falla.",r:"Topografía"},
{c:"cabo1",b:"B1",t:"Organización",d:"F",q:"El empleo inmediatamente superior al de cabo es…",o:["Cabo primero","Sargento","Cabo mayor","Soldado de primera"],a:0,x:"Cabo → Cabo 1º → Cabo mayor.",r:"Empleos tropa"},
{c:"cabo1",b:"B1",t:"Organización",d:"M",q:"El empleo de cabo mayor…",o:["Es el máximo de la escala de tropa","Es un empleo de suboficial","No existe en el ET","Equivale a sargento"],a:0,x:"Cabo mayor corona la escala de tropa.",r:"Ley 39/2007"},
{c:"cabo1",b:"B2",t:"Técnicas de mando",d:"M",q:"La evaluación entre iguales (pares) valora…",o:["El desempeño apreciado por compañeros del mismo nivel","Solo la antigüedad","Solo las notas teóricas","La opinión de la familia"],a:0,x:"Tus iguales evalúan tu valía como mando.",r:"Fase a distancia"},
{c:"cabo1",b:"B2",t:"Inglés",d:"F",q:"En inglés militar, «duty» significa…",o:["Deber o servicio","Duda","Destino","Diana"],a:0,x:"«On duty» = de servicio.",r:"Inglés"},
{c:"cabo1",b:"B2",t:"Inglés",d:"F",q:"«Report to your post» significa…",o:["Preséntese en su puesto","Informe del correo","Retírese a descansar","Recoja su fusil"],a:0,x:"Report = presentarse / dar parte.",r:"Inglés"},
{c:"cabo1",b:"B2",t:"Administración",d:"M",q:"La puntualidad en la documentación es…",o:["Una obligación del mando para no perjudicar a sus subordinados","Opcional","Solo exigible en operaciones","Exclusiva de oficinas"],a:0,x:"Un retraso administrativo puede costar un destino o un curso.",r:"Administración"},
/* ============ PERMANENCIA ============ */
{c:"perm",b:"B1",t:"El examen",d:"F",q:"La prueba de conocimientos de permanencia consta de…",o:["100 preguntas test en 120 minutos","50 preguntas en 70 minutos","200 preguntas en 180 minutos","80 preguntas en 90 minutos"],a:0,x:"100 test, 4 opciones, 120 minutos.",r:"Orden DEF/1341/2017"},
{c:"perm",b:"B1",t:"El examen",d:"M",q:"La puntuación de la prueba de conocimientos se calcula…",o:["P = Aciertos − Errores/(n−1)","P = Aciertos + Errores","P = Aciertos × 2","Sin penalización por error"],a:0,x:"Con 4 opciones, cada 3 errores restan 1 acierto.",r:"Orden DEF/1341/2017"},
{c:"perm",b:"B1",t:"El examen",d:"M",q:"En el concurso de permanencia, los méritos profesionales valen hasta…",o:["40 puntos","20 puntos","25 puntos","15 puntos"],a:0,x:"Profesionales 40 + académicos 20 + IPEC 25 + psicofísica 15.",r:"Bases · concurso"},
{c:"perm",b:"B1",t:"El examen",d:"M",q:"Para el régimen general se exigen…",o:["14 años de servicio, los 5 últimos en el ejército","8 años en cualquier ejército","20 años de servicio","10 años y ser cabo mayor"],a:0,x:"14 años + título de Técnico + evaluación favorable.",r:"Ley 8/2006 · bases"},
{c:"perm",b:"B1",t:"Constitución",d:"F",q:"Las Cortes Generales están formadas por…",o:["El Congreso de los Diputados y el Senado","El Gobierno y el Rey","El Congreso y el Tribunal Supremo","El Senado y el Defensor del Pueblo"],a:0,x:"Bicameralismo: Congreso + Senado.",r:"CE · Título III"},
{c:"perm",b:"B1",t:"Constitución",d:"F",q:"El mandato de diputados y senadores es de…",o:["Cuatro años","Dos años","Seis años","Cinco años"],a:0,x:"4 años, salvo disolución anticipada.",r:"CE · Título III"},
{c:"perm",b:"B1",t:"Constitución",d:"M",q:"El Título VIII de la Constitución regula…",o:["La organización territorial del Estado","Los derechos fundamentales","La Corona","El Poder Judicial"],a:0,x:"VIII = CC. AA., provincias y municipios.",r:"CE · Título VIII"},
{c:"perm",b:"B1",t:"Constitución",d:"M",q:"El Poder Judicial se regula en el Título…",o:["VI","III","IV","VIII"],a:0,x:"I derechos, III Cortes, IV Gobierno, V relaciones, VI judicial, VIII territorio.",r:"CE · Título VI"},
{c:"perm",b:"B1",t:"Defensa Nacional",d:"F",q:"La Defensa Nacional se regula en la…",o:["LO 5/2005, de 17 de noviembre","Ley 39/2007","LO 9/2011","Ley 36/2015"],a:0,x:"LO 5/2005: bases de la organización militar.",r:"LO 5/2005"},
{c:"perm",b:"B1",t:"MINISDEF",d:"M",q:"La estructura orgánica básica del Ministerio de Defensa se desarrolla en el…",o:["Real Decreto 205/2024","Real Decreto 372/2020","Real Decreto 96/2009","Real Decreto 521/2020"],a:0,x:"El RD 205/2024 derogó al 372/2020.",r:"RD 205/2024"},
{c:"perm",b:"B1",t:"FAS",d:"M",q:"La estructura operativa de las FAS depende de…",o:["El JEMAD","El JEME","Cada comunidad autónoma","La Guardia Civil"],a:0,x:"JEMAD: mando operativo; JEMES: mando orgánico.",r:"Organización FAS"},
{c:"perm",b:"B1",t:"FAS",d:"F",q:"El órgano de mando del Ejército del Aire y del Espacio es…",o:["El JEMA","El AJEMA","El JEME","El JEMAD"],a:0,x:"JEME (Tierra), AJEMA (Armada), JEMA (Aire y Espacio).",r:"Organización FAS"},
{c:"perm",b:"B2",t:"Carrera militar",d:"F",q:"La Ley 39/2007 es la Ley…",o:["De la carrera militar","De tropa y marinería","De seguridad nacional","De defensa nacional"],a:0,x:"19 de noviembre de 2007.",r:"Ley 39/2007"},
{c:"perm",b:"B2",t:"Tropa y marinería",d:"F",q:"El compromiso de larga duración se extiende hasta…",o:["Los 45 años de edad","Los 65 años","Los 10 años de servicio","La jubilación forzosa"],a:0,x:"Hasta los 45: de ahí la prisa por la permanente.",r:"Ley 8/2006"},
{c:"perm",b:"B2",t:"Tropa y marinería",d:"M",q:"Para acceder a permanente se exige, como mínimo, el título de…",o:["Técnico del sistema educativo general o equivalente","Doctor","Bachillerato internacional","No se exige titulación"],a:0,x:"Técnico (grado medio) o equivalente.",r:"Bases · requisitos"},
{c:"perm",b:"B2",t:"Derechos y deberes",d:"M",q:"Los derechos y deberes del militar se recogen, entre otras normas, en la…",o:["LO 9/2011","LO 5/2005","Ley 36/2015","RD 205/2024"],a:0,x:"LO 9/2011, de derechos y deberes.",r:"LO 9/2011"},
{c:"perm",b:"B2",t:"Situaciones",d:"M",q:"La situación ordinaria del militar profesional en activo es…",o:["Servicio activo","Excedencia","Reserva","Suspenso de funciones"],a:0,x:"El resto son situaciones especiales.",r:"Ley 39/2007"},
{c:"perm",b:"B2",t:"Concurso",d:"M",q:"En el concurso de permanencia, los IPEC valen hasta…",o:["25 puntos","40 puntos","20 puntos","15 puntos"],a:0,x:"40 + 20 + 25 + 15 = 100 del concurso.",r:"Bases · concurso"},
{c:"perm",b:"B3",t:"Seguridad Nacional",d:"F",q:"La Ley de Seguridad Nacional es la…",o:["Ley 36/2015, de 28 de septiembre","LO 5/2005","Ley 39/2007","Ley 8/2006"],a:0,x:"36/2015: Sistema de Seguridad Nacional.",r:"Ley 36/2015"},
{c:"perm",b:"B3",t:"ESN",d:"M",q:"La Estrategia de Seguridad Nacional 2021 se aprobó por…",o:["Real Decreto 1150/2021","Real Decreto 1008/2017","LO 5/2005","Acuerdo del Consejo de la UE"],a:0,x:"El RD 1150/2021 derogó al 1008/2017.",r:"RD 1150/2021"},
{c:"perm",b:"B3",t:"Doctrina",d:"M",q:"La doctrina para el empleo de las FAS se recoge en la publicación…",o:["PDC-01","PDC-99","MADOC-1","ESN-21"],a:0,x:"PDC-01(B), firmada por el JEMAD en julio de 2024.",r:"PDC-01(B)"},
{c:"perm",b:"B3",t:"ONU",d:"F",q:"La ONU se creó en…",o:["1945","1919","1957","1982"],a:0,x:"Carta de San Francisco, 1945.",r:"ONU"},
{c:"perm",b:"B3",t:"ONU",d:"M",q:"El Consejo de Seguridad de la ONU está formado por…",o:["5 miembros permanentes y 10 no permanentes","15 miembros permanentes","Solo 5 miembros en total","54 miembros rotatorios"],a:0,x:"5 permanentes con veto + 10 elegidos.",r:"ONU"},
{c:"perm",b:"B3",t:"OTAN",d:"F",q:"La OTAN se fundó en…",o:["1949","1945","1957","1991"],a:0,x:"Tratado de Washington, 1949.",r:"OTAN"},
{c:"perm",b:"B3",t:"OTAN",d:"M",q:"España ingresó en la OTAN en…",o:["1982","1975","1986","1999"],a:0,x:"OTAN en 1982; CEE en 1986. No los confundas.",r:"OTAN"},
{c:"perm",b:"B3",t:"UE",d:"F",q:"España ingresó en la CEE (hoy UE) en…",o:["1986","1978","1982","1992"],a:0,x:"1986: CEE. Maastricht (UE) es de 1992.",r:"UE"},
{c:"perm",b:"B3",t:"OSCE",d:"M",q:"La OSCE tiene su origen en…",o:["El Acta Final de Helsinki de 1975","El Tratado de Maastricht","El Pacto de Varsovia","El Tratado de Roma"],a:0,x:"De la CSCE de Helsinki a la OSCE actual.",r:"OSCE"},
{c:"perm",b:"B3",t:"Misiones",d:"M",q:"Las misiones internacionales de las FAS requieren, con carácter general…",o:["Acuerdo del Gobierno con autorización del Congreso","Solo la orden del Rey","Solo la decisión del JEMAD","La petición de la ONU"],a:0,x:"Control parlamentario previo del Congreso.",r:"LO 5/2005"},
{c:"perm",b:"B3",t:"Físicas",d:"F",q:"Las pruebas físicas de permanencia incluyen…",o:["Abdominales, flexiones, circuito de agilidad y carrera de 2.000 m","Natación y salto de longitud","Solo la carrera de 2.000 m","Lanzamiento de peso y vallas"],a:0,x:"Cuatro pruebas, de 0 a 5 puntos cada una.",r:"OM 54/2014"},
{c:"perm",b:"B3",t:"Convocatoria",d:"M",q:"La convocatoria de permanencia se publica, con carácter general…",o:["En el BOD, en primavera","En el BOE, en enero","En intranet, en Navidad","En el DOUE"],a:0,x:"BOD en primavera; físicas en octubre y examen en noviembre.",r:"BOD"}
];

/* Asignar IDs estables */
QUESTIONS.forEach((q, i) => q.id = "q" + (i + 1));

const RANKING_BOTS = [
  { name: "Sdo. Marín · BRILAT", xp: 2450 },
  { name: "Cabo Ruíz · BRIPAC", xp: 2310 },
  { name: "Sdo. 1º Gil · BRIEX", xp: 2180 },
  { name: "Cabo Sanz · MACA", xp: 1990 },
  { name: "Sdo. Vega · COMGECEU", xp: 1820 },
  { name: "Cabo 1º Pons · DIMZ", xp: 1650 },
  { name: "Sdo. Roca · MOE", xp: 1410 },
  { name: "Cabo Díaz · FLOAN", xp: 1180 }
];

const TESTIMONIALS = [
  { n: "Cabo J. Munir · ET", t: "Aprobé la permanente con un 83. Los simulacros clavaban el formato del examen real.", s: 5 },
  { n: "Sdo. 1º L. Haro · BRIPAC", t: "Estudiaba en guardias con el móvil sin cobertura. El modo offline me salvó la convocatoria.", s: 5 },
  { n: "Cabo S. Ferrer · IM", t: "Las estadísticas por bloque me dijeron dónde fallaba. Fui al examen sin lagunas.", s: 5 }
];
