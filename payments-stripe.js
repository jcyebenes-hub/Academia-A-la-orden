/* A LA ORDEN — Integración Stripe para producción (DOCUMENTACIÓN, no activa en el demo)
   Uso real: npm i stripe (o llamar a la API REST con fetch como aquí), exportar STRIPE_SECRET_KEY,
   crear productos/precios y sustituir el bloque "demo" de /api/checkout/confirm por webhooks. */
"use strict";
/*
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY; // sk_live_... / sk_test_...
const PRICE_IDS = {
  "pro:monthly":  "price_xxx",   // 14,99 €/mes
  "pro:single":   "price_xxx",   // 79 € pago único
  "carrera:monthly": "price_xxx",// 19,99 €/mes
  "carrera:single":  "price_xxx" // 149 € pago único
};

async function stripeRequest(path, params) {
  const body = new URLSearchParams(params).toString();
  const res = await fetch("https://api.stripe.com/v1/" + path, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + STRIPE_SECRET,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  if (!res.ok) throw new Error("Stripe: " + res.status + " " + (await res.text()));
  return res.json();
}

// 1) Crear Checkout Session en POST /api/checkout (sustituye al JSON de checkouts)
async function createCheckout(user, planKey, couponPct) {
  const params = {
    mode: planKey.endsWith(":monthly") ? "subscription" : "payment",
    "line_items[0][price]": PRICE_IDS[planKey],
    "line_items[0][quantity]": 1,
    success_url: "https://galon.app/app.html#/cuenta?bienvenida=pro",
    cancel_url: "https://galon.app/index.html#precios",
    client_reference_id: user.id,
    "metadata[uid]": user.id
  };
  if (couponPct) params["discounts[0][coupon]"] = couponPct; // crear cupón CABO10 en el panel Stripe
  const s = await stripeRequest("checkout/sessions", params);
  return s.url; // redirigir al usuario a s.url
}

// 2) Webhook en POST /api/stripe/webhook (raw body + verificación de firma)
//    Eventos a tratar:
//    - checkout.session.completed  → activar suscripción (metadata.uid), registrar pago
//    - invoice.paid                → renovar ends = now + 30d
//    - customer.subscription.deleted → degradar a plan free
//    Verificación: header stripe-signature con STRIPE_WEBHOOK_SECRET (HMAC SHA-256 sobre rawBody).
*/
module.exports = {};
