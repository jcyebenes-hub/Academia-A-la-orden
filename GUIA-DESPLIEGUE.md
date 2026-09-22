# 🚀 Despliegue de A LA ORDEN — 100% gratis (Render + GitHub + cron-job.org)

> Objetivo: web con cuentas 24/7 + bot de Telegram + agenda, sin pagar nada.
> Piezas: **Render** (hosting del servidor), **repo privado de GitHub** (los datos sobreviven),
> **cron-job.org** (ping para que no se duerma) y **nic.eu.org** (dominio propio gratis, opcional).

## 1 · Subir el código a GitHub (5 min)

1. Cuenta en github.com → New repository → nombre `galon` (privado recomendado).
2. En la carpeta del proyecto:
   ```
   git init
   git add .
   git commit -m "A LA ORDEN v1.0"
   git branch -M main
   git remote add origin https://github.com/TUUSUARIO/galon.git
   git push -u origin main
   ```
3. Tranquilidad: `.gitignore` ya excluye `.env` (token del bot) y `data/` (datos reales). No se suben.

## 2 · Render — el servicio (3 min)

1. render.com → **Sign in with GitHub** → New + → **Web Service** → elige `galon`.
2. Name: `galon` · Region: **Frankfurt** · Instance: **Free**.
3. Build `npm install` · Start `npm start` (los detecta solo; `npm start` lanza los 3 motores: web + bot + agenda).
4. Environment → añade ya mismo:
   - `PUBLIC_URL` = la URL que te dará Render (`https://galon.onrender.com`)
   - las del paso 3 (persistencia)
   - `TELEGRAM_BOT_TOKEN` (el del bot, para que el bot viva en Render)
   - `TELEGRAM_CHANNEL` y `TELEGRAM_ROUTES` (mira tu `.env` local)
   - `KOFI_VERIFICATION_TOKEN` (si ya tienes Ko-fi)
5. **Create Web Service** → ~2 min de build → abre tu URL: A LA ORDEN en internet, con bot y agenda dentro.

> ¿Por qué todo en un servicio? Render gratis da 750 h/mes **por cuenta**: un servicio 24/7 las consume
> justas. Tres servicios se quedarían sin horas a mediados de mes. `tools/arranque.js` lanza los tres
> motores dentro de uno y los reanteca si alguno muere.

## 3 · Que los datos sobrevivan (repo privado, 5 min)

El disco de Render **se vacía en cada despliegue**. `server.js` ya lo resuelve:
sube un volcado (`data/bundle.json`: cuentas, progreso, sesiones, apoyos) a un repo privado
y lo restaura al arrancar (sin pisa datos vivos).

1. GitHub → New repository → `galon-datos` → **Private**.
2. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate new:
   - Repository access: *Only select* → `galon-datos`
   - Permissions: **Contents → Read and write**
   - Copia el token (`github_pat_...`).
3. Render → tu servicio → Environment:
   - `GITHUB_TOKEN` = el token
   - `GITHUB_REPO` = `TUUSUARIO/galon-datos`
   - `GITHUB_BRANCH` = `main`

Cada 10 min (y en cada parada) sube el volcado; al reiniciar, restaura. El primer día verás en
los logs `☁️ volcado de datos subido al repo` — ahí queda guardado de verdad.

## 4 · Ping anti-sueño (2 min)

Render gratis duerme el servicio a los 15 min sin tráfico (y tarda ~1 min en despertar).

1. cron-job.org → cuenta gratis → **Create cronjob**:
   - URL: `https://galon.onrender.com/api/health`
   - Schedule: **every 5 minutes**
2. Save. Con el ping, el servicio no duerme nunca (750 h/mes cubren el mes entero de un servicio).

Alternativa igual de válida: UptimeRobot (monitor HTTP cada 5 min, gratis).

## 5 · Dominio gratis propio (opcional, cuando quieras)

1. desec.io → cuenta → *Create domain*… aún no: primero pide el nombre.
2. nic.eu.org → cuenta → *New domain* → `galon.eu.org`:
   - DNS: usa servidores externos → `ns1.desec.io` y `ns2.desec.io`
   - Aprobación manual: 1-14 días.
3. Cuando lo aprueben: en desec.io crea la zona `galon.eu.org` → registro `A`/`CNAME` según lo que
   diga Render (Settings → Custom Domains → añade `galon.eu.org`).
4. En Render añade el dominio y en Environment: `PUBLIC_URL=https://galon.eu.org`.
   → Los enlaces del bot y de los canales se fijan solos (cero retocar código).

## 6 · Ko-fi (5 min, cuando quieras activar el café)

1. ko-fi.com → cuenta → **Ko-fi Gold no es necesario** (la comisión del 5% es asumible; Gold la quita).
2. Settings → API/Webhooks → copia el **Verification Token** → pégalo en Render como
   `KOFI_VERIFICATION_TOKEN`.
3. Webhook URL (en la misma pantalla de Ko-fi): `https://TU-DOMINIO/api/webhooks/kofi`
4. En `js/donation.js`: `kofi: "https://ko-fi.com/TUUSUARIO"` (commit + push → Render redespliega).
   → El aviso de café se activa solo, y quien invita no vuelve a verlo.

## 7 · Actualizar la web después

```
git add . && git commit -m "mejora X" && git push
```
Render detecta el push y redespliega solo (~2 min). Los datos no se pierden (gracias al paso 3).

## Mapa mental

| Pieza | Servicio | Coste |
|---|---|---|
| Web + cuentas + bot + agenda | Render Web Service (Free) | 0 € |
| Datos duraderos | repo privado GitHub | 0 € |
| Ping anti-sueño | cron-job.org | 0 € |
| Dominio (opcional) | galon.eu.org + deSEC | 0 € |
| Cafés | Ko-fi | ~5% de lo recaudado |
