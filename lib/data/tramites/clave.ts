import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const clave: TramiteContenido = {
  slug: "clave",
  nivel: "estatal",
  nombreOficial: "Registro en el sistema Cl@ve",
  nombreColoquial: "Cl@ve, la identidad electrónica del Estado",
  descripcion:
    "El sistema con el que el Estado te identifica por internet, alternativa al certificado digital. Se puede sacar por vídeo, con una carta que te mandan a casa, con certificado, o en persona en una oficina.",
  organismo: "Cl@ve · Gobierno de España",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://clave.gob.es/registro/como-puedo-registrarme",
  alias: ["clave", "cl@ve", "clave pin", "clave permanente", "identidad electronica", "clave movil"],
  preguntas: [
    {
      id: "clv-p1",
      orden: 1,
      texto: "¿Para quién es el registro en Cl@ve?",
      tipo: "destinatario",
      opciones: [
        { id: "clv-p1-yo", texto: "Para mí" },
        {
          id: "clv-p1-otra",
          texto: "Para otra persona (mi madre, mi padre…)",
          veredictoInviable: true,
          textoAlternativas:
            "Aquí la fuente es tajante y ni siquiera vale un apoderamiento: «Para el registro en Cl@ve de forma presencial es imprescindible la presencia física de la persona que se va a registrar, así como que acuda con su DNI. Por tanto, no cabe instar registros en CL@VE mediante representación por parte de un tercero o apoderado». Tus opciones reales: (1) sentaros juntos y que se registre ella (por vídeo desde su móvil es lo más cómodo); (2) acompañarla a una oficina de registro con su DNI.",
        },
      ],
    },
    {
      id: "clv-p2",
      orden: 2,
      texto: "¿Cómo prefieres registrarte?",
      tipo: "normal",
      opciones: [
        { id: "clv-p2-video", texto: "Por vídeo, desde el móvil" },
        { id: "clv-p2-carta", texto: "Con una carta que me manden a casa" },
        { id: "clv-p2-cert", texto: "Con mi certificado digital o DNIe" },
        { id: "clv-p2-oficina", texto: "En persona, en una oficina" },
      ],
    },
    {
      id: "clv-p3",
      orden: 3,
      texto: "¿Qué documento de identidad tienes?",
      tipo: "normal",
      opciones: [
        { id: "clv-p3-dni", texto: "DNI español" },
        { id: "clv-p3-nie", texto: "NIE" },
      ],
    },
  ],
  requisitos: [
    {
      id: "clv-r1",
      tipo: "tramite_previo",
      titulo: "DNI en vigor (la vía de vídeo solo admite DNI español)",
      explicacion:
        "Fuente: «Temporalmente solo se ofrecerá el registro por videoidentificación a ciudadanos españoles con un DNI en vigor». Si tienes NIE, esta vía está cerrada ahora mismo: usa la carta de invitación o el certificado.",
      canal: "online",
      tramitePrevioSlug: "renovacion-dni",
      soloSiOpciones: ["clv-p2-video"],
    },
    {
      id: "clv-r2",
      tipo: "tecnico",
      titulo: "App Cl@ve, móvil con cámara y micro, y un sitio tranquilo",
      explicacion:
        "Fuente: «Tener instalada la APP Cl@ve. Un teléfono móvil con buena conexión, cámara y micrófono. Una dirección de correo electrónico y un número de teléfono personal. Un lugar tranquilo, bien iluminado, con fondo neutro».",
      canal: "online",
      soloSiOpciones: ["clv-p2-video"],
    },
    {
      id: "clv-r3",
      tipo: "doc_fisico",
      titulo: "El documento original, sin funda ni plastificar",
      explicacion:
        "Fuente: «Documento original en buen estado. No se pueden usar fundas, fotocopias o plastificados» y «El ciudadano debe ser el titular del documento».",
      canal: "online",
      soloSiOpciones: ["clv-p2-video"],
    },
    {
      id: "clv-r4",
      tipo: "doc_fisico",
      titulo: "La fecha de validez de tu DNI",
      explicacion:
        "Fuente: «DNI: indica la fecha de validez. DNI permanente (con fecha de validez 01-01-9999) solo es posible utilizar la fecha de expedición».",
      canal: "ambos",
      soloSiOpciones: ["clv-p3-dni"],
    },
    {
      id: "clv-r5",
      tipo: "doc_fisico",
      titulo: "El número de soporte de tu NIE",
      explicacion:
        "Fuente: «NIE: se solicitará el número de soporte que aparece en su documento».",
      canal: "ambos",
      soloSiOpciones: ["clv-p3-nie"],
    },
    {
      id: "clv-r6",
      tipo: "doc_fisico",
      titulo: "La carta de invitación con su código de 16 caracteres",
      explicacion:
        "Llega por correo postal a tu domicilio fiscal, el que conste en Hacienda (ojo con eso). Fuente: «Localiza el Código Seguro de Verificación (CSV) en la carta. Es un código de 16 números y letras en mayúsculas».",
      canal: "ambos",
      soloSiOpciones: ["clv-p2-carta"],
    },
    {
      id: "clv-r7",
      tipo: "tecnico",
      titulo: "Un móvil por persona, y un email",
      explicacion:
        "Fuente: «además del DNI, necesitas un número de teléfono móvil (solo se podrá asociar un DNI/NIE a un mismo número de móvil) y una dirección de correo electrónico». Si compartís móvil en casa, esto os va a frenar.",
      canal: "ambos",
      soloSiOpciones: ["clv-p2-carta"],
    },
    {
      id: "clv-r8",
      tipo: "tramite_previo",
      titulo: "Certificado digital o DNIe, con su número de soporte",
      explicacion:
        "Fuente: «Identifícate con tu certificado o DNI electrónico, además será necesario que consignes el número de soporte del documento para verificar la validez del mismo». Esta vía da nivel avanzado.",
      canal: "online",
      tramitePrevioSlug: "certificado-digital-fnmt",
      soloSiOpciones: ["clv-p2-cert"],
    },
    {
      id: "clv-r9",
      tipo: "doc_fisico",
      titulo: "Ir en persona con tu DNI (y mirar si piden cita)",
      explicacion:
        "Fuente: «es imprescindible la presencia física de la persona que se va a registrar, así como que acuda con su DNI» y «Recuerda, asimismo, que muchas oficinas requieren cita previa». Oficinas: AEAT, Seguridad Social, SEPE y Delegaciones del Gobierno.",
      canal: "presencial",
      soloSiOpciones: ["clv-p2-oficina"],
    },
  ],
  prerequisitos: [],
};
