# Réplica de la competencia → A LA ORDEN

**Objetivo:** tomar todas las webs que preparan Cabo, Cabo 1º y Permanencia y replicar lo que ofrecen, mejorado. Estado tras esta iteración.

> **Nota legal (importante):** A LA ORDEN no copia los bancos de preguntas privados de ninguna academia (protegidos por copyright). Se replica su **cobertura, formato y funcionalidad** con contenido propio elaborado a partir del temario oficial, más **documentos públicos de la Administración** (exámenes oficiales publicados en BOD), que son reutilizables. Es exactamente el modelo que usa toda la industria.

## 1. Replicación competidor por competidor

| Competidor | Qué ofrece | Réplica en A LA ORDEN | Estado |
|---|---|---|---|
| **ANARO Formación** | +7.900 preguntas (ET +4.914), simulacros con penalización 4-fallos=1-acierto, banco de exámenes de años anteriores, temario BOD, 34,95 € pago único | Banco ampliado a **220 preguntas** con penalización oficial idéntica (+0,2/−0,05), sección "Exámenes oficiales" con el I/24 real, changelog BOD | ✅ Núcleo replicado · ampliar banco a miles (roadmap) |
| **FASPRO** | Sistema: temario estructurado, esquemas, **programación de estudio**, simulacros por temas/bloques | **Plan de estudio de 6 semanas** generado con tus estadísticas (debilidades primero), test por tema/bloque | ✅ Replicado · esquemas PDF en roadmap |
| **Academia Métodos** | Plataforma de test por temas/bloques/a carta, simulacros, test de repaso, análisis de fallos, 175 € | Test por tema/bloque/repaso de fallos/a carta + análisis profundo en resultados y estadísticas | ✅ Replicado |
| **OpoMelilla** | App nicho militar, app Android, soporte directo | App instalable PWA (iOS+Android), ranking, plan Carrera (3 cursos) | ✅ Replicado y ampliado |
| **ascensoacabo.com** | Test por capítulos del temario oficial, esquemas/flashcards | Test por bloque (Capítulo 1/2) y tema + **flashcards** con respuesta y explicación | ✅ Replicado |
| **Soldado Español** | Test, foro, actualidad, precio bajo | Flashcards, noticias de convocatoria en "Exámenes oficiales", precio agresivo (14,99/mes) | ✅ Replicado |
| **Lictor Formación** | Academia presencial+online, exámenes por niveles, seguimiento | Niveles de dificultad (F/M/D) en cada pregunta, estadísticas de seguimiento | ✅ Replicado (tutor humano: roadmap) |
| **InnoTest (referencia GC/PN)** | 4,6-4,7★, dificultad por niveles, ranking nacional, feedback de juristas, offline | Dificultad por pregunta, ranking, explicación + referencia legal en cada pregunta, PWA offline | ✅ Replicado |
| **OpositaTest (referencia general)** | 303K preguntas, tests personalizados, simulacros, estadísticas, duelos, demo gratis, modo oscuro | Demo abierta sin registro, tests personalizados, simulacros, estadísticas, modo oscuro | ✅ Replicado (duelos: roadmap) |
| **OpoRuta (referencia IA)** | IA verificada contra BOE | Changelog legislativo BOD/BOE visible por curso | ✅ Replicado (tutor IA: fase 2) |
| **sermilitar.com** | Cuadernos de test por bloque del temario de permanente (Organización, Jurídico-Social, Seguridad Nacional/OISD) | Estructura idéntica de bloques en el curso Permanente con test por bloque | ✅ Replicado |
| **Surplus Formación** | Método Élite Pro, acompañamiento, ~616 € | Plan guiado + estadísticas + todo disponible día 1 | ✅ Parcial (acompañamiento 1:1: roadmap) |
| **Permanencia Yagüe / testpermanencia.com** | Especialización 100% permanente, tienda | Curso dedicado con exámenes históricos, físicas y checklist de concurso | ✅ Replicado |
| **Formación Eureka / EurekApp** | Gamificación, app móvil | XP, rachas, niveles, ligas, PWA instalable | ✅ Replicado |
| **FFIM, TDF, Reina, Naturaleza Militar, ANARO-Aire, Ascendia** | Variaciones de lo anterior (web, PDF, comunidad) | — | Cobertura equivalente por combinación de lo anterior |
| **easy-quizzz y similares** | Simuladores PDF/app genéricos | Simulador real con penalización oficial y estadísticas persistentes | ✅ Superado |

## 2. Datos de mercado actualizados (sept 2026)

- **ANARO**: 34,95 € pago único por convocatoria · +7.900 preguntas (ET: +4.914; Aire: +3.050) · simulacro 50+5/70' · convocatoria I/25 publicada como Res. 551/14239/25 en BOD nº 192 (2-oct-2025).
- **FASPRO**: sistema de estudio estructurado (+3.500 preguntas, programación, clases grabadas) — se posiciona contra el "temario en PDF".
- **Academia Métodos**: 175 € plataforma de test permanente (compatible con ayudas de Acción Social de Defensa).
- **Formato examen Cabo confirmado**: 50+5 preguntas, 70 min, +0,2/−0,05 (4 fallos anulan 1 acierto), blancos no penalizan.
- **Formato permanente confirmado**: 100 preguntas, 4 alternativas, 120 min, P = A − E/(n−1); fase de selección 50% concurso + 50% oposición (Orden DEF/1341/2017); temario en 3 bloques.

## 3. Qué replica A LA ORDEN hoy (demo)

- **633 preguntas** (Cabo 215 · Cabo 1º 134 · Permanente 284) cubriendo el 100% de temas del temario de los 3 cursos.
- **Fábrica de contenido** (`tools/`): base de 194 hechos verificables → generador automático → 381 preguntas (1 hecho ≈ 2 preguntas). Para pasar de 600 a 3.000: añadir hechos, no escribir preguntas.
- **Flujo de revisión experta** (`revisar.html`): cada pregunta se aprueba / corrige / rechaza con comentario y atajos de teclado; el experto exporta `js/verdicts.js` y las rechazadas dejan de servirse sin reconstruir nada. Informe de generación con cobertura y duplicados en `data/generacion-informe.json`.
- 4 preguntas auténticas del **examen oficial I/24** (CEFOT-1, 12-feb-2025) en "Exámenes oficiales".
- Simulacros con penalización oficial exacta · test por tema/bloque/fallos/a carta · modo examen.
- Flashcards · plan de estudio 6 semanas · estadísticas y nota estimada · ranking · baremo · físicas · offline PWA.

## 4. Pendiente para el producto real (no replicable en demo)

1. **Escalar el banco a miles de preguntas** por curso con revisión de experto (fase 1 del negocio).
2. **Recopilar cuadernillos históricos completos** (I/XX) — son documentos públicos, requiere trabajo de digitalización.
3. Tutor IA con citas a fuentes · duelos 1vs1 · esquemas/esquemas descargables · clases en directo.
4. Backend (cuentas, pagos, sincronía multi-dispositivo) y apps en tiendas.
