import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const familiaNumerosaAragon: TramiteContenido = {
  slug: "familia-numerosa-aragon",
  nivel: "autonomico",
  comunidad: "aragon",
  nombreOficial: "Título de Familia Numerosa (Aragón)",
  nombreColoquial: "El título de familia numerosa",
  descripcion:
    "El título que da descuentos y ventajas, entre ellas el DNI y el pasaporte gratis. En Aragón lo regula el Decreto 75/2023 y lo gestiona el Gobierno de Aragón. Se puede pedir todo el año.",
  organismo: "Departamento de Bienestar Social y Familia · Gobierno de Aragón",
  territorio: "Aragón",
  canales: ["online", "presencial"],
  urlFuente: "https://www.aragon.es/-/familias-numerosas",
  urlCitaPrevia: "https://citaprevia.aragon.es",
  alias: [
    "familia numerosa",
    "titulo de familia numerosa",
    "carnet familia numerosa",
    "familia numerosa aragon",
  ],
  preguntas: [
    {
      id: "fn-ar-p1",
      orden: 1,
      texto: "¿El título es para tu familia?",
      tipo: "destinatario",
      opciones: [
        { id: "fn-ar-p1-yo", texto: "Sí, soy progenitor, tutor o acogedor" },
        {
          id: "fn-ar-p1-otro",
          texto: "No, es para la familia de otra persona",
          veredictoInviable: true,
          textoAlternativas:
            "El título lo pide la propia unidad familiar. Si no eres progenitor, tutor o acogedor de esos menores, no puedes solicitarlo tú: tiene que hacerlo quien tenga la guarda.",
        },
      ],
    },
    {
      id: "fn-ar-p2",
      orden: 2,
      texto: "¿Hay miembros extranjeros no comunitarios?",
      tipo: "normal",
      opciones: [
        { id: "fn-ar-p2-no", texto: "No" },
        { id: "fn-ar-p2-si", texto: "Sí" },
      ],
    },
    {
      id: "fn-ar-p3",
      orden: 3,
      texto: "¿Hay hijos de entre 21 y 25 años que estudian?",
      tipo: "normal",
      opciones: [
        { id: "fn-ar-p3-no", texto: "No" },
        { id: "fn-ar-p3-si", texto: "Sí" },
      ],
    },
  ],
  requisitos: [
    {
      id: "fn-ar-r1",
      tipo: "tramite_previo",
      titulo: "Volante de empadronamiento colectivo de toda la familia",
      explicacion: "Fuente: «Volante de empadronamiento colectivo de todos los miembros de la familia».",
      canal: "ambos",
      tramitePrevioSlug: "empadronamiento-zaragoza",
    },
    {
      id: "fn-ar-r2",
      tipo: "doc_fisico",
      titulo: "Libro de familia o acta de nacimiento",
      explicacion: "Fuente: «Libro de familia o acta de nacimiento».",
      canal: "ambos",
    },
    {
      id: "fn-ar-r3",
      tipo: "doc_fisico",
      titulo: "Documento de firmas para autorizar la consulta de datos",
      explicacion: "Fuente: «Documento de firmas para autorización de la consulta de datos».",
      canal: "ambos",
    },
    {
      id: "fn-ar-r4",
      tipo: "doc_fisico",
      titulo: "Certificado o matrícula de estudios de los hijos de 21 a 25 años",
      explicacion:
        "Fuente: «Certificado o matrícula del centro donde cursen estudios los hijos/as». Cuentan «hasta los 25 años inclusive, si cursan estudios».",
      canal: "ambos",
      soloSiOpciones: ["fn-ar-p3-si"],
    },
    {
      id: "fn-ar-r5",
      tipo: "doc_fisico",
      titulo: "Tarjetas de residencia (miembros extranjeros no comunitarios)",
      explicacion:
        "Fuente: «residencia (solo para personas extranjeras no comunitarias): Tarjetas de residencia de miembros de la unidad familiar».",
      canal: "ambos",
      soloSiOpciones: ["fn-ar-p2-si"],
    },
    {
      id: "fn-ar-r6",
      tipo: "doc_fisico",
      titulo: "Cita previa (para la vía presencial)",
      explicacion:
        "Fuente: se atiende «La información y tramitación presencial requieren de cita previa, que puede solicitarse: Online en https://citaprevia.aragon.es/» o por teléfono.",
      canal: "presencial",
    },
  ],
  prerequisitos: [
    { slug: "empadronamiento-zaragoza", nota: "Hace falta el volante de empadronamiento colectivo." },
  ],
};
