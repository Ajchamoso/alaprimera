import { tramites } from "@/lib/data/tramites";

export interface InstantaneaChecklist {
  id: string;
  tramiteSlug: string;
  nombre: string;
  respuestas: Record<string, string>;
  marcados: Record<string, boolean>;
  canal?: "online" | "presencial";
  creadaEn: string;
}

export interface FeedbackValidado {
  checklist: InstantaneaChecklist;
  salioALaPrimera: boolean;
  queFallo?: string;
}

const FICHAS = new Map(tramites.map((tramite) => [tramite.slug, tramite]));
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FECHA_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function cabeEnJson(valor: unknown, maximo: number): boolean {
  try {
    return JSON.stringify(valor).length <= maximo;
  } catch {
    return false;
  }
}

/** Valida y copia solo los campos del dominio que una acción puede persistir. */
export function validaChecklist(valor: unknown): InstantaneaChecklist | null {
  if (!esRegistro(valor) || !cabeEnJson(valor, 50_000)) return null;
  if (typeof valor.id !== "string" || !UUID_V4.test(valor.id)) return null;
  if (typeof valor.tramiteSlug !== "string") return null;

  const tramite = FICHAS.get(valor.tramiteSlug);
  if (!tramite) return null;

  if (typeof valor.nombre !== "string") return null;
  const nombre = valor.nombre.trim();
  if (nombre.length < 1 || nombre.length > 120) return null;

  if (!esRegistro(valor.respuestas) || Object.keys(valor.respuestas).length > 4) return null;
  const respuestas: Record<string, string> = {};
  for (const [preguntaId, opcionId] of Object.entries(valor.respuestas)) {
    if (typeof opcionId !== "string") return null;
    const pregunta = tramite.preguntas.find((candidata) => candidata.id === preguntaId);
    if (!pregunta?.opciones.some((opcion) => opcion.id === opcionId)) return null;
    respuestas[preguntaId] = opcionId;
  }

  if (
    !esRegistro(valor.marcados) ||
    Object.keys(valor.marcados).length > tramite.requisitos.length
  ) {
    return null;
  }
  const idsRequisito = new Set(tramite.requisitos.map((requisito) => requisito.id));
  const marcados: Record<string, boolean> = {};
  for (const [requisitoId, marcado] of Object.entries(valor.marcados)) {
    if (!idsRequisito.has(requisitoId) || typeof marcado !== "boolean") return null;
    marcados[requisitoId] = marcado;
  }

  let canal: "online" | "presencial" | undefined;
  if (valor.canal !== undefined) {
    if (
      (valor.canal !== "online" && valor.canal !== "presencial") ||
      !tramite.canales.includes(valor.canal)
    ) {
      return null;
    }
    canal = valor.canal;
  }

  if (
    typeof valor.creadaEn !== "string" ||
    !FECHA_ISO.test(valor.creadaEn) ||
    Number.isNaN(Date.parse(valor.creadaEn))
  ) {
    return null;
  }

  return {
    id: valor.id,
    tramiteSlug: valor.tramiteSlug,
    nombre,
    respuestas,
    marcados,
    canal,
    creadaEn: valor.creadaEn,
  };
}

export function validaFeedback(valor: unknown): FeedbackValidado | null {
  if (!esRegistro(valor) || typeof valor.salioALaPrimera !== "boolean") return null;
  const checklist = validaChecklist(valor.checklist);
  if (!checklist) return null;

  let queFallo: string | undefined;
  if (valor.queFallo !== undefined) {
    if (typeof valor.queFallo !== "string") return null;
    const texto = valor.queFallo.trim();
    if (texto.length > 2000) return null;
    queFallo = texto || undefined;
  }

  return { checklist, salioALaPrimera: valor.salioALaPrimera, queFallo };
}

export function validaReporte(
  tramiteSlug: unknown,
  descripcion: unknown
): { tramiteSlug: string; descripcion: string } | null {
  if (typeof tramiteSlug !== "string" || !FICHAS.has(tramiteSlug)) return null;
  if (typeof descripcion !== "string") return null;
  const texto = descripcion.trim();
  if (texto.length < 5 || texto.length > 2000) return null;
  return { tramiteSlug, descripcion: texto };
}
