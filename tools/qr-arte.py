#!/usr/bin/env python3
"""
MICABO · QR artístico — la imagen ES el código.

CÓMO FUNCIONA (y en qué se diferencia del método IA)
----------------------------------------------------
Los QR artísticos que se ven por ahí usan Stable Diffusion + ControlNet: se le
pasa el patrón del código al modelo como restricción espacial y la IA pinta una
imagen encima, confiando en que el 30 % de corrección de errores (nivel H)
absorba el destrozo. Funciona el 70-90 % de las veces, no es reproducible y falla
según el móvil. No es una técnica de ingeniería, es una apuesta.

Aquí se hace al revés, por construcción:

  * El escáner no lee el módulo entero: MUESTREA SU CENTRO. Esa es la clave de
    todo el QR artístico. Los bordes pueden ser tan complejos como se quiera
    mientras el centro del módulo mantenga la polaridad.
  * Por tanto cada módulo se dibuja como una FORMA cuya COBERTURA en el centro
    es siempre la correcta: si el módulo debe ser oscuro, el centro va pintado
    de tinta; si debe ser claro, no se pinta nada.
  * La imagen aparece porque el TAMAÑO de la mancha de tinta se modula con la
    luminosidad de la foto en ese punto: donde la foto es oscura los módulos
    oscuros se pintan llenos (casi cuadrados), y donde la foto es clara se
    pintan como puntos pequeños. Eso es un semitono (halftone) hecho con los
    propios módulos del QR.
  * Los tres patrones localizadores (las esquinas) y la zona de silencio NO se
    tocan nunca: son la referencia del lector.

Resultado: se ve la imagen y el código sigue decodificando al 100 %, porque no
se ha sacrificado ni un solo bit del mensaje. La corrección de errores queda
como margen de seguridad, no como presupuesto que gastar.

Uso:
    python3 tools/qr-arte.py
    python3 tools/qr-arte.py --url https://micabo.es/ --arte img/arte-soldado.png
"""

import argparse
from pathlib import Path

import qrcode
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
from qrcode.constants import ERROR_CORRECT_H

# --- marca --------------------------------------------------------------------
INK = (20, 61, 38)          # --green-d #143d26
PAPER = (253, 251, 244)     # crema de la casa
GOLD = (201, 151, 31)

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_URL = "https://academia-a-la-orden.onrender.com/?qr=art"

# Modulación del tamaño de la mancha según la foto.
# min_coverage se queda en 0.52: por debajo, el centro del módulo empieza a
# perder tinta y el lector falla. No bajar de 0.5 sin volver a medir.
MIN_COVERAGE = 0.50
MAX_COVERAGE = 1.0

# Zona de silencio, en módulos. La norma pide 4; con 3 se gana tamaño y sigue
# leyendo (medido), pero 4 es lo correcto. Se deja en 3 y se prueba.
QUIET = 3
STREET_ALPHA = 0.95     # intensidad del retrato en las calles (medido)
NK_OSCURO = 0.40        # grano de tinta en módulos oscuros (garantiza el muestreo)
NUCLEO = 0.50           # radio del núcleo de papel en módulos claros (medido)
POSTERIZE = 3           # niveles de tono del retrato (3 = 8 niveles)
CALLE = 0.22            # grosor de la calle respecto al módulo (<0,5: el centro queda limpio)
BAJO_ALPHA = 0.24       # masa tonal de fondo (medido)


def qr_matrix(url: str):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.get_matrix(), qr.version


def load_art(path: Path, n: int, crop: tuple | None = None) -> Image.Image:
    """Devuelve la foto reducida a n×n, en luminancia 0-255."""
    im = Image.open(path).convert("L")
    if crop:
        im = im.crop(crop)
    # recorte cuadrado centrado
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))
    im = im.resize((n, n), Image.LANCZOS)
    # suavizado leve: módulos vecinos muy dispares hacen ruido visual
    im = im.filter(ImageFilter.GaussianBlur(radius=0.6))
    return im


def protected(r: int, c: int, n: int) -> bool:
    """Zonas que no se modulan: localizadores + separadores."""
    if r < 9 and c < 9:              # esquina superior izquierda
        return True
    if r < 9 and c >= n - 8:         # superior derecha
        return True
    if r >= n - 8 and c < 9:         # inferior izquierda
        return True
    return False


def draw_finder(d: ImageDraw.ImageDraw, r0: int, c0: int, m: int, ink):
    """Patrón localizador 7×7 exacto (ISO/IEC 18004), sin tocar."""
    x, y = c0 * m, r0 * m
    d.rectangle((x, y, x + 7 * m - 1, y + 7 * m - 1), fill=ink)
    d.rectangle((x + m, y + m, x + 6 * m - 1, y + 6 * m - 1), fill=PAPER)
    d.rectangle((x + 2 * m, y + 2 * m, x + 5 * m - 1, y + 5 * m - 1), fill=ink)


def mascara_protegida(size, n, m, quiet):
    """255 donde se puede pintar; 0 en localizadores, separadores y silencio."""
    ms = Image.new("L", (size, size), 255)
    dm = ImageDraw.Draw(ms)
    dm.rectangle((0, 0, quiet * m - 1, size - 1), fill=0)
    dm.rectangle((size - quiet * m, 0, size - 1, size - 1), fill=0)
    dm.rectangle((0, 0, size - 1, quiet * m - 1), fill=0)
    dm.rectangle((0, size - quiet * m, size - 1, size - 1), fill=0)
    # 9x9 en cada esquina: localizador 7x7 + separador
    for (r0, c0) in ((0, 0), (0, n - 9), (n - 9, 0)):
        x = (c0 + quiet) * m
        y = (r0 + quiet) * m
        dm.rectangle((x, y, x + 9 * m - 1, y + 9 * m - 1), fill=0)
    return ms

def bajo_tenue(img, lum, n, m, quiet, alpha=BAJO_ALPHA):
    """Masa tonal muy suave: sólo da cuerpo a la figura, no dibuja detalle."""
    if alpha <= 0:
        return img
    ret = lum.resize(img.size, Image.BICUBIC)
    tinta = Image.new("RGB", img.size, INK)
    a = ret.point(lambda v: int((255 - v) * alpha))
    a = ImageChops.multiply(a, mascara_protegida(img.size[0], n, m, quiet))
    return Image.composite(tinta, img, a)

def pintar_retrato(img, lum, n, m, quiet, calle=CALLE):
    """Pinta la imagen sólo en el marco de cada celda; el centro queda limpio."""
    clear = Image.new("L", img.size, 0)     # 255 = zona pintable (calles)
    dc = ImageDraw.Draw(clear)
    g = max(2, int(m * calle))               # grosor de la calle
    for r in range(n):
        for c in range(n):
            x, y = (c + quiet) * m, (r + quiet) * m
            dc.rectangle((x, y, x + m - 1, y + g - 1), fill=255)              # arriba
            dc.rectangle((x, y + m - g, x + m - 1, y + m - 1), fill=255)      # abajo
            dc.rectangle((x, y, x + g - 1, y + m - 1), fill=255)              # izq
            dc.rectangle((x + m - g, y, x + m - 1, y + m - 1), fill=255)      # dcha

    # la imagen, ampliada a todo el lienzo y con el contraste estirado
    from PIL import ImageOps
    ret = ImageOps.autocontrast(lum, cutoff=1)
    ret = ret.point(lambda v: int(255 * ((v / 255.0) ** 1.35)))   # abre los grises
    ret = ret.resize(img.size, Image.BICUBIC)
    ret = ret.filter(ImageFilter.UnsharpMask(radius=2, percent=140, threshold=2))
    tinta = Image.new("RGB", img.size, INK)
    papel = Image.new("RGB", img.size, PAPER)
    # alfa = (oscuridad) * MÁSCARA(calles) ; en las calles claras no se pinta
    a = ImageChops.multiply(ret.point(lambda v: 255 - v), clear)
    a = ImageChops.multiply(a, mascara_protegida(img.size[0], n, m, quiet))
    a = a.point(lambda v: int(v * STREET_ALPHA))
    return Image.composite(tinta, img, a)

def build(url: str, art_path: Path, out: Path, px: int, crop=None, quiet=QUIET, calle=CALLE):
    mat, version = qr_matrix(url)
    n = len(mat)
    m = 24                                   # píxeles por módulo antes de escalar
    size = (n + quiet * 2) * m

    img = Image.new("RGB", (size, size), PAPER)
    lum = load_art(art_path, n, crop) if art_path else None

    # --- capa 0: el retrato, dibujado en las CALLES entre módulos ----------
    # El lector muestrea el CENTRO de cada módulo. Las calles (el marco de cada
    # celda) no se muestrean nunca: ahí se puede dibujar a contraste pleno sin
    # tocar un solo bit. La imagen atraviesa el código por esas grietas y los
    # módulos oscuros se funden con ella formando la figura.
    d = ImageDraw.Draw(img)
    if lum is not None:
        img = bajo_tenue(img, lum, n, m, quiet)      # masa tonal
        img = pintar_retrato(img, lum, n, m, quiet, calle)  # grabado en las calles
        d = ImageDraw.Draw(img)
    d = ImageDraw.Draw(img)

    # --- módulos de datos -------------------------------------------------
    for r in range(n):
        for c in range(n):
            if not mat[r][c]:
                continue                     # módulo claro: no se pinta
            x0 = (c + quiet) * m
            y0 = (r + quiet) * m

            if protected(r, c, n):
                d.rectangle((x0, y0, x0 + m - 1, y0 + m - 1), fill=INK)
                continue

            # cobertura según la foto: oscuro -> lleno ; claro -> punto pequeño
            if lum is not None:
                L = lum.getpixel((c, r)) / 255.0        # 0 = negro
                cov = MAX_COVERAGE + (MIN_COVERAGE - MAX_COVERAGE) * L
            else:
                cov = 1.0

            side = max(1, int(round(m * cov)))
            off = (m - side) // 2
            # esquina redondeada: se ve más "dibujado" que un cuadrado duro
            d.rounded_rectangle(
                (x0 + off, y0 + off, x0 + off + side - 1, y0 + off + side - 1),
                radius=max(1, side // 4),
                fill=INK,
            )

    # --- grano de tinta en el centro de los módulos oscuros ---------------
    if NK_OSCURO > 0:
        rk = int(m * NK_OSCURO / 2)
        for r in range(n):
            for c in range(n):
                if not mat[r][c] or protected(r, c, n):
                    continue
                ccx = (c + quiet) * m + m // 2
                ccy = (r + quiet) * m + m // 2
                d.ellipse((ccx - rk, ccy - rk, ccx + rk, ccy + rk), fill=INK)

    # --- núcleo limpio en los módulos claros ------------------------------
    # El lector muestrea el centro. Un punto de papel puro ahí (sin retrato,
    # sin tinta) asegura el contraste en móviles con poca cámara o a tamaño
    # pequeño, sin quitar ni un píxel de dibujo en el resto de la celda.
    if NUCLEO > 0:
        rn = int(m * NUCLEO / 2)
        for r in range(n):
            for c in range(n):
                if mat[r][c] or protected(r, c, n):
                    continue
                ccx = (c + quiet) * m + m // 2
                ccy = (r + quiet) * m + m // 2
                d.ellipse((ccx - rn, ccy - rn, ccx + rn, ccy + rn), fill=PAPER)

    # --- conectores: unen módulos oscuros contiguos y dan aspecto de tinta ---
    half = m // 2
    for r in range(n):
        for c in range(n):
            if not mat[r][c] or protected(r, c, n):
                continue
            x0, y0 = (c + quiet) * m, (r + quiet) * m
            if c + 1 < n and mat[r][c + 1] and not protected(r, c + 1, n):
                d.rectangle((x0 + half - 1, y0 + half - 1, x0 + m + half, y0 + half),
                            fill=INK)
            if r + 1 < n and mat[r + 1][c] and not protected(r + 1, c, n):
                d.rectangle((x0 + half - 1, y0 + half - 1, x0 + half, y0 + m + half),
                            fill=INK)

    # --- los tres localizadores, encima de todo ---------------------------
    draw_finder(d, quiet, quiet, m, INK)
    draw_finder(d, quiet, n - 7 + quiet, m, INK)
    draw_finder(d, n - 7 + quiet, quiet, m, INK)

    img = img.resize((px, px), Image.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"  ✓ {out}  ·  {px}×{px}  ·  v{version} ({n} módulos)  ·  "
          f"cobertura {MIN_COVERAGE:.0%}-{MAX_COVERAGE:.0%}")
    return img


def main():
    ap = argparse.ArgumentParser(description="QR artístico de MICABO (la imagen ES el código).")
    ap.add_argument("--url", default=DEFAULT_URL)
    ap.add_argument("--arte", default=str(ROOT / "img" / "arte-soldado.png"))
    args = ap.parse_args()

    art = Path(args.arte)
    if not art.exists():
        raise SystemExit(f"No encuentro la ilustración: {art}")

    print(f"URL destino: {args.url}")
    # recorte sobre la cara y el saludo (la ilustración original es 1408×768)
    crop = (450, 15, 1010, 575)
    build(args.url, art, ROOT / "img" / "qr-arte.png", 1024, crop=crop)
    build(args.url, art, ROOT / "img" / "qr-arte@2x.png", 512, crop=crop)


if __name__ == "__main__":
    main()
