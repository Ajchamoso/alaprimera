import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const ultimasVoluntades: TramiteContenido = {
  slug: "ultimas-voluntades",
  nivel: "estatal",
  nombreOficial: "Certificado de Actos de Última Voluntad",
  nombreColoquial: "El certificado de últimas voluntades",
  descripcion:
    "El papel que dice si la persona fallecida hizo testamento y ante qué notario: por ahí empieza cualquier herencia. Se pide junto con el certificado de seguros, con el mismo impreso. Ojo: no se puede solicitar hasta pasados 15 días hábiles desde el fallecimiento. Fuente: «El Certificado de Actos de Última Voluntad es el documento que acredita si una persona ha otorgado testamento/s y ante qué Notario/s.»",
  organismo: "Registro de Actos de Última Voluntad · Ministerio de Justicia",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-actos-ultima",
  alias: [
    "ultimas voluntades",
    "certificado de ultimas voluntades",
    "actos de ultima voluntad",
    "saber si hay testamento",
    "certificado de testamento",
  ],
  preguntas: [
    {
      id: "uv-p1",
      orden: 1,
      texto: "¿Para quién pides el certificado?",
      tipo: "destinatario",
      opciones: [
        { id: "uv-p1-familiar", texto: "Para la herencia de un familiar" },
        { id: "uv-p1-otro", texto: "En nombre de otra persona fallecida" },
      ],
    },
    {
      id: "uv-p2",
      orden: 2,
      texto: "¿Cuándo falleció la persona?",
      tipo: "normal",
      opciones: [
        { id: "uv-p2-post", texto: "Después del 2 de abril de 2009" },
        { id: "uv-p2-pre", texto: "Antes de esa fecha, o la defunción se inscribió en un Juzgado de Paz" },
      ],
    },
    {
      id: "uv-p3",
      orden: 3,
      texto: "¿Cómo lo vas a tramitar?",
      tipo: "normal",
      opciones: [
        { id: "uv-p3-online", texto: "Por internet, con Cl@ve" },
        { id: "uv-p3-presencial", texto: "En persona o por correo" },
      ],
    },
  ],
  requisitos: [
    {
      id: "uv-r1",
      tipo: "doc_fisico",
      titulo: "La tasa: 3,86 € (modelo 790, tasa 006)",
      explicacion:
        "Fuente: «debe realizar el pago telemático de la tasa 006 asociada a la solicitud». El importe, según la Oficina de Justicia en el Municipio (ojm.justicia.es): «PRECIO DE LA TASA: 3,86 €».",
      canal: "ambos",
    },
    {
      id: "uv-r2",
      tipo: "tecnico",
      titulo: "Cl@ve",
      explicacion:
        "Para la vía online. Fuente: «Tramitación On-line con CL@VE». Solo vale si el fallecimiento es posterior al 2 de abril de 2009 y la defunción no se inscribió en un Juzgado de Paz.",
      canal: "online",
      soloSiOpciones: ["uv-p3-online"],
    },
    {
      id: "uv-r3",
      tipo: "doc_fisico",
      titulo: "El modelo 790 cumplimentado",
      explicacion:
        "Para pedirlo en persona o por correo. Fuente: «La presentación del formulario 790 es necesaria para solicitar un certificado de forma presencial o por correo».",
      canal: "presencial",
      soloSiOpciones: ["uv-p3-presencial"],
    },
    {
      id: "uv-r4",
      tipo: "tramite_previo",
      titulo: "El certificado literal de defunción",
      explicacion:
        "Solo si el fallecimiento es anterior al 2 de abril de 2009 o la defunción se inscribió en un Juzgado de Paz. Fuente: en ese caso «ha de acudir a la vía presencial o por correo postal pues ha de acompañar a su solicitud el certificado literal de defunción».",
      canal: "presencial",
      tramitePrevioSlug: "certificado-defuncion",
      soloSiOpciones: ["uv-p2-pre"],
    },
  ],
  prerequisitos: [
    {
      slug: "certificado-defuncion",
      nota: "Solo si el fallecimiento es anterior al 2/4/2009 o la defunción se inscribió en un Juzgado de Paz; en los demás casos la vía online no lo pide.",
    },
  ],
};
