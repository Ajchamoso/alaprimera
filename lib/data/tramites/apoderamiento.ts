import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const apoderamiento: TramiteContenido = {
  slug: "apoderamiento",
  nivel: "estatal",
  nombreOficial: "Registro Electrónico de Apoderamientos (REA) de la AGE",
  nombreColoquial: "Poder actuar en nombre de otra persona",
  descripcion:
    "La vía oficial para que alguien pueda hacer trámites en tu nombre ante la Administración del Estado, o para que tú los hagas por un familiar. No sirve para todo: solo para los trámites que estén marcados como apoderables.",
  organismo: "Administración General del Estado · Punto de Acceso General",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://sede.administracion.gob.es/servicios-electronicos/rea",
  alias: [
    "apoderamiento",
    "apoderar",
    "poder notarial",
    "actuar en nombre de",
    "representar a mi madre",
    "rea",
    "representacion",
  ],
  preguntas: [
    {
      id: "apo-p1",
      orden: 1,
      texto: "¿Qué lado eres tú?",
      tipo: "destinatario",
      opciones: [
        { id: "apo-p1-poderdante", texto: "Quiero autorizar a alguien a actuar por mí" },
        { id: "apo-p1-apoderado", texto: "Quiero que un familiar me autorice a actuar por él o ella" },
      ],
    },
    {
      id: "apo-p2",
      orden: 2,
      texto: "¿Quién va a inscribir el apoderamiento?",
      tipo: "normal",
      opciones: [
        { id: "apo-p2-poderdante", texto: "La persona que da el poder" },
        { id: "apo-p2-apoderado", texto: "La persona que lo recibe" },
      ],
    },
    {
      id: "apo-p3",
      orden: 3,
      texto: "¿Para qué lo necesitas?",
      tipo: "normal",
      opciones: [
        { id: "apo-p3-todo", texto: "Para cualquier trámite (poder general)" },
        { id: "apo-p3-concreto", texto: "Para un trámite concreto" },
      ],
    },
  ],
  requisitos: [
    {
      id: "apo-r1",
      tipo: "tramite_previo",
      titulo: "DNI electrónico o certificado digital en vigor",
      explicacion:
        "La fuente lo marca como imprescindible: «¿Cómo acredito mi identidad? Con DNI electrónico o certificado digital reconocido en vigor (requisito imprescindible)». Ojo: esta fuente NO menciona Cl@ve como alternativa.",
      canal: "ambos",
      tramitePrevioSlug: "certificado-digital-fnmt",
    },
    {
      id: "apo-r2",
      tipo: "tecnico",
      titulo: "Que el trámite esté marcado como apoderable",
      explicacion:
        "El límite grande: no todo se puede apoderar. Fuente: se podrá inscribir «en todos aquellos trámites y actuaciones que con carácter previo hayan sido inscritos en el Sistema de Información Administrativa (SIA) con capacidad para ser iniciados por apoderado». Comprueba tu trámite antes de montar todo esto.",
      canal: "ambos",
    },
    {
      id: "apo-r3",
      tipo: "doc_fisico",
      titulo: "Poder notarial o documento privado firmado por ambos",
      explicacion:
        "Solo si lo inscribe quien recibe el poder. Fuente: «será necesario que aporte un poder notarial o un documento privado firmado electrónicamente por ella y por la persona poderdante». Los documentos privados con firma electrónica «solo se podrán presentar por comparecencia electrónica».",
      canal: "ambos",
      soloSiOpciones: ["apo-p2-apoderado"],
    },
    {
      id: "apo-r4",
      tipo: "tramite_previo",
      titulo: "Bastanteo por los servicios jurídicos",
      explicacion:
        "Un paso intermedio que bloquea. Fuente: el poder «tendrá que ser bastanteado […] El apoderamiento no estará autorizado y no surtirá efecto sin haber pasado por este trámite».",
      canal: "ambos",
      soloSiOpciones: ["apo-p2-apoderado"],
    },
    {
      id: "apo-r5",
      tipo: "tramite_previo",
      titulo: "Que la otra persona acepte después",
      explicacion:
        "Fuente: si lo inscribe quien da el poder, «la persona apoderada deberá comparecer a posteriori para aceptar el apoderamiento. Solo en este momento el apoderamiento pasará a estar autorizado y podrá ser usado».",
      canal: "ambos",
      soloSiOpciones: ["apo-p2-poderdante"],
    },
    {
      id: "apo-r6",
      tipo: "doc_fisico",
      titulo: "Decidir el tipo de poder y su fecha de fin",
      explicacion:
        "Fuente: hay tres tipos. «Tipo a: apoderamiento general para cualquier actuación administrativa ante cualquier Administración Pública. Tipo b: […] para una Administración y sus Organismos Públicos […]. Tipo c: apoderamiento para determinados trámites». Y: «El plazo máximo de vigencia no podrá ser superior a los 5 años».",
      canal: "ambos",
    },
  ],
  prerequisitos: [
    { slug: "certificado-digital-fnmt", nota: "La fuente lo marca como requisito imprescindible." },
  ],
};
