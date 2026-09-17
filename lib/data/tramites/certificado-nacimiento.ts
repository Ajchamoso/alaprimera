import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const certificadoNacimiento: TramiteContenido = {
  slug: "certificado-nacimiento",
  nivel: "estatal",
  nombreOficial: "Certificación de nacimiento (Registro Civil)",
  nombreColoquial: "El certificado de nacimiento",
  descripcion:
    "El documento del Registro Civil que acredita tu nacimiento. Hace falta para el primer DNI y para el pasaporte de un menor sin DNI. Se puede pedir por internet, en persona o por correo.",
  organismo: "Registro Civil · Ministerio de la Presidencia, Justicia y Relaciones con las Cortes",
  territorio: "España",
  canales: ["online", "presencial"],
  urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramite?k=solicitud-certificado-nacimiento-presencial",
  alias: [
    "certificado de nacimiento",
    "partida de nacimiento",
    "certificacion literal",
    "registro civil",
    "certificado nacimiento",
  ],
  preguntas: [
    {
      id: "nac-p1",
      orden: 1,
      texto: "¿De quién es el certificado?",
      tipo: "destinatario",
      opciones: [
        { id: "nac-p1-yo", texto: "Mío" },
        { id: "nac-p1-hijo", texto: "De un hijo o menor a mi cargo" },
        { id: "nac-p1-otro", texto: "De otra persona" },
      ],
    },
    {
      id: "nac-p2",
      orden: 2,
      texto: "¿El nacimiento fue posterior a 1950?",
      tipo: "normal",
      opciones: [
        { id: "nac-p2-si", texto: "Sí" },
        { id: "nac-p2-no", texto: "No, o no lo sé" },
      ],
    },
    {
      id: "nac-p3",
      orden: 3,
      texto: "¿Cómo quieres pedirlo?",
      tipo: "normal",
      opciones: [
        { id: "nac-p3-online", texto: "Por internet" },
        { id: "nac-p3-presencial", texto: "En persona o por correo" },
      ],
    },
  ],
  requisitos: [
    {
      id: "nac-r1",
      tipo: "tecnico",
      titulo: "Cl@ve o certificado digital",
      explicacion:
        "Fuente: «Para acceder a este trámite es necesario disponer de certificado digital o estar registrado en Clave para identificarse de forma única». Sin ellos también se puede pedir online, pero llega por correo postal.",
      canal: "online",
      soloSiOpciones: ["nac-p3-online"],
    },
    {
      id: "nac-r2",
      tipo: "doc_fisico",
      titulo: "Ir al Registro Civil donde consta el nacimiento",
      explicacion:
        "Fuente: se presenta «En el registro civil en el que conste inscrito el nacimiento». Ojo: no vale cualquiera. Y «Para realizar presencialmente este trámite utilice el servicio de cita previa».",
      canal: "presencial",
      soloSiOpciones: ["nac-p3-presencial"],
    },
    {
      id: "nac-r3",
      tipo: "doc_fisico",
      titulo: "Tu DNI y los datos de la persona",
      explicacion:
        "Fuente: «DNI de la persona que solicite el certificado» e «Identificación (nombre, apellidos, fecha y lugar de nacimiento) de la persona sobre la que se solicita el certificado».",
      canal: "presencial",
      soloSiOpciones: ["nac-p3-presencial"],
    },
    {
      id: "nac-r4",
      tipo: "doc_digital",
      titulo: "Autorización de la persona inscrita",
      explicacion:
        "Fuente: «En caso de solicitar el certificado como tercero autorizado por el inscrito o por su representante […] se podrá exigir la aportación de una autorización del inscrito».",
      canal: "ambos",
      soloSiOpciones: ["nac-p1-otro"],
    },
    {
      id: "nac-r5",
      tipo: "doc_fisico",
      titulo: "Pedirlo en persona: antes de 1950 no hay vía online",
      explicacion:
        "Fuente: «No podrán expedirse certificaciones por este procedimiento cuando los asientos se practicasen antes de 1950 o se hubieran realizado en un registro civil delegado (juzgados de paz) o en un registro consular».",
      canal: "ambos",
      soloSiOpciones: ["nac-p2-no"],
    },
  ],
  prerequisitos: [],
};
