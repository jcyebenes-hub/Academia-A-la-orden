/* MICABO · LOTE ARMAMENTO — CABO C2 «ARMAMENTO Y TEORÍA DEL TIRO». 8 preguntas con DOBLE PASADA (temario Cabo nov-2025: T1 normas, T2 G-36, T3 USP, T4 MG-42, T5 teoría del tiro · guía docente CB1).
   Auditoría: sesgo 0 (posiciones 2/2/2/2 · F/M/D 2/4/2); eco 0; colisiones 0 (umbral ≥12); stems sin choques.
   RESULTADO HONESTO: el armamento ya estaba 87% curado (bank7 ar01-50, bank3 n131-135, bank11 c1o033-042) → solo 4 parejas aportaban: MG4, Spike, perforante, rompedoras. +4 NUEVAS del temario: seguro S/T/R, visor 1,5x, cadencia MG-42 por cambio de cierre, balas explosivas.
   DESCARTADOS (30 ids): 9 parejas DUPLICADAS con el pool (G36E calibre ⊂ ar02/c1o034/q19 · MG 7,62 ⊂ ar17/n132 [el borrador decía MG-3; el temario trae MG-42] · C-90 ⊂ ar15/n133 · USP ⊂ ar10/n134/q20 · seguridad ⊂ n135/c1o033/ar45 · Browning ⊂ ar19 · LAG-40 ⊂ ar14 · toma de gases ⊂ ar06 · cargador 30 ⊂ ar03) + 4 parejas SIN FUENTE (EIMOS 60mm — fuentes dicen «81 o 60», ambiguo · trazadora — temario 3.2 solo trae explosivas/perforantes/incendiarias · espoleta «mecano-eléctrica» — no aparece en ningún material · visor C-90 «2 aumentos y 13 grados» — sin literal, Instalaza solo confirma 2×) + 4 gemelas de las promovidas (g1437,g1443,g1533,g1535). */
"use strict";
window.QUESTIONS30 = [
 {
  "src": "g1436",
  "d": "F",
  "q": "¿Qué calibre emplea la ametralladora MG4?",
  "o": [
   "9 × 19 mm",
   "7,62 × 51 mm",
   "5,56 × 45 mm",
   "12,7 × 99 mm"
  ],
  "x": "La MG4 (Heckler & Koch) es una ametralladora de cinta del ET en 5,56 × 45 mm. Ojo: la ametralladora ligera clásica de escuadra (también en 5,56) es la Minimi; la MG3 es la media de 7,62. [Fuente: dotación del ET · H&K MG4 · Temario Cabo nov-2025 (T. Armamento)]",
  "r": "H&K MG4 · dotación ET · Temario Cabo nov-2025",
  "a": 2,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm001"
 },
 {
  "src": "(nueva)",
  "d": "F",
  "q": "Las balas explosivas son la munición que…",
  "o": [
   "Contiene una carga que explota por impacto",
   "Lleva núcleo duro perforante",
   "Se infla al contacto con el aire",
   "Ilumina la trayectoria del proyectil"
  ],
  "x": "Literal del temario: «Munición con balas explosivas: la munición de uso militar con balas que contengan una carga que explota por impacto». [Fuente: Temario Cabo nov-2025 · Teoría del tiro, apdo. 3.2]",
  "r": "Temario Cabo nov-2025 · Teoría del tiro 3.2",
  "a": 0,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm002"
 },
 {
  "src": "g1532",
  "d": "M",
  "q": "¿Qué munición está prevista para atravesar blindajes?",
  "o": [
   "La perforante",
   "La incendiaria",
   "La de fogueo",
   "La subcalibre de instrucción"
  ],
  "x": "Perforante = «la munición de uso militar con balas blindadas de núcleo duro perforante» (literal). Entre las granadas, las perforantes están «previstas para atravesar blindajes». [Fuente: Temario Cabo nov-2025 · Teoría del tiro, apdos. 1.1 y 3.2]",
  "r": "Temario Cabo nov-2025 · Teoría del tiro 3.2",
  "a": 1,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm003"
 },
 {
  "src": "g1534",
  "d": "M",
  "q": "Las granadas que actúan por los fragmentos que producen se llaman…",
  "o": [
   "Iluminantes",
   "De metralla",
   "Rompedoras",
   "Fumígenas"
  ],
  "x": "Literal del temario: entre las granadas, las «rompedoras actúan por los fragmentos que se producen». Las de metralla llevan carga interior de balines esféricos; las especiales son iluminantes, fumígenas o incendiarias. [Fuente: Temario Cabo nov-2025 · Teoría del tiro, apdo. 1.1.b]",
  "r": "Temario Cabo nov-2025 · Teoría del tiro 1.1.b",
  "a": 3,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm004"
 },
 {
  "src": "g1442",
  "d": "M",
  "q": "¿Qué tipo de sistema es el Spike?",
  "o": [
   "Un dron de vigilancia",
   "Un sistema de misiles contracarro guiado",
   "Un radar contrabatería",
   "Un mortero integrado en vehículo"
  ],
  "x": "La guía docente lo estudia como «sistema de armas misil contra carro Spike» (junto al TOW): es el misil guiado antitanque de dotación en las unidades de Infantería. [Fuente: Guía docente CB1 (RA1 · CE1.1)]",
  "r": "Guía docente CB1 · RA1 CE1.1",
  "a": 2,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm005"
 },
 {
  "src": "(nueva)",
  "d": "M",
  "q": "La aleta del seguro del fusil G36E tiene tres posiciones, que son:",
  "o": [
   "S (seguro), T (tiro a tiro) y R (ráfagas)",
   "L (lento), M (medio) y A (automático)",
   "P (paso), F (fuego) y S (silencio)",
   "1, 2 y 3 (según el alcance)"
  ],
  "x": "Literal del temario: «S» = Seguro (aleta horizontal), «T» = Tiro a tiro (girada hacia abajo) y «R» = Ráfagas (verticalmente hacia abajo). [Fuente: Temario Cabo nov-2025 · Fusil HK G-36]",
  "r": "Temario Cabo nov-2025 · Fusil HK G-36",
  "a": 0,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm006"
 },
 {
  "src": "(nueva)",
  "d": "D",
  "q": "Según los datos técnicos del temario, el visor óptico del G36E tiene unos aumentos de:",
  "o": [
   "4 × fijos en todos los ejércitos",
   "Sin aumentos (1 ×)",
   "1,5 × en el ET y 3 × en la FN",
   "3 × en el ET y 1,5 × en la FN"
  ],
  "x": "Literal de los datos técnicos: «Visor óptico. Aumentos: ET = 1,5 ×. FN = 3 ×» (el visor va integrado en el asa de transporte). [Fuente: Temario Cabo nov-2025 · Fusil HK G-36, datos técnicos]",
  "r": "Temario Cabo nov-2025 · Fusil HK G-36 · datos técnicos",
  "a": 3,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm007"
 },
 {
  "src": "(nueva)",
  "d": "D",
  "q": "La MG-42 (MG 1A3) no dispone de regulador de cadencia: esta se determina…",
  "o": [
   "Mediante el cambio de cierre (dos cierres de distinto peso)",
   "Roscando un incrementador de retroceso",
   "Variando el paso del rayado del cañón",
   "Cambiando el trípode de posición"
  ],
  "x": "Literal del temario: «No dispone de regulador para variar la cadencia, por lo que ésta se determina mediante el cambio de cierre, dispone de dos cierres, con distinto peso cada uno de ellos» (cadencia teórica: 1.300 dpm). [Fuente: Temario Cabo nov-2025 · Ametralladora MG-42]",
  "r": "Temario Cabo nov-2025 · Ametralladora MG-42",
  "a": 1,
  "c": "cabo",
  "b": "C2",
  "t": "Armamento",
  "id": "arm008"
 }
];
