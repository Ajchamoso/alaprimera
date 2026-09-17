import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const empadronamientoZaragoza: TramiteContenido = {
  slug: "empadronamiento-zaragoza",
  nivel: "local",
  comunidad: "aragon",
  familia: "empadronamiento",
  nombreOficial: "Alta en el Padrón Municipal (Ayuntamiento de Zaragoza)",
  nombreColoquial: "Empadronarse en Zaragoza",
  descripcion:
    "Inscribirse en el padrón del Ayuntamiento de Zaragoza. Es la base de casi todo lo demás en Aragón: la tarjeta sanitaria y la familia numerosa te lo van a pedir. El alta es siempre presencial y sin cita previa.",
  organismo: "Gestión del Padrón · Ayuntamiento de Zaragoza",
  territorio: "Zaragoza (municipio)",
  canales: ["presencial"],
  urlFuente: "https://www.zaragoza.es/sede/servicio/tramite/3317",
  alias: [
    "empadronamiento",
    "empadronarme",
    "padron",
    "empadronarse en zaragoza",
    "volante de empadronamiento",
    "certificado de empadronamiento",
  ],
  preguntas: [
    {
      id: "emp-za-p1",
      orden: 1,
      texto: "¿Quién se empadrona?",
      tipo: "destinatario",
      opciones: [
        { id: "emp-za-p1-yo", texto: "Yo (con mi familia si procede)" },
        { id: "emp-za-p1-menor", texto: "Un menor a mi cargo" },
      ],
    },
    {
      id: "emp-za-p2",
      orden: 2,
      texto: "¿Cómo puedes acreditar que vives ahí?",
      tipo: "normal",
      opciones: [
        { id: "emp-za-p2-propio", texto: "Vivienda propia o de alquiler a mi nombre" },
        { id: "emp-za-p2-ajeno", texto: "Vivo en casa de otra persona" },
      ],
    },
  ],
  requisitos: [
    {
      id: "emp-za-r1",
      tipo: "doc_fisico",
      titulo: "Documento de identidad de todos los que se empadronan",
      explicacion:
        "Fuente: «hay que llevar siempre los documentos de identidad de las personas que se vayan a dar de alta». Requisito de base: «vivir en Zaragoza la mayor parte del año».",
      canal: "presencial",
    },
    {
      id: "emp-za-r2",
      tipo: "doc_fisico",
      titulo: "Documento que acredite que la vivienda es tu residencia habitual",
      explicacion:
        "Fuente: «los documentos que prueben que la vivienda es su residencia habitual» — por ejemplo «contrato de alquiler, escritura de propiedad, último recibo de luz, agua, etc.».",
      canal: "presencial",
      soloSiOpciones: ["emp-za-p2-propio"],
    },
    {
      id: "emp-za-r3",
      tipo: "doc_fisico",
      titulo: "Autorización del titular de la vivienda (impreso M005)",
      explicacion:
        "Si te empadronas en casa de otra persona. Fuente: «[M005] - Autorización para la Inscripción Padronal en el domicilio de otra persona».",
      canal: "presencial",
      soloSiOpciones: ["emp-za-p2-ajeno"],
    },
    {
      id: "emp-za-r4",
      tipo: "doc_fisico",
      titulo: "Documentos que acrediten la filiación del menor",
      explicacion:
        "Fuente: «si se inscribe a menores de edad, deberá presentar los documentos que acrediten la filiación» (libro de familia o certificado de nacimiento).",
      canal: "presencial",
      soloSiOpciones: ["emp-za-p1-menor"],
    },
    {
      id: "emp-za-r5",
      tipo: "doc_fisico",
      titulo: "Ir en persona a una Junta Municipal (sin cita previa)",
      explicacion:
        "El alta no se puede hacer por internet. Fuente: «En caso de ALTA el trámite es obligatoriamente presencial» y se hace «SIN CITA PREVIA. En las Juntas Municipales y Juntas Vecinales». (El volante o certificado sí se pueden pedir online después.)",
      canal: "presencial",
    },
  ],
  prerequisitos: [],
};
