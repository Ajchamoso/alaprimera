import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const renovacionDni: TramiteContenido = {
  slug: "renovacion-dni",
  nivel: "estatal",
  nombreOficial: "Renovación del DNI",
  nombreColoquial: "Renovar el carnet de identidad",
  descripcion:
    "Renovar el DNI cuando está caducado o a punto de caducar, se ha deteriorado o has perdido el anterior. Hay que ir en persona y con cita previa a una oficina de expedición.",
  organismo: "Policía Nacional (Ministerio del Interior)",
  territorio: "España",
  canales: ["presencial"],
  urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_420&id_menu=7_8",
  urlCitaPrevia: "https://www.citapreviadnie.es/",
  alias: ["dni", "carnet", "carné", "carnet de identidad", "documento de identidad", "renovar dni"],
  preguntas: [
    {
      id: "dni-p1",
      orden: 1,
      texto: "¿Para quién es la renovación?",
      tipo: "destinatario",
      opciones: [
        { id: "dni-p1-yo", texto: "Para mí" },
        { id: "dni-p1-menor", texto: "Para un menor a mi cargo" },
        {
          id: "dni-p1-adulto",
          texto: "Para otra persona adulta (mi madre, mi padre…)",
          veredictoInviable: true,
          textoAlternativas:
            "El DNI es personal y no puedes renovarlo tú por ella. Fuente: «para solicitar la renovación del Documento Nacional de Identidad será imprescindible la presencia física de la persona». Lo que sí puedes hacer: pedirle tú la cita previa, prepararle esta checklist y acompañarla el día de la cita.",
        },
      ],
    },
    {
      id: "dni-p2",
      orden: 2,
      texto: "¿Por qué motivo lo renuevas?",
      tipo: "normal",
      opciones: [
        { id: "dni-p2-caducidad", texto: "Caducado o a punto de caducar" },
        { id: "dni-p2-perdida", texto: "Pérdida o robo" },
        { id: "dni-p2-deterioro", texto: "Deterioro" },
      ],
    },
    {
      id: "dni-p3",
      orden: 3,
      texto: "¿Has cambiado de domicilio desde el último DNI?",
      tipo: "normal",
      opciones: [
        { id: "dni-p3-si", texto: "Sí" },
        { id: "dni-p3-no", texto: "No" },
      ],
    },
    {
      id: "dni-p4",
      orden: 4,
      texto: "¿Ha cambiado algún dato personal (nombre, apellidos, estado civil)?",
      tipo: "normal",
      opciones: [
        { id: "dni-p4-si", texto: "Sí" },
        { id: "dni-p4-no", texto: "No" },
      ],
    },
  ],
  requisitos: [
    {
      id: "dni-r1",
      tipo: "doc_fisico",
      titulo: "Una fotografía de 32×26 mm, de menos de 2 años",
      explicacion:
        "Fuente: «32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir o dificultar la identificación de la persona», con antigüedad «máxima de 2 años». Se admiten prendas de cabeza por motivos religiosos o médicos si dejan descubierto el óvalo del rostro, y gafas oscuras a personas invidentes.",
      canal: "presencial",
    },
    {
      id: "dni-r2",
      tipo: "doc_fisico",
      titulo: "El DNI que vas a renovar",
      explicacion:
        "Fuente: entre los documentos a aportar, «El DNI a renovar».",
      canal: "presencial",
      soloSiOpciones: ["dni-p2-caducidad", "dni-p2-deterioro"],
    },
    {
      id: "dni-r3",
      tipo: "doc_fisico",
      titulo: "La denuncia por pérdida o robo",
      explicacion:
        "Fuente: «En los casos de extravío y/o sustracción deberá presentar denuncia ante una Oficina de Denuncias y Atención al Ciudadano o ante la Unidad de Documentación en el momento de expedición del Documento Nacional de Identidad». Si ya la pusiste en otro sitio (guardia civil, juzgado, consulado), basta con comunicarlo aportando el justificante.",
      canal: "presencial",
      soloSiOpciones: ["dni-p2-perdida"],
    },
    {
      id: "dni-r4",
      tipo: "doc_fisico",
      titulo: "Certificado de empadronamiento de menos de 3 meses",
      explicacion:
        "Solo si cambias de domicilio respecto del DNI anterior. Fuente: «certificado o volante de empadronamiento del Ayuntamiento donde el solicitante tenga su domicilio, expedido con una antelación máxima de tres meses a la fecha de la solicitud del Documento Nacional de Identidad». Puedes ahorrártelo: no hace falta si no te opones a que consulten el padrón, «siempre que el empadronamiento se haya realizado por el interesado con una antelación mínima de dos meses».",
      canal: "presencial",
      soloSiOpciones: ["dni-p3-si"],
    },
    {
      id: "dni-r5",
      tipo: "doc_fisico",
      titulo: "Certificado del Registro Civil de menos de 6 meses",
      explicacion:
        "Fuente: «En caso de variación de datos de filiación, Certificado del Registro Civil (expedido con una antelación máxima de seis meses a la fecha de la solicitud del DNI)».",
      canal: "presencial",
      soloSiOpciones: ["dni-p4-si"],
    },
    {
      id: "dni-r6",
      tipo: "doc_fisico",
      titulo: "La tasa: 12 € (efectivo o tarjeta)",
      explicacion:
        "Fuente: la tasa «se actualiza mediante la Ley de Presupuestos Generales del Estado, estando actualmente fijada en 12 euros, pudiéndose realizar el pago en las Unidades de Documentación en efectivo o mediante tarjeta bancaria», o por internet al pedir la cita. Es gratis si renuevas solo por cambio de datos con el DNI en vigor, o si acreditas familia numerosa.",
      canal: "presencial",
    },
    {
      id: "dni-r7",
      tipo: "doc_fisico",
      titulo: "El DNI de quien acompaña al menor",
      explicacion:
        "Fuente: los menores deben acudir acompañados por quien tenga patria potestad o tutela, presentando «su DNI, Tarjeta de Identificación de Extranjero (TIE) o Certificado de Registro de Ciudadano de la Unión». Ojo: lo que se presenta es el documento del adulto, no el libro de familia.",
      canal: "presencial",
      soloSiOpciones: ["dni-p1-menor"],
    },
    {
      id: "dni-r8",
      tipo: "doc_fisico",
      titulo: "Cita previa pedida",
      explicacion:
        "Fuente: «en el momento de solicitud de cita previa a través de la web www.citapreviadnie.es».",
      canal: "presencial",
    },
  ],
  prerequisitos: [],
};
