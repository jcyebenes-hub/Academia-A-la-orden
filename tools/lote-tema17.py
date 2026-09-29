#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Lote Tema 17 · Instrucción cívica (símbolos, patronas, condecoraciones) — 50 preguntas
# Fuentes verificadas 21-sep-2026: RD 1560/1997 de 10-oct (BOE-A-1997-21605 consolidado, leído): himno = «Marcha
# Granadera» o «Marcha Real Española», partitura oficial en anexo, frase de 16 compases, negra=76, tonalidad
# Si b mayor, versiones COMPLETA (homenajes a la Bandera y actos con SS.MM. los Reyes) y BREVE (demás actos) +
# historia del himno (Libro de Ordenanza de toques militares de la Infantería Española, 1761, Manuel Espinosa;
# Carlos III Marcha de Honor 3-9-1770; decreto 17-7-1942; derechos vía RD 1543/1997 de la versión 1908 del
# maestro Bartolomé Pérez Casas; armonización actual del Maestro Francisco Grau Vergara, Guardia Real; II
# República = Himno de Riego; concurso de 1870 desierto) + Constitución art. 4 (bandera respetada; composición
# ya cubierta en T5 cp, aquí ángulo proporciones/uso) + RD 1511/1977 (Reglamento de Banderas y Estandartes,
# Guiones, Insignias y Distintivos; escudo en ambas caras; bandera civil sin escudo; media asta = duelo) +
# símbolos del escudo (Castilla/León/Aragón/Navarra/Granada, escusón Borbón-Anjou, Columnas de Hércules Plus
# Ultra, bandera naval 1785 de Carlos III) + patronas institucionales (Pilar-FAS 12-O, Inmaculada-Infantería
# 8-dic, Santiago-Caballería 25-jul, Santa Bárbara-Artillería 4-dic) + Real y Militar Orden de San Fernando
# (Cortes de Cádiz 1811, máxima recompensa, titulares laureados) + Cruz al Mérito Militar (distintivos de
# colores) + Día de las FAS (fecha variable, fijada cada año). EVITADO por duplicar: composición art. 4 CE (T5),
# bandera/himno europeos (T14), "cuál es el himno"/"letra oficial" (FCH base), juramento ante la Bandera (base).
RAW = [
["F","El Reglamento de Banderas y Estandartes, Guiones, Insignias y Distintivos está recogido en el:",["RD 1511/1977","RD 1560/1997","RD 1997/1511","Decreto de 1942"],"RD 1511/1977: la norma de referencia de las enseñas militares. El 1560/1997 es el del himno; no los mezcles.","RD 1511/1977"],
["F","La bandera de las Fuerzas Armadas lleva el escudo de España:",["En ambas caras (anverso y reverso)","Solo en el reverso","Nunca: escudo prohibido","Solo si el Rey lo firma"],"Reglamento de 1977: el escudo figura en ambas caras del paño en la bandera de las unidades.","RD 1511/1977"],
["F","La bandera SIN escudo es:",["La bandera civil o privada","La bandera de guerra","La bandera coronela","La bandera falsa"],"Sin escudo = uso civil/privado. Las unidades militares usan la de escudo en ambas caras.","RD 1511/1977"],
["M","La proporción entre las franjas roja-amarilla-roja es:",["1:2:1 (la amarilla es el doble de ancha que cada roja)","1:1:1 (tres iguales)","2:1:2 (las rojas dobles)","1:3:1"],"Art. 4 CE + reglamento: roja, amarilla (el doble) y roja. La central domina el paño.","CE art. 4 · RD 1511/1977"],
["F","En señal de DUELO oficial, la bandera se instala:",["A media asta","En lo más alto siempre","Al revés","Guardada para siempre"],"Media asta = duelo institucional. Detalle de protocolo que todo militar debe reconocer a la primera.","RD 1511/1977"],
["F","El himno nacional está regulado por el:",["RD 1560/1997, de 10 de octubre, que fija su partitura oficial","RD 1511/1977","RD 1543/1943","Una orden ministerial de 2020"],"RD 1560/1997: himno, partitura oficial en el anexo, versiones y modalidades de interpretación.","RD 1560/1997"],
["M","La Marcha Granadera aparece en 1761 en:",["El Libro de Ordenanza de toques militares de la Infantería Española (Manuel Espinosa)","Una ópera italiana","Un cancionero de marina","El diario de Colón"],"Origen documentado: libro de toques de 1761, atribuido a Manuel Espinosa, de autor desconocido para la pieza.","Historia del himno"],
["M","Carlos III declaró la Marcha Granadera:",["Marcha de Honor (3 de septiembre de 1770)","Himno nacional en 1785","Canción prohibida","Marcha fúnebre"],"3-9-1770: Marcha de Honor para actos públicos y solemnes; el pueblo la hizo himno de facto.","Historia del himno"],
["M","Los derechos de explotación del himno los adquirió el Estado en 1997 (versión de 1908 de Pérez Casas) mediante:",["El RD 1543/1997","El RD 1511/1977","Compra en subasta pública en 1985","No se compraron nunca"],"RD 1543/1997: adquisición de los derechos de la versión del maestro Pérez Casas; paso previo al RD 1560/1997.","RD 1543/1997"],
["M","Las versiones oficiales del himno nacional son:",["Completa y breve (corta)","Larga y eterna","Solo existe una","De día y de noche"],"Art. 2-3 del RD 1560/1997: dos versiones con usos distintos. La tonalidad: Si bemol mayor, negra=76.","RD 1560/1997"],
["F","La versión COMPLETA del himno se interpreta:",["En homenajes a la Bandera y actos oficiales con SS.MM. los Reyes","En cualquier barra de bar","Solo en bodas militares","Nunca"],"Literal del art. 3: homenaje a la Bandera y actos con Su Majestad el Rey o la Reina: versión completa.","RD 1560/1997"],
["M","La versión BREVE del himno corresponde a:",["Los demás actos no incluidos en la versión completa","Solo los funerales","Los actos extranjeros exclusivamente","Ningún acto"],"Todo lo que no es homenaje a la Bandera ni acto regio: versión breve.","RD 1560/1997"],
["M","La tonalidad oficial del himno nacional es:",["Si bemol mayor","Do mayor","Mi menor","Fa sostenido"],"Detalle fino pero literal del art. 2 del RD: Si bemol mayor, indicación metronómica de negra igual a 76.","RD 1560/1997"],
["M","La II República sustituyó la Marcha Real por:",["El Himno de Riego","La Internacional","El himno europeo","Silencio absoluto"],"1931-1939: Himno de Riego. La Marcha Real volvió en 1937 y se confirmó por decreto de 17-7-1942.","Historia del himno"],
["M","El concurso nacional para elegir himno convocado en 1870 (Amadeo I) terminó:",["Desierto: se volvió a la Marcha de Granaderos","Con una valsa ganadora","Con el himno de Riego","Con una copla popular"],"447 composiciones presentadas y premio desierto: la Marcha de Granaderos siguió de himno.","Historia del himno"],
["F","Las Columnas de Hércules con el lema «Plus Ultra» forman parte de:",["El escudo de España","El escudo de la UE","La enseña naval de Portugal","El sello de la OTAN"],"Columnas de Hércules y «Plus Ultra» («más allá»): el emblema imperial de Carlos I, hoy en el escudo de España.","Símbolos de España"],
["M","El escusón central del escudo de España corresponde a:",["La casa real de Borbón-Anjou (tres flores de lis)","El reino de Navarra","La corona de Aragón","El Imperio romano"],"Escusón de azur con tres flores de lis de oro: la casa reinante, en el centro del escudo.","Símbolos de España"],
["M","Las CADENAS del escudo de España corresponden a:",["El reino de Navarra","Castilla","Granada","León"],"Cuartos: castillo (Castilla), león rampante (León), palos o barras (Aragón), cadenas (Navarra) y granada (Granada).","Símbolos de España"],
["F","La fiesta nacional de España se celebra el:",["12 de octubre","1 de enero","6 de diciembre","19 de marzo"],"12 de octubre: Día de la Hispanidad y desfile de las Fuerzas Armadas; festividad del Pilar.","Fiestas civiles"],
["F","La patrona de las Fuerzas Armadas es:",["La Virgen del Pilar","La Virgen de Covadonga","La Virgen de Lourdes","Santa Teresa"],"Virgen del Pilar, patrona de las FAS y de la Hispanidad: por eso su día es el 12 de octubre.","Patronato de las FAS"],
["F","La patrona de la INFANTERÍA es:",["La Inmaculada Concepción (8 de diciembre)","Santa Bárbara","La Virgen del Carmen","Santa Cristina"],"Inmaculada Concepción, 8 de diciembre: patrona de Infantería. No confundir con el Pilar (FAS).","Patronos de las Armas"],
["M","El patrono de la CABALLERÍA es:",["Santiago Apóstol (25 de julio)","San Jorge","San Fernando","San Martín"],"Santiago Apóstol, 25 de julio: patrono de Caballería.","Patronos de las Armas"],
["M","La patrona de la ARTILLERÍA es:",["Santa Bárbara (4 de diciembre)","Santa Rita","La Virgen del Rocío","Santa Lucía"],"Santa Bárbara, 4 de diciembre: patrona de la Artillería.","Patronos de las Armas"],
["F","La máxima recompensa militar de España es:",["La Real y Militar Orden de San Fernando","La Cruz del Mérito Militar","La medalla del bautismo de fuego","El diploma de la guarda"],"San Fernando: la recompensa más alta por hechos de armas extraordinarios; sus titulares son los laureados.","Recompensas militares"],
["M","La Orden de San Fernando fue instituida por:",["Las Cortes de Cádiz en 1811","El Rey Juan Carlos I en 1982","Napoleón en 1808","Las Cortes de Madrid en 1920"],"1811, Cortes de Cádiz: más de dos siglos premiado el mayor heroísmo.","Recompensas militares"],
["M","La Cruz al Mérito Militar se concede:",["Con distintos distintivos (colores) según el tipo de mérito","Siempre en color verde","Solo post mortem","Solo a generales"],"Distintivos de colores según la naturaleza del mérito: la forma de graduar el reconocimiento.","Recompensas militares"],
["M","La Medalla Militar distingue:",["Hechos distinguidos de valor (menores que los de San Fernando)","La limpieza del acuartelamiento","El mejor cocinero","La asistencia perfecta al gimnasio"],"Escalón recompensador bajo la San Fernando: valor distinguido en operaciones.","Recompensas militares"],
["F","El Día de las Fuerzas Armadas tiene:",["Fecha variable: se determina cada año (suele ser en mayo o junio)","Fecha fija el 28 de mayo","Fecha fija el 1 de abril","Solo se celebra en años pares"],"No hay fecha fija por ley: la fija el Ministerio cada año, con actos y exposición de medios abiertos al público.","Protocolo FAS"],
["M","En los acuartelamientos, la bandera se iza y arría:",["Al amanecer y al atardecer (izo diario solemne)","Una vez al año","Solo cuando llueve","Cada hora"],"Uso diario del pabellón nacional: izar por la mañana y arriar al atardecer, con la debida solemnidad.","RD 1511/1977"],
["M","El 12 de octubre también recuerda:",["La llegada de Colón a América (1492)","La batalla de Lepanto","El descubrimiento del fuego","El fin de la guerra civil"],"12-10-1492: llegada a América; por la fecha coincide con el Pilar: fiesta nacional e Hispanidad.","Fiestas civiles"],
["M","El desfile de la fiesta nacional (12-O) lo preside:",["Su Majestad el Rey","El alcalde de Madrid","El embajador de la OTAN","El decano de los coroneles"],"Acto de Estado: presidido por SS.MM. los Reyes (por eso, si suena el himno, versión completa).","Protocolo de Estado"],
["M","Las condecoraciones se lucen en el uniforme mediante:",["Pasadores (barras de colores en el bolsillo)","Imanes","Cuerda de cáñamo","Cinta adhesiva"],"Pasadores: barra con los colores de cada recompensa, al orden que marca la norma.","Reglamento de distintivos"],
["D","Acto oficial con SS.MM. los Reyes presente. La versión del himno será:",["La completa","La breve","Ninguna: no se toca","Una marcha improvisada"],"Acto regio = versión completa (art. 3 del RD 1560/1997). Aplicación directa de la regla.","RD 1560/1997 · caso"],
["D","Se decreta duelo oficial por una víctima mortal. La bandera del acuartelamiento:",["Se instala a media asta","Se quema en señal de pena","Se cambia por una negra","Se iza al doble de altura"],"Duelo = media asta. Sencillo, solemne e inconfundible.","RD 1511/1977 · caso"],
["D","Inauguración de un polideportivo, sin SS.MM. ni homenaje a la Bandera. El himno se toca:",["En versión breve","En versión completa","Dos veces seguidas","No se toca nunca"],"Acto ordinario = versión breve. La completa queda para Bandera y actos regios.","RD 1560/1997 · caso"],
["M","La armonización actual del himno es obra del maestro:",["Francisco Grau Vergara (Coronel Director de la Unidad de Música de la Guardia Real)","Paco Ibáñez","Beethoven","Un maestro de cerámica"],"Francisco Grau Vergara: revisión y orquestación de 1997, respetando la armonización de Pérez Casas.","RD 1560/1997"],
["M","La versión de 1908 cuyos derechos compró el Estado era del maestro:",["Bartolomé Pérez Casas","Manuel de Falla","Joaquín Rodrigo","Ruperto Chapí"],"Pérez Casas instrumentó en 1908 la versión que se usó casi un siglo: de sus derechohabientes la compró el Estado (RD 1543/1997).","Historia del himno"],
["M","La bandera roja-amarilla-roja nació en 1785 para:",["La Marina (Carlos III): distinguir los barcos españoles en el mar","El ejército de tierra en 1785","Una campaña de publicidad","La Exposición Universal"],"Carlos III, 1785: sustituir la bandera blanca borbónica, que se confundía con otras marinas, por un paño inconfundible.","Historia de la bandera"],
["M","Antes de 1785, los barcos españoles enarbolaban:",["Bandera blanca con el escudo real (Borbones)","Bandera azul celeste","El paño morado de Castilla","Una vela roja"],"La blanca con escudo se confundía con las de otras casas reales: el problema que resolvió el bicolor.","Historia de la bandera"],
["M","El Día de las Fuerzas Armadas incluye siempre:",["Homenaje a los que dieron su vida por España y exposición de medios","Una paella gigante","Un desfile de mascotas","Fuegos artificiales de cierre"],"Acto central: homenaje a los caídos por España, junto a jura/promesas y medios a pie de calle.","Protocolo FAS"],
["M","Las BANDERAS de las unidades militares también pueden:",["Ser condecoradas (p. ej., Laureadas de San Fernando)","Cambiar de color en verano","Llevar publicidad","Votar en las elecciones"],"La recompensa puede ser colectiva: la enseña de la unidad porta las corbatas de sus condecoraciones.","Recompensas militares"],
["F","El lema «Plus Ultra» significa:",["«Más allá»","«Antes de ayer»","«Ni por esas»","«Aquí nos quedamos»"],"Columnas de Hércules y «más allá»: el llamado a superar los límites del mundo conocido.","Símbolos de España"],
["D","Tras el izado encuentras una bandera caída en el suelo. Lo correcto:",["Recogerla con respeto de inmediato e informar al jefe de la unidad","Pisarla para plancharla","Dejarla ahí y callar","Usarla como faldón de mesa"],"La enseña nacional exige respeto siempre: se recoge, se custodia y se comunica el incidente.","RD 1511/1977 · caso"],
["D","Camino del comedor suena el himno en un acto. Tu conducta correcta:",["Detenerse y ponerse a la atención (descubrirse si llevas cobertura)","Seguir andando con prisa","Gritar ¡viva! sin parar","Sacar el móvil a grabar en selfie"],"Himno nacional = atención y respeto: parado, quieto y descubierto. Protocolo básico de cortesía.","Protocolo · caso"],
["M","Los «palos» del cuartel de Aragón son:",["Cuatro barras rojas sobre campo de oro","Cinco estrellas azules","Un ajedrez blanco y negro","Rayos verdes"],"Las barras de Aragón: rojas sobre oro, uno de los cuarteles históricos del escudo.","Símbolos de España"],
["M","La granada del escudo de España representa:",["El reino de Granada","Una granada de mano","La fruta del huerto real","El escudo de Sevilla"],"Punta del escudo: la granada al natural, por el reino de Granada.","Símbolos de España"],
["M","La frase técnica del himno consta de:",["16 compases (dos secciones de cuatro repetidos)","64 compases sin estructura","Un solo acorde eterno","8 compases en línea"],"Art. 2 literal: frase de dieciséis compases, dos secciones de cuatro compases repetidas.","RD 1560/1997"],
["M","El equivalente de la Cruz del Mérito Militar en la Marina y el Ejército del Aire:",["La Cruz del Mérito Naval y la Cruz del Mérito Aéreo","La cruz de la amistad","La medalla de natación","El sextante de oro"],"Cada Ejército tiene su cruz de mérito: Militar (Tierra), Naval (Armada) y Aérea (Ejército del Aire).","Recompensas militares"],
["F","Los titulares de la Cruz Laureada de San Fernando son llamados:",["Caballeros (o damas) laureados","Soldados de platino","Gran cruz super deluxe","Comendadores del radar"],"Laureados: así se distingue a los condecorados con la máxima recompensa militar española.","Recompensas militares"],
["M","El art. 4.1 de la Constitución establece que la bandera de España:",["Debe ser respetada por todos los españoles","Se puede cambiar por referendum local","Es opcional en territorio nacional","Se usa solo en fiestas"],"Art. 4.1: la bandera está formada por las franjas roja-amarilla-roja «y debe ser respetada por todos los españoles».","CE art. 4.1"]
]
assert len(RAW) == 50, "RAW tiene %d" % len(RAW)
import io
PATRON = [(p + j) % 4 for j in range(13) for p in range(4)][:50]
filas = []
for i, ((dif, q, ops, x, r), dest) in enumerate(zip(RAW, PATRON), 1):
    correcta = ops[0]; resto = ops[1:]
    nuevas = resto[:dest] + [correcta] + resto[dest:]
    esc = lambda t: t.replace('"', '\\"')
    filas.append('{c:"cabo",b:"C1",t:"Instrucción cívica",d:"%s",id:"cv%02d",q:"%s",o:[%s],a:%d,x:"%s",r:"%s"}' % (dif, i, esc(q), ",".join('"%s"' % esc(o) for o in nuevas), dest, esc(x), esc(r)))
LOTE17 = (',\n/* ===== LOTE EXAMINADOR — Tema 17: Instrucción cívica (símbolos, patronas, condecoraciones)\n'
'   Elaboración PROPIA (examinador GALÓN), 21-sep-2026, contra fuentes verificadas hoy: RD 1560/1997 de 10-oct\n'
'   (BOE-A-1997-21605 consolidado LEÍDO: «Marcha Granadera»/«Marcha Real Española», partitura oficial, frase de\n'
'   16 compases, negra=76, Si b mayor, versión COMPLETA = homenajes a la Bandera y actos con SS.MM. los Reyes,\n'
'   versión BREVE = demás actos) + historia del himno (Libro de Ordenanza de toques de Infantería 1761, Espinosa;\n'
'   Carlos III Marcha de Honor 3-9-1770; decreto 17-7-1942; RD 1543/1997 derechos versión 1908 de Pérez Casas;\n'
'   armonización Francisco Grau Vergara; Riego en la II República; concurso 1870 desierto) + RD 1511/1977\n'
'   (escudo en ambas caras, bandera civil sin escudo, media asta duelo, izo diario) + escudo (cuarteles,\n'
'   escusón Borbón-Anjou, Columnas Plus Ultra, bandera naval 1785 Carlos III, antes blanca) + patronas (Pilar\n'
'   FAS 12-O, Inmaculada Infantería 8-dic, Santiago Caballería 25-jul, Santa Bárbara Artillería 4-dic) + San\n'
'   Fernando (Cádiz 1811, laureados, máxima recompensa) + Mérito Militar (distintivos) + Día FAS variable.\n'
'   EVITADO por duplicar: composición art. 4 CE (T5), bandera/himno europeos (T14), "cuál es el himno" y\n'
'   "letra oficial" (FCH base), juramento ante la Bandera (base). */\n')
s = io.open('/home/user/galon/js/bank7.js', encoding='utf-8').read().rstrip()
assert s.endswith('];')
s = s[:-2] + LOTE17 + ",\n".join(filas) + "\n];\n"
io.open('/home/user/galon/js/bank7.js', 'w', encoding='utf-8').write(s)
from collections import Counter
print("Lote Tema 17 montado: 50 · reparto correctas:", dict(sorted(Counter(PATRON).items())), "· dificultades:", dict(sorted(Counter(r[0] for r in RAW).items())))
