#!/usr/bin/env python3
"""
MICABO · Generador del QR de marca del pie de página.

Uso:
    python3 tools/qr-micabo.py                          # URL por defecto
    python3 tools/qr-micabo.py --url https://micabo.es  # cuando el dominio esté vivo

Qué hace:
  1. Genera un QR con corrección de errores ALTA (nivel H): resiste hasta un 30 %
     de daño, que es lo que permite taparle el centro con el emblema sin romperlo.
  2. Lo pinta en los colores de la marca (verde #143d26 sobre crema #fdfbf4).
  3. Pega en el centro el emblema del saludo, con un anillo de separación del color
     del fondo. El hueco central se calcula sobre el tamaño real del QR, no a ojo.

Salida:
  img/qr-micabo.png       ·  1024 px, para pantalla (se muestra a ~132 px)
  img/qr-micabo@2x.png    ·   512 px, densidad doble

Requisitos:  pip install qrcode pillow
"""

import argparse
import sys
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw
from qrcode.constants import ERROR_CORRECT_H

# --- Paleta de la marca (tomada de css/style.css) -----------------------------
GREEN = (20, 61, 38)        # --green-d  #143d26
CREAM = (253, 251, 244)     # fondo, casi el --card #fffdf6
GOLD = (201, 151, 31)       # --gold    #c9971f   (solo para el anillo del emblema)

# --- Ajustes del hueco central -------------------------------------------------
# MEDIDO, no estimado: se barrió de 16 % a 24 % del lado probando cada variante
# con el lector zbar a 100-300 px, limpio y con desenfoque. Con 20 % y anillo del
# 4 % la lectura es 21/21 en todos los tamaños; a partir del 22 % se desploma
# (18/21) y al 24 % falla más de la mitad. No subir sin volver a medir.
EMBLEM_RATIO = 0.20
RING_RATIO = 0.04          # anillo de separación crema alrededor del emblema

DEFAULT_URL = "https://academia-a-la-orden.onrender.com/?utm_source=qr"

ROOT = Path(__file__).resolve().parent.parent
EMBLEM = ROOT / "img" / "qr-soldado.png"


def _circle_mask(size: int) -> Image.Image:
    """Máscara circular con bordes suavizados (antialias x4)."""
    s = size * 4
    m = Image.new("L", (s, s), 0)
    ImageDraw.Draw(m).ellipse((0, 0, s - 1, s - 1), fill=255)
    return m.resize((size, size), Image.LANCZOS)


def _trim_white(img: Image.Image) -> Image.Image:
    """Recorta el marco blanco que traen las ilustraciones generadas."""
    img = img.convert("RGB")
    w, h = img.size
    px = img.load()
    bg = px[0, 0]

    def diff(c):
        return abs(c[0] - bg[0]) + abs(c[1] - bg[1]) + abs(c[2] - bg[2])

    left, top, right, bottom = w, h, 0, 0
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            if diff(px[x, y]) > 26:
                left = min(left, x)
                right = max(right, x)
                top = min(top, y)
                bottom = max(bottom, y)
    if right <= left or bottom <= top:
        return img  # no se detectó fondo: se devuelve tal cual

    pad = 2
    box = (max(0, left - pad), max(0, top - pad),
           min(w, right + pad), min(h, bottom + pad))
    return img.crop(box)


def build(url: str, out: Path, size: int) -> Path:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,   # imprescindible para el hueco central
        box_size=10,
        border=2,                            # zona de silencio: medido, 2 gana a 4
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=GREEN, back_color=CREAM).convert("RGB")
    img = img.resize((size, size), Image.NEAREST)  # NEAREST = módulos nítidos

    # --- emblema central ---------------------------------------------------
    em_size = int(size * EMBLEM_RATIO)
    ring = int(size * RING_RATIO)
    disc = em_size + ring * 2

    if EMBLEM.exists():
        em = _trim_white(Image.open(EMBLEM))
        em = em.resize((em_size, em_size), Image.LANCZOS)
    else:
        print(f"  ! No encuentro {EMBLEM}; se deja un disco dorado liso.", file=sys.stderr)
        em = Image.new("RGB", (em_size, em_size), GOLD)

    # disco de separación (crema) para que el QR "respire" junto al emblema
    layer = Image.new("RGBA", (disc, disc), (0, 0, 0, 0))
    layer.paste(Image.new("RGB", (disc, disc), CREAM), (0, 0), _circle_mask(disc))
    layer.paste(em, (ring, ring), _circle_mask(em_size))

    # filete dorado fino alrededor del emblema
    d = ImageDraw.Draw(layer)
    d.ellipse((ring - 2, ring - 2, ring + em_size + 1, ring + em_size + 1),
              outline=GOLD, width=max(2, size // 400))

    pos = ((size - disc) // 2, (size - disc) // 2)
    img.paste(layer, pos, layer)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"  ✓ {out.relative_to(ROOT)}  ·  {size}×{size} px  ·  "
          f"emblema {em_size} px ({EMBLEM_RATIO:.0%})")
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="Genera el QR de marca de MICABO.")
    ap.add_argument("--url", default=DEFAULT_URL,
                    help="URL que abrirá el QR (por defecto, la de Render)")
    args = ap.parse_args()

    print(f"URL destino: {args.url}")
    build(args.url, ROOT / "img" / "qr-micabo@2x.png", 512)
    build(args.url, ROOT / "img" / "qr-micabo.png", 1024)


if __name__ == "__main__":
    main()
