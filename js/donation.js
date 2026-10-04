/* MICABO — Configuración de donaciones (edita con tus valores reales)
   Modelo: 100% gratis, donaciones voluntarias SIN contraprestación (nada queda
   bloqueado tras donar). Transparencia radical: costes y recaudación públicos.
   REGLA: solo URLs que existan de verdad — un enlace vacío no se muestra. */
window.GALON_DONATE = {
  enabled: true,
  kofi: "",                                   /* ← ko-fi.com/TUUSUARIO cuando lo crees (el botón se activa solo) */
  paypal: "",
  liberapay: "",
  bizumNum: "674 38 16 16",                   /* Bizum público del proyecto (aparece en Apoya) */
  bizumRaw: "674381616",
  telegram: "https://t.me/galon_alertas",     /* canal comunidad + Alertas BOD (justificantes → muro) */
  /* COSTES REALES del proyecto (año normal, cifras 2026): */
  /*  Servidor Render plan gratis: 0 € (si crecemos: ~85 €/año, plan Starter 7 $/mes) */
  /*  Dominio micabo.es · Strato: ~10-15 €/año  ·  Email Resend (3.000/mes): 0 € */
  /*  IA chat Gemini plan gratis: 0 €  ·  SIM del WhatsApp del proyecto: ~30 €/año */
  annualGoal: 40,                             /* meta anual real ≈ dominio + SIM */
  monthlyCost: 3.4,
  raised: 0                                   /* lo recaudado este año (actualízalo a mano) */
};
