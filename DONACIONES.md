# A LA ORDEN · Plan de donaciones (modelo actual) y salida a monetizar

## Principio
**Todo gratis, para siempre.** Las donaciones son voluntarias y sin contraprestación: no se bloquea nada tras donar. Eso mantiene el modelo limpio legalmente mientras no haya empresa, y es la mejor carta de captación en un nicho quemado a precios de 300-800 €.

## Canales (configurar en js/donation.js)
| Canal | Comisión | Uso recomendado |
|---|---|---|
| Bizum personal | 0% | España, donación puntual (no publicar el número en web abierta: dárselo por el grupo) |
| PayPal.me | ~3,4% + 0,35 € | Enlace directo fácil |
| Ko-fi | 5% (Gold 8$/mes lo elimina) | Café puntual, web bonita |
| Liberapay | ~0% | Donación recurrente mensual |

## Transparencia radical (el motor de confianza)
Publicar cada mes: costes (VPS ~5 €, dominio ~1 €, email 0 € → total ~6 €) y recaudación. El medidor de la landing se edita en `js/donation.js` (monthlyCost / raised). En este nicho, la honestidad contable ES marketing.

## Matemática de sostenibilidad
- Coste mensual real: ~6 €. Con 5 donantes de 3 € ya hay beneficio.
- 300 usuarios activos × 1,5% conversión × 4 € = ~18 €/mes → cubre costes ×3.
- 1.000 activos → ~60 €/mes → permite pagar revisión legal de preguntas y mejor hosting.

## Cuándo monetizar (3 señales objetivas, no ganas)
1. Costes cubiertos 3 meses seguidos con margen ≥50%.
2. ≥300 usuarios activos al mes (o retención semanal alta y crecimiento estable).
3. Demanda de cosas que cuestan dinero: experto que valide banco, VPS mayor, apps en tiendas.

## Cómo monetizar sin quemar la comunidad
- **Grandfathering**: quien donó antes de la monetización = FUNDADOR → Pro gratis o -50% perpetuo (anótalo: la app ya distingue fundadores en cuentas).
- Modelo sugerido entonces: mantener lo actual gratis (tests, simulacros, offline) y cobrar solo extras pesados (banco validado por jurista, clases, apps de tiendas). Pago único por convocatoria (estilo 9,99-14,99 €) encaja mejor que cuota en este público.
- El motor Stripe/Redsys ya está construido y dormido (`BACKEND.md`, `payments-stripe.js`): coste de mantenerlo 0 €, se reactiva con claves.

## Fiscalidad (honesto, no es asesoramiento)
- Las donaciones recibidas son ingresos: decláralos en tu IRPF.
- Sin contraprestación por donar = menor riesgo de "actividad económica", pero si se hace habitual, Hacienda puede considerarlo como tal: cuando pase de ~1.000 €/año o sea recurrente, consulta a un gestor (~50 €).
- Nunca prometas ventajas por donar mientras no haya empresa.

## KPIs del modelo
| Métrica | Meta mes 3 |
|---|---|
| Usuarios demo activos/mes | 300 |
| Donantes/mes | 8+ |
| Costes cubiertos | 100% |
| Retención D7 | >25% |
