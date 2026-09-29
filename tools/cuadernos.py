#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Cuadernos GALÓN · genera un PDF por tema (elaboración propia) desde js/bank7.js (lote examinador).
# 100% contenido propio: sin material de terceros (InfoTroPa, academias). Descargable por los usuarios.
import io, re, os, sys

BANK = io.open('js/bank7.js', encoding='utf-8').read()
SLUGS = {
    "Reales Ordenanzas": "reales-ordenanzas", "Régimen Disciplinario": "regimen-disciplinario",
    "Código Penal Militar": "codigo-penal-militar", "Derechos y deberes": "derechos-y-deberes",
    "Organización de la Defensa": "organizacion-defensa", "Carrera militar": "carrera-militar",
    "Organización del ET": "organizacion-et", "Enseñanza militar": "ensenanza-militar",
    "Transmisiones": "transmisiones", "Topografía": "topografia",
    "Primeros auxilios": "primeros-auxilios", "Constitución": "constitucion",
    "Instrucción del combatiente": "instruccion-combatiente", "OTAN y UE": "otan-y-ue", "Armamento y tiro": "armamento-y-tiro", "Logística": "logistica", "Instrucción cívica": "instruccion-civica",
}
TITLE_DESC = {
    "Reales Ordenanzas": "RD 96/2009 y deberes militares", "Régimen Disciplinario": "LO 8/2014",
    "Código Penal Militar": "LO 85/1998 y LO 14/2015", "Derechos y deberes": "Ley 39/2007 y su desarrollo",
    "Organización de la Defensa": "Ley 5/2005, estructuras y órganos", "Carrera militar": "Ley 39/2007 y RD 502/2020",
    "Organización del ET": "RD 847/2015 y Orden DEF/708/2020", "Enseñanza militar": "RD 416/2014 y sistema de enseñanza",
    "Transmisiones": "Sistema PR4G y Mando de Transmisiones", "Topografía": "Mapa, orientación y coordenadas",
    "Primeros auxilios": "Guías ERC 2025 y Cruz Roja", "Constitución": "CE de 1978 y sus 4 reformas",
    "Instrucción del combatiente": "Marchas, protección, patrullas y NBQ", "OTAN y UE": "Alianza Atlántica y Unión Europea", "Armamento y tiro": "G36, USP y teoría del tiro", "Logística": "Abastecimiento, mantenimiento y BRILOG", "Instrucción cívica": "Símbolos, himno, patronas y condecoraciones",
}

def filas():
    out = []
    for ln in BANK.split('\n'):
        if not ln.startswith('{c:"cabo"'): continue
        s = ln.replace('\\"', '\x00')
        m = re.match(r'\{c:"([^"]*)",b:"([^"]*)",t:"([^"]*)",d:"([^"]*)",id:"([^"]*)",q:"(.*)",o:\[(.*)\],a:(\d),x:"(.*)",r:"(.*)"\}', s)
        if not m: continue
        c, b, t, d, qid, q, o, a, x, r = m.groups()
        ops = re.findall(r'"(.*?)"(?:,|$)', o)
        if len(ops) != 4: continue
        out.append({'t': t, 'd': d, 'id': qid, 'q': q.replace('\x00', '"'), 'o': [p.replace('\x00', '"') for p in ops], 'a': int(a), 'x': x.replace('\x00', '"'), 'r': r.replace('\x00', '"')})
    return out

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.colors import HexColor
from xml.sax.saxutils import escape

pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
LIMPIA = re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\u2190-\u21FF]+')
def limp(t): return LIMPIA.sub('', t).strip()

st_titulo = ParagraphStyle('t', fontName='DejaVuB', fontSize=17, leading=22, textColor=HexColor('#0d1b3d'))
st_sub = ParagraphStyle('s', fontName='DejaVu', fontSize=9.5, leading=13, textColor=HexColor('#444455'))
st_q = ParagraphStyle('q', fontName='DejaVuB', fontSize=10.5, leading=14, spaceBefore=9)
st_o = ParagraphStyle('o', fontName='DejaVu', fontSize=10, leading=13.5, leftIndent=14)
st_ok = ParagraphStyle('ok', fontName='DejaVuB', fontSize=10, leading=13.5, leftIndent=14, textColor=HexColor('#0a6b3d'))
st_x = ParagraphStyle('x', fontName='DejaVu', fontSize=8.5, leading=11.5, textColor=HexColor('#555566'), leftIndent=14, spaceBefore=2)

todas = filas()
temas = []
for t in SLUGS:
    qs = [q for q in todas if q['t'] == t]
    if qs: temas.append((t, qs))
os.makedirs('pdf', exist_ok=True)
manifest = []
for i, (t, qs) in enumerate(temas, 1):
    fich = 'galon-cabo-%02d-%s.pdf' % (i, SLUGS[t])
    doc = SimpleDocTemplate('pdf/' + fich, pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm,
                            title='GALÓN · Cabo · %s' % t, author='GALÓN (elaboración propia)')
    E = []
    E.append(Paragraph('GALÓN · Curso de Cabo (ET)', st_titulo))
    E.append(Spacer(1, 3*mm))
    E.append(Paragraph('%s — %s' % (t, TITLE_DESC.get(t, '')), st_titulo))
    E.append(Spacer(1, 4*mm))
    E.append(Paragraph('Cuaderno de estudio: %d preguntas con respuesta, explicación y referencia normativa. '
                       'Elaboración PROPIA de GALÓN sobre fuentes oficiales verificadas (BOE, MINISDEF, IGN, ERC, Cruz Roja). '
                       'Libre para uso personal; prohibida su venta. Generado 21-sep-2026. App: galon · banco auditado.' % len(qs), st_sub))
    E.append(Spacer(1, 6*mm))
    LET = 'ABCD'
    for n, q in enumerate(qs, 1):
        E.append(Paragraph('%d. [%s] %s' % (n, q['d'], escape(limp(q['q']))), st_q))
        for j, op in enumerate(q['o']):
            marca = ' ✔' if j == q['a'] else ''
            E.append(Paragraph('%s) %s%s' % (LET[j], escape(limp(op)), marca), st_ok if j == q['a'] else st_o))
        E.append(Paragraph('Explicación: %s · Ref: %s' % (escape(limp(q['x'])), escape(limp(q['r']))), st_x))
    doc.build(E)
    kb = os.path.getsize('pdf/' + fich) // 1024
    manifest.append((fich, t, len(qs), kb))
    print('%s · %s · %d preg · %d KB' % (fich, t, len(qs), kb))
io.open('pdf/MANIFIESTO.txt', 'w', encoding='utf-8').write('\n'.join('%s|%s|%d|%d' % m for m in manifest))
print('TOTAL temas:', len(temas), '· preguntas:', sum(len(q) for _, q in temas))
