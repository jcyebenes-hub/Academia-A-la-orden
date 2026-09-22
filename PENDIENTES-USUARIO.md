# 📌 PENDIENTES DEL USUARIO — A LA ORDEN

## ⏰ Recordatorio pendiente (lo pediste expresamente)
- **TELEGRAM**: entrar en **BotFather** → `/setname` → elegir el bot → escribir **A LA ORDEN**.
  (El código ya saluda con el nombre nuevo; falta solo el nombre visible en Telegram.)
  → Cuanto antes lo hagas, antes se acabará la confusión con el nombre viejo.

## ✅ HECHO 22-sep: DESPLIEGUE EN RENDER
- App viva en **https://academia-a-la-orden.onrender.com** (plan Free, Frankfurt, autoDeploy).
- Repo de código: github.com/jcyebenes-hub/Academia-A-la-orden · datos en repo privado datos-alaorden.
- Bot de Telegram AHORA vive en Render (el local está apagado: cero conflictos 409).
- Usuario admin recreado en Render: admin@alaorden.es / admin1234.
- Render Free se duerme ~15 min sin visitas → la 1.ª visita tarda ~50 s en despertar.
- CADA PUSH al repo = redesperpliegue automático (así se publican las novedades).

## 🧹 Limpieza de llaves (hazlo cuando quieras)
- REVOCAR: el token fine-grained `github_pat_…` (no se usa ya) → https://github.com/settings/personal-access-tokens
- REVOCAR (más adelante, si quieres): la API key de Render `rnd_…` → https://dashboard.render.com/u/settings
- **NO revocar**: el token clásico `ghp_C2PL…` — está dentro de Render como GITHUB_TOKEN para salvar los datos (si lo revocas, se pierde la persistencia). Algún día lo cambiamos por uno dedicado solo al repo datos-alaorden.

## 💻 Cuando tengas PC
1. **Parar el bot local** (si despliegas en Render o similar, evita el error 409 de Telegram).
2. **PUBLIC_URL propia** (dominio fijo en vez del túnel efímero). `alaorden.es` está LIBRE (~10 €/año, verificado 22-sep-2026).
3. **Ko-fi real**: crear la cuenta siguiendo KOFI-GUIA.md → pasarme la URL → la pongo en `js/donation.js` y se activa todo.
4. **Imágenes de galones** (las que tienes pendientes de hacer/mejorar).
5. Servicios dormidos: Stripe/Redsys siguen apagados a propósito.

## ✅ Hecho estos días (para que no se te olvide lo que ya está)
- Renombrado GALÓN → A LA ORDEN (206 reemplazos; existe galones.es, producto gemelo policía).
- Selector de curso «¿Qué preparas hoy?» ANTES de entrar (tiles, fin de la ruleta).
- Navegador de preguntas con líneas verde/roja en todos los tests.
- Lote examinador COMPLETO: 17 temas · 850 preguntas · 17 cuadernos PDF.
- 🎡 TRIVIAL DE LA TROPA: ruleta 6 quesitos, solitario y por código (URL 10ª: demand-readings-participate-elimination).
