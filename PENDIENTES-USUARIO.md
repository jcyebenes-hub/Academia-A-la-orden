# 📌 PENDIENTES DEL USUARIO — MICABO

## ⏰ Recordatorio pendiente (lo pediste expresamente)
- **TELEGRAM**: entrar en **BotFather** → `/setname` → elegir el bot → escribir **MICABO**.
  (El código ya saluda con el nombre nuevo; falta solo el nombre visible en Telegram.)
  → Cuanto antes lo hagas, antes se acabará la confusión con el nombre viejo.

## ✅ HECHO 22-sep: DESPLIEGUE EN RENDER
- App viva en **https://micabo.es** (plan Free, Frankfurt, autoDeploy).
- Repo de código: github.com/jcyebenes-hub/Academia-A-la-orden · datos en repo privado datos-alaorden.
- Bot de Telegram AHORA vive en Render (el local está apagado: cero conflictos 409).
- Usuario admin CREADO Y PERSISTENTE en Render: admin@alaorden.es / admin1234.
- ✅ PERSISTENCIA VERIFICADA de punta a punta: datos → bundle en repo privado datos-alaorden (cada 2 min y al parar) → restauración al arrancar. Admin sobrevivió a un reinicio forzado (probado).
- Arreglado en el camino: las variables de entorno van por endpoint dedicado /env-vars (el PATCH las ignoraba); SIGTERM ahora con 10 s de gracia para el volcado.
- Render Free se duerme ~15 min sin visitas → la 1.ª visita tarda ~50 s en despertar.
- CADA PUSH al repo = redesperpliegue automático (así se publican las novedades).

## 🧹 Limpieza de llaves (hazlo cuando quieras)
- REVOCAR: el token fine-grained `github_pat_…` (no se usa ya) → https://github.com/settings/personal-access-tokens
- REVOCAR (más adelante, si quieres): la API key de Render `rnd_…` → https://dashboard.render.com/u/settings
- **NO revocar**: el token clásico `ghp_C2PL…` — está dentro de Render como GITHUB_TOKEN para salvar los datos (si lo revocas, se pierde la persistencia). Algún día lo cambiamos por uno dedicado solo al repo datos-alaorden.

## 💻 Cuando tengas PC
1. **Parar el bot local** (si despliegas en Render o similar, evita el error 409 de Telegram).
2. **DOMINIO PROPIO: micabo.es** (decisión 24-sep-2026; alaorden.es resultó aparcado por Arsys). Estado: registrado en Render (micabo.es + www, IDs cdm-daqpgfjncjis739il1ag / -l1b0), referencias ya cambiadas a https://micabo.es. PENDIENTE DEL USUARIO: comprar micabo.es en Strato (~1 €/año) y crear DNS: A @ 216.24.57.1 · CNAME www → academia-a-la-orden.onrender.com. Tras el DNS: Verify en Render → SSL automático → PUBLIC_URL ya en micabo.es. La URL onrender.com sigue funcionando como puerta trasera.
3. **Ko-fi real**: crear la cuenta siguiendo KOFI-GUIA.md → pasarme la URL → la pongo en `js/donation.js` y se activa todo.
4. **Imágenes de galones** (las que tienes pendientes de hacer/mejorar).
5. Servicios dormidos: Stripe/Redsys siguen apagados a propósito.

## ✅ Hecho estos días (para que no se te olvide lo que ya está)
- Renombrado GALÓN → MICABO (206 reemplazos; existe galones.es, producto gemelo policía).
- Selector de curso «¿Qué preparas hoy?» ANTES de entrar (tiles, fin de la ruleta).
- Navegador de preguntas con líneas verde/roja en todos los tests.
- Lote examinador COMPLETO: 17 temas · 850 preguntas · 17 cuadernos PDF.
- 🎡 TRIVIAL DE LA TROPA: ruleta 6 quesitos, solitario y por código (URL 10ª: demand-readings-participate-elimination).

- LOTES DE PREGUNTAS por bloque oficial (v73 trajo temario + dossiers): prioridad Bloque II Seguridad FAS/régimen interior (solo 2 preguntas) y Bloque VII Liderazgo (3). El usuario propuso ir tema a tema.

- VALIDACIÓN DE BORRADORES: 1.299 preguntas del generador (bank5/QUESTIONS6) fuera de juego desde v82 hasta validarlas en revisar.html por lotes; 646 tenían explicación-eco. Curadas en juego: 1.095 — cabo1 (~40) y perm (~71) necesitan lotes propios URGENTE.

- LOTE 1 CABO 1º HECHO (v83): 54 curadas propias (Disciplinario 12, Documentación 10, Mando/Liderazgo 10, Tiro 10, Topografía 6, Organización 6) → Cabo 1º: 110 curadas. LOTE 2 propuesto: Geografía + Historia + Inglés + primeros auxilios/NBQ (pools aún 0 en el trivial de cabo1).

- LOTE 1 PERMANENCIA HECHO (v84): 58 curadas propias (Situaciones 5, Carrera militar 7, Tropa 4, Seguridad Nacional 4, ESN 5 — incluida la pregunta del contexto geopolítico que cayó al amigo en Moodle—, Doctrina 4, UE 5, OTAN 4, ONU 3, OSCE 3, Misiones 6, Físicas 3, Convocatoria 3, FAS 2) → Permanencia: 159 curadas. Sigue: LOTE 2 CABO 1º (Geografía, Historia, Inglés, Primeros auxilios/NBQ).

- LOTE 2 PERMANENCIA HECHO (v85): 40 curadas (Constitución +10 →22, Defensa Nacional +8 →15, MINISDEF +6 →12, El examen +4 →9, Físicas/Convocatoria/Doctrina/Misiones/Carrera/FAS +2 cada uno) → Permanencia: 199 curadas. Quedan finos solo: Derechos y deberes (6) y OSCE (6). Tras esto: LOTE 2 CABO 1º (Geografía, Historia, Inglés, Primeros auxilios/NBQ).

- LOTE 2 CABO 1º HECHO (v86): 45 curadas (Geografía 12, Historia 12, Inglés +8 →16, Primeros auxilios 8, NBQ 5) → Cabo 1º: 155 curadas · syllabus B1 con Primeros auxilios/NBQ añadidos · trivial cabo1 pools [13,13,7,9,0,14] (solo Transmisiones a 0). Siguiente remesa posible: Transmisiones cabo1 + Derechos y deberes/OSCE perm + validación de borradores.

- LOTE OFICIAL 1 DESDE LA TEORÍA DEL USUARIO (v88): 24 curadas citando los documentos oficiales (Tema 5 OSCE OISD + LO 9/2011 Tema 3) → Permanencia: 223 · TODOS los temas ≥7. La teoría oficial (49 PDFs, 4,6 MB texto) vive en /home/user/teoria-txt/ · 3 PDFs escaneados sin OCR pendientes (Tema 1 Reg Personal, Tema 6 LO 3/2007, resolución UCOS).

- BIBLIOTECA OFICIAL en Temario (v91): los 49 PDFs del Rincón de Tropa servidos desde /pdf/temarios/ (97 MB) con 📖 consultar y ⬇️ descargar, agrupados por curso y materia (2.171 págs). SW v91: los PDF no se cachean (pesan).

- DISEÑO v2 (sw v92): capa moderna sobre la identidad verde/oro — dock inferior flotante de cristal con pestaña activa en píldora dorada, iconos SVG de trazo (fin de emojis en la barra), escudo de la landing en la cabecera con MICABO en oro degradado, fondos con brillo ambiental, tarjetas/botones con profundidad y presión táctil, animación de entrada de vistas, scrollbars finos. Limpieza de workspace: fuera cloudflared (38MB), social duplicado y zip viejo (124→41 MB); los 49 PDFs de temarios viven SOLO en GitHub/Render (no copiarlos al workspace).

- FIX TRIVIAL v94: captura perezosa del puente AO (el módulo cargaba antes que app.js → pools vacíos → «Sin preguntas disponibles») + red de seguridad. Bump trivial.js?v=94 y CACHE v94 para que la caché no tape el arreglo.

- v97: CAUSA RAÍZ de las actualizaciones lentas arreglada — el servidor cacheaba sw.js 1 hora; ahora no-cache (revalida siempre). PORTERO DE LOGIN: abrir cualquier curso sin sesión lleva a Entrar/Crear cuenta (tras login, vuelve la ventana de cursos automáticamente).

- v98: LOTE OFICIAL 2 — 16 preguntas de INGLÉS de Cabo 1º desde el ME7-029 (escuadra/sección/grupo táctico, full corporal, drill parade, fall in…): Inglés 14→30. Tarjeta destacada 🇬🇧 en Entrenar (solo Cabo 1º) + tema Inglés en Por tema/B2. BIBLIOTECA reordenada como la carpeta original: grupos con nombre real (Convocatoria y trámites, Temario a distancia (oficial), OISD, Jurídico-Social…), 43 títulos legibles, tamaño en MB/KB por documento.

- v99: UNIFICACIÓN — la vista Biblioteca (#/biblio, desde Más o Entrenar) es ahora EL hub de descargas: temarios oficiales del Rincón de Tropa ordenados (49 docs) + cuadernos MICABO + fuentes BOE. VERSIÓN VISIBLE: badge «v99» en la biblioteca y «MICABO v99» en Ajustes (window.APPV) — para verificar de un vistazo qué build tiene cada uno.

- CAMPAÑA TEMA A TEMA (v100): Lote 3 = Cabo · Bloque I · Tema 1 «Disposiciones Generales» (RD 96/2009 arts. 1-13): 16 curadas estilo examen real desde el temario oficial nov-2025 → RROO cabo +16. Mapa oficial: Cap1 Bloques I-VII + Cap2 táctica/topo/armamento. Siguiente: Tema 2 «Del Militar».

- CAMPAÑA (v101): Lote 4 = Cabo · Bloque I · Tema 2 «Del Militar» (arts. 14-23 + 32/38): 16 curadas (espíritu militar, virtudes del 17, justicia del 18, ambición honrada, tradición, prestigio, conducto reglamentario) → Cabo 922→938. Fix erratas bank13 (corveo/intendencia). Siguiente: Tema 3 «De la Disciplina».

- CAMPAÑA (v102): Lote 5 = Cabo · Bloque I · Tema 3 «De la Disciplina» (arts. 44-52) con MÉTODO NUEVO de doble pasada (redacción + auditoría automática contra el texto fuente: detectó sesgo de longitud 9/10 y distribución 2/6/2 → corregidos). JSON de entrega en lotes/lote5-tema3-disciplina.json. 10 preg (3F/5M/2D) → Cabo 938→948. Nota: el temario salta el art. 48. Siguiente: Tema 4 «De la Acción del Mando» (arts. 53-77).

- CAMPAÑA (v103): Lote 6 = Cabo · Bloque I · Tema 4 «De la Acción del Mando» (arts. 53-77): 16 curadas (5F/8M/3D) con doble pasada — auditoría 1ª detectó sesgo de longitud 11/16 → rebalanceado a 3/16. JSON en lotes/lote6-tema4-mando.json. Cabo 948→964. Siguiente: Tema 5 «De las Operaciones».

- CAMPAÑA (v104): Lote 7 = Cabo · Bloque I · Tema 5 «De las Operaciones» (arts. 83-103): 11 curadas (3F/5M/3D) — CIERRA LAS RROO (Bloque I completo: T1-T5). Auditoría: sesgo longitud 10/11 → 1/11, posiciones A:8 → A3/B3/C3/D2 (pads + barajado automático). JSON lotes/lote7-tema5-operaciones.json. Cabo 964→975. Siguiente: Bloque II (Seguridad FAS, RD 194/2010).

- v105: REGISTRO REAL CON CURSO — el form de registro elige qué estudiar (Cabo/Cabo 1º/Permanente), se guarda en la CUENTA (server: users.curso + publicUser) y al hacer login desde cualquier dispositivo la app se fija en ese curso. /api/curso (auth) para cambiarlo; cambiar curso con sesión en la app lo actualiza en el servidor. Probado en arnés + E2E real tras deploy.

- v105-fix (9df3334): /api/curso devolvía «Error interno» (usaba u.uid; u ya ES el user → clave .id). Hotfix desplegado y re-verificado E2E real: registro guarda curso (perm) ✓ → cambio a cabo1 ✓ → login en «otro dispositivo» conserva cabo1 ✓ → /api/me ✓ → «hacker» rechazado ✓ → sin sesión rechazado ✓ → admin/PDF 200 ✓ → cuenta QA borrada. PENDIENTE: window.APPV sigue «99» → bump a 106 con la próxima release (Bloque II).

- v106: (1) LOTE 8 — Cabo · Bloque II · T1 «Normas de seguridad en las FAS» (RD 194/2010, arts. 2-32): 18 curadas rt070-rt087 (bank19, t:"Seguridad en las FAS"), 6F/8M/4D, posiciones A4/B6/C5/D3, sesgo longitud 16/18→5/18 (3 pasadas de pads). JSON lotes/lote8-bloque2-t1-seguridad-rd194.json. Cabo 975→993. Siguiente: T2 OM 50/2011 Mando y Régimen Interior (@913-1009). (2) LOGIN/REGISTRO REDISEÑADOS (tarjeta cristal, logo MICABO, campos con icono, ojito mostrar/ocultar, tarjetas de curso seleccionables). (3) GOOGLE SIGN-IN implementado de punta a punta (server /api/google verifica firma JWT contra JWKS de Google + POST /api/google público; cliente monta botón GIS si hay client_id) — PENDIENTE: usuario debe crear OAuth Client ID en Google Cloud Console y definir env var GOOGLE_CLIENT_ID en Render (o dármelo). (4) APPV 99→106 (3 releases sin bump) + CACHE sw v106.

- v107: SARGENTO MICABO — chat de ayuda flotante 🎖️ (js/chat.js) + POST /api/chat: corpus local con las 2.718 preguntas del banco y sus justificaciones; FAQ (contacto/dinero/convocatoria), búsqueda por id (rt0NN) y por palabras completas con umbral (prefiere callar antes que inventar); límite 25/día/IP. CON GEMINI_API_KEY (env, modelo GEMINI_MODEL, def. gemini-2.5-flash; free tier ~10 RPM/250-500 RPD) la IA redacta la respuesta SOLO con el material recuperado (RAG); sin clave funciona en modo local. PENDIENTE: usuario decide si crea API key gratuita en aistudio.google.com → env GEMINI_API_KEY (o me la pasa); WhatsApp del proyecto cuando tenga número → env WHATSAPP_NUMBER (aparece wa.me en el chat y en /api/config.wa). APPV 107 + CACHE v107.

- v108: FIX EXÁMENES OFICIALES — vExams filtraba por curso del usuario y en Cabo 1º/Permanente la lista salía VACÍA (sin botón: «no me deja entrar»). Ahora los históricos se muestran a todos los cursos (aviso «examen de ascenso a Cabo» si el curso difiere) y el título es SOLO el mes/año de celebración («Febrero 2025», I/24 celebrado 12-feb-2025, CEFOT-1). 20/20 preguntas re-verificadas: fuente «Examen oficial I/24» + formato correcto. APPV 108 + CACHE v108.

- v109: NUEVA CAMPAÑA — CABO 1º y PERMANENCIA tema a tema (usuario: «tenemos muy pocas»). Inventario: cabo1 572 (NBQ solo 5, Primeros auxilios 8), perm 677 (El examen 19, ESN 21, SN 21, Físicas 21). LOTE 9 = cabo1 · NBQ (temario Cap. 2 @4619: NPI/COLPRO, niveles Cero-Foxtrot, máscara M6-87, filtros, colocación 9 s) → bank20, ids c1n001-016, b:"B2", 5F/8M/3D, sesgo 10→7→2/16, A4/B4/C4/D4. LOTE 10 = perm · Seguridad Nacional (Ley 36/2015 arts. 1-26, BOE-A-2015-10389 consolidado; ¡OJO: 10485 era otro doc!) → bank21, ids ps001-016, b:"B3", 5F/8M/3D, sesgo 12→11→5/16. Cabo1 588 · Perm 693. Siguientes temas finos: cabo1 Primeros auxilios (8, sin fuente en temario — usar cuaderno MICABO/manual), perm El examen (19) y Físicas (21). APPV 109 + CACHE v109.

- DESCUBRIMIENTO teoria-txt: hay temarios oficiales por tema de PERMANENCIA (Tropa Permanente__…: ESN 2022, OTAN, OSCE, UE, Misiones, Jurídico-Social T1-T8, Organización, CONVOCATORIA + O_DEF/1341/2017) y de CABO 1º (Temario completo act. abril 2026, Geografía e Historia ME7-030, Informática, Formación común JUL22). Usar como FUENTE primaria de los próximos lotes de la campaña cabo1/perm.

- v110: LOTE 11 — perm · El examen (19→35): 16 curadas pe001-016 (bank22, b:"B1"), TODAS de fuentes oficiales leídas: Res. 452/08724/26 (BOD nº 116, 17-jun-2026: 120 min, copiar→0, media−1σ, no presentarse→eliminación salvo art. 18, reservas a criterio del órgano, corte normativo 1-sep-2026, 20 días naturales, 1.000 plazas, apto OM 54/2014, anexo III) y O. DEF/1341/2017 (arts. 4-6: concurso valora 3 cosas, 3 decimales/milésima, final 200 pts, «n»=opciones como solución). Sesgo 7/16→4/16, A4/B4/C4/D4, 5F/8M/3D. NOTA: cabo1 · Primeros auxilios SIN fuente sólida en teoria-txt (solo menciones contextuales) → NO inventar; alternativa: manual PA militar vía web o saltar a Organización (cabo1, temario abr-2026). Físicas (perm) tiene OM 54/2014 pendiente de leer. APPV 110 + CACHE v110.

- v111: LOTE 12 — cabo1 · Organización: el pelotón de fusiles (24→40): 16 curadas c1p001-016 (bank23, b:"B1") del temario oficial Cabo 1º abr-2026 Cap. 2 Bloques I-II (composición: mando sargento/cabo 1º + 2 escuadras homogéneas + conductores + AMP; desembarcado/embarcado; características y posibilidades; misiones de jefe de pelotón/sucesión de mando/jefes de escuadra disciplina de fuego/FA/AMP/conductores). NUEVO CORRECTOR DINÁMICO de sesgo (colas militares a distractores hasta igualar) → 13/16 → 0/16 en un pase. A4/B4/C4/D4, 5F/8M/3D. Total global 2.766. Próximos: perm · Físicas (21, OM 54/2014 por leer), cabo1 Organización puede crecer más (armamento dotación tipo: 8 FUSA 1,5x + 3 FUSA 3x + 2 FA + 2 LG 40mm + 1 AML + 1 pistola; C-90 y granadas = munición — gemas anotadas), perm ESN (21, temario propio T1 en teoria-txt). APPV 111 + CACHE v111.

- v112: LOTE 13 — perm · Físicas (21→37): 16 curadas pfi001-016 (bank24, b:"B3") de la OM 54/2014, DE 11 DE NOVIEMBRE (ojo: no 16 de mayo; citada expresamente por la Convocatoria 2026 para el «apto») + art. 8 (3 h semanales, acto de servicio, verificada vía O. DEF/738/2024 BOE). OM 54/2014 NO está en teoria-txt (mi afirmación anterior era errónea; fuente = texto BOD citado literal en reservistasjaen + cruces BOE). Contenido: art. 3 (fuerza=2 pruebas, resistencia 2000/6000, CAV <45), art. 4 (20 puntos/prueba, Anexo II), ejecuciones literales (barbilla almohadilla 10 cm, un descanso «tierra», segunda parada=fin, abdominales 3 min desde 1ª repetición, CAV 16 m/7 conos/pelota tenis/salida sentada a la espalda/una salida falsa, pecho cruza línea). CORRECCIÓN DE BUG DE PROCESO: el pulir() no escribía el archivo (pads perdidos) → detectado por re-auditoría 11/16 y rehecho → 0/16 FINAL. Físicas 37, perm 709, global 2.782. Próximos: perm · ESN (21, temario propio T1 ESN 2022 en carpeta), cabo1 Organización armamento (dotación tipo anotada). APPV 112 + CACHE v112.

- v113: MEJORAS SARGENTO (a raíz de prueba real del usuario: «Dime el temario de cabo y como entro?» → fallback). (1) FAQ temario por curso: cabo (2 capítulos con % y materias), cabo1 (oposición+a distancia+presencial), perm (3 bloques Anexo III) + ruta real de entrada; el cliente manda el curso seleccionado (AO.stateRef().course) y el server usa b.curso o el de la sesión; guard para no robar preguntas normativas con la palabra «temario». (2) FALLBACK con escalado WhatsApp: si WHATSAPP_NUMBER → texto con wa.me?text=<duda pre-rellenada>; si no → mensaje mejorado. (3) BUG: vista #/temario (vTemario) estaba HUÉRFANA (cero enlaces) → nueva entrada: tile 📖 en menú entrenar + TICKS rotativo. PENDIENTE SIGUE: usuario aún no da WHATSAPP_NUMBER ni GOOGLE_CLIENT_ID ni GEMINI_API_KEY. APPV 113 + CACHE v113.

- v114 (solo marketing, sin tocar app): LANZAMIENTO DE PUBLICIDAD — marketing/PLAN-MEDIOS.md (6 medios por retorno: WhatsApp → Telegram → Foro Rincón de Tropa → TikTok/Reels → FB grupos → Reddit; NO pautar de pago aún; calendario 4 semanas; KPIs: 50 users/4 sem, fundadores <80, 10 duelos/sem) + KIT-COPY.md (6 piezas listas: difusión WhatsApp x2, Telegram, hilo foro, 3 guiones TikTok, post FB, reto duelo, firmas + momentos de temporada) + img/ (4 creativos revisados: banner-cabo, story-fundador «SOLO 100/quedan 98», banner-duelos, banner-examen «¿Aprobarías el examen real?»). FOMO 100% verdadero: quedan 98/100 FUNDADOR (real /api/config), fecha bases otoño-2026, ranking real sin bots. ACCIONES DEL USUARIO ESTA SEMANA: estado WhatsApp + grupos (D1), hilo foro (D2), 2-3 grupos Telegram (D3), grabar V1 (D4), 2 grupos FB (D5), 5 duelos (D6).

- v114: APOYA TRANSPARENTE — (1) tabla COSTES REALES año normal (Render 0 € / Strato ~10-15 € / Resend 0 € / Gemini 0 € / SIM WhatsApp ~30 € → TOTAL ~40-45 €/año, meta anual 40 € vía GALON_DONATE.annualGoal; compromiso mensual "lo que entra y lo que sale" por Telegram). (2) BIZUM PÚBLICO [Bizum del titular — oculto desde v115] (donation.js bizumNum/bizumRaw; tarjeta "Cómo apoyar" con botón copiar al portapapeles + justificante→Telegram→muro; Ko-fi cuando exista se añade como botón secundario). (3) ACCIÓN SOCIAL: excedente sobre ~40 €/año se dona a causa militar votada por la comunidad cada trimestre (ejemplo real citado: Cruz Roja Española · Consejo Militar), justificantes publicados; NO inventadas otras entidades. (4) chatFAQ.dinero actualizada con Bizum + costes + FUNDADOR. APPV 114 + CACHE v114. NOTA: el número Bizum queda PÚBLICO en la web (intencionado, lo pidió el usuario).

- v115: BIZUM DISCRETO (petición del usuario: «que no salga mi móvil, solo el botón») — donation.js: bizumNum="" y bizumRaw solo para el botón copiar (prohibido pintarlo en UI); tarjeta «Cómo apoyar» sin dígitos («pulsa el botón y se te copia el número», concepto MICABO); toast del botón sin dígitos; chatFAQ.dinero: «botón que copia el número de Bizum», sin dígitos. PENDIENTES: número de v114 enmascarado por si el repo es público. OJO: el número sigue en el código fuente de js/donation.js (el botón lo necesita en el cliente); si se quiere ocultar del todo → endpoint /api/bizum. + marketing/EMAIL-OUTREACH.md: kit de email honesto (regla LSSI anti-spam, 5 canales legítimos sin raspear, correo 1 personal, correo 2 academias B2B, respuesta rápida, plan opt-in con Brevo/Mailrelay; envío en frío con la cuenta del usuario = NO recomendado: spam ilegal + IP datacenter → spam folder).

- v116: CONTACTO — email del proyecto academiamicabo@hotmail.com cableado en: card «Cómo apoyar» (mailto), pie de vista (firma con APPV), chat «hablar con vosotros» y fallback de desconocidas (server.js), legal/privacidad.html y terminos.html (sustituye los falsos privacidad@galon.app y hola@galon.app; quedan placeholders [RAZÓN SOCIAL]/[CIF]/[DIRECCIÓN] a decisión del usuario), KIT-COPY (línea de contacto) y EMAIL-OUTREACH (firma correo 2 + nota de contraseña de aplicación para Brevo). APPV 116 + CACHE v116.
