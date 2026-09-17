import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const dniPrimeraVez: TramiteContenido = {
  slug: "dni-primera-vez",
  nivel: "estatal",
  nombreOficial: "Primera inscripción del DNI",
  nombreColoquial: "El primer DNI (de un niño o niña)",
  descripcion:
    "Sacar el DNI por primera vez. Hay que ir en persona con cita previa, y trae dos trámites escondidos: el certificado de nacimiento del Registro Civil y el empadronamiento. Los dos caducan.",
  organismo: "Policía Nacional (Ministerio del Interior)",
  territorio: "España",
  canales: ["presencial"],
  urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_410",
  urlCitaPrevia: "https://www.citapreviadnie.es/",
  alias: [
    "primer dni",
    "dni primera vez",
    "dni de mi hijo",
    "sacar el dni",
    "primera inscripcion",
    "dni niño",
  ],
  preguntas: [
    {
      id: "dni1-p1",
      orden: 1,
      texto: "¿Para quién es el primer DNI?",
      tipo: "destinatario",
      opciones: [
        { id: "dni1-p1-menor", texto: "Para un menor a mi cargo" },
        { id: "dni1-p1-yo", texto: "Para mí" },
        {
          id: "dni1-p1-adulto",
          texto: "Para otra persona adulta",
          veredictoInviable: true,
          textoAlternativas:
            "El DNI es personal: la fuente exige «la presencia física de la persona a quien se haya de expedir». No puedes sacarlo tú por otra persona adulta. Sí puedes pedirle la cita, prepararle la lista y acompañarla.",
        },
      ],
    },
    {
      id: "dni1-p2",
      orden: 2,
      texto: "¿Dónde reside la persona?",
      tipo: "normal",
      opciones: [
        { id: "dni1-p2-espana", texto: "En España" },
        { id: "dni1-p2-extranjero", texto: "En el extranjero" },
      ],
    },
    {
      id: "dni1-p3",
      orden: 3,
      texto: "¿Es una primera inscripción por nacionalización?",
      tipo: "normal",
      opciones: [
        { id: "dni1-p3-no", texto: "No" },
        { id: "dni1-p3-si", texto: "Sí, tengo TIE o Certificado de Registro con NIE" },
      ],
    },
  ],
  requisitos: [
    {
      id: "dni1-r1",
      tipo: "tramite_previo",
      titulo: "Certificación literal de nacimiento (menos de 6 meses)",
      explicacion:
        "Ojo: tiene que pedirse expresamente para esto. Fuente: «Certificación literal de nacimiento (emitida solo a efectos de la obtención del Documento Nacional de Identidad) expedida por el Registro Civil […] con una antelación máxima de seis meses a la fecha de presentación».",
      canal: "presencial",
      tramitePrevioSlug: "certificado-nacimiento",
    },
    {
      id: "dni1-r2",
      tipo: "tramite_previo",
      titulo: "Certificado o volante de empadronamiento (menos de 3 meses)",
      explicacion:
        "Fuente: «Certificado o volante de empadronamiento del Ayuntamiento donde la persona solicitante tenga su domicilio, expedido con una antelación máxima de tres meses a la fecha de la tramitación».",
      canal: "presencial",
      tramitePrevioFamilia: "empadronamiento",
      soloSiOpciones: ["dni1-p2-espana"],
    },
    {
      id: "dni1-r3",
      tipo: "doc_fisico",
      titulo: "Certificación del consulado (si residís fuera de España)",
      explicacion:
        "Fuente: «Las personas con nacionalidad española residentes en el extranjero acreditarán el domicilio mediante certificación de la Representación Diplomática o Consular donde estén inscritos como residentes, expedida con una antelación máxima de tres meses».",
      canal: "presencial",
      soloSiOpciones: ["dni1-p2-extranjero"],
    },
    {
      id: "dni1-r4",
      tipo: "doc_fisico",
      titulo: "Una fotografía de 32×26 mm, de menos de 2 años",
      explicacion:
        "Fuente: «tamaño 32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros», con «antigüedad máxima de 2 años». Se admiten prendas de cabeza por motivos religiosos o médicos si dejan descubierto el óvalo del rostro.",
      canal: "presencial",
    },
    {
      id: "dni1-r5",
      tipo: "doc_fisico",
      titulo: "El DNI de quien acompaña al menor",
      explicacion:
        "Fuente: se hará «en presencia de quien tenga encomendada la patria potestad o tutela […] el cual deberá aportar su DNI, Tarjeta de Identificación de Extranjero (TIE) o Certificado de Registro de Ciudadano de la Unión». Ojo: aquí la fuente habla en singular. A diferencia del pasaporte, NO exige el consentimiento de ambos progenitores.",
      canal: "presencial",
      soloSiOpciones: ["dni1-p1-menor"],
    },
    {
      id: "dni1-r6",
      tipo: "doc_fisico",
      titulo: "Tu TIE o Certificado de Registro con el NIE",
      explicacion:
        "Fuente: en primera inscripción como nacionalizado con TIE o Certificado de Registro donde conste el NIE, «deberá aportarlo, como requisito indispensable, en el momento de la tramitación».",
      canal: "presencial",
      soloSiOpciones: ["dni1-p3-si"],
    },
    {
      id: "dni1-r7",
      tipo: "doc_fisico",
      titulo: "La tasa: 12 € (efectivo o tarjeta)",
      explicacion:
        "Fuente: la tasa está «actualmente fijada en 12 euros, pudiéndose realizar el pago en las Unidades de Documentación en efectivo o mediante tarjeta bancaria», o por internet al pedir la cita. Gratis si acreditáis familia numerosa, y para menores de 14 años en unidad de convivencia con ingreso mínimo vital.",
      canal: "presencial",
    },
    {
      id: "dni1-r8",
      tipo: "doc_fisico",
      titulo: "Cita previa pedida",
      explicacion:
        "Fuente: «la tramitación del Documento Nacional de Identidad se realizará con la presencia física de la persona, a través de los sistemas de cita previa».",
      canal: "presencial",
    },
  ],
  prerequisitos: [
    { slug: "certificado-nacimiento", nota: "Pídelo «emitida solo a efectos de la obtención del Documento Nacional de Identidad» del DNI: caduca a los 6 meses." },
    { familia: "empadronamiento", nota: "El certificado caduca a los 3 meses." },
  ],
};
