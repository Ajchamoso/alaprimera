import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const inscripcionNacimiento: TramiteContenido = {
  slug: "inscripcion-nacimiento",
  nivel: "estatal",
  nombreOficial: "Inscripción de Nacimiento",
  nombreColoquial: "Inscribir al recién nacido",
  descripcion:
    "Registrar al bebé en el Registro Civil: es el asiento que da fe de su nacimiento, su nombre y su filiación, y de él cuelgan después el resto de sus trámites. Corre prisa y hay dos vías con plazos distintos: si lo tramita el hospital, 72 horas; si vais vosotros al Registro Civil, diez días (ampliables a 30 con causa justificada).",
  organismo: "Registro Civil · Ministerio de Justicia",
  territorio: "España",
  canales: ["presencial"],
  urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/inscripcion-nacimiento",
  alias: [
    "inscribir nacimiento",
    "registrar bebe",
    "registrar recien nacido",
    "inscripcion de nacimiento",
    "registro civil bebe",
    "dar de alta al bebe en el registro",
  ],
  preguntas: [
    {
      id: "insc-p1",
      orden: 1,
      texto: "¿Para quién es la inscripción?",
      tipo: "destinatario",
      opciones: [
        { id: "insc-p1-hijo", texto: "Para mi hijo o hija recién nacido/a" },
        { id: "insc-p1-familiar", texto: "Para el bebé de un familiar (yo lo declaro)" },
      ],
    },
    {
      id: "insc-p2",
      orden: 2,
      texto: "¿Cómo vais a inscribirlo?",
      tipo: "normal",
      opciones: [
        { id: "insc-p2-hospital", texto: "En el propio hospital, en los primeros días" },
        { id: "insc-p2-registro", texto: "Nosotros mismos en el Registro Civil" },
      ],
    },
    {
      id: "insc-p3",
      orden: 3,
      texto: "¿Dónde queréis inscribir el nacimiento?",
      tipo: "normal",
      opciones: [
        { id: "insc-p3-lugar", texto: "En el lugar donde ha nacido" },
        { id: "insc-p3-domicilio", texto: "En el municipio donde vivimos los padres" },
      ],
    },
  ],
  requisitos: [
    {
      id: "insc-r1",
      tipo: "doc_digital",
      titulo: "El certificado médico del nacimiento",
      explicacion:
        "Lo firma el personal sanitario que atendió el parto. Fuente: la declaración se acompaña de «el certificado médico preceptivo firmado electrónicamente por el facultativo». Si nacisteis en un hospital y lo tramita el propio centro, no tenéis que aportarlo vosotros.",
      canal: "presencial",
    },
    {
      id: "insc-r2",
      tipo: "doc_fisico",
      titulo: "El documento oficial de declaración, cumplimentado",
      explicacion:
        "Fuente: «La declaración se efectuará presentando el documento oficial debidamente cumplimentado, que comprenderá la identificación y nacionalidad de los declarantes». Ojo con el nombre elegido: «no se puede designar más de un nombre compuesto ni más de dos simples».",
      canal: "presencial",
    },
    {
      id: "insc-r3",
      tipo: "doc_fisico",
      titulo: "Certificado de empadronamiento de ambos padres",
      explicacion:
        "Solo si inscribís en vuestro municipio y no en el del hospital. Fuente: «Certificado de empadronamiento de ambos padres». Sirve para «acreditar el domicilio común de los padres en el lugar en que se pretende inscribir».",
      canal: "presencial",
      soloSiOpciones: ["insc-p3-domicilio"],
    },
    {
      id: "insc-r4",
      tipo: "doc_fisico",
      titulo: "Certificado del hospital de que el bebé no se ha inscrito ya",
      explicacion:
        "Solo si inscribís en vuestro municipio. Fuente: «Certificado de la Clínica u Hospital de que no se ha promovido ninguna otra inscripción del recién nacido». Además, los padres declaran «bajo su responsabilidad que no han promovido la inscripción en el Registro Civil correspondiente al lugar de nacimiento».",
      canal: "presencial",
      soloSiOpciones: ["insc-p3-domicilio"],
    },
    {
      id: "insc-r5",
      tipo: "doc_fisico",
      titulo: "El DNI de ambos padres, presentes los dos",
      explicacion:
        "Solo si inscribís en vuestro municipio. Fuente: «La acreditación se hará por DNI o, en su defecto, por certificado de empadronamiento», y «se exige que la solicitud se formule por la comparecencia de los progenitores de común acuerdo»: tenéis que ir los dos.",
      canal: "presencial",
      soloSiOpciones: ["insc-p3-domicilio"],
    },
  ],
  prerequisitos: [],
};
