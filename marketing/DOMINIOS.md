# DOMINIOS para MICABO · gratis de verdad vs baratos (verificado oct-2026)

## Lo primero: .app NO es gratis
El TLD **.app** es de Google Registry y se paga (~10-15 €/año en Porkbun/Cloudflare/Strato).
Los dominios gratis clásicos (.tk, .ml, .ga, .cf, .gq de Freenom) **murieron en 2024** — no usar.

## Opciones reales HOY

### Opción 0 · La que ya tienes (RECOMENDADA, coste 0 extra)
**micabo.es** ya lo pagas en Strato (~10 €/año). Es el dominio más serio para la marca.
- En Strato (panel DNS): crear CNAME `www` → `academia-a-la-orden.onrender.com`
  y redirección/ALIAS del dominio raíz → misma URL (Strato lo hace con su "redirección enmascarada" NO: mejor A record; Render usa CNAME/flattening).
- En Render → tu servicio → Settings → Custom Domains → añadir `micabo.es` y `www.micabo.es`.
- Render emite el **certificado SSL gratis solo**. Yo puedo hacer el lado Render por API cuando me digas.
- Propina: en Strato se puede activar también el correo micabo.es (email propio del proyecto).

### Opción 1 · GRATIS y seria → micabo.eu.org
- Registro en **nic.eu.org** (organización sin ánimo de lucro desde 1996, dominio de 2º nivel real, nunca caduca).
- Contras: aprobación MANUAL (1-14 días, a veces hasta ~2 meses) y te piden 2 nameservers externos
  (se pueden poner los de Cloudflare gratis o deSEC.io gratis).
- Paso a paso: ① darse de alta en nic.eu.org · ② pedir "micabo.eu.org" · ③ al aprobar, darles los NS
  · ④ crear el registro CNAME `micabo.eu.org → academia-a-la-orden.onrender.com` · ⑤ añadirlo en Render.
- Aspecto: `micabo.eu.org` — serio, europeo, y "eu" hasta pega con la casa.

### Opción 2 · GRATIS y rápida (24-72 h) → micabo.is-a.dev
- Comunidad de desarrolladores: se pide por **Pull Request en GitHub** (sabes hacerlo; yo te preparo el PR).
- Solo CNAME (vale para Render) · SSL gratis · nunca caduca · aspecto dev-friendly: `micabo.is-a.dev`.
- Contras: es un subdominio ajeno ("is-a.dev" no es tu marca) y si la comunidad desaparece, el dominio muere.

### Opción 3 · Si te enamora el .app
- **micabo.app** o similar: ~10-15 €/año (Porkbun suele ser lo más barato; Strato también lo vende).
- Nota técnica: .app fuerza HTTPS siempre (HSTS) — con Render no es problema, el SSL es automático.
- Mi consejo: si vas a pagar, no pagues por .app — ya pagas micabo.es y es la marca.

## Cuadro rápido
| Opción | Coste | Tiempo | Imagen | Riesgo |
|---|---|---|---|---|
| **micabo.es** (ya tuyo) | 0 extra | 30 min | ⭐⭐⭐ la marca | ninguno |
| micabo.eu.org | 0 € | 1-14 días (lento) | ⭐⭐⭐ serio | bajo |
| micabo.is-a.dev | 0 € | 24-72 h (PR) | ⭐⭐ dev | medio (comunidad) |
| micabo.app | ~10-15 €/año | inmediato | ⭐⭐ | pagar dos dominios |

## Mi recomendación final
1. **Ahora**: apuntar micabo.es a Render (lo hacemos hoy — dímelo y hago el lado Render).
2. **En paralelo**: pedir micabo.eu.org (gratis, para tener un alter-ego europeo si algún día
   quieres separar landing de app). Rechazar .is-a.dev salvo que quieras algo solo para pruebas.
3. **Nada de .app de pago** mientras micabo.es ya cubre la marca.

## Cuando el dominio esté en Render (lo hago yo)
- Añadir dominio por API de Render + verificar SSL.
- Cambiar `PUBLIC_URL` en las env vars (emails con enlace correcto).
- Actualizar enlaces en index/footer/chat si apuntan al onrender.com.
- Dejar el .onrender.com funcionando también (redirección), para no romper enlaces antiguos (IG, Ko-fi).
