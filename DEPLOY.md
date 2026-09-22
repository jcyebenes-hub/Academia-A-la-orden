# A LA ORDEN · Guía de salida a producción (de cero a real)

Esta es la ruta exacta para convertir el proyecto actual en un servicio real, legal y cobrando. Todo lo que es **código** ya está listo; lo que es **claves y trámites** se marca como PASO PROPIETARIO.

## 0. Qué ya es real en el código (hecho)
- Pagos: integración **Stripe Checkout real** y **Redsys real** (firma HMAC-SHA256 + 3DES del estándar v1.0, notificaciones verificadas). Si detecta claves en `.env`, cobra de verdad; si no, entra en modo pruebas **etiquetado**.
- Seguridad: rate-limiting, bloqueo por fuerza bruta, cookies Secure bajo HTTPS, comprobación de origen, scrypt, cabeceras de seguridad, panel interno protegido con ADMIN_TOKEN.
- RGPD operativo: verificación de email, recuperación de contraseña, exportación y borrado de cuenta por el propio usuario (art. 15-20), registro de auditoría.
- Documentos legales plantillados: `/legal/terminos.html`, `/legal/privacidad.html`, `/legal/cookies.html`.

## 1. Empresa y legalidad (PASO PROPIETARIO)
1. Alta como autónomo o creación de SL (para cobrar con pasarela necesitarás CIF/NIF).
2. Completa los datos entre corchetes de los 3 documentos legales y pásalos por un asesor legal (1-2 h de revisión).
3. Registra la actividad de tratamiento RGPD (documento interno; la política pública ya está).

## 2. Contenido apto para público
1. Revisión experta en `/revisar.html?t=ADMIN_TOKEN` (jurista o militar cualificado: aprobar/corregir/rechazar).
2. Exporta `js/verdicts.js` y sustituye el del servidor.
3. En `.env`: `CONTENT_STRICT=1` → solo se sirve contenido aprobado.
4. Mantén la fecha "verificado a…" actualizada en cada convocatoria.

## 3. Servidor y dominio
```bash
# PASO PROPIETARIO: contrata un VPS (Hetzner/OVH/…, 5€/mes sobra) y un dominio
# En el VPS (Ubuntu):
apt update && apt install -y nodejs caddy
adduser galon && su galon
# sube la carpeta galon/ (git clone o rsync)
cd galon && cp .env.example .env && nano .env   # completa claves
# servicio systemd: /etc/systemd/system/galon.service
```
`/etc/systemd/system/galon.service`:
```ini
[Unit]
Description=GALON
After=network.target
[Service]
User=galon
WorkingDirectory=/home/galon/galon
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
[Install]
WantedBy=multi-user.target
```
`/etc/caddy/Caddyfile` (TLS automático y gratis):
```
tudominio.es {
    reverse_proxy localhost:8000
}
```
```bash
systemctl enable --now galon caddy
# comprobar: curl https://tudominio.es/api/health
```

## 4. Pagos reales
### Opción A — Stripe (rápida, internacional)
1. Crea/activa la cuenta en stripe.com (KYC: titular, IBAN, web).
2. Productos → 4 precios: Pro 14,99 €/mes · Pro pago único 79 € · Carrera 19,99 €/mes · Carrera única 149 €.
3. Copia los `price_xxx` y `sk_live_…` al `.env`.
4. Cupón: crea `CABO10` (10% off) y pega su id en `STRIPE_COUPON_CABO10`.
5. Webhook: Developers → Webhooks → `https://tudominio.es/api/webhooks/stripe` con eventos `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted` → pega el `whsec_…` en `STRIPE_WEBHOOK_SECRET`.
6. Prueba primero en modo test (sk_test + tarjetas 4242) y luego pasa a live.

### Opción B — Redsys (TPV de banco español)
1. Contrata el TPV Virtual con tu banco (CaixaBank, Santander, BBVA…). Te dan **FUC** (código comercio), terminal y clave **KC**.
2. `.env`: `REDSYS_MERCHANT_CODE`, `REDSYS_SECRET_KEY`, `REDSYS_ENV=prod` (empieza en `test`).
3. En el portal del TPV: URL de notificación `https://tudominio.es/api/webhooks/redsys` (verificación de firma ya implementada).
4. Nota: la renovación mensual automática con Redsys requiere su servicio de pagos recurrentes (por referencia); para empezar, el pago único por convocatoria funciona sin más.

## 5. Email real
1. Crea cuenta en resend.com → verifica tu dominio (registros DKIM/SPF que te indican).
2. `.env`: `RESEND_API_KEY`, `MAIL_FROM=A LA ORDEN <hola@tudominio.es>`.

## 6. Copias de seguridad y monitorización
```bash
# cron: backup diario de datos a las 4:00
0 4 * * * tar czf ~/backups/galon-$(date +\%F).tgz /home/galon/galon/data
# monitorización gratuita: uptimerobot.com apuntando a /api/health
```

## 7. Checklist de lanzamiento
- [ ] `.env` completo (ADMIN_TOKEN nuevo, PUBLIC_URL con tu dominio)
- [ ] HTTPS activo (Caddy) y `curl /api/health` en verde
- [ ] `revisar.html` responde 403 sin token
- [ ] Pago de prueba real de 1 céntimo→reembolso (o en modo test) en la pasarela
- [ ] Webhooks de la pasarela verificados (un pago real activa el plan)
- [ ] Emails de verificación llegando a Gmail/Outlook (no a spam)
- [ ] Documentos legales completados y visibles en el pie
- [ ] Contenido revisado por experto + `CONTENT_STRICT=1`
- [ ] Backup diario probado (restaura uno en local)
- [ ] Campaña fundadores (los 100 primeros ya se auto-marcan como FUNDADOR en el registro)

## 8. Escalado posterior
- Postgres con `sql/schema.sql` cuando pases de ~500 usuarios (el código está aislado en jread/jsave).
- CDN para estáticos (Cloudflare delante de Caddy).
- Métricas de negocio ya disponibles en `/api/admin/stats?t=…` (MRR, ingresos, suscripciones).
