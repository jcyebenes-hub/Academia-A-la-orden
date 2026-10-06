// bank72 · PLAN «PERMANENCIA TEMA A TEMA» — PERM SUELTOS 4: TRANSMISIONES (temario Cabo nov-25 §4.2-4.3 Redes de radio + abr-26 defensa aérea pasiva)
// pv123-128 · ZONA MUY SERVIDA: tx01-50 (PR4G/RRC/Mando de Transmisiones) + n141-144 cubren casi todo → DESCARTES 18: g1093/94 (=n141 enlace) · g1095/96 (=n142/tx01 PR4G) · g1097/98 (=n143 canales autorizados) · g1099/100 (=n144 brevedad-claridad) · g1470/71 (silencio radio genérico → cubierto por pv123 con el matiz del material: directora) · g1474/75 (indicativo genérico → pv125 da el detalle: abreviados dos últimos dígitos) · g1542/43 (acuse de recibo: explicado en la x de n144, servida).
// PROMOVIDAS: g1476/77 → pv124 (malla despejada de tráfico radio, redacción literal del temario) · g1472/73 → pv126 (EMCON = medida PASIVA de defensa aérea abr-26). +4 NUEVAS del material: pv123 (silencio radio lo impone/levanta la estación DIRECTORA, palabras clave + autenticación) · pv125 (indicativos abreviados: dos últimos dígitos) · pv127 (ATR: definición literal) · pv128 (ATR prisionero: DESTRUIR el mensaje — quemarlo, ocultarlo, romperlo, comérselo; solo nombre/empleo/filiación/fecha).
window.QUESTIONS72 = [
 {
  "d": "M",
  "q": "En una red de radio, ¿quién impone y levanta el silencio radio?",
  "o": [
   "La estación que inició la última comunicación",
   "El mando de mayor empleo del escalafón, personalmente en cada estación",
   "La estación directora de la red, por orden del Mando",
   "Cualquier operador que detecte actividad enemiga"
  ],
  "a": 2,
  "x": "Por motivos de seguridad, el Mando puede ordenar el silencio radio o el cambio de frecuencia en la red, siendo la ESTACIÓN DIRECTORA la encargada de imponerlo y levantarlo en la red de su responsabilidad; normalmente se utilizan palabras codificadas o nombres clave, y el silencio se levanta de la misma forma o mediante la AUTENTICACIÓN. Prohibido violar el silencio ordenado por la directora. Complementa n143 (seguridad de la información) y tx42 (el salto de frecuencia impide la localización).",
  "r": "Temario Cabo nov-25 §4.3.1",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv123"
 },
 {
  "d": "M",
  "q": "Antes de transmitir un mensaje en una malla de radio, hay que…",
  "o": [
   "Asegurarse de que la malla está despejada de tráfico radio, sin interrumpir las comunicaciones en curso",
   "Repetir el mensaje completo tres veces por seguridad",
   "Pedir permiso por escrito al jefe de la unidad",
   "Cambiar de frecuencia para no ser escuchado"
  ],
  "a": 0,
  "x": "LITERAL del temario: al enviar un mensaje hay que ASEGURARSE DE QUE LA MALLA ESTÁ DESPEJADA DE TRÁFICO RADIO, sin interrumpir las comunicaciones que se estén efectuando entre la estación directora y otro corresponsal (para asegurarse, cabe una llamada preliminar antes de transmitir). Promovida g1476/77 («escuchar para no interferir») con la redacción oficial.",
  "r": "Temario Cabo nov-25 §4.3.1.b · promovida g1476/77",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv124"
 },
 {
  "d": "F",
  "q": "Una vez establecida la comunicación entre dos estaciones de radio…",
  "o": [
   "Se suspende la comunicación hasta nueva orden",
   "Los indicativos se comunican al enemigo por convenio",
   "Se duplican los indicativos por seguridad",
   "Los indicativos se abrevian: se utilizan solo los dos últimos dígitos"
  ],
  "a": 3,
  "x": "Una vez establecida la comunicación no hace falta repetir el indicativo completo de la estación llamada, y se pasa a utilizar INDICATIVOS ABREVIADOS: sólo los DOS ÚLTIMOS DÍGITOS. El «indicativo» genérico ya está servido (g1474/75 descartados); el detalle de examen es la abreviación.",
  "r": "Temario Cabo nov-25 §4.3.1.e",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv125"
 },
 {
  "d": "M",
  "q": "En la defensa aérea pasiva del pelotón, el control de emisiones electromagnéticas (EMCON)…",
  "o": [
   "Sustituye al enmascaramiento y a la dispersión",
   "Es una medida pasiva que evita delatar nuestra posición",
   "Es una medida de defensa aérea activa, junto al fuego antiaéreo",
   "Solo se aplica en tiempo de paz"
  ],
  "a": 1,
  "x": "El EMCON es una de las MEDIDAS PASIVAS de defensa aérea, junto a la dispersión, el enmascaramiento, la decepción, la fortificación y la movilidad: se mantiene el control de emisiones PARA NO DELATAR NUESTRA POSICIÓN (aparte de eliminar indicios como rodadas, huellas, humos o polvos). Promovida g1472/73 (el borrador solo decía «limitar transmisiones que revelan la posición») con el encuadre oficial.",
  "r": "Temario Cabo abr-26 · defensa aérea pasiva · promovida g1472/73",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv126"
 },
 {
  "d": "F",
  "q": "¿Qué es el agente de transmisiones (ATR)?",
  "o": [
   "El jefe de la estación directora de la red",
   "El combatiente que hace efectivo el enlace a distancia entre mandos, llevando mensajes personalmente y utilizando cualquier medio de transporte",
   "Un tipo de radio portátil del Ejército de Tierra",
   "El operador de la estación satelitaria"
  ],
  "a": 1,
  "x": "Definición LITERAL: el ATR es el combatiente que hace efectivo el ENLACE A DISTANCIA entre los mandos de dos o más unidades, PERSONALMENTE, llevando mensajes y utilizando para ello CUALQUIER MEDIO DE TRANSPORTE. El envío por agente de transmisiones sigue siendo indicado para documentos, mapas, mensajes postales y cuando la situación táctica (p. ej., silencio radio) o la saturación de los otros medios no permita su uso.",
  "r": "Temario Cabo nov-25 §4.2.2",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv127"
 },
 {
  "d": "D",
  "q": "Un agente de transmisiones está a punto de caer prisionero del enemigo. ¿Qué debe hacer con el mensaje?",
  "o": [
   "Guardarlo en el bolsillo hasta ser liberado",
   "Leerlo en voz alta para ganar tiempo",
   "Destruirlo por cualquier medio (quemándolo, ocultándolo, rompiéndolo, incluso comiéndoselo) y jamás comunicar su contenido",
   "Entregarlo para negociar la retirada"
  ],
  "a": 2,
  "x": "LITERAL: si está a punto de caer prisionero debe DESTRUIR EL MENSAJE por cualquier medio — quemándolo, ocultándolo en el terreno, rompiéndolo e incluso comiéndoselo — y BAJO NINGÚN CONCEPTO comunicará al enemigo el contenido del mensaje, limitándose a decir su nombre, empleo, filiación y fecha de nacimiento. Si resulta herido, lo pondrá en conocimiento del jefe de la unidad más próxima.",
  "r": "Temario Cabo nov-25 §4.2.6",
  "c": "perm",
  "b": "B3",
  "t": "Transmisiones",
  "id": "pv128"
 }
];
