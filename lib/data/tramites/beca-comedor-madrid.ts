import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const becaComedorMadrid: TramiteContenido = {
  slug: "beca-comedor-madrid",
  nivel: "autonomico",
  comunidad: "madrid",
  nombreOficial: "Becas de comedor escolar 2026-2027 (Comunidad de Madrid)",
  nombreColoquial: "La beca de comedor del cole",
  descripcion:
    "Ayuda para el comedor escolar de alumnos de Infantil, Primaria y Secundaria en centros sostenidos con fondos públicos de la Comunidad de Madrid. La piden los progenitores o tutores, y depende de la renta familiar.",
  organismo: "Consejería de Educación · Comunidad de Madrid",
  territorio: "Comunidad de Madrid",
  canales: ["online", "presencial"],
  urlFuente:
    "https://sede.comunidad.madrid/ayudas-becas-subvenciones/becas-comedor-escolar-2026-2027",
  plazo: {
    inicio: "2026-04-29",
    fin: "2026-05-28",
    nota: "En la convocatoria 2026-2027 el plazo fue del 29/04 al 28/05. Suele abrirse en primavera: consulta la fuente oficial para la próxima.",
  },
  alias: [
    "beca comedor",
    "beca de comedor",
    "comedor escolar",
    "ayuda comedor",
    "beca del cole",
    "becas comedor madrid",
  ],
  preguntas: [
    {
      id: "beca-p1",
      orden: 1,
      texto: "¿Para quién solicitas la beca?",
      tipo: "destinatario",
      opciones: [
        { id: "beca-p1-hijo", texto: "Para un hijo o menor a mi cargo" },
        {
          id: "beca-p1-otro",
          texto: "Para el hijo de otra persona",
          veredictoInviable: true,
          textoAlternativas:
            "La beca la piden quienes tienen la guarda del menor. Fuente: son destinatarios los «Progenitores, tutores, acogedores o personas encargadas de la guarda y custodia» del alumno. Si no eres una de esas figuras, no puedes solicitarla tú: tiene que hacerlo quien la tenga.",
        },
      ],
    },
    {
      id: "beca-p2",
      orden: 2,
      texto: "¿Cómo quieres presentarla?",
      tipo: "normal",
      opciones: [
        { id: "beca-p2-online", texto: "Por internet" },
        { id: "beca-p2-presencial", texto: "En papel / en el colegio" },
      ],
    },
    {
      id: "beca-p3",
      orden: 3,
      texto: "¿Vivís en un municipio de la Comunidad de Madrid?",
      tipo: "normal",
      opciones: [
        { id: "beca-p3-si", texto: "Sí" },
        { id: "beca-p3-no", texto: "No, residimos fuera" },
      ],
    },
    {
      id: "beca-p4",
      orden: 4,
      texto: "¿Vuestros ingresos tributan por IRPF?",
      tipo: "normal",
      opciones: [
        { id: "beca-p4-irpf", texto: "Sí, hacemos la declaración" },
        { id: "beca-p4-no-irpf", texto: "No / no todos" },
      ],
    },
  ],
  requisitos: [
    {
      id: "beca-r1",
      tipo: "tramite_previo",
      titulo: "Un sistema de firma electrónica reconocido",
      explicacion:
        "Fuente: «Para realizar este trámite por medios electrónicos necesitas uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid». El certificado digital de la FNMT es uno de los habituales; confirma en la fuente cuáles admite tu convocatoria.",
      canal: "online",
      tramitePrevioSlug: "certificado-digital-fnmt",
      soloSiOpciones: ["beca-p2-online"],
    },
    {
      id: "beca-r2",
      tipo: "doc_fisico",
      titulo: "Libro de familia completo (o certificado de nacimiento de los menores)",
      explicacion:
        "Fuente: «Libro de familia completo, certificado del Registro Civil o Partida de Nacimiento de todos los menores».",
      canal: "ambos",
    },
    {
      id: "beca-r3",
      tipo: "doc_fisico",
      titulo: "Certificado de empadronamiento familiar",
      explicacion:
        "Fuente: «Empadronamiento familiar del municipio si es distinto al de Madrid en el que figuren todos los residentes en el mismo si los datos de los miembros de la solicitud no coinciden con el número de miembros que figuran en el Libro de familia, certificado Registro Civil o Partida de nacimiento (si no se marca declaración responsable del apartado 8 de la solicitud)».",
      canal: "ambos",
      soloSiOpciones: ["beca-p3-no"],
    },
    {
      id: "beca-r4",
      tipo: "doc_digital",
      titulo: "Certificado de la Agencia Tributaria con código seguro de verificación",
      explicacion:
        "De la renta de 2024. Fuente: «Certificado expedido por la Agencia Tributaria con código seguro de verificación» para ingresos sometidos a IRPF (2024).",
      canal: "ambos",
      soloSiOpciones: ["beca-p4-irpf"],
    },
    {
      id: "beca-r5",
      tipo: "doc_digital",
      titulo: "Vida laboral, nóminas y certificación tributaria",
      explicacion:
        "Para ingresos que no tributan por IRPF. Fuente: certificación tributaria + «Informe de vida laboral de la Seguridad Social» + nóminas del empleador.",
      canal: "ambos",
      soloSiOpciones: ["beca-p4-no-irpf"],
    },
    {
      id: "beca-r6",
      tipo: "doc_fisico",
      titulo: "Sentencia de separación o divorcio, o certificado de defunción",
      explicacion:
        "Solo si hay custodia en exclusiva. Fuente: «Sentencia judicial de separación legal o divorcio o convenio regulador ratificado por el juez o certificado de defunción que determine la custodia en exclusiva de los menores (si no se marca declaración responsable del apartado 8 de la solicitud)».",
      canal: "ambos",
    },
    {
      id: "beca-r7",
      tipo: "doc_fisico",
      titulo: "Renta familiar por persona por debajo del límite",
      explicacion:
        "Fuente: «Disponer de una renta familiar por persona inferior a 8.400 euros durante el año económico 2024»; para familias numerosas, «renta familiar por persona a partir de 8.400 e inferior a 10.000 euros». También hay vías por Renta Mínima de Inserción, Ingreso Mínimo Vital, víctimas de violencia de género o terrorismo, Fuerzas de Seguridad, acogimiento familiar y protección internacional.",
      canal: "ambos",
    },
    {
      id: "beca-r8",
      tipo: "doc_fisico",
      titulo: "Plaza matriculada o reservada en el centro",
      explicacion:
        "Fuente: el alumno debe estar «matriculado o tiene una reserva de plaza» en un centro público o privado sostenido con fondos públicos, en Infantil, Primaria o Secundaria Obligatoria.",
      canal: "ambos",
    },
  ],
  prerequisitos: [
    {
      slug: "certificado-digital-fnmt",
      nota: "Si la presentas por internet necesitas firma electrónica reconocida.",
    },
  ],
};
