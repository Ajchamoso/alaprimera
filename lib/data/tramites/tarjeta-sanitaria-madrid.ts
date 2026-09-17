import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const tarjetaSanitariaMadrid: TramiteContenido = {
  slug: "tarjeta-sanitaria-madrid",
  nivel: "autonomico",
  comunidad: "madrid",
  nombreOficial: "Tarjeta Sanitaria Individual (Comunidad de Madrid)",
  nombreColoquial: "La tarjeta sanitaria",
  descripcion:
    "La tarjeta del médico. Se pide en el centro de salud o por internet. Hace falta estar empadronado en la Comunidad de Madrid y tener reconocido el derecho a la asistencia por el INSS.",
  organismo: "Servicio Madrileño de Salud · Consejería de Sanidad",
  territorio: "Comunidad de Madrid",
  canales: ["online", "presencial"],
  urlFuente: "https://sede.comunidad.madrid/prestacion-social/tarjeta-sanitaria",
  alias: [
    "tarjeta sanitaria",
    "tarjeta del medico",
    "sanidad",
    "medico de cabecera",
    "tsi",
    "tarjeta sanitaria de mi hijo",
  ],
  preguntas: [
    {
      id: "san-p1",
      orden: 1,
      texto: "¿Para quién es la tarjeta?",
      tipo: "destinatario",
      opciones: [
        { id: "san-p1-yo", texto: "Para mí" },
        { id: "san-p1-otro", texto: "Para otra persona (hijo, madre…) y la pido yo" },
      ],
    },
    {
      id: "san-p2",
      orden: 2,
      texto: "¿Qué necesitas hacer?",
      tipo: "normal",
      opciones: [
        { id: "san-p2-primera", texto: "Sacarla por primera vez" },
        { id: "san-p2-repo", texto: "Se ha perdido, roto o hay que cambiar datos" },
      ],
    },
    {
      id: "san-p3",
      orden: 3,
      texto: "¿Qué nacionalidad tiene el titular?",
      tipo: "normal",
      opciones: [
        { id: "san-p3-es", texto: "Española" },
        { id: "san-p3-ext", texto: "Extranjera" },
      ],
    },
  ],
  requisitos: [
    {
      id: "san-r1",
      tipo: "tramite_previo",
      titulo: "Estar empadronado en la Comunidad de Madrid",
      explicacion: "Fuente, literal: «Estar empadronado en la Comunidad de Madrid».",
      canal: "ambos",
      tramitePrevioSlug: "empadronamiento-madrid",
      soloSiOpciones: ["san-p2-primera"],
    },
    {
      id: "san-r2",
      tipo: "tramite_previo",
      titulo: "Tener reconocido el derecho a la asistencia por el INSS",
      explicacion:
        "Fuente: «Tener derecho a la asistencia sanitaria por el Instituto Nacional de la Seguridad Social (INSS)». Ojo: es tener el derecho reconocido, no aportar el documento de afiliación: la fuente no lo pide.",
      canal: "ambos",
      soloSiOpciones: ["san-p2-primera"],
    },
    {
      id: "san-r3",
      tipo: "doc_fisico",
      titulo: "Permiso de residencia en vigor o en trámite",
      explicacion:
        "Fuente: «En caso de personas extranjeras, disponer de un permiso de residencia en vigor o en trámite de renovación». Y hay que «Acreditar la vigencia del permiso de residencia, cada vez que se renueve»: la tarjeta de personas extranjeras sí caduca, la de españolas no.",
      canal: "ambos",
      soloSiOpciones: ["san-p3-ext"],
    },
    {
      id: "san-r4",
      tipo: "doc_fisico",
      titulo: "Certificado de nacimiento (menores de 14 sin DNI)",
      explicacion:
        "Fuente: «Certificado de nacimiento (solo en menores de 14 años, en ausencia de DNI o TIE)».",
      canal: "ambos",
      soloSiOpciones: ["san-p1-otro"],
    },
    {
      id: "san-r5",
      tipo: "doc_fisico",
      titulo: "Documento que acredite la representación",
      explicacion:
        "Fuente: «En caso de actuar por medio de un representante, documento que acredite la representación o vinculación familiar (Libro de familia, Sentencia judicial de incapacitación, Resolución de acogimiento o tutela, poderes o autorización)».",
      canal: "ambos",
      soloSiOpciones: ["san-p1-otro"],
    },
    {
      id: "san-r6",
      tipo: "doc_fisico",
      titulo: "Volante de empadronamiento de menos de 90 días",
      explicacion:
        "Fuente: «Volante de empadronamiento expedido con menos de 90 días a su presentación». Curiosamente la fuente lo pide para esto, y no para la primera tarjeta.",
      canal: "ambos",
      tramitePrevioSlug: "empadronamiento-madrid",
      soloSiOpciones: ["san-p2-repo"],
    },
    {
      id: "san-r7",
      tipo: "tecnico",
      titulo: "Firma electrónica reconocida",
      explicacion:
        "Fuente: «Para realizar este trámite por medios electrónicos necesitas uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid». Si vas al centro de salud, no hace falta ni el formulario: «El personal de la Unidad Administrativa te indicará la documentación necesaria en tu caso concreto».",
      canal: "online",
    },
  ],
  prerequisitos: [
    { slug: "empadronamiento-madrid", nota: "Hay que estar empadronado en la Comunidad de Madrid." },
  ],
};
