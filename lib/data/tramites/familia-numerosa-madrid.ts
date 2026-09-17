import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const familiaNumerosaMadrid: TramiteContenido = {
  slug: "familia-numerosa-madrid",
  nivel: "autonomico",
  comunidad: "madrid",
  nombreOficial: "Título de Familia Numerosa (Comunidad de Madrid)",
  nombreColoquial: "El título de familia numerosa",
  descripcion:
    "El título que da descuentos y ventajas, entre ellas el DNI y el pasaporte gratis. Ya no es un papel: es una tarjeta digital. Se puede pedir todo el año.",
  organismo: "Dirección General de Infancia, Familia y Fomento de la Natalidad · Comunidad de Madrid",
  territorio: "Comunidad de Madrid",
  canales: ["online", "presencial"],
  urlFuente:
    "https://sede.comunidad.madrid/autorizaciones-licencias-permisos-carnes/titulo-familia-numerosa",
  alias: [
    "familia numerosa",
    "titulo de familia numerosa",
    "carnet familia numerosa",
    "descuentos familia numerosa",
  ],
  preguntas: [
    {
      id: "fn-p1",
      orden: 1,
      texto: "¿El título es para tu familia?",
      tipo: "destinatario",
      opciones: [
        { id: "fn-p1-yo", texto: "Sí, soy progenitor, tutor o acogedor" },
        {
          id: "fn-p1-otro",
          texto: "No, es para la familia de otra persona",
          veredictoInviable: true,
          textoAlternativas:
            "El título lo pide la propia unidad familiar. Si hay separación o divorcio y lo pide el progenitor no custodio, la fuente exige documentación específica: sentencia y/o convenio regulador, los tres últimos recibos de la pensión y un escrito firmado del progenitor custodio dando por conocida la inclusión de los hijos. Si no eres de la familia, no puedes pedirlo tú.",
        },
      ],
    },
    {
      id: "fn-p2",
      orden: 2,
      texto: "¿Qué nacionalidad tienen los miembros de la familia?",
      tipo: "normal",
      opciones: [
        { id: "fn-p2-es", texto: "Española" },
        { id: "fn-p2-ue", texto: "De la UE" },
        { id: "fn-p2-otra", texto: "De fuera de la UE" },
      ],
    },
    {
      id: "fn-p3",
      orden: 3,
      texto: "¿Hay hijos de entre 21 y 25 años?",
      tipo: "normal",
      opciones: [
        { id: "fn-p3-no", texto: "No" },
        { id: "fn-p3-si", texto: "Sí" },
      ],
    },
    {
      id: "fn-p4",
      orden: 4,
      texto: "¿Hay separación, divorcio o custodia compartida?",
      tipo: "normal",
      opciones: [
        { id: "fn-p4-no", texto: "No" },
        { id: "fn-p4-si", texto: "Sí" },
      ],
    },
  ],
  requisitos: [
    {
      id: "fn-r1",
      tipo: "tramite_previo",
      titulo: "Certificado o volante de empadronamiento de menos de 3 meses",
      explicacion:
        "De todos los que vayan en el título. Fuente: «expedido como máximo, dentro de los tres meses inmediatos anteriores a la fecha de solicitud. No se requiere que figuren los hijos menores de seis meses».",
      canal: "ambos",
      tramitePrevioSlug: "empadronamiento-madrid",
    },
    {
      id: "fn-r2",
      tipo: "doc_fisico",
      titulo: "Copia del libro de familia (o certificados de matrimonio y nacimiento)",
      explicacion:
        "Fuente: «Copia del Libro de Familia donde conste, en su caso, el matrimonio y nacimiento de los hijos o, en su defecto copia de los certificados de matrimonio y nacimiento de los hijos. En el caso de que los miembros de la familia figuren en distintos Libros de Familia se aportará copia de todos ellos».",
      canal: "ambos",
      soloSiOpciones: ["fn-p2-es"],
    },
    {
      id: "fn-r3",
      tipo: "doc_fisico",
      titulo: "Certificado de inscripción en el Registro Central de Extranjeros",
      explicacion:
        "Fuente (personas comunitarias): «Copia del certificado de inscripción en el Registro Central de Extranjeros». Y la documentación familiar «análoga, si ésta existe en el Estado del que son nacionales».",
      canal: "ambos",
      soloSiOpciones: ["fn-p2-ue"],
    },
    {
      id: "fn-r4",
      tipo: "doc_fisico",
      titulo: "Permiso de residencia o visado de reagrupación familiar",
      explicacion:
        "Fuente (extracomunitarias): «copia de la documentación acreditativa de la residencia legal: permiso de residencia o visado de reagrupación familiar». Si está caducado, hace falta copia de la solicitud de prórroga y el Anexo V.",
      canal: "ambos",
      soloSiOpciones: ["fn-p2-otra"],
    },
    {
      id: "fn-r5",
      tipo: "doc_fisico",
      titulo: "Certificado de estudios de los hijos de 21 a 25 años",
      explicacion:
        "Fuente: «Copia del certificado del Centro donde cursen estudios, matrícula oficial donde conste el curso que va a realizar, preinscripción o cualquier otro documento válido en derecho».",
      canal: "ambos",
      soloSiOpciones: ["fn-p3-si"],
    },
    {
      id: "fn-r6",
      tipo: "doc_fisico",
      titulo: "Sentencia, convenio regulador y recibos de la pensión",
      explicacion:
        "Fuente: si lo pide el progenitor no custodio, «copia de sentencia judicial y/o convenio regulador donde se determine la custodia de los hijos, tres últimos recibos bancarios correspondientes al pago de la pensión alimenticia de sus hijos y escrito firmado por el progenitor custodio». En custodia compartida, «acuerdo entre progenitores sobre titularidad y tiempos del Título».",
      canal: "ambos",
      soloSiOpciones: ["fn-p4-si"],
    },
    {
      id: "fn-r7",
      tipo: "tecnico",
      titulo: "Firma electrónica reconocida (también para usar el título)",
      explicacion:
        "No solo para pedirlo: el título ya no existe en papel. Fuente: «El título en soporte físico ha sido sustituido por una tarjeta digital en la aplicación de Familias Numerosas. Para acceder tienes que disponer de uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid».",
      canal: "ambos",
    },
    {
      id: "fn-r8",
      tipo: "doc_fisico",
      titulo: "Cita previa (para la vía presencial)",
      explicacion:
        "Fuente: «si deseas presentar la solicitud de forma presencial, es preciso tener cita previa. Para obtenerla, pulsa en el siguiente enlace o llama al teléfono 012».",
      canal: "presencial",
    },
  ],
  prerequisitos: [
    { slug: "empadronamiento-madrid", nota: "El empadronamiento caduca a los 3 meses para este trámite." },
  ],
};
