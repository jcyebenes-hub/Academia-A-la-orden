/* MICABO · TEMARIO OFICIAL DE CABO (ET) — convocatoria I/26
   ---------------------------------------------------------------------------
   Estructura y contenidos tal como los entregó el responsable del proyecto
   (20-oct-2026). 2 bloques · 10 temas.

   CÓMO SE AÑADE LA TEORÍA
   Cada tema tiene un campo `teoria` y cada bloque otro. Se rellenan con HTML
   simple (<p>, <ul>, <li>, <b>) y la app los pinta tal cual dentro del tema.
   Mientras estén a null, la ficha muestra «teoría en preparación».
   El campo `video` de cada tema admite la URL de YouTube; mientras esté vacío
   la ficha muestra «Vídeo: próximamente».

   El campo `banco` es la lista de nombres de tema del banco de preguntas que
   alimenta el botón de test de ese tema. Si está vacío, el tema no tiene test.
   --------------------------------------------------------------------------- */
"use strict";
window.TEMARIO_CABO26 = {
  actualizado: "20-oct-2026",
  fuente: "Temario de Cabo (ET) · convocatoria I/26",
  bloques: [
    {
      id: "B1", n: 1,
      titulo: "Formación general militar",
      teoria: null,
      temas: [
        {
          n: 1,
          titulo: "Reales Ordenanzas para las Fuerzas Armadas",
          normativa: "Real Decreto 96/2009",
          contenidos: [
            "Principios generales de comportamiento del militar.",
            "Deberes fundamentales.",
            "Disciplina y jerarquía.",
            "Unidad de mando.",
            "Cumplimiento de las órdenes.",
            "Responsabilidad individual.",
            "Relaciones entre militares.",
            "Responsabilidad en el ejercicio del mando.",
            "Comportamiento en operaciones.",
            "Disponibilidad para el servicio."
          ],
          banco: ["Reales Ordenanzas"],
          teoria: null
        },
        {
          n: 2,
          titulo: "Seguridad en las Fuerzas Armadas",
          normativa: "Real Decreto 194/2010",
          contenidos: [
            "Conceptos generales de seguridad militar.",
            "Seguridad de las instalaciones.",
            "Protección de personas, material e información.",
            "Responsabilidades del personal.",
            "Medidas de seguridad.",
            "Funciones generales del personal de servicio.",
            "Prevención de incidentes."
          ],
          banco: ["Seguridad en las FAS"],
          teoria: null
        },
        {
          n: 3,
          titulo: "Mando y régimen interior",
          normativa: "",
          contenidos: [
            "Organización del régimen interior.",
            "Responsabilidades de los mandos.",
            "Servicios y guardias.",
            "Normas generales de funcionamiento de las unidades.",
            "Obligaciones del personal de servicio.",
            "Organización y funcionamiento de las instalaciones militares."
          ],
          banco: ["Régimen Interior"],
          teoria: null
        },
        {
          n: 4,
          titulo: "Régimen disciplinario y Código Penal Militar",
          normativa: "Ley Orgánica 8/2014, de Régimen Disciplinario de las Fuerzas Armadas · Ley Orgánica 14/2015, del Código Penal Militar",
          contenidos: [
            "Principios del régimen disciplinario.",
            "Clasificación de las faltas.",
            "Sanciones disciplinarias.",
            "Autoridades y competencias sancionadoras.",
            "Procedimiento disciplinario.",
            "Recursos.",
            "Diferencias entre infracción disciplinaria y delito militar.",
            "Principales delitos militares."
          ],
          banco: ["Régimen Disciplinario", "Código Penal Militar"],
          teoria: null
        },
        {
          n: 5,
          titulo: "Organización del Ejército de Tierra",
          normativa: "",
          contenidos: [
            "Organización general de las Fuerzas Armadas.",
            "Estructura básica del Ejército de Tierra.",
            "Cuartel General, Fuerza y Apoyo a la Fuerza.",
            "Principales mandos y unidades.",
            "Organización general de las unidades terrestres.",
            "Funciones generales de las armas y especialidades."
          ],
          banco: ["Organización del ET", "Organización de la Defensa"],
          teoria: null
        },
        {
          n: 6,
          titulo: "Derechos y deberes de los militares",
          normativa: "Ley Orgánica 9/2011",
          contenidos: [
            "Derechos fundamentales.",
            "Libertades públicas y sus limitaciones en el ámbito militar.",
            "Deberes profesionales.",
            "Asociaciones profesionales.",
            "Derecho de petición.",
            "Participación y representación del personal militar."
          ],
          banco: ["Derechos y deberes"],
          teoria: null
        },
        {
          n: 7,
          titulo: "Liderazgo militar",
          normativa: "",
          orientativos: true,
          contenidos: [
            "Concepto de liderazgo.",
            "Ejercicio del mando.",
            "Responsabilidad del jefe.",
            "Comunicación con los subordinados.",
            "Disciplina y cohesión.",
            "Motivación del personal.",
            "Toma de decisiones.",
            "Ejemplo personal."
          ],
          banco: ["Liderazgo"],
          teoria: null
        }
      ]
    },
    {
      id: "B2", n: 2,
      titulo: "Instrucción técnica y táctica",
      teoria: null,
      aviso: "Bloque pendiente de confirmar con el contenido exacto de la convocatoria I/26 antes de darlo por definitivo.",
      temas: [
        {
          n: 8,
          titulo: "Instrucción del combatiente individual",
          normativa: "",
          contenidos: [
            "Equipo individual.",
            "Preparación para el servicio.",
            "Técnicas básicas del combatiente.",
            "Seguridad durante la instrucción.",
            "Procedimientos generales de actuación individual.",
            "Transmisiones básicas y procedimientos de comunicación que figuren en el programa."
          ],
          banco: ["Instrucción del combatiente", "Transmisiones", "Orden Cerrado", "Escuadra y equipo"],
          teoria: null
        },
        {
          n: 9,
          titulo: "Topografía y orientación",
          normativa: "",
          contenidos: [
            "Lectura e interpretación de mapas.",
            "Escalas.",
            "Coordenadas.",
            "Orientación.",
            "Uso de la brújula.",
            "Distancias y rumbos.",
            "Representación del terreno."
          ],
          banco: ["Topografía"],
          teoria: null
        },
        {
          n: 10,
          titulo: "Armamento y teoría del tiro",
          normativa: "",
          contenidos: [
            "Identificación del armamento incluido en el programa.",
            "Características generales.",
            "Elementos y mecanismos.",
            "Normas de seguridad.",
            "Conservación y mantenimiento.",
            "Principios básicos de balística y teoría del tiro."
          ],
          banco: ["Armamento", "Armamento y tiro", "Tiro"],
          teoria: null
        }
      ]
    }
  ]
};
