import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const tarjetaSanitariaAragon: TramiteContenido = {
  slug: "tarjeta-sanitaria-aragon",
  nivel: "autonomico",
  comunidad: "aragon",
  nombreOficial: "Tarjeta Sanitaria Individual (Aragón)",
  nombreColoquial: "La tarjeta sanitaria",
  descripcion:
    "La tarjeta del médico en Aragón. Se pide en persona, con cita previa. Hace falta estar empadronado en algún municipio de Aragón. Ojo: aquí el trámite es solo presencial.",
  organismo: "Servicio Aragonés de Salud (SALUD)",
  territorio: "Aragón",
  canales: ["presencial"],
  urlFuente:
    "https://www.aragon.es/tramitador/-/tramite/solicitud-tarjeta-sanitaria-emision-inicial-sucesiva",
  urlCitaPrevia: "https://citaprevia.aragon.es",
  alias: [
    "tarjeta sanitaria",
    "tarjeta del medico",
    "salud aragon",
    "medico de cabecera",
    "tarjeta sanitaria aragon",
  ],
  preguntas: [
    {
      id: "san-ar-p1",
      orden: 1,
      texto: "¿Para quién es la tarjeta?",
      tipo: "destinatario",
      opciones: [
        { id: "san-ar-p1-yo", texto: "Para mí" },
        { id: "san-ar-p1-menor", texto: "Para un menor a mi cargo" },
      ],
    },
    {
      id: "san-ar-p2",
      orden: 2,
      texto: "¿Qué nacionalidad tiene el titular?",
      tipo: "normal",
      opciones: [
        { id: "san-ar-p2-es", texto: "Española" },
        { id: "san-ar-p2-ext", texto: "Extranjera" },
      ],
    },
  ],
  requisitos: [
    {
      id: "san-ar-r1",
      tipo: "tramite_previo",
      titulo: "Estar empadronado en un municipio de Aragón",
      explicacion:
        "Fuente: para españoles, «Tener vecindad administrativa en alguno de los municipios de la Comunidad Autónoma de Aragón», y en la documentación se pide «Certificación de empadronamiento».",
      canal: "presencial",
      tramitePrevioSlug: "empadronamiento-zaragoza",
    },
    {
      id: "san-ar-r2",
      tipo: "tramite_previo",
      titulo: "Tener reconocido el derecho a la asistencia por el INSS",
      explicacion:
        "Fuente (extranjeros): «Tener reconocido el derecho a la asistencia sanitaria por el Instituto Nacional de la Seguridad Social».",
      canal: "presencial",
      soloSiOpciones: ["san-ar-p2-ext"],
    },
    {
      id: "san-ar-r3",
      tipo: "doc_fisico",
      titulo: "Documento de identidad (DNI, NIE o pasaporte)",
      explicacion: "Fuente: «Documento que acredite identidad DNI/NIE/Pasaporte».",
      canal: "presencial",
    },
    {
      id: "san-ar-r4",
      tipo: "doc_fisico",
      titulo: "Número de usuario/a de la Seguridad Social",
      explicacion: "Fuente (con nacionalidad española): «Número de usuario/a de Seguridad Social».",
      canal: "presencial",
      soloSiOpciones: ["san-ar-p2-es"],
    },
    {
      id: "san-ar-r5",
      tipo: "doc_fisico",
      titulo: "El libro de familia (o documento que acredite el parentesco)",
      explicacion: "Fuente: «Libro familia o documento que acredite parentesco. En caso de menores».",
      canal: "presencial",
      soloSiOpciones: ["san-ar-p1-menor"],
    },
    {
      id: "san-ar-r6",
      tipo: "doc_fisico",
      titulo: "Certificación de no exportación y declaración jurada",
      explicacion:
        "Solo si eres extranjero sin derecho reconocido por el INSS. Fuente: «Certificación de no exportación» y «Declaración jurada de no existir terceros obligados al pago».",
      canal: "presencial",
      soloSiOpciones: ["san-ar-p2-ext"],
    },
    {
      id: "san-ar-r7",
      tipo: "doc_fisico",
      titulo: "La solicitud cumplimentada, y pedir cita previa",
      explicacion:
        "Fuente: «Solicitud cumplimentada», y se presenta pidiendo «cita previa en una de nuestras oficinas de información y registro».",
      canal: "presencial",
    },
  ],
  prerequisitos: [
    { slug: "empadronamiento-zaragoza", nota: "Hay que estar empadronado en un municipio de Aragón." },
  ],
};
