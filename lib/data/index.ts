import type { Tramite } from "@/lib/types";
import { tramites } from "./tramites";

/**
 * Capa de acceso a fichas. Hoy sirve el seed local; en la Fase 2 pasa a leer
 * de Supabase manteniendo estas mismas firmas (el resto de la app no cambia).
 */

export function getTramites(): Tramite[] {
  return tramites;
}

export function getTramiteBySlug(slug: string): Tramite | undefined {
  return tramites.find((t) => t.slug === slug);
}

/** Cadena de prerrequisitos desde un trámite (sin ciclos: lo garantiza la curación). */
export function getCadena(tramite: Tramite): { tramite: Tramite; nota?: string }[] {
  const cadena: { tramite: Tramite; nota?: string }[] = [];
  const vistos = new Set<string>([tramite.slug]);
  let pendientes = [...tramite.prerequisitos];
  while (pendientes.length > 0) {
    const [actual, ...resto] = pendientes;
    pendientes = resto;
    if (vistos.has(actual.slug)) continue;
    vistos.add(actual.slug);
    const previo = getTramiteBySlug(actual.slug);
    if (previo) {
      cadena.push({ tramite: previo, nota: actual.nota });
      pendientes.push(...previo.prerequisitos);
    }
  }
  return cadena;
}

/** Quita acentos y pasa a minúsculas para comparar como escribe la gente. */
export function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Búsqueda coloquial sobre nombre, alias y descripción (FR-002). Determinista. */
export function buscaTramites(consulta: string, catalogo: Tramite[] = tramites): Tramite[] {
  const q = normaliza(consulta.trim());
  if (q.length === 0) return catalogo;
  const palabras = q
    .split(/\s+/)
    .filter((p) => (p.length > 2 && !STOPWORDS.has(p)) || PALABRAS_CORTAS_UTILES.has(p));
  return catalogo.filter((t) => {
    const pajar = normaliza(
      [t.nombreOficial, t.nombreColoquial, t.descripcion, t.organismo, ...t.alias].join(" ")
    );
    return palabras.length > 0
      ? palabras.some((p) => pajar.includes(p))
      : pajar.includes(q);
  });
}

const PALABRAS_CORTAS_UTILES = new Set(["dni", "nie", "ss", "irpf"]);

const STOPWORDS = new Set([
  "del", "los", "las", "una", "uno", "unos", "unas", "que", "como", "para",
  "por", "con", "sin", "mis", "tus", "sus", "este", "esta", "eso", "esos",
  "necesito", "quiero", "hacer", "tengo", "hay", "donde", "cual", "cuales",
]);
