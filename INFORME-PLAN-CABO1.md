# INFORME MAESTRO — PLAN «CABO 1º TEMA A TEMA» · 17/17 COMPLETO (v142 → v158)

Método por tema: resolver los borradores existentes (auditoría vs fuente del alumno, contraste con TODO el pool, gemelas→una, verdad ya servida→retirar, sin literal→descarte) + 10 preguntas nuevas 100% literales con doble pasada (correcta en o[0] + rotación + red maestra de colisiones + canario desde PROD).

| Tema | Versión | Lote | Fuente madre | Antes → Después | Descartes |
|---|---|---|---|---|---|
| 1. Seguridad | v142 | c1s001-010 | RD 194/2010 · OM 50/2011 · RR FF.AA. | 16 → 26 | 16 |
| 2. NBQ | v143 | c1b001-010 | ABR26 NBQ (L4987-5260) · ADRP/EM NBQ | — | — |
| 3. Administración | v144 | c1a001-010 | Convocatoria CB1 2026 (BOD 62) · L39/2007 | — | — |
| 4. Técnicas de mando | v145 | c1m001-010 | Guía docente CB1 2025 (CEFOT) | 6 → 16 | 18 |
| 5. Logística | v146 | c1l001-010 | ABR26 Cap. logística · FD JUL22 SALE | 15 → 25 | 0 |
| 6. Primeros auxilios | v147 | c1x001-010 | TCCC/CoTCCC · ERC/AHA 2025 | 18 → 28 | — |
| 7. Topografía | v148 | c1t001-010 | ABR26 topografía · fe de erratas milésimas | 18 → 28 | — |
| 8. Documentación | v149 | c1d001-010 | Rincón de Tropa · RD 194/2010 · Convocatoria | 13 → 23 | 16 |
| 9. Geografía | v150 | c1g001-010 | ME7-030 (relieve/latitud/pisos) | 12 → 22 | 20 |
| 10. Tiro | v151 | c1r001-010 | Cabo nov-25 Bloque III balística (L8502-8548) | 13 → 23 | 22 |
| 11. Régimen disciplinario | v152 | c1f001-010 | LO 8/2014 (ABR26 Bloque II completo + fe de erratas art. 45) | 12 → 22 | 17 |
| 12. Organización | v153 | c1h001-010 | OM 50/2011 arts. 5-6 · Instrucción 14/2021 (nov-25 Bloque V) | 24 → 34 | 14 |
| 13. Mando y liderazgo | v154 | c1i001-010 | FD JUL22: dinámica de grupos + liderazgo (territorio virgen) | 21 → 31 | 0 |
| 14. Historia | v155 | c1j001-010 | ME7-030 Historia (Prehistoria → 1898) | 12 → 22 | 0 |
| 15. Inglés | v156 | c1k001-010 | ME7-029 (glosario militar + escalafones) | 50 → 60 | 0 |
| 16. El examen | v157 | c1u001-010 | Convocatoria CB1 2026 (bases 2.1.3/2.4/2.5/2.6/3.1.3.2/3.1.4/10/6.5/11.1) | 26 → 36 | 0 |
| 17. Revisión final | v158 | — | Verificación integral desde PROD | — | repesca 0 legítima |

## Verificación integral (v158)

- **Drift local↔PROD: 0** — 2139 preguntas evaluadas en los 57 bancos servidos; 2123 ids únicos; 356 borradores.
- **Cosecha del plan: 160 promovidas** (16 × 10), cada lote con canario 10/10 por claves por id desde PROD.
- **F/M/D global de la cosecha: 50/76/34** (objetivo 30/50/20 ✓) · posiciones A/B/C/D: 38/45/50/27.
- **Bug corregido:** bank22 era copia zombi de bank9 (pe001-016 con posiciones antiguas, pe010 sin el hotfix de trienios) y estaba cableado → des-cableado (app.html, app.js, trivial, sw) y fichero eliminado. Las 16 duplicaciones de id del pool eran exactamente esas.
- **Repo hygiene:** js/sw.js (v73) zombi del repo histórico eliminado; el SW real es /sw.js de raíz.
- **Corrección de inventario:** El examen tenía 26 servidas (c1e001-026), no 28.
- **Errata BOD** (bank29): aplicada en v152 tras 16 versiones («BOD nº 83» → «Convocatoria cb1 2026 (BOD nº 62, 31-mar-2026)»).
- **Repesca: 0 promovidas legítimas** — los 356 borradores restantes son de Permanencia (~280, para su fase) o descartes ya juzgados (gemelas, sin literal en la fuente del alumno).

## Contadores de cierre

- Pool servido: **1843** (por arnés; 2123 ids únicos globales con demo data) · borradores: **356**
- Plan: **320 preguntas promovidas** de las 17 visitas · maratón histórico: **962/1299 · 340 promovidas**
- Commits del plan: v142→v158 (ver PENDIENTES-USUARIO.md B13-B37)

## Pendiente (a orden del usuario)

1. **Permanencia tema a tema** (doble pasada), mismos estándares.
2. **Clases YouTube** (formato por decidir).
3. Tokens por rotar al cerrar: GitHub (rnd_xmw…) y Ko-fi.
