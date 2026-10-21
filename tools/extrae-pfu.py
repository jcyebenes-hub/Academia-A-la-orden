#!/usr/bin/env python3
"""
MICABO · Extractor de las Pruebas Físicas Unificadas (PFU)

Fuente única y oficial: Orden DEF/15/2026, de 13 de enero (BOE núm. 19, 21-ene-2026),
BOE-A-2026-1379. Se descarga el XML del BOE y de ahí salen, sin tocar a mano:

  · Anexo II  → los cuatro baremos de puntuación (0-100) por edad y sexo.
  · Anexo III → las marcas mínimas de cada proceso (tropa, oficiales/suboficiales,
                permanencia, mayores de 45...).

Uso:
    python3 tools/extrae-pfu.py                 # descarga el BOE y escribe js/pfu-data.js
    python3 tools/extrae-pfu.py --xml boe.xml   # usa un XML ya descargado
    python3 tools/extrae-pfu.py --informe       # solo enseña lo que ha sacado
"""

import argparse
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL = "https://www.boe.es/diario_boe/xml.php?id=BOE-A-2026-1379"
FUENTE = "Orden DEF/15/2026 (BOE-A-2026-1379) · BOE núm. 19, 21-ene-2026"


def tablas(xml):
    return re.findall(r"<table.*?</table>", xml, re.S)


def filas(tabla):
    out = []
    for r in re.findall(r"<tr.*?</tr>", tabla, re.S):
        celdas = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", c)).strip()
                  for c in re.findall(r"<t[dh].*?</t[dh]>", r, re.S)]
        out.append(celdas)
    return out


def segundos(txt):
    """«5:15» o «11´54´´» → segundos enteros."""
    t = txt.replace("´", "'").replace("’", "'")
    m = re.match(r"^(\d+)[:'\s](\d{1,2})", t)
    if m:
        return int(m.group(1)) * 60 + int(m.group(2))
    m = re.match(r"^(\d+)$", t)
    return int(m.group(1)) if m else None


def baremo(fs, con_sexo, grupos):
    """Convierte una tabla de puntuación en [{marca, p:{grupo:{M,F}}}]."""
    datos = []
    for r in fs[1:]:
        if len(r) < 2:
            continue
        marca = r[0]
        if not re.match(r"^[\d:,]+$", marca):
            continue
        if con_sexo:
            if len(r) != 2 + 2 * len(grupos):
                continue
            puntos = {g: {"M": int(r[1 + 2 * i]), "F": int(r[2 + 2 * i])}
                      for i, g in enumerate(grupos)}
        else:
            if len(r) != 2 + len(grupos):
                continue
            puntos = {g: {"M": int(r[1 + i]), "F": int(r[1 + i])}
                      for i, g in enumerate(grupos)}
        datos.append({"marca": marca, "p": puntos})
    return datos


def minimas(fs):
    """Tabla de marcas mínimas → {prueba: {columna: {H: valor, M: valor}}}."""
    cab = fs[0]
    cols = cab[2:]
    out, actual = {}, None
    for r in fs[1:]:
        if len(r) < 3:
            continue
        # una fila abre prueba nueva cuando su primera celda no es el sexo
        if r[0] in ("H", "M"):
            prueba, sexo, vals = actual, r[0], r[1:]
        else:
            prueba, sexo, vals = r[0], r[1], r[2:]
            actual = prueba
        d = out.setdefault(prueba, {})
        for i, v in enumerate(cols):
            if i < len(vals):
                d.setdefault(v, {})[sexo] = vals[i]
    return out


def bandas_permanencia(fs):
    """Tabla 5.º (permanencia): cada prueba da 0-5 puntos según la marca."""
    valores = [5, 4, 3, 2, 1, 0]
    out, actual = {}, None
    for r in fs[1:]:
        if not r or r[0] in ("Valor.", "Valor"):
            break
        if r[0] in ("H", "M"):
            prueba, sexo, vals = actual, r[0], r[1:]
        else:
            prueba, sexo, vals = r[0], r[1], r[2:]
            actual = prueba
        if prueba is None or len(vals) < 6:
            continue
        out.setdefault(prueba, {})[sexo] = [
            {"banda": vals[i].replace("´´", "\u2033").replace("´", "\u2032"), "puntos": valores[i]}
            for i in range(6)]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--xml")
    ap.add_argument("--informe", action="store_true")
    args = ap.parse_args()

    if args.xml:
        xml = Path(args.xml).read_text(encoding="utf-8")
    else:
        print("descargando", URL)
        xml = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8")

    T = tablas(xml)
    if len(T) < 11:
        raise SystemExit("El BOE no tiene la forma esperada (%d tablas)" % len(T))

    grupos = ["17-25", "26-30", "31-35", "36-40", "41-45", "46-50", "51-55", "56-59", "60+"]
    grupos_cav = grupos[:5]

    pruebas = {
        "flexiones": {
            "nombre": "Flexo-extensiones de brazos",
            "corto": "Flexiones",
            "unidad": "repeticiones",
            "tipo": "asc",           # más es mejor
            "detalle": "2 minutos, barbilla en almohadilla de 10 cm",
            "baremo": baremo(filas(T[0]), True, grupos),
        },
        "plancha": {
            "nombre": "Plancha isométrica",
            "corto": "Plancha",
            "unidad": "tiempo",
            "tipo": "asc",
            "detalle": "Isométrica: aguantar la posición sin apoyar rodillas ni bajar la cadera",
            "baremo": baremo(filas(T[1]), False, grupos),
        },
        "carrera": {
            "nombre": "Carrera de 2.000 m",
            "corto": "2.000 m",
            "unidad": "tiempo",
            "tipo": "desc",          # menos es mejor
            "detalle": "2.000 m en pista o terreno firme, regular y compacto",
            "baremo": baremo(filas(T[2]), True, grupos),
        },
        "soltura": {
            "nombre": "Soltura acuática (50 m)",
            "corto": "Soltura 50 m",
            "unidad": "tiempo",
            "tipo": "desc",
            "solo_marcas": True,       # el Anexo II no le da baremo 0-100
            "detalle": "50 m libres en piscina de al menos 25 m, sin pararse ni apoyarse",
            "baremo": [],
        },
        "cav": {
            "nombre": "Circuito de agilidad-velocidad",
            "corto": "CAV",
            "unidad": "segundos",
            "tipo": "desc",
            "detalle": "Circuito de agilidad y velocidad: cambios rápidos de dirección y ritmo",
            "baremo": baremo(filas(T[3]), True, grupos_cav),
        },
    }

    procesos = {
        "tropa_ingreso": {
            "nombre": "Tropa y marinería · ingreso",
            "columnas": ["Ingreso"], "marcas": minimas(filas(T[4]))},
        "tropa_egreso": {
            "nombre": "Tropa y marinería · fin de la formación",
            "columnas": ["Al finalizar la fase de formación militar general",
                         "Al finalizar la enseñanza de formación"],
            "marcas": minimas(filas(T[4]))},
        "oficiales": {
            "nombre": "Oficiales y suboficiales (Cuerpos Generales)",
            "columnas": ["Ingreso carrera y complemento", "Curso 1.º", "Curso 2.º",
                         "Curso 3.º", "Curso 4.º", "Curso 5.º"],
            "marcas": minimas(filas(T[5]))},
        "permanencia": {
            "nombre": "Permanencia · tropa a relación de servicios permanente",
            "bandas_puntos": bandas_permanencia(filas(T[9])),
            "max": 15,
            "nota": "Cada prueba puntúa de 0 a 5. El BOE fija un máximo de 15 puntos."},
        "mayores45": {
            "nombre": "Mayores de 45 · promoción",
            "columnas": ["Ingreso"], "marcas": minimas(filas(T[10]))},
    }

    # ------- comprobación -------
    for k, p in pruebas.items():
        if not p["baremo"] and not p.get("solo_marcas"):
            raise SystemExit("baremo vacío: " + k)
    if args.informe:
        for k, p in pruebas.items():
            b = p["baremo"]
            print("%-10s %3d filas · de %s a %s" % (k, len(b), b[0]["marca"], b[-1]["marca"]))
        for k, pr in procesos.items():
            print("%-14s %s" % (k, list((pr.get("marcas") or pr.get("bandas_puntos")).keys())))
        return

    datos = {
        "fuente": FUENTE,
        "regla_apto": {
            "puntos_por_prueba": 20,
            "texto": "Art. 12.1: para la evaluación periódica hay que alcanzar 20 puntos en cada prueba para ser apto.",
            "en_vigor": "2027-01-01"},
        "url": "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1379",
        "grupos": grupos,
        "pruebas": pruebas,
        "procesos": procesos,
    }
    js = ("/* MICABO · PRUEBAS FÍSICAS UNIFICADAS · datos oficiales\n"
          "   Fuente: %s\n"
          "   Generado por tools/extrae-pfu.py — NO editar a mano. */\n"
          '"use strict";\n'
          "window.PFU = %s;\n") % (FUENTE, json.dumps(datos, ensure_ascii=False, separators=(",", ":")))
    destino = ROOT / "js" / "pfu-data.js"
    destino.write_text(js, encoding="utf-8")
    print("escrito:", destino, "·", round(destino.stat().st_size / 1024), "KB")


if __name__ == "__main__":
    main()
