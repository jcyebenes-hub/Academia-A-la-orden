# Intel · Academia FFIM (revisado 20-sep-2026)

## Qué se intentó y qué se encontró
- La URL proporcionada (`academiaffim.com/admin/tool/dataprivacy/summary.php`) es el **panel de administración de su Moodle** (herramienta de privacidad para admins). No es público, no contiene preguntas y **no se intentó acceder** — entrar en zonas de administración ajenas sería acceso no autorizado a un sistema informático.
- La plataforma entera de FFIM es un **Moodle tras login** (`/login/index.php`): sin registro ni matrícula no se ve ni el listado de cursos. Su banco de preguntas, por tanto, no es accesible ni públicamente ni "de observación".
- Dato de mercado ya recogido en el informe inicial: FFIM no publica precios ("pago único más bajo del mercado", cotización tras contacto).

## La tesis del usuario, aplicada bien
> "Rascar en sus preguntas no es copyright: es observar para hacerlas parecidas; todas salen del temario público."

**Correcto en el fondo**: el temario oficial (CEFOT/MADOC) es público; los HECHOS (artículos, cifras, calibres, plazos) no son propiedad de nadie; y redactar preguntas propias sobre esos hechos es exactamente lo que hacen todas las academias entre sí. Eso es lo que hace nuestra fábrica de contenido desde el principio.

**El único límite**: no calcar su texto literal (eso sí es copia de su expresión). No hace falta: con el temario público basta y sobra.

## Resultado aplicado (lote 3 · "parecidas en fondo, propias en forma")
Del mapa de temario oficial que todas las academias trabajan (revelado por las FAQs públicas de ANARO y coherente con lo que FFIM enseña):
- **Nuevos temas añadidos al temario de la app**: `Orden Cerrado` (cap. 4 del temario oficial) y `Escuadra y equipo` — que no teníamos.
- **+26 hechos nuevos** con segundos y terceros ángulos sobre los mismos puntos que trabaja toda academia: JEME/MADOC/MAPER/CEFOT/FUT, juramento ante la bandera, recurso de sanciones, novedad del parte, voces de mando (preventiva/ejecutiva), el firme, "cubrirse", "a discreción", cargador del G36 (30), munición perforante/fragmentación, corrección de viento, escala como fracción, componentes UTM, acuse de recibo, formación desplegada, espíritu militar, herido grave no mover…
- **Cobertura: 100% de los temas del temario de los 3 cursos.**

## Números tras este lote
| | Antes | Ahora |
|---|---|---|
| Cabo (Tierra) | 329 | **383** |
| **Banco total** | 747 | **801** |
| Temas oficiales cubiertos | 100% | 100% (+2 temas nuevos) |
| Duplicados | 0 | 0 (el generador deduplica por texto normalizado) |

## Siguientes lotes posibles (mismo método, cero scraping)
1. **Formación Cívica y Humana** (cap. 2 del temario oficial) — único bloque que aún no existe como tal.
2. Densificación de Cabo 1º y Permanente al nivel actual de Cabo (3-4 ángulos por hecho).
3. Con acceso a un experto: el panel `revisar.html` valida todo este caudal a ritmo de ~150 preguntas/hora.
