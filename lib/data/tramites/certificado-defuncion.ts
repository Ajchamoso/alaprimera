import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const certificadoDefuncion: TramiteContenido = {
  slug: "certificado-defuncion",
  nivel: "estatal",
  nombreOficial: "Certificado de Defunción",
  nombreColoquial: "El certificado de defunción",
  descripcion:
    "El documento del Registro Civil que da fe de la muerte de una persona. Es el primer papel que piden casi todas las gestiones que vienen después (pensiones, herencia, bajas). Fuente: «Es el documento expedido por el Registro Civil que da fe de la muerte de una persona y de la fecha y lugar en que se ha producido.»",
  organismo: "Registro Civil · Ministerio de Justicia",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-defuncion",
  alias: [
    "certificado de defuncion",
    "partida de defuncion",
    "certificado de fallecimiento",
    "acta de defuncion",
    "certificado defuncion registro civil",
  ],
  preguntas: [
    {
      id: "def-p1",
      orden: 1,
      texto: "¿Quién pide el certificado?",
      tipo: "destinatario",
      opciones: [
        { id: "def-p1-familiar", texto: "Soy familiar de la persona fallecida" },
        { id: "def-p1-tercero", texto: "No soy familiar, pero tengo interés legítimo (p. ej. acreedor)" },
      ],
    },
    {
      id: "def-p2",
      orden: 2,
      texto: "¿Cómo quieres pedirlo?",
      tipo: "normal",
      opciones: [
        { id: "def-p2-online", texto: "Por internet" },
        { id: "def-p2-presencial", texto: "En persona o por correo" },
      ],
    },
  ],
  requisitos: [
    {
      id: "def-r1",
      tipo: "doc_fisico",
      titulo: "Los datos de la persona fallecida",
      explicacion:
        "Nombre y apellidos, y la fecha y el lugar de la defunción. Fuente (Punto de Acceso General): hay que indicar «el nombre, apellidos del fallecido, y el lugar y fecha de defunción».",
      canal: "ambos",
    },
    {
      id: "def-r2",
      tipo: "tecnico",
      titulo: "Cl@ve o certificado digital (o la vía sin identificación)",
      explicacion:
        "Para pedirlo por internet. Fuente: la sede ofrece «Solicitud en línea con identificación CL@VE» y «Solicitud en línea sin identificación CL@VE».",
      canal: "online",
      soloSiOpciones: ["def-p2-online"],
    },
    {
      id: "def-r3",
      tipo: "doc_fisico",
      titulo: "Tu DNI; si es por correo, una carta con tus datos",
      explicacion:
        "Fuente (Punto de Acceso General): por correo se envía una carta con «nombre, apellidos y DNI de la persona que solicita el certificado, así como el nombre, apellidos del fallecido, y el lugar y fecha de defunción». La sede añade que «el certificado solicitado por esta vía se remitirá siempre por correo ordinario al domicilio indicado».",
      canal: "presencial",
      soloSiOpciones: ["def-p2-presencial"],
    },
  ],
  prerequisitos: [],
};
