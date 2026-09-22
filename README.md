# 🎖️ A LA ORDEN — Academia de Tropa (Cabo, Cabo 1º y Permanente del ET)

Todo gratis. Banco de 2.401 preguntas auditadas, 17 cuadernos PDF, trivial con ruleta, duelos por código, bot de Telegram y más.

## Desplegar en Render (clic a clic)
1. github.com → este repo (Academia-A-la-orden)
2. render.com → **New + → Web Service** → conecta tu GitHub y elige el repo
3. Configuración:
   - **Runtime**: Node · **Build**: `npm install` (no tiene dependencias, tarda segundos)
   - **Start**: `npm start` (arranca web + bot de Telegram + agenda en un solo servicio)
   - **Instance type**: Free
4. **Environment** → añade las variables del `.env.example` que uses (mínimo `TELEGRAM_BOT_TOKEN` si quieres el bot)
5. Create Web Service → tu `PUBLIC_URL` será `https://academia-a-la-orden.onrender.com`

## Notas importantes
- **Discos efímeros en el plan gratis**: para no perder cuentas/duelos, añade `GITHUB_TOKEN` + `GITHUB_REPO` (la app persiste los datos vía API de GitHub).
- **Conflicto 409 de Telegram**: cuando el bot de Render esté vivo, no dejes otro bot corriendo en local con el mismo token.
- El servicio gratis se duerme por inactividad (~15 min); el primer despertar tarda ~50 s.
