// bank117 · TIRO — CB1 · 10 preguntas (fm111-fm120) · d=MD
// FUENTE OFICIAL: «Temario Curso Cabo ACT NOV 2025», Cap. 2 · BLOQUE III: ARMAMENTO Y
// TEORÍA DEL TIRO (Tema 1 normas de uso y manejo · Tema 2 HK G-36 · Tema 3 HK USP ·
// Tema 4 MG-42 · Tema 5 teoría del tiro). Texto aportado por el usuario.
// Se solapa DELIBERADAMENTE lo mínimo con el banco existente (ar01-ar50, arm001-008,
// c1r001-010, n131-n135, n214, n234): aquí se preguntan datos técnicos finos del NOV-2025
// que esas tandas no tocaban (longitudes, paso de rayado, energías, retroceso del cañón,
// pesos y cadencias de la MG-42, suma algebraica de ángulos).
// PENDIENTE PARA LA FASE DE REVISIÓN FINAL (pactada con el user): ar05 afirma que el G36E
// pesa «3,3 kg» mientras el NOV-2025 da «3,4 kg» (arma sin cargador) → discrepancia a
// resolver en el repaso total, NO se pregunta por ella aquí.
// Método doble pasada · correctas distribuidas (0×3, 1×2, 2×2, 3×3) · sin «todas/ninguna».
window.QUESTIONS117 = [
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm111",
  "q": "Antes del empleo del arma, en caso de fallos y averías y antes de la limpieza, ¿qué cuatro comprobaciones exige el temario?",
  "o": [
   "Que el arma esté engrasada, el cargador lleno, el seguro puesto y la culata desplegada",
   "Que el arma esté desmontada, el cañón limpio, el cierre abierto y el visor reglado",
   "Que el arma esté descargada, se haya retirado el sistema de alimentación, esté libre la recámara y no haya ningún cuerpo extraño en el cañón",
   "Que el arma esté fría, apoyada, sin correa y con el cargador separado"
  ],
  "a": 2,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 1: «Antes del empleo del arma, en el caso de fallos y averías y antes de la limpieza se deberá comprobar, que: — El arma está descargada, — Se ha retirado el sistema de alimentación, — Está libre la recámara — En el cañón no se encuentra ningún cuerpo extraño». Son cuatro comprobaciones, y la cuarta es la que más se olvida: mirar el cañón.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 1 (normas de uso y manejo)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm112",
  "q": "Si no se conoce el estado de carga de un arma, ¿cómo debe tratarse?",
  "o": [
   "Como si estuviera cargada y lista para el disparo",
   "Como si estuviera descargada, hasta comprobarlo",
   "Como material inservible hasta que la revise un armero",
   "Como si estuviera cargada solo si el cargador está colocado"
  ],
  "a": 0,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 1: «Siempre que no se conozca el estado de carga del arma, ésta debe ser tratada como si estuviera cargada y lista para el disparo». Es la regla que cierra el círculo: el desconocimiento nunca se resuelve suponiendo que está descargada.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 1 (normas de uso y manejo)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm113",
  "q": "Según los datos técnicos del G36 E, ¿cuál es su longitud total con el culatín desplegado y plegado?",
  "o": [
   "1.000 mm desplegado y 750 mm plegado",
   "999 mm desplegado y 659 mm plegado",
   "899 mm desplegado y 759 mm plegado",
   "999 mm desplegado y 759 mm plegado"
  ],
  "a": 3,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 2: «Longitud total, culatín desplegado 999 mm / Longitud total, culatín plegado 759 mm / Longitud del cañón 480 mm». El dato que se confunde es el plegado: son 759, no 659.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 2 (fusil HK G-36)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm114",
  "q": "¿Qué paso de rayado y en qué sentido tiene el cañón del G36 E?",
  "o": [
   "178 mm, dextrorsum (a derechas)",
   "178 mm, sinistrorsum (a izquierdas)",
   "480 mm, dextrorsum",
   "178 cm, dextrorsum"
  ],
  "a": 0,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 2: «Paso del rayado 178 mm dextrorsum». Ojo a dos confusiones típicas: el paso de rayado es de 178 milímetros (no 480, que es la longitud del cañón) y es dextrorsum, hacia la derecha.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 2 (fusil HK G-36)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm115",
  "q": "¿Qué velocidad inicial y qué energía en boca tiene el proyectil del G36 E?",
  "o": [
   "750 m/s y 1.700 julios",
   "920 m/s y 1.300 julios",
   "Aproximadamente 920 m/s y aproximadamente 1.700 julios",
   "Aproximadamente 360 m/s y aproximadamente 500 julios"
  ],
  "a": 2,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 2: «Velocidad inicial del proyectil vo -, aprox. 920 m/s / Energía en boca Eo -, aprox. 1700 julios». Ojo: 750 son los disparos por minuto (cadencia), no la velocidad; y 360 m/s es la velocidad de la pistola USP.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 2 (fusil HK G-36)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm116",
  "q": "En la pistola USP, ¿cómo se desbloquea el arma tras el disparo?",
  "o": [
   "Por corto retroceso basculante del cañón, de unos 3 mm, con sistema de amortiguación",
   "Por un largo retroceso rectilíneo del cañón de 30 mm",
   "Por toma directa de gases al cierre",
   "Por acerrojamiento mediante rodillos de bloqueo"
  ],
  "a": 0,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 3: la USP tiene «Acerrojamiento semirrígido por interposición del bloque de la recámara» y «Desbloqueo por corto retroceso basculante del cañón (unos 3 mm) con sistema de amortiguación». El acerrojamiento por rodillos es de la MG-42, no de la pistola.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 3 (pistola HK USP)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm117",
  "q": "¿Qué velocidad inicial del proyectil y qué alcance eficaz tiene la pistola USP (9 × 19)?",
  "o": [
   "360 m/s y 100 metros",
   "920 m/s y 50 metros",
   "360 m/s y 25 metros",
   "360 m/s y 50 metros"
  ],
  "a": 3,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 3: «Calibre: 9 x 19 mm Parabellum. — Velocidad inicial del proyectil: 360 m/s. — Alcance eficaz: 50 metros». Son 50 metros, no 100, y la velocidad es la cuarta parte de la del fusil.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 3 (pistola HK USP)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm118",
  "q": "¿Qué cadencia teórica y qué alcance máximo tiene la ametralladora MG 1A3 (42/58)?",
  "o": [
   "750 dpm y 2.000 m",
   "1.300 dpm y 4.000 m",
   "1.300 dpm y 1.200 m",
   "900 dpm y 4.000 m"
  ],
  "a": 1,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 4: «Calibre: 7,62x51 mm. NATO · Alimentación: Cartuchos eslabonados · Alcance máximo: 4.000 m · Cadencia teórica: 1.300 dpm · Peso del arma: 11,5 Kg · Peso del trípode: 14 Kg · Capacidad de la caja de munición: 250 cartuchos». Los 1.200 m son la graduación del alza en hectómetros, no el alcance máximo.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 4 (ametralladora MG-42)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm119",
  "q": "¿En qué se convierte la MG 1A3 (42/58) al acoplarla sobre un trípode?",
  "o": [
   "En una ametralladora pesada, por superar los 25 kg de conjunto",
   "En una ametralladora media, al darle el trípode estabilidad y precisión en el tiro",
   "En un arma antiaérea exclusivamente",
   "No cambia de categoría: el trípode solo mejora la comodidad del tirador"
  ],
  "a": 1,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 4: «La ametralladora MG 1A 3 (42/58) es un arma colectiva, automática de 7,62 milímetros de calibre. Se convierte en media al acoplarse sobre un trípode que le da estabilidad y precisión en el tiro». Es una de las preguntas conceptuales más rentables del tema.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 4 (ametralladora MG-42)"
 },
 {
  "c": "cabo1",
  "b": "B1",
  "t": "Tiro",
  "d": "MD",
  "id": "fm120",
  "q": "Según la teoría del tiro, el ángulo de tiro (FI) es igual a…",
  "o": [
   "El ángulo de mira menos el de elevación",
   "El ángulo de situación menos el de elevación",
   "El ángulo formado por la línea de mira y la línea de situación",
   "La suma algebraica de los ángulos de elevación y de situación"
  ],
  "a": 3,
  "x": "Temario NOV-2025, Cap. 2, Bloque III, Tema 5: «Ángulo de tiro (FI) es el formado por las líneas de tiro y horizontal de referencia. Es igual a la suma algebraica de los ángulos de elevación y situación». Ojo: el ángulo de ELEVACIÓN se forma entre la línea de tiro y la de SITUACIÓN (no con la horizontal), y el de MIRA entre la línea de tiro y la de mira.",
  "r": "Temario Cabo nov-25 · Bloque III · Tema 5 (teoría del tiro)"
 }
];
