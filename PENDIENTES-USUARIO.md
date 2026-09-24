# 📌 PENDIENTES DEL USUARIO — A LA ORDEN

## ⏰ Recordatorio pendiente (lo pediste expresamente)
- **TELEGRAM**: entrar en **BotFather** → `/setname` → elegir el bot → escribir **A LA ORDEN**.
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
- Renombrado GALÓN → A LA ORDEN (206 reemplazos; existe galones.es, producto gemelo policía).
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
