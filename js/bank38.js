// bank38 · Instrucción del combatiente (cabo C2) — validación de 26 borradores (13 parejas)
// PROMOVIDAS 2: ic101 fuego y movimiento (← g1478/g1479, literal L5758) · ic102 patrulla (← g1482/g1483, literal L5832)
// DESCARTADAS 11 parejas: jornada 24/30 km (=n152+n153+ic01/02) · abrigo (=n154+ic07-09+to47) · cubierto (=to47/ic08-09) · orden cerrada (=n155+ic10) · elementos escuadra recon (=n156, jalonamiento) · columna/desplegada y desplegada-combatir (SIN LITERAL — la fuente dice: orden de marcha=HILERA, combate=FILA/GUERRILLA) · orden preventiva (SIN LITERAL) · distancias/impacto (SIN LITERAL) · espíritu militar «valores y sentimientos» (SIN LITERAL; art. 14 ya servido por rt017+n129)
// Serie ic01-50 vive en data.js → ids ic101+ para no colisionar
window.QUESTIONS38 = [
 {
  "src": "g1478/g1479",
  "d": "M",
  "q": "En sus desplazamientos, la escuadra combina acciones elementales de…",
  "o": [
   "Mando y obediencia",
   "Vigilancia y enlace",
   "Fuego y movimiento",
   "Apoyo y seguridad"
  ],
  "x": "Literal: «La escuadra combina acciones elementales de fuego y movimiento en las distintas operaciones en las que interviene». En orden de combate: «La escuadra ejecutará los saltos reunida, combinando el fuego y movimiento con la otra escuadra del pelotón»; si el fuego enemigo no lo permite, el movimiento será por saltos individuales. [Fuente: Temario Cabo nov-25 · Doctrina de la escuadra (2-I-41/43) · §3 Desplazamientos de la unidad]",
  "r": "Temario Cabo nov-25 · Doctrina de la escuadra (2-I-41/43)",
  "a": 2,
  "c": "cabo",
  "b": "C2",
  "t": "Instrucción del combatiente",
  "id": "ic101"
 },
 {
  "src": "g1482/g1483",
  "d": "M",
  "q": "Habitualmente, ¿cómo se denomina la unidad designada para efectuar un reconocimiento?",
  "o": [
   "La escuadra",
   "La patrulla",
   "La guerrilla",
   "La escolta"
  ],
  "x": "Literal: «Habitualmente, la unidad designada para el reconocimiento se denomina patrulla». La patrulla de reconocimiento obtiene información del enemigo y del terreno evitando el combate, y se organiza en elementos de mando y enlace, reconocimiento y observación, y seguridad y apoyo (este último para ofrecer protección a sus componentes). [Fuente: Temario Cabo nov-25 · Doctrina de la escuadra (2-I-41/43) · §3.5 Reconocimiento]",
  "r": "Temario Cabo nov-25 · Doctrina de la escuadra (2-I-41/43)",
  "a": 1,
  "c": "cabo",
  "b": "C2",
  "t": "Instrucción del combatiente",
  "id": "ic102"
 }
];
