import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const becaComedorAragon: TramiteContenido = {
  slug: "beca-comedor-aragon",
  nivel: "autonomico",
  comunidad: "aragon",
  nombreOficial: "Becas de comedor escolar (Aragón)",
  nombreColoquial: "La beca de comedor del cole",
  descripcion:
    "Ayuda para el comedor escolar en Aragón, para alumnos de Infantil, Primaria y Educación Especial. Depende de la renta familiar. La lista exacta de documentos está en la orden de convocatoria de cada curso.",
  organismo: "Departamento de Educación · Gobierno de Aragón",
  territorio: "Aragón",
  canales: ["online", "presencial"],
  urlFuente:
    "https://www.aragon.es/tramitador/-/tramite/becas-comedor-escolar-y-periodo-estival-no-lectivo",
  plazo: {
    inicio: "2026-06-08",
    fin: "2026-06-19",
    nota: "En la convocatoria 2026-2027 el plazo fue del 08/06 al 19/06. Suele abrirse a finales de curso: consulta la fuente oficial para la próxima.",
  },
  alias: [
    "beca comedor",
    "beca de comedor",
    "comedor escolar aragon",
    "ayuda comedor",
    "beca del cole",
  ],
  preguntas: [
    {
      id: "beca-ar-p1",
      orden: 1,
      texto: "¿Para quién solicitas la beca?",
      tipo: "destinatario",
      opciones: [
        { id: "beca-ar-p1-hijo", texto: "Para un hijo o menor a mi cargo" },
        {
          id: "beca-ar-p1-otro",
          texto: "Para el hijo de otra persona",
          veredictoInviable: true,
          textoAlternativas:
            "La beca la piden quienes tienen la guarda del menor. Si no eres progenitor, tutor o acogedor, no puedes solicitarla tú: tiene que hacerlo quien la tenga.",
        },
      ],
    },
    {
      id: "beca-ar-p2",
      orden: 2,
      texto: "¿Cómo quieres presentarla?",
      tipo: "normal",
      opciones: [
        { id: "beca-ar-p2-online", texto: "Por internet" },
        { id: "beca-ar-p2-presencial", texto: "En papel / en una oficina de registro" },
      ],
    },
  ],
  requisitos: [
    {
      id: "beca-ar-r1",
      tipo: "doc_fisico",
      titulo: "Tener el domicilio en Aragón",
      explicacion: "Fuente: «Tener su domicilio en el territorio de la Comunidad Autónoma de Aragón».",
      canal: "ambos",
    },
    {
      id: "beca-ar-r2",
      tipo: "doc_fisico",
      titulo: "Renta familiar por debajo de 2 veces el IPREM",
      explicacion:
        "Fuente: «El máximo de renta familiar para tener acceso a las becas de comedor escolar será de dos veces el Indicador Público de Renta de Efectos Múltiples (IPREM) vigente para el periodo objeto de la convocatoria».",
      canal: "ambos",
    },
    {
      id: "beca-ar-r3",
      tipo: "doc_fisico",
      titulo: "Estar matriculado en una etapa que da derecho",
      explicacion:
        "Fuente: «Alumnado que vaya a cursar estudios del tercer curso del primer ciclo de Educación Infantil, del segundo ciclo de Educación Infantil, de Educación Primaria y de Educación Especial».",
      canal: "ambos",
    },
    {
      id: "beca-ar-r4",
      tipo: "doc_digital",
      titulo: "Solicitud por la aplicación de becas (online)",
      explicacion:
        "Fuente: «Las solicitudes serán cumplimentadas a través de la aplicación informática de gestión de becas de comedor escolar y material curricular accesible a través del enlace disponible en educa.aragon.es». La fuente no detalla qué identificación digital pide la aplicación: confírmalo antes.",
      canal: "online",
      soloSiOpciones: ["beca-ar-p2-online"],
    },
    {
      id: "beca-ar-r5",
      tipo: "doc_fisico",
      titulo: "El resto de documentación de la convocatoria",
      explicacion:
        "Ojo: la ficha oficial no lista los documentos, los remite a la orden. Fuente: «Documentación descrita en el artículo undécimo de la orden de convocatoria». Consulta esa orden (en el BOA) para la lista exacta.",
      canal: "ambos",
    },
  ],
  prerequisitos: [],
};
