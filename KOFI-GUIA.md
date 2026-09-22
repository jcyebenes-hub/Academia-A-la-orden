# ☕ KO-FI · Guía clic a clic (Meta de la Tropa)

> Objetivo: que quien quiera, apoye el servidor/dominio con un café. **0% de comisión** de Ko-fi
> en cafés sueltos y en metas de crowdfunding (verificado 21-sep-2026). Sin empresa, sin CIF.

---

## ANTES DE EMPEZAR — lo que hay que saber (verificado hoy)

| Qué | Comisión Ko-fi | Nota |
|---|---|---|
| Café suelto (donación única) | **0%** | Solo te quita PayPal (~3% + 0,30 € aprox.) |
| **Meta de crowdfunding (Goals)** | **0%** | Es lo que usaremos |
| Tienda / membrecías / cafés mensuales | 5% | **NO las usamos** |
| Cuenta Ko-fi | Gratis | El Gold (~10-12 €/mes) NO hace falta |

⚠️ **IMPORTANTE (trampa de Ko-fi)**: las cuentas nuevas traen activado el "Contributor status",
que cobra **5% hasta en los cafés sueltos**. Hay que DESACTIVARLO en Ajustes → Pago (paso 6 abajo).

⚠️ **LEGAL (España, sincero)**: lo que entra por Ko-fi **no es una "donación" legal**: son
**ingresos** que se declaran en el **IRPF (modelo 100)** como rendimiento esporádico. Siendo
poco dinero y sin ser tu medio de vida, no se exige alta de autónomo; si algún día crece mucho,
habla con un asesor. **NADA de regalos físicos ni sorteos** (eso es venta / juego: alta y
autorización de la Ley 13/2011). Los "regalos" A LA ORDEN son **reconocimiento**: muro, insignia y
fundadores de por vida. El estudio sigue 100% gratis para todos.

---

## PASO A PASO (~15 minutos)

### 1) Crear la cuenta
1. Entra en `https://ko-fi.com` → **Sign Up / Regístrate** (arriba a la derecha).
2. Regístrate con tu email (o con Google). Usa el email de tu PayPal.
3. Elige tu **nombre de página**: algo corto, p. ej. `galon` → quedaría `ko-fi.com/galon`.
   (Si está cogido: `galonapp`, `apoyogalon`…)
4. Te llegará un email de verificación → pulsa **Confirmar email**.

### 2) Conectar el dinero (PayPal)
1. Menú lateral → **Payment / Pagos** (o "Get paid").
2. Elige **PayPal** → **Connect PayPal** → inicia sesión con TU PayPal y acepta.
3. El dinero de cada café cae DIRECTO en tu PayPal (Ko-fi no retiene el dinero).

### 3) ⚠️ Quitar el 5% de los cafés (Contributor status)
1. Icono de tu perfil (abajo-izquierda) → **Settings / Ajustes**.
2. Pestaña **Payment / Pago**.
3. Busca **"Contributor status"** o **"Get all of Ko-fi"** → **DESACTÍVALO** ("opt out").
4. Comprueba que dice **0% en one-off tips / cafés sueltos**.

### 4) Crear la META de la tropa (crowdfunding)
1. Menú → **Goals / Metas** (dentro de tu página).
2. **Create a goal / Crear meta**:
   - Título: `Meta de la tropa A LA ORDEN — servidor + dominio`
   - Monto objetivo: **12 €** (dominio ~10 €/año + redondeo; actualízalo si cambia)
   - Tipo: **Yearly / Anual** (o la que prefieras)
3. Guarda. La barra de progreso aparecerá en tu página de Ko-fi.

### 5) Poner la página bonita (mínimo)
1. **Page / Página** → edita:
   - Foto: tu galón/logo (cuando tengas las imágenes de galones hechas)
   - Descripción: `A LA ORDEN: estudiar para Cabo, gratis para siempre. Tu café paga servidor y dominio. Nada queda bloqueado por no aportar.`
   - **Welcome message / mensaje de agradecimiento** personalizado.
2. **NO actives** Shop ni Memberships (5% y ya sabemos por qué no).

### 6) Webhooks (OPCIONAL — requiere Ko-fi Gold)
El servidor A LA ORDEN ya entiende el webhook (`/api/webhooks/kofi` con `KOFI_VERIFICATION_TOKEN` en
`.env`): apunta al donante con su cuenta en la app automáticamente.
- Si algún día contratas Gold: Settings → API / Webhooks → pega
  `https://TU-DOMINIO/api/webhooks/kofi` y copia el **verification token** al `.env`.
- **Sin Gold**: nada pasa. Dime cada mes cuántos cafés han entrado y actualizo la barra a mano
  (js/donation.js → `raised`, y `data/supporters.json` si me pasas apodos).

### 7) Conectar Ko-fi con A LA ORDEN (dímelo y lo hago yo)
1. Copia el enlace de tu página (`https://ko-fi.com/TUUSUARIO`).
2. Pásamelo por el chat.
3. Yo lo pongo en `js/donation.js` (campo `kofi`) → la app empieza a mostrar el botón
   "☕ Apoyar en Ko-fi" solo (la tarjeta de café y la vista ☕ Apoya ya están listas).

---

## QUÉ VERÁ EL USUARIO (ya implementado en la app, v55)
- **Más → ☕ Apoya**: barra "Meta de la tropa" con **datos reales** del webhook/mano
  (`/api/apoyos`), muro de **Fundadores de por vida** (hoy: Sergio y Marco 🏅) y contador de cafés.
- Tarjeta de café suave (1 vez/semana, nunca en un test, se calla con "Ya colaboro").
- **Nadie compra ventajas**: quien aporta recibe reconocimiento; quien no, todo gratis igual.

## NÚMEROS PARA NO PERDERSE
- Coste real actual: dominio ~10 €/año (Render gratis hasta el despliegue; su plan gratis basta).
- Meta anual sugerida: **12 €**. Cualquier café de más = colchón para el día que Render facture.
- Fundadores: plazas limitadas a 100 de por vida (ya quedan menos de 100: Sergio y Marco dentro).

---

## 💰 FISCALIDAD (verificado 21-sep-2026 en sede.agenciatributaria.gob.es)

**La vía legal "sin declarar" existe y es la de la meta de la tropa:**

- La AEAT excluye de la obligación de declarar a quien **no supera 1.000 €/año en conjunto**
  (rendimientos no laborales, ganancias, etc.), si su sueldo viene de **un solo pagador y es
  < 22.000 €/año**. La meta A LA ORDEN (dominio ~12 €/año) queda infinitamente por debajo.
- El proyecto es **gratuito y esporádico** → no es "actividad económica" ni te mete en IVA
  (la ley excluye del concepto de empresario a quien presta servicios **a título gratuito**).
- **Nada de autónomo**: no hay habitualidad ni organización lucrativa.

**La regla de oro**: si algún día los cafés superan los **1.000 € en un año**, me lo dices y
se declara en el modelo 100 (una casilla; con cantidades pequeñas el impuesto es mínimo).
Ocultarlo ya no sería descuido, sería fraude — y eso no lo hacemos.

**Condición militar (Ley 39/2007)**: la actividad privada del militar en activo está limitada
y algunas actividades exigen autorización. Un proyecto gratuito, esporádico y sin ánimo de
lucro es defendible, pero si crece (o te lo pregunta el mando), consulta con asesoría.

*Nota: no soy asesor fiscal — esto es información verificada de la AEAT para tu caso concreto
(meta pequeñísima, proyecto gratuito); si la cosa crece, gestor o AEAT (060).*
