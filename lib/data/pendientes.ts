import type { NivelTerritorial, Tramite } from "@/lib/types";
import { nombreComunidad } from "@/lib/data/comunidades";

/**
 * PENDIENTES: el backlog del catálogo, ya visible.
 *
 * Cada uno es un trámite que existe pero al que aún no le hemos hecho la ficha.
 * Aparece agrupado por su hecho vital para que la taxonomía tenga masa que
 * validar — pero NO muestra requisitos: solo "en preparación". Por eso no
 * viola la regla de oro: un pendiente no puede publicar contenido sin verificar,
 * porque no publica contenido.
 *
 * Los nombres salen de conocimiento general, no de fuentes (son backlog, no
 * fichas). Cuando a uno le toca su turno, se cura con /preparar-ficha, se mueve
 * a tramites.ts y deja de ser pendiente. Ver docs/hechos-vitales.md.
 */
interface Pendiente {
  slug: string;
  nombreColoquial: string;
  nombreOficial: string;
  organismo: string;
  nivel: NivelTerritorial;
  comunidad?: string;
  hechoVital: string;
}

const lista: Pendiente[] = [
  // ── Nace un hijo ──
  { slug: "prestacion-nacimiento", nombreColoquial: "La baja por nacimiento (maternidad y paternidad)", nombreOficial: "Prestación por nacimiento y cuidado de menor", organismo: "Seguridad Social (INSS)", nivel: "estatal", hechoVital: "nacimiento" },

  // ── Empieza el cole ──
  { slug: "admision-escolar-madrid", nombreColoquial: "Pedir plaza en el cole", nombreOficial: "Admisión de alumnos en centros sostenidos con fondos públicos", organismo: "Consejería de Educación · Comunidad de Madrid", nivel: "autonomico", comunidad: "madrid", hechoVital: "escuela" },
  { slug: "admision-escolar-aragon", nombreColoquial: "Pedir plaza en el cole", nombreOficial: "Admisión de alumnos en centros sostenidos con fondos públicos", organismo: "Departamento de Educación · Gobierno de Aragón", nivel: "autonomico", comunidad: "aragon", hechoVital: "escuela" },
  { slug: "beca-general", nombreColoquial: "La beca general de estudios", nombreOficial: "Beca general del Ministerio para estudios postobligatorios", organismo: "Ministerio de Educación, Formación Profesional y Deportes", nivel: "estatal", hechoVital: "escuela" },

  // ── Me mudo de casa ──
  { slug: "cambio-domicilio-dgt", nombreColoquial: "Cambiar la dirección del carnet y el coche", nombreOficial: "Cambio de domicilio del permiso de conducir y de circulación", organismo: "DGT", nivel: "estatal", hechoVital: "mudanza" },

  // ── Cuido de un mayor ──
  { slug: "discapacidad-madrid", nombreColoquial: "El grado de discapacidad", nombreOficial: "Reconocimiento del grado de discapacidad", organismo: "Comunidad de Madrid", nivel: "autonomico", comunidad: "madrid", hechoVital: "mayores" },
  { slug: "discapacidad-aragon", nombreColoquial: "El grado de discapacidad", nombreOficial: "Reconocimiento del grado de discapacidad", organismo: "IASS · Gobierno de Aragón", nivel: "autonomico", comunidad: "aragon", hechoVital: "mayores" },
  { slug: "dependencia-madrid", nombreColoquial: "La ley de dependencia", nombreOficial: "Reconocimiento de la situación de dependencia", organismo: "Comunidad de Madrid", nivel: "autonomico", comunidad: "madrid", hechoVital: "mayores" },
  { slug: "dependencia-aragon", nombreColoquial: "La ley de dependencia", nombreOficial: "Reconocimiento de la situación de dependencia", organismo: "IASS · Gobierno de Aragón", nivel: "autonomico", comunidad: "aragon", hechoVital: "mayores" },
  { slug: "tarjeta-sanitaria-europea", nombreColoquial: "La tarjeta sanitaria europea", nombreOficial: "Tarjeta Sanitaria Europea (TSE)", organismo: "Seguridad Social (INSS)", nivel: "estatal", hechoVital: "mayores" },
  { slug: "pension-jubilacion", nombreColoquial: "La pensión de jubilación", nombreOficial: "Pensión de jubilación", organismo: "Seguridad Social (INSS)", nivel: "estatal", hechoVital: "mayores" },

  // ── Empiezo a trabajar ──
  { slug: "numero-seguridad-social", nombreColoquial: "El número de la Seguridad Social", nombreOficial: "Número de la Seguridad Social", organismo: "Seguridad Social (TGSS)", nivel: "estatal", hechoVital: "trabajo" },
  { slug: "vida-laboral", nombreColoquial: "Mi vida laboral", nombreOficial: "Informe de vida laboral", organismo: "Seguridad Social (TGSS)", nivel: "estatal", hechoVital: "trabajo" },
  { slug: "paro", nombreColoquial: "Cobrar el paro", nombreOficial: "Prestación por desempleo", organismo: "SEPE", nivel: "estatal", hechoVital: "trabajo" },
  { slug: "alta-autonomo", nombreColoquial: "Darme de alta como autónomo", nombreOficial: "Alta en el RETA y en el censo de empresarios (Hacienda)", organismo: "Seguridad Social y Agencia Tributaria", nivel: "estatal", hechoVital: "trabajo" },

  // ── La renta y Hacienda ──
  { slug: "renta-irpf", nombreColoquial: "La declaración de la renta", nombreOficial: "Declaración del IRPF", organismo: "Agencia Tributaria", nivel: "estatal", hechoVital: "hacienda" },
  { slug: "certificado-tributario", nombreColoquial: "Certificado de estar al corriente con Hacienda", nombreOficial: "Certificado tributario", organismo: "Agencia Tributaria", nivel: "estatal", hechoVital: "hacienda" },

  // ── Fallece un familiar ──
  { slug: "pension-viudedad", nombreColoquial: "La pensión de viudedad", nombreOficial: "Pensión de viudedad", organismo: "Seguridad Social (INSS)", nivel: "estatal", hechoVital: "fallecimiento" },

  // ── Me caso ──
  { slug: "inscripcion-matrimonio", nombreColoquial: "Casarme por lo civil", nombreOficial: "Expediente e inscripción de matrimonio", organismo: "Registro Civil · Ministerio de Justicia", nivel: "estatal", hechoVital: "matrimonio" },

  // ── Pido una ayuda ──
  { slug: "ingreso-minimo-vital", nombreColoquial: "El Ingreso Mínimo Vital", nombreOficial: "Ingreso Mínimo Vital (IMV)", organismo: "Seguridad Social (INSS)", nivel: "estatal", hechoVital: "ayudas" },
  { slug: "rmi-madrid", nombreColoquial: "La Renta Mínima de Inserción", nombreOficial: "Renta Mínima de Inserción (RMI)", organismo: "Comunidad de Madrid", nivel: "autonomico", comunidad: "madrid", hechoVital: "ayudas" },
  { slug: "iai-aragon", nombreColoquial: "El Ingreso Aragonés de Inserción", nombreOficial: "Ingreso Aragonés de Inserción (IAI)", organismo: "Gobierno de Aragón", nivel: "autonomico", comunidad: "aragon", hechoVital: "ayudas" },
];

/** Expande cada pendiente a un Tramite completo, vacío de contenido y marcado. */
export const pendientes: Tramite[] = lista.map((p) => ({
  slug: p.slug,
  nombreOficial: p.nombreOficial,
  nombreColoquial: p.nombreColoquial,
  descripcion: "",
  organismo: p.organismo,
  nivel: p.nivel,
  comunidad: p.comunidad,
  hechoVital: p.hechoVital,
  pendiente: true,
  territorio:
    p.nivel === "estatal" ? "España" : (nombreComunidad(p.comunidad ?? "") ?? "—"),
  canales: [],
  urlFuente: "",
  verificadaEn: null,
  generadaPorIa: false,
  alias: [p.nombreColoquial, p.nombreOficial],
  preguntas: [],
  requisitos: [],
  prerequisitos: [],
}));
