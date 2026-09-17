import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const pasaporte: TramiteContenido = {
  slug: "pasaporte",
  nivel: "estatal",
  nombreOficial: "Pasaporte ordinario",
  nombreColoquial: "El pasaporte",
  descripcion:
    "Sacar o renovar el pasaporte. Se hace en persona con cita previa. Para menores hace falta el consentimiento de TODAS las personas con patria potestad, no solo de quien tiene la custodia.",
  organismo: "Policía Nacional (Ministerio del Interior)",
  territorio: "España",
  canales: ["presencial"],
  urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_1084",
  urlCitaPrevia: "https://www.citapreviadnie.es/",
  alias: ["pasaporte", "renovar pasaporte", "sacar pasaporte", "pasaporte de mi hijo"],
  preguntas: [
    {
      id: "pas-p1",
      orden: 1,
      texto: "¿Para quién es el pasaporte?",
      tipo: "destinatario",
      opciones: [
        { id: "pas-p1-yo", texto: "Para mí" },
        { id: "pas-p1-menor", texto: "Para un menor a mi cargo" },
        {
          id: "pas-p1-adulto",
          texto: "Para otra persona adulta",
          veredictoInviable: true,
          textoAlternativas:
            "Fuente: «será imprescindible la presencia física de la persona a quien se haya de expedir». No puedes sacarlo tú por otra persona adulta. Sí puedes pedirle la cita y acompañarla.",
        },
      ],
    },
    {
      id: "pas-p2",
      orden: 2,
      texto: "¿El menor tiene ya DNI?",
      tipo: "normal",
      opciones: [
        { id: "pas-p2-si", texto: "Sí, tiene DNI" },
        { id: "pas-p2-no", texto: "No tiene DNI todavía" },
      ],
    },
    {
      id: "pas-p3",
      orden: 3,
      texto: "¿Tienes ya un pasaporte anterior?",
      tipo: "normal",
      opciones: [
        { id: "pas-p3-no", texto: "No, es el primero" },
        { id: "pas-p3-vigor", texto: "Sí, y está en vigor" },
        { id: "pas-p3-perdido", texto: "Lo perdí o me lo robaron" },
      ],
    },
  ],
  requisitos: [
    {
      id: "pas-r1",
      tipo: "tramite_previo",
      titulo: "DNI en vigor",
      explicacion:
        "El encadenamiento clásico: si tu DNI está caducado, primero toca renovarlo. Fuente: «Documento Nacional de Identidad en vigor del solicitante en su versión física o digital, para comprobar los datos de este documento con los reflejados en la solicitud».",
      canal: "presencial",
      tramitePrevioSlug: "renovacion-dni",
      soloSiOpciones: ["pas-p1-yo", "pas-p2-si"],
    },
    {
      id: "pas-r2",
      tipo: "tramite_previo",
      titulo: "Certificación literal de nacimiento (menos de 6 meses)",
      explicacion:
        "Sustituye al DNI cuando el menor aún no lo tiene. Fuente: «deberá aportar una certificación literal de nacimiento expedida por el Registro Civil correspondiente con una antelación máxima de seis meses […] y que contengan la anotación de que se ha emitido a los solos efectos de la obtención de este documento».",
      canal: "presencial",
      tramitePrevioSlug: "certificado-nacimiento",
      soloSiOpciones: ["pas-p2-no"],
    },
    {
      id: "pas-r3",
      tipo: "doc_fisico",
      titulo: "El consentimiento de TODAS las personas con patria potestad",
      explicacion:
        "Aquí es donde más gente se atasca. Fuente: «deberá constar el consentimiento expreso de quienes tengan atribuido el ejercicio de la patria potestad o tutela (TODAS LAS PERSONAS QUE LA TENGAN ATRIBUIDA)». Pueden ir juntos o por separado, incluso a equipos de expedición distintos, o hacerlo ante notario. Si hay sentencia que priva o limita la patria potestad de uno, basta la autorización del otro.",
      canal: "presencial",
      soloSiOpciones: ["pas-p1-menor"],
    },
    {
      id: "pas-r4",
      tipo: "doc_fisico",
      titulo: "DNI del progenitor o tutor, y acreditar el parentesco",
      explicacion:
        "Fuente: al prestar el consentimiento «deberán acreditar su identidad con el documento nacional de identidad en vigor» y «se deberá acreditar la relación de parentesco, o condición de tutor, mediante la presentación de cualquier documento oficial al efecto».",
      canal: "presencial",
      soloSiOpciones: ["pas-p1-menor"],
    },
    {
      id: "pas-r5",
      tipo: "doc_fisico",
      titulo: "Una fotografía reciente de 32×26 mm",
      explicacion:
        "Fuente: «tamaño 32 x 26 milímetros, con fondo uniforme blanco y liso, tomada de frente y sin gafas de cristales oscuros», «de alta resolución y en papel fotográfico de buena calidad». No hace falta si has sacado o renovado el DNI el mismo día.",
      canal: "presencial",
    },
    {
      id: "pas-r6",
      tipo: "doc_fisico",
      titulo: "El pasaporte anterior, para anularlo",
      explicacion:
        "Fuente: si el pasaporte está en vigor y no se ha perdido, «deberá presentar el mismo en el equipo de expedición […] a efectos de que sea inutilizado físicamente».",
      canal: "presencial",
      soloSiOpciones: ["pas-p3-vigor"],
    },
    {
      id: "pas-r7",
      tipo: "doc_fisico",
      titulo: "La tasa: 30 € (efectivo o tarjeta)",
      explicacion:
        "Fuente: «Primera obtención, renovación, extravío, sustracción, anticipo o deterioro: 30,00 euros, abonados bien en efectivo o a través de tarjeta de crédito/débito en la Unidad de Documentación, o utilizando el pago por vía telemática». Gratis si acreditáis familia numerosa.",
      canal: "presencial",
    },
  ],
  prerequisitos: [
    { slug: "renovacion-dni", nota: "El pasaporte exige el DNI en vigor." },
  ],
};
