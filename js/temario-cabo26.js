/* MICABO · TEMARIO OFICIAL DE CABO (ET)
   ---------------------------------------------------------------------------
   Estructura EXACTA del temario oficial: DIREN CEFOT 1, «Temario oposición
   ascenso a Cabo del ET», actualización noviembre 2025.
   2 capítulos · 10 bloques · 33 temas. La numeración de temas se reinicia en
   cada bloque, igual que en el documento original.

   LA TEORÍA NO ESTÁ AQUÍ: está en js/teoria-cabo.js, generada del propio PDF
   por tools/extrae-temario.py. Cada bloque apunta a su clave con `teoriaKey`
   («cabo:1.1» … «cabo:1.7» en el capítulo 1; «cabo:2.1» … «cabo:2.3» en el 2).

   `banco` = nombres de tema del banco de preguntas que alimentan el test.
   --------------------------------------------------------------------------- */
"use strict";
window.TEMARIO_CABO26 = {
  actualizado: "20-oct-2026",
  fuente: "Temario oficial CEFOT 1 · actualización noviembre 2025",
  capitulos: {
    1: "Formación general militar",
    2: "Instrucción táctica y técnica"
  },
  bloques: [
    /* =================== CAPÍTULO 1 · FORMACIÓN GENERAL MILITAR =================== */
    {
      n: 1, cap: 1, teoriaKey: "cabo:1.1", key: "1.1",
      titulo: "Reales Ordenanzas para las FAS",
      normativa: "Real Decreto 96/2009",
      temas: [
        { n: 1, titulo: "Disposiciones generales", banco: ["Reales Ordenanzas"] },
        { n: 2, titulo: "Del Militar", banco: ["Reales Ordenanzas"] },
        { n: 3, titulo: "De la Disciplina", banco: ["Reales Ordenanzas"] },
        { n: 4, titulo: "De la acción del Mando", banco: ["Reales Ordenanzas"] },
        { n: 5, titulo: "De las Operaciones", banco: ["Reales Ordenanzas"] }
      ]
    },
    {
      n: 2, cap: 1, teoriaKey: "cabo:1.2", key: "1.2",
      titulo: "Seguridad en las Fuerzas Armadas",
      normativa: "RD 194/2010 · OM 50/2011",
      temas: [
        { n: 1, titulo: "RD 194/2010 · Normas de seguridad en las FAS", banco: ["Seguridad en las FAS"],
          contenidos: ["Disposiciones generales.", "Plan de Seguridad.", "De las Guardias de Seguridad.", "De la Policía Militar."] },
        { n: 2, titulo: "OM 50/2011 · Mando y régimen interior", banco: ["Seguridad en las FAS"],
          contenidos: ["Guardias de Seguridad."] }
      ]
    },
    {
      n: 3, cap: 1, teoriaKey: "cabo:1.3", key: "1.3",
      titulo: "Mando y Régimen Interior",
      normativa: "Orden Ministerial 50/2011",
      temas: [
        { n: 1, titulo: "Disposiciones generales", banco: ["Régimen Interior"] },
        { n: 2, titulo: "De la acción del mando", banco: ["Régimen Interior"] },
        { n: 3, titulo: "Del Régimen Interior", banco: ["Régimen Interior"] },
        { n: 4, titulo: "Los servicios de las instalaciones", banco: ["Régimen Interior"] },
        { n: 5, titulo: "Las guardias", banco: ["Régimen Interior"] }
      ]
    },
    {
      n: 4, cap: 1, teoriaKey: "cabo:1.4", key: "1.4",
      titulo: "Régimen Disciplinario y Código Penal Militar",
      normativa: "LO 8/2014 · LO 14/2015",
      temas: [
        { n: 1, titulo: "LO 8/2014 · Régimen Disciplinario de las FAS", banco: ["Régimen Disciplinario"],
          contenidos: ["Disposiciones generales.", "Faltas y sanciones.", "Potestad disciplinaria y competencia sancionadora.", "Procedimiento sancionador.", "Ejecución de las sanciones.", "Recursos."] },
        { n: 2, titulo: "LO 14/2015 · Código Penal Militar", banco: ["Código Penal Militar"],
          contenidos: ["Ámbito de aplicación y definiciones.", "Del delito militar.", "De las penas.", "Delitos contra la seguridad y defensa nacionales.", "Delitos contra la disciplina.", "Delitos relativos al ejercicio de los derechos fundamentales y libertades públicas.", "Delitos contra los deberes del servicio."] }
      ]
    },
    {
      n: 5, cap: 1, teoriaKey: "cabo:1.5", key: "1.5",
      titulo: "Organización del ET y situaciones administrativas",
      normativa: "Instrucción 14/2021 (act. ODEF 559/2024) · Ley 39/2007",
      temas: [
        { n: 1, titulo: "Instrucción 14/2021 · Organización del Ejército de Tierra", banco: ["Organización del ET"] },
        { n: 2, titulo: "Situaciones administrativas del personal de las FAS", banco: ["Carrera militar"] }
      ]
    },
    {
      n: 6, cap: 1, teoriaKey: "cabo:1.6", key: "1.6",
      titulo: "LO 9/2011 · Derechos y deberes",
      normativa: "Ley Orgánica 9/2011 · RD 176/2014",
      temas: [
        { n: 1, titulo: "Disposiciones generales", banco: ["Derechos y deberes"] },
        { n: 2, titulo: "Derechos y deberes de carácter profesional", banco: ["Derechos y deberes"] },
        { n: 3, titulo: "Asociaciones profesionales", banco: ["Derechos y deberes"] },
        { n: 4, titulo: "Del Observatorio de la Vida Militar", banco: ["Derechos y deberes"] },
        { n: 5, titulo: "RD 176/2014 · Iniciativas y quejas", banco: ["Derechos y deberes"],
          contenidos: ["Tramitación de iniciativas.", "Tramitación de quejas."] }
      ]
    },
    {
      n: 7, cap: 1, teoriaKey: "cabo:1.7", key: "1.7",
      titulo: "Liderazgo",
      normativa: "",
      temas: [
        { n: 1, titulo: "Modelo de liderazgo K-2", banco: ["Liderazgo"] },
        { n: 2, titulo: "Mando orientado a la misión (MoM)", banco: ["Liderazgo"] }
      ]
    },

    /* =================== CAPÍTULO 2 · INSTRUCCIÓN TÁCTICA Y TÉCNICA =================== */
    {
      n: 1, cap: 2, teoriaKey: "cabo:2.1", key: "2.1",
      titulo: "Instrucción técnica y táctica del combatiente",
      normativa: "",
      temas: [
        { n: 1, titulo: "Instrucción técnica de combate",
          banco: ["Instrucción del combatiente", "Transmisiones", "NBQ", "Primeros auxilios"],
          contenidos: ["El terreno. Utilización.", "Misiones individuales del combatiente.", "Instrucción NBQ.", "Transmisiones. Conocimientos básicos para transmitir."] },
        { n: 2, titulo: "Instrucción táctica · Escuadra/Equipo",
          banco: ["Orden Cerrado", "Escuadra y equipo", "Instrucción del combatiente"] }
      ]
    },
    {
      n: 2, cap: 2, teoriaKey: "cabo:2.2", key: "2.2",
      titulo: "Topografía",
      normativa: "",
      temas: [
        { n: 1, titulo: "Cartografía", banco: ["Topografía"] },
        { n: 2, titulo: "Orientación", banco: ["Topografía"] },
        { n: 3, titulo: "Navegación", banco: ["Topografía"] }
      ]
    },
    {
      n: 3, cap: 2, teoriaKey: "cabo:2.3", key: "2.3",
      titulo: "Armamento y teoría del tiro",
      normativa: "",
      temas: [
        { n: 1, titulo: "Normas generales en el uso y manejo de las armas", banco: ["Armamento", "Armamento y tiro"] },
        { n: 2, titulo: "Fusil de asalto HK G-36", banco: ["Armamento", "Armamento y tiro"] },
        { n: 3, titulo: "Pistola HK USP Compact", banco: ["Armamento", "Armamento y tiro"] },
        { n: 4, titulo: "Ametralladora MG-42", banco: ["Armamento", "Armamento y tiro"] },
        { n: 5, titulo: "Teoría del tiro", banco: ["Tiro", "Armamento y tiro"] }
      ]
    }
  ]
};
