/* A LA ORDEN — Configuración de donaciones (edita con tus valores reales)
   Modelo: 100% gratis, donaciones voluntarias SIN contraprestación (nada queda
   bloqueado tras donar). Transparencia radical: costes y recaudación públicos.
   REGLA: solo URLs que existan de verdad — un enlace vacío no se muestra. */
window.GALON_DONATE = {
  enabled: true,
  kofi: "",                                   // ← pega aquí tu ko-fi.com/TUUSUARIO cuando lo crees (el aviso de la app se activa solo)
  paypal: "",                                 // ← paypal.me/TUUSUARIO cuando lo crees
  liberapay: "",                              // Liberapay (recurrente, ~0%)
  bizum: "Bizum: pídelo por el canal de Telegram", // texto o número NO público en web
  telegram: "https://t.me/galon_alertas",     // canal comunidad + Alertas BOD
  monthlyCost: 1,                             // coste real actual: dominio ~10 €/año amortizado (Render gratis de momento)
  raised: 0                                   // lo recaudado este mes (actualízalo a mano)
};
