# Cómo viva el repo sin reventar el workspace (LEER antes de tocar git)

Los 49 PDFs de temarios (98 MB) viven SOLO en GitHub (pdf/temarios/) y Render los sirve desde ahí.
NO se copian al workspace: el límite de guardado es 128 MB y los eliminaría en cada sesión.

## Reconstruir el clone en una sesión nueva (el sandbox borra .git/config y puede rebobinar):
    cd /home/user
    git clone --depth 1 --filter=blob:none --sparse https://<TOKEN>@github.com/jcyebenes-hub/Academia-A-la-orden.git repo-alaorden
    cd repo-alaorden
    git sparse-checkout set --no-cone '/*' '!/pdf/temarios'   # todo MENOS los PDFs
    git config user.name jcyebenes-hub; git config user.email jcyebenes-hub@users.noreply.github.com

## Sincronizar cambios desde galon/ (copia todo menos lo que no existe ya en repo):
- python shutil walk de galon → repo (sin borrar), como siempre.
- NUNCA copiar pdf/temarios al repo desde el workspace (allí ya está, intacto).

## Si algún día hay que añadir/cambiar un PDF:
1. Bajar solo ese fichero (raw.githubusercontent o /tmp), meterlo en repo/pdf/temarios/.
2. Commit + push INMEDIATO y borrar la copia local del clone entero si hace falta.

## Tras cada push: verificar canarios
- curl al PDF: https://academia-a-la-orden.onrender.com/pdf/temarios/Cabo__Convocatoria.pdf (200)
- título MICABO en /app.html · sw.js CACHE v92 · login admin OK.
