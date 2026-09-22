# AUDITORÍA DEL BANCO · "El Alumno Agente" — 20-sep-2026

> **Objetivo**: asegurarnos de que cada respuesta del banco es correcta contra la normativa vigente.
> Si una respuesta es dudosa, no sale. La confianza es el producto.

## Cómo trabaja el agente

`tools/auditor.js` se "examina" de **todas** las preguntas del banco (las mismas que sirve la app, con el mismo cargador) y sobre cada una aplica 6 familias de reglas:

| Regla | Qué caza |
|---|---|
| **NORMA** | Preguntas de "qué ley regula X" contrastadas contra la **tabla de verdad** (LODN=LO 5/2005, RROO=RD 96/2009, Carrera=L 39/2007, T&M=L 8/2006, DyD=LO 9/2011, Disciplina=LO 8/2014, CPM=LO 14/2015, Seg. Nac.=L 36/2015, ESN 2021=RD 1150/2021, Proc. Adm.=L 39/2015, Org. ET=RD 847/2015, Igualdad=LO 3/2007) |
| **EQUIV** | Equivalencias de empleos ET–Armada (teniente general↔almirante general, coronel↔capitán de navío, comandante↔capitán de fragata) |
| **FORMATO** | Formatos oficiales de examen: Cabo 50+5/70' · Cabo 1º 50 preg. (35 FM+15 FS) · Permanencia 100 preg./120' |
| **FUGA** | La respuesta aparece literal en el enunciado (regalo) |
| **DUPLI/ESTRUCT** | Estructura rota: opciones repetidas, índice inválido, placeholders, "todas las anteriores" |
| **AVISO-X** | (informativo) la explicación no repite la cifra clave de la respuesta |

Salida: `data/auditoria.json` (incidencias) + `data/auditoria-avisos.json`. Se ejecuta con `node tools/auditor.js` **después de cada regeneración** del banco.

## Acta final

```
Preguntas examinadas: 1.550 (Cabo 533 · Cabo 1º 459 · Permanencia 558)
Incidencias: 0   ✅ APTO
Distribución A/B/C/D: 592/319/301/338 (38/21/19/22 %) · *acta actualizada tras los lotes 12-13 (rascado OpoMelilla + bases I/26: geografía, historia e inglés militar en Cabo 1º)* · *actualizado tras el lote 12 (Permanencia IV, rascado OpoMelilla + normativa)*
Avisos informativos: 8 (estilo, no error)
```

## Lo que el agente ha cazado y corregido en esta auditoría (7 errores reales)

| # | Pregunta | Decía | Corregido a | Fuente |
|---|---|---|---|---|
| 1 | Ley de la Defensa Nacional (bank3, n307) | "Ley 39/2015, de 18 de noviembre" + explicación falsa "sustituyó a la 5/2005" | **LO 5/2005, de 17 de noviembre** | BOE |
| 2 | Seguridad Nacional (bank3, n339) | "Ley 2/2015, de 30 de marzo" | **Ley 36/2015, de 28 de septiembre** | Congreso.es / BOE (verificado hoy) |
| 3 | Seguridad Nacional (generada ×2, facts-perm) | "Ley 2/2015" | **Ley 36/2015** | ídem |
| 4 | RROO vigentes (facts-cabo, g1008) | "RD 502/2020" y marcaba el 96/2009 como "derogado" | **RD 96/2009, de 6 de febrero** (el 502/2020 regula las guardias de seguridad) | RROO BOE |
| 5 | Duplicidad contradictoria | Dos preguntas de RROO con respuestas distintas convivían | Una eliminada por dedup (el banco queda en 1.388) | — |

El error nº1 es el más valioso: llevaba en el banco desde el principio y **ninguna revisión manual lo había visto**. El agente lo cazó por regla.

## Falsos positivos del propio agente (aprendizaje)

En su primer examen marcó 605 incidencias; 598 eran del propio auditor. Ajustes hechos:
- "TODO" en regex casaba con la palabra española "todos" → 581 falsos ESTRUCT
- Las preguntas de **hueco** (`___`) repiten legítimamente palabras del enunciado → FUGA/EQUIV/FORMATO ahora validan la frase con el hueco rellenado
- Preguntas sobre aspectos parciales del examen (35 FM, 5 de reserva) no deben exigir el total (50/100)

Esto queda registrado para que nadie desconfíe del "0 incidencias": es un 0 **después** de afinar el detector y corregir lo real.

## Muestra de verificación humana experta (además de las reglas)

14 preguntas elegidas al azar entre los 3 cursos, verificadas a mano contra fuente:
RROO RD 96/2009 ✓ · LODN LO 5/2005 ✓ · SN Ley 36/2015 ✓ (Congreso) · LO 9/2011 ✓ · teniente general↔almirante general ✓ · G36 5,56×45 OTAN ✓ · PAS ✓ · fonético "M"=Mike ✓ · FINUL Líbano desde 2006 ✓ · ESN 2021 RD 1150/2021 ✓ · art. 42.7 TUE ✓ · Res. 551/04582/26 (I/26 Cabo 1º) ✓ · FC=(NFD+9·NEX)/10 (guía docente CEFOT-1) ✓ · Op. Balmis ✓ — **14/14 correctas**.

## Aviso honesto y estado de la mejora

- La **posición** de la respuesta correcta estaba sesgada a la A (40%) en los bancos antiguos. **RESUELTO (20-sep-2026)**: `app.js` baraja las opciones de cada pregunta una vez por carga (Fisher-Yates sobre los 4 índices + remapeo del índice correcto), antes de servir cualquier vista. Así la distribución real en pantalla es uniforme y la corrección/revisión siguen siendo coherentes porque toda la app lee los mismos objetos barajados.
- Los 8 AVISO-X son explicaciones que explican con otras palabras (p. ej. "dos años" vs "2"): estilo, no error.
- El agente es **determinista** (reglas, no magia): cubre lo estructural y lo normativo-tabular. La redacción y el matiz siguen pasando por revisión humana (ver sample).

*Firma: banco certificado APTO a 20-sep-2026 · próxima auditoría: tras cada nuevo lote.*
