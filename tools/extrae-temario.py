#!/usr/bin/env python3
"""
MICABO · Extractor del temario oficial de Cabo (CEFOT 1 · actualización nov-2025)

Lee el volcado de texto del PDF y devuelve la teoría troceada TEMA A TEMA,
limpia y en HTML simple, lista para que la app la pinte dentro de cada tema.

Los cortes NO están a ojo: se localizan los encabezados reales «TEMA n:» del
cuerpo del documento, saltándose la página de índice de cada bloque.

Uso:
    python3 tools/extrae-temario.py             # genera js/teoria-cabo.js
    python3 tools/extrae-temario.py --informe   # solo enseña el reparto

No guarda el PDF: trabaja sobre /home/user/teoria-txt/CABO_TEMARIO_NOV2025.txt
"""

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TXT = ROOT.parent / "teoria-txt" / "CABO_TEMARIO_NOV2025.txt"

# (capítulo, bloque, título del bloque, línea del CUERPO del bloque, [títulos de los temas])
ESTRUCTURA = [
    (1, 1, "Reales Ordenanzas para las Fuerzas Armadas", 284, [
        "Disposiciones generales", "Del Militar", "De la Disciplina",
        "De la acción del Mando", "De las Operaciones"]),
    (1, 2, "Seguridad en las Fuerzas Armadas", 725, [
        "RD 194/2010 · Normas de seguridad en las FAS",
        "OM 50/2011 · Normas sobre mando y régimen interior"]),
    (1, 3, "Mando y Régimen Interior (OM 50/2011)", 1127, [
        "Disposiciones generales", "De la acción del mando", "Del régimen interior",
        "Los servicios de las instalaciones", "Las guardias"]),
    (1, 4, "Régimen Disciplinario y Código Penal Militar", 1639, [
        "LO 8/2014 · Régimen Disciplinario de las FAS",
        "LO 14/2015 · Código Penal Militar"]),
    (1, 5, "Organización del ET y situaciones administrativas", 2898, [
        "Instrucción 14/2021 · Organización del Ejército de Tierra",
        "Situaciones administrativas (Ley 39/2007)"]),
    (1, 6, "LO 9/2011 · Derechos y deberes de los militares", 3654, [
        "Disposiciones generales", "Derechos y deberes de carácter profesional",
        "Asociaciones profesionales", "Del Observatorio de la Vida Militar",
        "RD 176/2014 · Iniciativas y quejas"]),
    (1, 7, "Liderazgo", 4090, [
        "Modelo de liderazgo K-2", "Mando orientado a la misión (MoM)"]),
    (2, 1, "Instrucción técnica y táctica del combatiente", 4386, [
        "Instrucción técnica de combate", "Instrucción táctica · Escuadra/Equipo"]),
    (2, 2, "Topografía", 6272, [
        "Cartografía", "Orientación", "Navegación"]),
    (2, 3, "Armamento y teoría del tiro", 7162, [
        "Normas generales en el uso y manejo de las armas", "Fusil de asalto HK G-36",
        "Pistola HK USP Compact", "Ametralladora MG-42", "Teoría del tiro"]),
]

# Línea donde arranca la cabecera del bloque siguiente (o el final del texto).
# Sirve de tope: así no se cuela la página de índice del bloque que viene detrás.
CORTES = [685, 1077, 1603, 2856, 3596, 4064, 4321, 6220, 7127, None]

RUIDO = [
    re.compile(r"^TEMARIO\s+OPOSICI[ÓO]N\s+ASCENSO\s+A\s+CABO\s*$", re.I),
    re.compile(r"^=+\s*P[ÁA]GINA\s+\d+\s*=+$", re.I),
    re.compile(r"^\d+-[IVX]+-\d+$"),          # códigos de página tipo 1-I-4
    re.compile(r"^\s*\d{1,3}\s*$"),           # número de página suelto
    re.compile(r"^BLOQUE\.?\s*[-–]?\s*[IVX]+\.?$", re.I),
    re.compile(r"^CAP[ÍI]TULO\s+[IVX]+\.?$", re.I),
]
HEAD_TEMA = re.compile(r"^TEMA\s+\d+\s*[:.]")
HEAD_MAYUS = re.compile(r"^[A-ZÁÉÍÓÚÜÑ0-9][A-ZÁÉÍÓÚÜÑ0-9 \.,\-()/]{5,69}$")
ITEM_NUM = re.compile(r"^\d{1,2}\s*(?:\.-|-|\.)\s*")
HEAD_ART = re.compile(r"^(Art[íi]culo\s+\d+[\.\s]?.*?)$")
HEAD_AP = re.compile(r"^((?:CAP[ÍI]TULO|SECCI[ÓO]N|T[ÍI]TULO)\s+[IVXLC0-9]+.*?)$", re.I)


PALABRAS_COMUNES = {
    "a", "e", "o", "u", "y", "de", "del", "el", "la", "los", "las", "un", "una", "unos", "unas",
    "en", "con", "por", "para", "que", "se", "su", "sus", "al", "lo", "le", "les", "no", "ni",
    "si", "es", "son", "ser", "ha", "han", "he", "hay", "mas", "más", "ya", "como", "cuando",
    "donde", "este", "esta", "estos", "estas", "ese", "esa", "aquel", "me", "te", "nos", "mi",
    "tu", "mis", "tus", "sin", "sobre", "tras", "ante", "bajo", "cabe", "contra", "desde",
    "entre", "hacia", "hasta", "según", "durante", "mediante",
}


def vocabulario(trozos):
    """Palabras que el propio documento usa muchas veces: sirven para recomponer
    las que el PDF parte por la mitad («p rofesionales» → «profesionales»)."""
    cuenta = {}
    for lineas in trozos:
        for ln in lineas:
            for w in re.findall(r"[a-záéíóúüñ]{4,}", ln.lower()):
                cuenta[w] = cuenta.get(w, 0) + 1
    return cuenta


def une_palabras(lineas, vocab):
    """Recompone palabras que el PDF ha partido con un espacio de más."""
    salida = []
    for ln in lineas:
        toks = ln.split(" ")
        i, out = 0, []
        while i < len(toks):
            if i + 1 < len(toks):
                a = re.sub(r"[^a-záéíóúüñ]", "", toks[i].lower())
                b = re.sub(r"[^a-záéíóúüñ]", "", toks[i + 1].lower())
                junto = a + b
                if (a and b and 1 <= len(a) <= 3 and a not in PALABRAS_COMUNES
                        and vocab.get(junto, 0) >= 4 and vocab.get(a, 0) < 2):
                    out.append(toks[i] + toks[i + 1])
                    i += 2
                    continue
            out.append(toks[i])
            i += 1
        salida.append(" ".join(out))
    return salida


def limpia(lineas):
    """Convierte las líneas crudas del PDF en HTML simple y legible."""
    out = []
    parrafo = []
    en_lista = [False]

    def cierra_lista():
        if en_lista[0]:
            out.append("</ul>")
            en_lista[0] = False

    def cierra():
        if parrafo:
            txt = re.sub(r"\s+", " ", " ".join(parrafo)).strip()
            if len(txt) > 1:
                out.append("<p>" + html.escape(txt) + "</p>")
            parrafo.clear()

    for raw in lineas:
        ln = raw.strip()
        if not ln:
            cierra()
            continue
        if any(r.match(ln) for r in RUIDO):
            continue

        if HEAD_TEMA.match(ln) and len(ln) < 130:
            cierra(); cierra_lista()
            out.append("<h3>" + html.escape(re.sub(r"\s+", " ", ln)) + "</h3>")
            continue

        # tablas de dos columnas tipo «1.- Bocacha   11.- Palanca»: se leen como lista
        columnas = [c.strip() for c in re.split(r"\s{2,}", ln) if c.strip()]
        if len(columnas) >= 2 and sum(1 for c in columnas if re.match(r"^\d{1,2}\b", c)) >= 2:
            cierra()
            if not en_lista[0]:
                out.append("<ul class=\"teo-lista\">"); en_lista[0] = True
            for c in columnas:
                c = re.sub(r"^\d{1,2}\s*(?:\.-|-|\.)?\s*", "", c)
                if c:
                    out.append("<li>" + html.escape(c) + "</li>")
            continue

        # subtítulo del documento en MAYÚSCULAS («DATOS GENERALES.»)
        if HEAD_MAYUS.match(ln) and len(ln.split()) >= 2 and not re.match(r"^[\d\s.\-]+$", ln):
            cierra(); cierra_lista()
            out.append("<h3>" + html.escape(re.sub(r"\s+", " ", ln)) + "</h3>")
            continue

        # elemento suelto de lista numerada
        if ITEM_NUM.match(ln) and len(ln) < 160:
            cierra()
            if not en_lista[0]:
                out.append("<ul class=\"teo-lista\">"); en_lista[0] = True
            out.append("<li>" + html.escape(ITEM_NUM.sub("", ln)) + "</li>")
            continue

        m = HEAD_ART.match(ln)
        if m and len(ln) < 90:
            cierra(); cierra_lista()
            out.append("<h4>" + html.escape(re.sub(r"\s+", " ", ln)) + "</h4>")
            continue

        m = HEAD_AP.match(ln)
        if m and len(ln) < 90:
            cierra(); cierra_lista()
            out.append("<h3>" + html.escape(re.sub(r"\s+", " ", ln)) + "</h3>")
            continue

        # viñetas
        if re.match(r"^[•\-–]\s+", ln):
            cierra(); cierra_lista()
            parrafo.append("• " + re.sub(r"^[•\-–]\s+", "", ln))
            continue

        # apartados numerados: «1. …», «2.3. …», «a) …» → párrafo propio
        if re.match(r"^(\d+(\.\d+)*\.|[a-z]\))\s+\S", ln):
            cierra(); cierra_lista()
            parrafo.append(ln)
            continue

        cierra_lista()
        parrafo.append(ln)

    cierra(); cierra_lista()
    return "".join(out)


def marcas_tema(lineas, ini, fin):
    """Dónde empieza de verdad cada tema dentro del cuerpo de un bloque.
    Se salta la página de índice (que repite todos los «TEMA n» seguidos)."""
    vistas = {}
    for i in range(ini - 1, min(fin, len(lineas))):
        m = re.match(r"^TEMA\s+(\d+)\s*[:.]", lineas[i].strip())
        if not m:
            continue
        n = int(m.group(1))
        if n not in vistas:
            # el índice lista los temas en pocas líneas seguidas: si el anterior
            # marcado está a menos de 6 líneas, es índice, no cuerpo
            vistas[n] = i
    # descarta marcas que formen parte de la lista de índice
    orden = sorted(vistas.items())
    limpio = {}
    for n, i in orden:
        previos = [j for _, j in limpio.items() if j < i]
        if not previos or i - max(previos) > 6:
            limpio[n] = i
    return limpio


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--informe", action="store_true")
    args = ap.parse_args()

    if not TXT.exists():
        raise SystemExit("Falta el volcado de texto: " + str(TXT))
    lineas = TXT.read_text(encoding="utf-8", errors="replace").splitlines()

    # 1) localizar los 33 trozos
    trozos = []
    for k, (cap, nb, titulo_bloque, arranque, titulos) in enumerate(ESTRUCTURA):
        fin_bloque = CORTES[k] if CORTES[k] else len(lineas)
        marcas = marcas_tema(lineas, arranque, fin_bloque)
        for ntema, titulo in enumerate(titulos, start=1):
            if ntema not in marcas:
                raise SystemExit("No encuentro el TEMA {} del bloque {}.{}".format(ntema, cap, nb))
            ini = marcas[ntema]
            fin = marcas.get(ntema + 1, fin_bloque - 1)
            trozos.append((cap, nb, ntema, titulo, lineas[ini:fin]))

    # 2) vocabulario del propio documento, para recomponer palabras partidas
    vocab = vocabulario([t[4] for t in trozos])

    total = 0
    piezas = []
    _cache = {}
    for k, (cap, nb, titulo_bloque, arranque, titulos) in enumerate(ESTRUCTURA):
        fin_bloque = CORTES[k] if CORTES[k] else len(lineas)
        clave = "cabo:{}.{}".format(cap, nb)
        marcas = marcas_tema(lineas, arranque, fin_bloque)
        cuerpo = {}
        for ntema, titulo in enumerate(titulos, start=1):
            cap_i, nb_i, nt_i, tit_i, crudo = next(
                t for t in trozos if t[0] == cap and t[1] == nb and t[2] == ntema)
            h = limpia(une_palabras(crudo, vocab))
            cuerpo[str(ntema)] = h
            total += len(h)
            if args.informe:
                print("B{}.{} T{:<2} {:<52} {:>7} car · {:>3} párrafos".format(
                    cap, nb, ntema, titulo[:52], len(h), h.count("<p>")))
        piezas.append((clave, cuerpo))

    print("\nTOTAL teoría: {:,} caracteres ({:.0f} KB)".format(total, total / 1024))
    if args.informe:
        return

    js = [
        "/* MICABO · TEORÍA DEL TEMARIO OFICIAL DE CABO (CEFOT 1, actualización nov-2025)",
        "   Generado automáticamente por tools/extrae-temario.py.",
        "   Clave: \"cabo:capítulo.bloque\" → { nTema: html }. */",
        '"use strict";',
        "window.TEORIA = window.TEORIA || {};",
    ]
    for clave, cuerpo in piezas:
        js.append("window.TEORIA[{}] = {{".format(json.dumps(clave)))
        for n, h in cuerpo.items():
            js.append("{}: {},".format(json.dumps(n), json.dumps(h, ensure_ascii=False)))
        js.append("};")
    destino = ROOT / "js" / "teoria-cabo.js"
    destino.write_text("\n".join(js), encoding="utf-8")

    # mapa ligero aparte (≈700 bytes): el índice sabe qué temas traen teoría sin
    # cargar los 480 KB. Este sí puede ir en el núcleo del service worker.
    idx = {clave: [int(n) for n in sorted(cuerpo, key=int)] for clave, cuerpo in piezas}
    ligero = ['/* MICABO · índice de teoría disponible (generado por tools/extrae-temario.py) */',
              '"use strict";', 'window.TEORIA_IDX = {};']
    for clave, ns in idx.items():
        ligero.append("window.TEORIA_IDX[{}] = {};".format(json.dumps(clave), json.dumps(ns)))
    (ROOT / "js" / "teoria-idx.js").write_text("\n".join(ligero), encoding="utf-8")
    print("escrito:", destino, "·", round(destino.stat().st_size / 1024), "KB")


if __name__ == "__main__":
    main()
