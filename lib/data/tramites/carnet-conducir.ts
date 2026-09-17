import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const carnetConducir: TramiteContenido = {
  slug: "carnet-conducir",
  nivel: "estatal",
  nombreOficial: "Obtención del permiso de conducción",
  nombreColoquial: "Sacarse el carnet de conducir",
  descripcion:
    "Obtener por primera vez el permiso de conducir: hay que residir en España, pasar un reconocimiento médico y aprobar el examen teórico y el práctico. Fuente: hay que «Residir en España», «Reunir las aptitudes psicofísicas requeridas» y «Ser declarado apto por la Jefatura Provincial de Tráfico en las pruebas teóricas y prácticas», y «No estar privado por resolución judicial del derecho a conducir vehículos de motor».",
  organismo: "DGT · Dirección General de Tráfico",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente:
    "https://www.dgt.es/nuestros-servicios/permisos-de-conducir/obtener-un-nuevo-permiso-de-conducir/requisitos-preparacion-y-presentacion-a-examen/",
  alias: [
    "carnet de conducir",
    "sacarse el carnet",
    "permiso de conducir",
    "obtener el carnet",
    "carne de conducir",
  ],
  preguntas: [
    {
      id: "cc-p1",
      orden: 1,
      texto: "¿Para quién es el carnet?",
      tipo: "destinatario",
      opciones: [
        { id: "cc-p1-yo", texto: "Para mí" },
        {
          id: "cc-p1-otro",
          texto: "Para otra persona",
          veredictoInviable: true,
          textoAlternativas:
            "El carnet es personal: hay que aprobar en persona las pruebas. Fuente: «Ser declarado apto por la Jefatura Provincial de Tráfico en las pruebas teóricas y prácticas». No puedes examinarte por otra persona. Sí puedes ayudarle a reunir los papeles y a buscar autoescuela.",
        },
      ],
    },
    {
      id: "cc-p2",
      orden: 2,
      texto: "¿Cómo te vas a presentar?",
      tipo: "normal",
      opciones: [
        { id: "cc-p2-autoescuela", texto: "A través de una autoescuela" },
        { id: "cc-p2-libre", texto: "Por libre" },
      ],
    },
    {
      id: "cc-p3",
      orden: 3,
      texto: "¿Eres estudiante extranjero de fuera de la Unión Europea?",
      tipo: "normal",
      opciones: [
        { id: "cc-p3-no", texto: "No" },
        { id: "cc-p3-si", texto: "Sí" },
      ],
    },
  ],
  requisitos: [
    {
      id: "cc-r1",
      tipo: "tramite_previo",
      titulo: "El informe de aptitud psicofísica (el psicotécnico)",
      explicacion:
        "Se hace en un centro de reconocimiento antes del examen. Fuente: «Obtén un informe de aptitud psicofísica». Para ello, «acude a un Centro de Reconocimiento de Conductores autorizado». Ojo: «Este certificado tiene un período de validez de 90 días».",
      canal: "presencial",
    },
    {
      id: "cc-r2",
      tipo: "doc_fisico",
      titulo: "El talón-foto, con una fotografía de 32×26 mm",
      explicacion:
        "Te lo entrega la autoescuela y lo llevas al examen práctico. Fuente: «Talón-foto con fotografía original actual de 32 x 26 mm. en color y con fondo liso, tomada de frente con la cabeza descubierta y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir o dificultar tu identificación»; «la escuela en la que te matricules para realizar el examen práctico te entregará el talón-foto». Desde noviembre de 2024 «ya no es necesario volver a presentar el talón-foto y/o fotografías en aquellos trámites en los que tengamos dicha documentación ya recopilada», pero sí la primera vez.",
      canal: "ambos",
    },
    {
      id: "cc-r3",
      tipo: "tramite_previo",
      titulo: "Aprobar el examen teórico y el práctico",
      explicacion:
        "Es el núcleo del trámite. Fuente: «es necesario superar un examen específico teórico y otro práctico». El aprobado de una prueba se guarda dos años: «El aprobado de una prueba se guardará durante dos años».",
      canal: "presencial",
    },
    {
      id: "cc-r4",
      tipo: "doc_fisico",
      titulo: "La tasa de la DGT",
      explicacion:
        "Fuente: «Para poder presentarte a los exámenes será necesario abonar una tasa». (El importe exacto no lo fijamos aquí: la sede lo carga de forma dinámica; conviene comprobarlo al pagar.)",
      canal: "ambos",
    },
    {
      id: "cc-r5",
      tipo: "doc_fisico",
      titulo: "Acreditar 6 meses de estancia como estudiante",
      explicacion:
        "Fuente: «Si eres estudiante extranjero no perteneciente a la Unión Europea, deberás demostrar que estás en esta circunstancia durante un período mínimo continuado de seis meses».",
      canal: "ambos",
      soloSiOpciones: ["cc-p3-si"],
    },
  ],
  prerequisitos: [],
};
