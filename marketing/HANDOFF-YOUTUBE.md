# HANDOFF · Proyecto YouTube MICABO (para arrancar en un agente NUEVO)

> Este workspace (el de la app) NO viaja al otro agente: cada conversación empieza con su propio
> workspace vacío. Lo que el nuevo agente necesite hay que SUBÍRSELE como ficheros. Este documento
> es el manual de arranque: prompt de inicio + checklist + reglas + credenciales.

---

## 1 · FICHEROS QUE HAY QUE SUBIRLE AL NUEVO AGENTE (checklist)

| Fichero (desde este workspace) | Para qué |
|---|---|
| `teoria-txt/Cabo__TEMARIO CURSO CABO ACT NOV 2025.txt` | Fuente de verdad del guion (subir 1 tema o el completo al empezar) |
| Resto de txt que toque (convocatorias, etc.) | Solo si el vídeo lo requiere |
| `galon/icon.png` | Logo MC circular para intro, diapos y miniatura |
| `marketing/POST-IG-MAMAS.md` *(opcional)* | Referencia de tono/marca |

Truco: subir solo el material de la sesión (un tema = una sesión). El agente rinde mejor con poco contexto y fuente clara.

---

## 2 · PROMPT DE ARRANQUE (copiar/pegar en el nuevo agente, en el primer mensaje)

```
CONTEXTO: Soy militar de tropa español y creador de MICABO, una academia online 100% GRATIS para
preparar el ascenso a Cabo del Ejército de Tierra (app: academia-a-la-orden.onrender.com · marca:
MICABO, verde militar y oro · contacto: academiamicabo@hotmail.com · IG/YT: @academiamicabo).
Principios del proyecto: verdad radical (cifras reales, nada inflado), trato de tú, tono militar
cercano (a la comunidad le llamamos «la tropa»), cero humo.

TAREA: crear la serie de vídeos de YouTube con las clases del temario oficial de ascenso a Cabo,
tema a tema. De CADA vídeo producirás 5 entregables en el workspace:
1) guion hablado (español de España, tú, 5-8 min ≈ 700-1.000 palabras: gancho, esquema, cierre
   con llamada a la app y a la comunidad);
2) diapositivas (HTML/SVG o PPTX: verde militar/oro, iconos grandes, poco texto);
3) miniatura 1280x720 (si la generas con IA: SIN texto dentro — el titular lo pongo yo en Canva);
4) subtítulos .srt con tiempos;
5) metadatos YouTube: título ≤100 caracteres con palabra clave, descripción con capítulos (00:00…),
   5-8 hashtags y enlace a la app.

FUENTE DE VERDAD: SOLO el temario oficial que te subiré en cada sesión (fichero .txt). NO inventes
normas, artículos, fechas ni datos. Si algo no está en el material, márcalo «pendiente de verificar».
Fechas/convocatorias SOLO las que yo te dé en el chat.

DATOS VIGENTES (oct-2026): convocatoria I/26 de ascenso a Cabo publicada (BOD nº 178, 11-sep-2026);
plazo de solicitudes CERRADO el 26-sep-2026; fecha y sede del examen PENDIENTES de publicar.
Examen: 50 preguntas + 5 de reserva, 70 min; corrección NO = (0,2 × aciertos) − (0,05 × errores).
Nota de corte I/25: 4.335. El banco de la app supera las 1.900 preguntas («+1.900», sin cifra exacta
salvo que yo la confirme).

PERSISTENCIA: guarda TODO en el workspace con esta estructura para que no se pierda nada entre
sesiones: /youtube/INFORME-YOUTUBE.md (log de decisiones y estado), /youtube/guiones/,
/youtube/diapositivas/, /youtube/miniaturas/, /youtube/srt/, /youtube/metadata.md.

REGLAS: sin música ni material de terceros sin licencia; si usas voz TTS, dímelo antes; miniaturas
sin rostros de niños ni logos de terceros (tampoco Mamás en Acción sin permiso expreso); el temario
es material privado del curso: no volcarlo íntegro en descripciones públicas, solo guion adaptado.

EMPIEZA: proponerme el plan de la temporada (orden de temas según el temario que te subo) y escribir
el guion completo del VÍDEO 0: «La convocatoria I/26 de ascenso a Cabo: lo que tienes que saber
ahora» (3-4 min, gancho: el plazo ya se cerró / qué viene ahora).
```

---

## 3 · CLAVES DE CONTENIDO (las que viajan dentro del prompt, resumen)

- **Examen real**: 50+5 preguntas, 70 min, blancas no penalizan, fórmula NO=(0,2×A)−(0,05×E).
- **Corte I/25**: 4.335 (I/24: 4.390). Título solo mes/año; exámenes oficiales cross-curso.
- **Convocatoria I/26**: BOD nº 178 (11-sep-2026) · plazo cerrado 26-sep-2026 · examen pendiente de citación.
- **Pool de la app**: +1.900 preguntas verificables · gratis siempre · insignia FUNDADOR (quedan 98).
- **Causa social**: Mamás en Acción (15 € = 1 día) — mención SOLO como «destino del excedente» hasta tener su permiso por escrito (email enviado 7-oct-2026, a la espera).

## 4 · REGLAS DE MARCA (no negociables)

- Marca **MICABO** (nunca «Acaalaorden» ni mezclas). Verde militar `#1d2a21/#f3efe3` + oro `#e3b23a`.
- Tono: de tú, militar cercano, orgullo sin petulancia; «la tropa», «compis».
- Cifras REALES siempre; FOMO solo verdad; sin bots ni métricas infladas.
- Sin niños en imágenes (imagen + RGPD). Sin logos de terceros sin permiso.
- El temario es material privado: guion adaptado, no volcado íntegro público.

## 5 · CREDENCIALES / CLAVES (importante, seguridad)

- **Subir vídeos**: lo más simple y seguro es que el USER suba manualmente a YouTube (studio.youtube.com).
  Automatizar solo si va a haber volumen: proyecto en Google Cloud → habilitar **YouTube Data API v3** →
  OAuth 2.0 (cliente de escritorio) → el nuevo agente te pedirá el token. **NUNCA pegues el secreto en
  un chat** sin necesidad; si se pega, revocar/rotar al terminar (mismo hábito que con Render/Ko-fi).
- **TTS (locución)**: opciones gratis/comfortables: ElevenLabs (cupo gratis), Gemini TTS, edge-tts
  (gratis, local). El agente puede generar el audio si tiene la clave; o el user graba su propia voz
  (mejor para conexión con la tropa — recomendado para el vídeo 0).
- **Miniaturas**: generar arte SIN TEXTO con IA y titular en Canva (el texto IA siempre se rompe).
- **Enlace en descripción**: `https://academia-a-la-orden.onrender.com` (cambiar a micabo.es cuando el
  dominio apunte) + Ko-fi `ko-fi.com/academiamicabo` + IG `@academiamicabo`.

## 6 · PIPELINE RECOMENDADO POR VÍDEO

1. Elegir tema → subir su txt al nuevo agente.
2. Guion (entregable 1) → revisión del user (1 pasada: «esto no lo digo así»).
3. Voz: grabación del user O TTS → audio final.
4. Diapositivas (entregable 2) → grabar pantalla leyendo (OBS, gratis).
5. Miniatura (entregable 3) + titular en Canva.
6. .srt (entregable 4) → YouTube los importa y corrige a medias solos.
7. Metadatos (entregable 5) → subir → añadir a la playlist del bloque.
8. Apuntar el estado en /youtube/INFORME-YOUTUBE.md (para la siguiente sesión).

## 7 · PUENTE CON ESTE AGENTE (el de la app)

- Cuando existan vídeos: pasarme las URLs y los enlazo en la app (biblioteca/panel «Vídeos»).
- Todo lo que el otro agente produzca vive en SU workspace: si quieres que algo llegue aquí
  (un guion, una miniatura), descárgalo allí y súbelo aquí.
- Este agente sigue siendo el del código/banco/marketing: PENDIENTES registra que YouTube va por separado.

## 8 · ESTADO DEL PROYECTO AL CORTAR (7-oct-2026)

- App: v186 LIVE (chat convocatorias arreglado) · pool +1.900 · bank5 28 · TEMA 2 cerrado.
- Social: Mamás en Acción causa designada (v185) · email de cortesía ENVIADO (a la espera) ·
  post IG preparado en marketing/POST-IG-MAMAS.md (lo publica el user).
- Pendientes app: fecha/sede examen I/26 cuando salga en el BOD · contador impacto (1ª donación) ·
  rotar tokens Render/Ko-fi · errata c1o001 (LO 8/2014: 4-dic-2014).
