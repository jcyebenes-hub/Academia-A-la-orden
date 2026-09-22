# A LA ORDEN · Backend y pagos

Arquitectura del demo: **Node puro sin dependencias** (`server.js`) que sirve la web + API REST. Datos en `data/*.json` (users, tokens, payments, checkouts, progress). Sesiones con cookie HttpOnly de 30 días y contraseñas con scrypt.

## Arranque
```bash
node server.js            # http://localhost:8000  (web + API en el mismo origen)
PORT=3000 node server.js  # otro puerto
ADMIN_TOKEN=xxx node server.js  # token del panel admin
```

## Endpoints
| Método y ruta | Auth | Qué hace |
|---|---|---|
| GET /api/config | no | Planes, cupones, plazas de fundador restantes |
| POST /api/register | no | Crea cuenta (scrypt + cookie de sesión). Los 100 primeros = FUNDADOR |
| POST /api/login | no | Login → cookie galon_token (30 días) |
| POST /api/logout | no | Cierra sesión |
| GET /api/me | sí | Perfil + plan activo + fecha de renovación |
| POST /api/checkout | sí | Crea sesión de pago {plan, cycle, coupon} → URL de checkout |
| GET /api/checkout/sid?id | no | Info de la sesión (plan, importe, cupón) |
| POST /api/checkout/confirm | sí | Valida tarjeta (DEMO), activa suscripción, registra pago |
| GET /api/invoices | sí | Facturas del usuario |
| GET/POST /api/progress | sí | Sincronización del progreso (fusión cliente: máximos y unión) |
| GET /api/ranking | no | Ranking real (XP de todos los usuarios) |
| GET /api/admin/stats?t=TOKEN | token | Usuarios, fundadores, subs activas, MRR, ingresos |

## Cupones integrados
- `CABO10` — 10 % de descuento en el primer cobro (campamento de redes).
- `FUNDADOR` — 1er mes gratis, solo para los 100 primeros registros (lista de espera de la fase PRE).

## Prueba del flujo completo (curl)
```bash
# registro
curl -c cj.txt -H 'Content-Type: application/json' \
  -d '{"name":"Sergio","email":"sergio@test.es","password":"secreta1"}' \
  http://localhost:8000/api/register
# crear checkout PRO mensual con cupón
curl -b cj.txt -H 'Content-Type: application/json' \
  -d '{"plan":"pro","cycle":"monthly","coupon":"CABO10"}' \
  http://localhost:8000/api/checkout
# pagar (demo) con el sid devuelto
curl -b cj.txt -H 'Content-Type: application/json' \
  -d '{"id":"SID","card":{"number":"4242 4242 4242 4242","holder":"SERGIO","exp":"12/29","cvc":"123"}}' \
  http://localhost:8000/api/checkout/confirm
# estado y facturas
curl -b cj.txt http://localhost:8000/api/me
curl -b cj.txt http://localhost:8000/api/invoices
# métricas de negocio
curl 'http://localhost:8000/api/admin/stats?t=galon2026'
```

## Sincronización multi-dispositivo
El cliente (`js/cloud.js`) sube el progreso tras cada test y al entrar. La fusión es tolerante a offline:
- XP, racha → el **máximo** de ambos dispositivos · fallos/blancos/SRS/vistas → **unión** · historial → **concatenado y deduplicado**.
- El progreso local siempre funciona sin cuenta (promise de "offline total" se mantiene).

## PASO A PRODUCCIÓN (checklist)
1. **Pagos reales**
   - Opción A · **Stripe** (rápido): Checkout Sessions + webhooks (`checkout.session.completed`, `customer.subscription.deleted`). Esqueleto en `payments-stripe.js`.
   - Opción B · **Redsys** (tarjetas españolas, TPV virtual): firma HMAC SHA-256 del parámetro Ds_MerchantParameters; habitual en academias españolas.
   - Nunca guardar PAN; conservar solo last4 y el id de cliente de la pasarela.
2. **Base de datos**: sustituir los JSON por SQLite (mismo tamaño de proyecto) o Postgres gestionado; los accesos ya están aislados en jread/jsave.
3. **Sesiones**: cookies Secure + SameSite=Lax tras poner HTTPS; rotación de tokens.
4. **RGPD**: política de privacidad, derecho de supresión (endpoint DELETE /api/me), minimización de datos, registro de actividades. Email del aviso ya en la pantalla de cuenta.
5. **Hosting**: cualquier VPS/Plataforma Node (fly.io, Railway, VPS español — dato relevante para cliente militar). Backups diarios de `data/`.
6. **Emails**: bienvenida + recibo (Resend/SMTP), y el flujo de la lista de fundadores.
7. **Observabilidad**: logs estructurados, /health, alertas de caída (la app es offline-first: una caída no bloquea el estudio).

## Qué NO es este demo
- Los pagos son simulados (ninguna tarjeta se cobra de verdad) y el banco de preguntas sigue siendo de muestra.
- No hay verificación de email ni 2FA (necesarios en producción).
