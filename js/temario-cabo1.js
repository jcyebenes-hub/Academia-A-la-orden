/* MICABO · TEMARIO OFICIAL DE CABO 1º (ET)
   ---------------------------------------------------------------------------
   Estructura y contenidos tal como los entregó el responsable del proyecto
   (20-oct-2026). 4 bloques · 16 temas.

   CÓMO SE AÑADE LA TEORÍA
   Cada tema tiene un campo `teoria` y cada bloque otro. Se rellenan con HTML
   simple (<p>, <ul>, <li>, <b>) y la app los pinta dentro del tema, con la
   barra dorada. Mientras estén a null, la ficha muestra «teoría en preparación».
   El campo `video` de cada tema admite la URL de YouTube; mientras esté vacío
   la ficha muestra «Vídeo: próximamente».

   El campo `banco` son los nombres de tema del banco de preguntas que alimentan
   el botón de test. Si está vacío, el tema todavía no tiene test.
   --------------------------------------------------------------------------- */
"use strict";
window.TEMARIO_CABO1 = {
  actualizado: "20-oct-2026",
  fuente: "Temario de Cabo 1º (ET) · curso de actualización",
  bloques: [
    {
      id: "B1", n: 1,
      titulo: "Formación militar",
      teoria: null,
      aviso: "Los temas 1 a 7 son una propuesta de organización didáctica: hay que confirmar sus apartados con el programa vigente del curso de acceso a cabo primero.",
      temas: [
        {
          n: 1,
          titulo: "Reales Ordenanzas para las Fuerzas Armadas",
          normativa: "Real Decreto 96/2009",
          contenidos: [
            "Principios generales.",
            "Reglas de comportamiento.",
            "Disciplina y jerarquía.",
            "Deberes del militar.",
            "Ejercicio del mando.",
            "Responsabilidad del mando.",
            "Relaciones entre militares.",
            "Comportamiento en operaciones.",
            "Cumplimiento de las órdenes."
          ],
          banco: ["Reales Ordenanzas"],
          teoria: null
        },
        {
          n: 2,
          titulo: "Derechos y deberes de los militares",
          normativa: "Ley Orgánica 9/2011",
          contenidos: [
            "Derechos fundamentales.",
            "Deberes profesionales.",
            "Asociaciones profesionales.",
            "Derecho de petición.",
            "Participación y representación.",
            "Limitaciones específicas derivadas de la condición militar."
          ],
          banco: [],
          teoria: null
        },
        {
          n: 3,
          titulo: "Régimen disciplinario",
          normativa: "Ley Orgánica 8/2014",
          contenidos: [
            "Faltas leves, graves y muy graves.",
            "Sanciones.",
            "Autoridades competentes.",
            "Procedimiento disciplinario.",
            "Cumplimiento de sanciones.",
            "Recursos."
          ],
          banco: ["Régimen disciplinario"],
          teoria: null
        },
        {
          n: 4,
          titulo: "Código Penal Militar",
          normativa: "Ley Orgánica 14/2015",
          contenidos: [
            "Ámbito de aplicación.",
            "Delitos militares.",
            "Delitos contra la disciplina.",
            "Delitos contra los deberes del servicio.",
            "Delitos contra la seguridad y defensa nacionales.",
            "Penas previstas en la legislación militar."
          ],
          banco: ["Código Penal Militar"],
          teoria: null
        },
        {
          n: 5,
          titulo: "Organización militar",
          normativa: "",
          contenidos: [
            "Organización general de las Fuerzas Armadas.",
            "Estructura del Ejército de Tierra.",
            "Principales órganos y mandos.",
            "Organización de las unidades.",
            "Funciones generales de los mandos y escalones orgánicos."
          ],
          banco: ["Organización"],
          teoria: null
        },
        {
          n: 6,
          titulo: "Seguridad y régimen interior",
          normativa: "",
          contenidos: [
            "Seguridad de instalaciones.",
            "Servicios y guardias.",
            "Organización del régimen interior.",
            "Responsabilidades del personal.",
            "Funciones generales de los mandos.",
            "Normas de seguridad."
          ],
          banco: ["Seguridad"],
          teoria: null
        },
        {
          n: 7,
          titulo: "Liderazgo y responsabilidad del cabo primero",
          normativa: "",
          nota: "Como preparación complementaria",
          contenidos: [
            "Liderazgo de pequeñas unidades.",
            "Supervisión de subordinados.",
            "Comunicación.",
            "Disciplina.",
            "Instrucción del personal.",
            "Responsabilidad en el servicio.",
            "Resolución de incidencias."
          ],
          banco: ["Mando y liderazgo", "Técnicas de mando"],
          teoria: null
        }
      ]
    },
    {
      id: "B2", n: 2,
      titulo: "Formación sociocultural",
      teoria: null,
      aviso: "Estos contenidos deben tratarse como orientación hasta comprobar el índice exacto del curso de actualización.",
      temas: [
        {
          n: 8,
          titulo: "Constitución Española",
          normativa: "",
          contenidos: [
            "Estructura.",
            "Derechos y deberes fundamentales.",
            "La Corona.",
            "Las Cortes Generales.",
            "El Gobierno.",
            "El Poder Judicial.",
            "Organización territorial."
          ],
          banco: ["Constitución"],
          teoria: null
        },
        {
          n: 9,
          titulo: "Organización del Estado",
          normativa: "",
          contenidos: [
            "Instituciones constitucionales.",
            "Administración General del Estado.",
            "Comunidades autónomas.",
            "Provincias y municipios.",
            "Principales funciones de las instituciones."
          ],
          banco: ["Administración"],
          teoria: null
        },
        {
          n: 10,
          titulo: "Cultura general",
          normativa: "",
          contenidos: [
            "Sociedad española.",
            "Instituciones públicas.",
            "Acontecimientos históricos.",
            "Conceptos básicos de cultura general."
          ],
          banco: [],
          teoria: null
        }
      ]
    },
    {
      id: "B3", n: 3,
      titulo: "Geografía e historia de España",
      teoria: null,
      temas: [
        {
          n: 11,
          titulo: "Geografía física",
          normativa: "",
          contenidos: [
            "Sistemas montañosos.",
            "Principales ríos.",
            "Vertientes hidrográficas.",
            "Climas.",
            "Costas.",
            "Archipiélagos.",
            "Accidentes geográficos."
          ],
          banco: ["Geografía"],
          notaBanco: "El banco no está subdividido por apartados: el test cubre toda la geografía.",
          teoria: null
        },
        {
          n: 12,
          titulo: "Geografía política",
          normativa: "",
          contenidos: [
            "Comunidades autónomas.",
            "Capitales autonómicas.",
            "Provincias y capitales.",
            "Ciudades autónomas.",
            "Límites territoriales de España."
          ],
          banco: ["Geografía"],
          notaBanco: "Comparte banco con el tema 11: el test es el mismo.",
          teoria: null
        },
        {
          n: 13,
          titulo: "Historia de España",
          normativa: "",
          contenidos: [
            "Hispania romana.",
            "Edad Media.",
            "Reyes Católicos.",
            "Austrias y Borbones.",
            "Guerra de la Independencia.",
            "Historia constitucional.",
            "Siglos XIX y XX.",
            "Transición democrática.",
            "Constitución de 1978."
          ],
          banco: ["Historia"],
          teoria: null
        }
      ]
    },
    {
      id: "B4", n: 4,
      titulo: "Inglés básico",
      teoria: null,
      temas: [
        {
          n: 14,
          titulo: "Gramática",
          normativa: "",
          contenidos: [
            "Verbo to be.",
            "Verbo to have.",
            "Presente simple.",
            "Presente continuo.",
            "Pasado simple.",
            "Futuro básico.",
            "Pronombres.",
            "Artículos.",
            "Preposiciones.",
            "Preguntas y negaciones."
          ],
          banco: ["Inglés"],
          notaBanco: "El banco de inglés no está dividido por destrezas: el test cubre los tres temas del bloque.",
          teoria: null
        },
        {
          n: 15,
          titulo: "Vocabulario",
          normativa: "",
          contenidos: [
            "Números y fechas.",
            "Horas.",
            "Familia y profesiones.",
            "Lugares.",
            "Actividades cotidianas.",
            "Vocabulario militar elemental."
          ],
          banco: ["Inglés"],
          notaBanco: "Comparte banco con los temas 14 y 16.",
          teoria: null
        },
        {
          n: 16,
          titulo: "Comprensión escrita",
          normativa: "",
          contenidos: [
            "Comprensión de frases.",
            "Textos cortos.",
            "Identificación de tiempos verbales.",
            "Preguntas sencillas.",
            "Vocabulario en contexto."
          ],
          banco: ["Inglés"],
          notaBanco: "Comparte banco con los temas 14 y 15.",
          teoria: null
        }
      ]
    }
  ]
};
