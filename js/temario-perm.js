/* MICABO · TEMARIO OFICIAL DE TROPA PERMANENTE
   ---------------------------------------------------------------------------
   Estructura y contenidos tal como los entregó el responsable del proyecto
   (20-oct-2026). 3 bloques · 21 temas.

   CÓMO SE AÑADE LA TEORÍA
   Cada tema tiene un campo `teoria` y cada bloque otro. Se rellenan con HTML
   simple (<p>, <ul>, <li>, <b>) y la app los pinta dentro del tema, con la
   barra dorada. Mientras estén a null, la ficha muestra «teoría en preparación».
   El campo `video` de cada tema admite la URL de YouTube; mientras esté vacío
   la ficha muestra «Vídeo: próximamente».

   El campo `banco` son los nombres de tema del banco de preguntas que alimentan
   el botón de test. Varios temas pueden compartir banco (se avisa en la ficha).
   --------------------------------------------------------------------------- */
"use strict";
window.TEMARIO_PERM26 = {
  actualizado: "20-oct-2026",
  fuente: "Temario de Tropa Permanente · convocatoria 2026",
  bloques: [
    {
      id: "B1", n: 1,
      titulo: "Organización",
      teoria: null,
      temas: [
        {
          n: 1,
          titulo: "Organización política y territorial del Estado",
          normativa: "Constitución Española de 1978",
          nota: "Debe estudiar los títulos indicados en el programa",
          contenidos: [
            "Título III: Cortes Generales.",
            "Título IV: Gobierno y Administración.",
            "Título V: relaciones entre el Gobierno y las Cortes Generales.",
            "Título VI: Poder Judicial.",
            "Título VIII: organización territorial del Estado.",
            "Composición y funciones de las Cortes Generales.",
            "Funciones del Congreso y del Senado.",
            "Nombramiento y funciones del presidente del Gobierno.",
            "Organización de la Administración.",
            "Principios de la organización territorial."
          ],
          banco: ["Constitución"],
          teoria: null
        },
        {
          n: 2,
          titulo: "Defensa Nacional",
          normativa: "Ley Orgánica 5/2005, de la Defensa Nacional",
          contenidos: [
            "Objeto de la ley.",
            "Competencias de los órganos del Estado.",
            "Funciones del presidente del Gobierno.",
            "Funciones del ministro de Defensa.",
            "Organización militar.",
            "Fuerzas Armadas y misiones.",
            "Control parlamentario de la Defensa."
          ],
          banco: ["Defensa Nacional"],
          teoria: null
        },
        {
          n: 3,
          titulo: "Régimen Jurídico del Sector Público",
          normativa: "Ley 40/2015",
          contenidos: [
            "Disposiciones generales.",
            "Principios de actuación.",
            "Órganos administrativos.",
            "Competencia.",
            "Delegación y avocación.",
            "Organización de la Administración General del Estado.",
            "Ministerios y estructura interna.",
            "Relaciones entre administraciones públicas."
          ],
          banco: ["RJSP"],
          teoria: null
        },
        {
          n: 4,
          titulo: "Ministerio de Defensa",
          normativa: "Real Decreto 998/2017, junto con las modificaciones aplicables",
          nota: "Hay que comprobar qué versión normativa corresponde estudiar en la convocatoria",
          contenidos: [
            "Estructura orgánica.",
            "Órganos superiores y directivos.",
            "Organización del Ministerio.",
            "Competencias generales de sus órganos."
          ],
          banco: ["MINISDEF"],
          teoria: null
        },
        {
          n: 5,
          titulo: "Organización básica de las Fuerzas Armadas",
          normativa: "Real Decreto 872/2014 · Orden DEF/166/2015",
          contenidos: [
            "Organización básica.",
            "Principios generales.",
            "Estructura de las Fuerzas Armadas.",
            "Órganos principales.",
            "Relaciones orgánicas y funcionales."
          ],
          banco: ["FAS"],
          teoria: null
        },
        {
          n: 6,
          titulo: "Desarrollo de la organización básica",
          normativa: "Orden DEF/1887/2015 · Instrucción 7/2016 del JEME · disposiciones correspondientes a la Armada y al Ejército del Aire",
          nota: "Las normas de organización pueden haber sufrido modificaciones posteriores: deben estudiarse con las actualizaciones que determine la convocatoria de 2026",
          contenidos: [
            "Estado Mayor de la Defensa.",
            "Organización del Ejército de Tierra.",
            "Organización de la Armada.",
            "Organización del Ejército del Aire y del Espacio.",
            "Principales órganos y estructuras de mando."
          ],
          banco: ["Organización del ET"],
          teoria: null
        }
      ]
    },
    {
      id: "B2", n: 2,
      titulo: "Jurídico-social",
      teoria: null,
      temas: [
        {
          n: 1,
          titulo: "Régimen del personal militar profesional",
          normativa: "Ley 39/2007, de la carrera militar · Ley 8/2006, de Tropa y Marinería",
          contenidos: [
            "Categorías y empleos militares.",
            "Carrera militar.",
            "Escalas.",
            "Ascensos.",
            "Situaciones administrativas.",
            "Evaluaciones.",
            "Derechos profesionales.",
            "Régimen específico de tropa y marinería."
          ],
          banco: ["Carrera militar", "Tropa y marinería", "Situaciones"],
          teoria: null
        },
        {
          n: 2,
          titulo: "Reales Ordenanzas para las Fuerzas Armadas",
          normativa: "Real Decreto 96/2009",
          contenidos: [
            "Principios básicos.",
            "Reglas de comportamiento.",
            "Disciplina.",
            "Jerarquía.",
            "Unidad de mando.",
            "Deberes del militar.",
            "Ejercicio del mando.",
            "Relaciones entre militares.",
            "Actuación en operaciones."
          ],
          banco: ["ROFAS"],
          teoria: null
        },
        {
          n: 3,
          titulo: "Derechos y deberes de los miembros de las Fuerzas Armadas",
          normativa: "Ley Orgánica 9/2011",
          contenidos: [
            "Derechos fundamentales.",
            "Deberes.",
            "Libertades públicas.",
            "Asociaciones profesionales.",
            "Derecho de petición.",
            "Participación y representación.",
            "Limitaciones derivadas de la condición militar."
          ],
          banco: ["Derechos y deberes"],
          teoria: null
        },
        {
          n: 4,
          titulo: "Régimen disciplinario",
          normativa: "Ley Orgánica 8/2014",
          contenidos: [
            "Principios generales.",
            "Faltas leves, graves y muy graves.",
            "Sanciones.",
            "Competencias sancionadoras.",
            "Procedimiento.",
            "Cumplimiento de sanciones.",
            "Recursos."
          ],
          banco: ["Régimen Disciplinario"],
          teoria: null
        },
        {
          n: 5,
          titulo: "Tramitación de iniciativas y quejas",
          normativa: "Real Decreto 176/2014",
          contenidos: [
            "Qué se considera iniciativa o queja.",
            "Quién puede presentarla.",
            "Procedimiento de presentación.",
            "Tramitación.",
            "Autoridades competentes.",
            "Derechos del militar durante el procedimiento."
          ],
          banco: ["Iniciativas y quejas"],
          teoria: null
        },
        {
          n: 6,
          titulo: "Igualdad de trato y oportunidades",
          normativa: "Ley Orgánica 3/2007",
          contenidos: [
            "Objeto y ámbito.",
            "Principio de igualdad.",
            "Igualdad de trato.",
            "Discriminación directa e indirecta.",
            "Políticas públicas.",
            "Igualdad en el empleo público."
          ],
          banco: ["Igualdad"],
          notaBanco: "El banco no separa la LO 3/2007 del Observatorio: el test de los temas 6 y 7 es el mismo.",
          teoria: null
        },
        {
          n: 7,
          titulo: "Observatorio Militar para la Igualdad y prevención del acoso",
          normativa: "Orden Ministerial 51/2011 · Resolución 400/38199/2015 · Orden DEF/482/2016",
          contenidos: [
            "Funciones del Observatorio Militar para la Igualdad.",
            "Igualdad entre mujeres y hombres en las Fuerzas Armadas.",
            "Acoso sexual y por razón de sexo.",
            "Prevención y protección.",
            "Unidades de Protección frente al Acoso.",
            "Procedimientos de actuación."
          ],
          banco: ["Igualdad"],
          notaBanco: "Comparte banco con el tema 6.",
          teoria: null
        },
        {
          n: 8,
          titulo: "Procedimiento Administrativo Común",
          normativa: "Ley 39/2015",
          contenidos: [
            "Interesados.",
            "Derechos de las personas en sus relaciones con las administraciones.",
            "Actos administrativos.",
            "Eficacia y validez.",
            "Plazos.",
            "Notificaciones.",
            "Procedimiento administrativo.",
            "Revisión de actos.",
            "Recursos administrativos."
          ],
          banco: ["PAC"],
          teoria: null
        }
      ]
    },
    {
      id: "B3", n: 3,
      titulo: "Seguridad nacional, acción conjunta y organizaciones internacionales",
      teoria: null,
      temas: [
        {
          n: 1,
          titulo: "Seguridad Nacional",
          normativa: "Ley 36/2015, de Seguridad Nacional",
          contenidos: [
            "Concepto de seguridad nacional.",
            "Principios básicos.",
            "Riesgos y amenazas.",
            "Sistema de Seguridad Nacional.",
            "Autoridades competentes.",
            "Estrategia de Seguridad Nacional."
          ],
          banco: ["Seguridad Nacional", "ESN"],
          teoria: null
        },
        {
          n: 2,
          titulo: "Doctrina para la acción conjunta",
          normativa: "PDC-01",
          contenidos: [
            "Entorno de seguridad.",
            "Marco doctrinal para el empleo de las Fuerzas Armadas.",
            "Mando y control.",
            "Operaciones conjuntas.",
            "Integración en estructuras multinacionales.",
            "Coordinación de capacidades."
          ],
          banco: ["Doctrina"],
          teoria: null
        },
        {
          n: 3,
          titulo: "Organización de las Naciones Unidas",
          normativa: "",
          contenidos: [
            "Historia y objetivos.",
            "Estados miembros.",
            "Asamblea General.",
            "Consejo de Seguridad.",
            "Secretaría General.",
            "Carta de las Naciones Unidas.",
            "Relación de España con la ONU.",
            "Participación española en operaciones y misiones."
          ],
          banco: ["ONU"],
          teoria: null
        },
        {
          n: 4,
          titulo: "Organización del Tratado del Atlántico Norte",
          normativa: "",
          contenidos: [
            "Historia de la OTAN.",
            "Objetivos.",
            "Estados miembros.",
            "Estructura política.",
            "Estructura militar.",
            "Principales órganos.",
            "Incorporación de España.",
            "Participación española en la Alianza."
          ],
          banco: ["OTAN"],
          teoria: null
        },
        {
          n: 5,
          titulo: "Organización para la Seguridad y la Cooperación en Europa",
          normativa: "",
          contenidos: [
            "Historia.",
            "Objetivos.",
            "Estados participantes.",
            "Estructura.",
            "Ámbitos de actuación.",
            "Relación de España con la OSCE."
          ],
          banco: ["OSCE"],
          teoria: null
        },
        {
          n: 6,
          titulo: "Unión Europea",
          normativa: "",
          contenidos: [
            "Historia y evolución.",
            "Instituciones.",
            "Parlamento Europeo.",
            "Consejo Europeo.",
            "Consejo de la Unión Europea.",
            "Comisión Europea.",
            "Política Común de Seguridad y Defensa.",
            "Relación de España con la UE."
          ],
          banco: ["UE"],
          teoria: null
        },
        {
          n: 7,
          titulo: "España y las misiones internacionales",
          normativa: "",
          contenidos: [
            "Participación española en operaciones.",
            "Misiones de Naciones Unidas.",
            "Operaciones de la OTAN.",
            "Misiones de la Unión Europea.",
            "Objetivos generales.",
            "Misiones realizadas y en curso."
          ],
          banco: ["Misiones"],
          teoria: null
        }
      ]
    }
  ]
};
