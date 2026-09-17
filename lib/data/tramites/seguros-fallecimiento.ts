import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const segurosFallecimiento: TramiteContenido = {
  slug: "seguros-fallecimiento",
  nivel: "estatal",
  nombreOficial: "Certificado de Contratos de Seguros de cobertura de fallecimiento",
  nombreColoquial: "Saber qué seguros de vida tenía",
  descripcion:
    "El documento que dice con qué aseguradora tenía la persona fallecida un seguro de vida o de accidentes, para poder reclamarlo. Se pide a la vez que el de últimas voluntades, con el mismo modelo 790, y tampoco antes de 15 días hábiles desde el fallecimiento. Fuente: es el «documento que acredita los contratos vigentes en que figuraba como asegurada la persona fallecida y con qué entidad aseguradora».",
  organismo: "Registro de Contratos de Seguros de Cobertura de Fallecimiento · Ministerio de Justicia",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-contratos-seguros",
  alias: [
    "seguros de fallecimiento",
    "certificado de seguros de vida",
    "saber si tenia seguro de vida",
    "contratos de seguros de cobertura de fallecimiento",
    "registro de seguros de vida",
  ],
  preguntas: [
    {
      id: "seg-p1",
      orden: 1,
      texto: "¿Para quién pides el certificado?",
      tipo: "destinatario",
      opciones: [
        { id: "seg-p1-familiar", texto: "Para gestionar el fallecimiento de un familiar" },
        { id: "seg-p1-tercero", texto: "Para otra persona (con interés en saberlo)" },
      ],
    },
    {
      id: "seg-p2",
      orden: 2,
      texto: "¿Cuándo falleció la persona?",
      tipo: "normal",
      opciones: [
        { id: "seg-p2-post", texto: "Después del 2 de abril de 2009" },
        { id: "seg-p2-pre", texto: "Antes de esa fecha, o la defunción se inscribió en un Tribunal de Instancia" },
      ],
    },
    {
      id: "seg-p3",
      orden: 3,
      texto: "¿Cómo lo vas a tramitar?",
      tipo: "normal",
      opciones: [
        { id: "seg-p3-online", texto: "Por internet" },
        { id: "seg-p3-presencial", texto: "En persona o por correo" },
      ],
    },
  ],
  requisitos: [
    {
      id: "seg-r1",
      tipo: "doc_fisico",
      titulo: "La tasa: 3,86 € (modelo 790, tasa 006)",
      explicacion:
        "Fuente: «debe realizar el pago telemático de la tasa 006 asociada a la solicitud». El importe, según la Oficina de Justicia en el Municipio (ojm.justicia.es): «PRECIO DE LA TASA: 3,86 €».",
      canal: "ambos",
    },
    {
      id: "seg-r2",
      tipo: "tecnico",
      titulo: "Cl@ve o certificado digital (o la vía sin certificado)",
      explicacion:
        "Para la vía online. Fuente: la sede ofrece «Tramitación On-line con CL@VE» y «Tramitación On-line sin Certificado Digital».",
      canal: "online",
      soloSiOpciones: ["seg-p3-online"],
    },
    {
      id: "seg-r3",
      tipo: "doc_fisico",
      titulo: "El modelo 790 cumplimentado",
      explicacion:
        "Para pedirlo en persona o por correo. Fuente: «La presentación del formulario 790 es necesaria para solicitar un certificado de forma presencial o por correo».",
      canal: "presencial",
      soloSiOpciones: ["seg-p3-presencial"],
    },
    {
      id: "seg-r4",
      tipo: "tramite_previo",
      titulo: "El certificado literal de defunción",
      explicacion:
        "Solo si el fallecimiento es anterior al 2 de abril de 2009 o la defunción se inscribió en un Tribunal de Instancia. Fuente: «SI LA FECHA DEL FALLECIMIENTO ES POSTERIOR AL 2 DE ABRIL DE 2009 Y LA DEFUNCIÓN NO ESTÁ INSCRITA EN UN TRIBUNAL DE INSTANCIA NO ES NECESARIO PRESENTAR EL CERTIFICADO DE DEFUNCIÓN»; en los demás casos, «Certificado Literal de Defunción, que habrá de ser original o fotocopia compulsada, expedido por el Registro Civil».",
      canal: "presencial",
      tramitePrevioSlug: "certificado-defuncion",
      soloSiOpciones: ["seg-p2-pre"],
    },
  ],
  prerequisitos: [
    {
      slug: "certificado-defuncion",
      nota: "Solo si el fallecimiento es anterior al 2/4/2009 o la defunción se inscribió en un Tribunal de Instancia.",
    },
  ],
};
