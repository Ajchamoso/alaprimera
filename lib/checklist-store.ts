import type { Requisito, Tramite } from "@/lib/types";

/**
 * Progreso anónimo en el navegador (FR-011), modelado como store externo para
 * useSyncExternalStore: snapshots cacheados por string crudo, mutaciones que
 * emiten, y sincronización entre pestañas vía evento 'storage'. Misma forma
 * que la fila de BD para que el merge a cuenta (FR-012, Fase 2) sea directo.
 */

export interface ChecklistLocal {
  id: string;
  tramiteSlug: string;
  nombre: string;
  respuestas: Record<string, string>; // preguntaId → opcionId
  marcados: Record<string, boolean>; // requisitoId → conseguido
  canal?: "online" | "presencial";
  creadaEn: string;
}

export type Borradores = Record<string, Record<string, string>>; // slug → respuestas

const KEY_CHECKLISTS = "alaprimera.checklists.v1";
const KEY_BORRADORES = "alaprimera.borradores.v1";

// ── Mecánica de store externo ────────────────────────────────────────────────

const oyentes = new Set<() => void>();

function emite() {
  for (const oyente of oyentes) oyente();
}

export function suscribe(oyente: () => void): () => void {
  oyentes.add(oyente);
  window.addEventListener("storage", oyente); // cambios desde otras pestañas
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

/** Snapshot cacheado: mismo string crudo → misma referencia (requisito de useSyncExternalStore). */
function creaSnapshot<T>(key: string, porDefecto: T): () => T {
  let rawCache: string | null = null;
  let parsedCache: T = porDefecto;
  let inicializado = false;
  return () => {
    const raw = window.localStorage.getItem(key);
    if (!inicializado || raw !== rawCache) {
      rawCache = raw;
      inicializado = true;
      try {
        parsedCache = raw ? (JSON.parse(raw) as T) : porDefecto;
      } catch {
        parsedCache = porDefecto;
      }
    }
    return parsedCache;
  };
}

const SIN_CHECKLISTS: ChecklistLocal[] = [];
const SIN_BORRADORES: Borradores = {};

export const getChecklistsSnapshot = creaSnapshot<ChecklistLocal[]>(KEY_CHECKLISTS, SIN_CHECKLISTS);
export const getBorradoresSnapshot = creaSnapshot<Borradores>(KEY_BORRADORES, SIN_BORRADORES);

// Snapshots de servidor: estables y vacíos (el estado local solo existe en el navegador).
export const getChecklistsServidor = (): ChecklistLocal[] => SIN_CHECKLISTS;
export const getBorradoresServidor = (): Borradores => SIN_BORRADORES;

function guarda(key: string, valor: unknown) {
  window.localStorage.setItem(key, JSON.stringify(valor));
  emite();
}

// ── Mutaciones (solo desde manejadores de eventos) ───────────────────────────

export function creaChecklist(
  tramiteSlug: string,
  nombre: string,
  respuestas: Record<string, string>
): ChecklistLocal {
  const nueva: ChecklistLocal = {
    id: crypto.randomUUID(),
    tramiteSlug,
    nombre,
    respuestas,
    marcados: {},
    creadaEn: new Date().toISOString(),
  };
  guarda(KEY_CHECKLISTS, [...getChecklistsSnapshot(), nueva]);
  return nueva;
}

export function actualizaChecklist(
  id: string,
  cambios: Partial<Pick<ChecklistLocal, "nombre" | "marcados" | "canal">>
) {
  const todas = getChecklistsSnapshot();
  const idx = todas.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const copia = [...todas];
  copia[idx] = { ...todas[idx], ...cambios };
  guarda(KEY_CHECKLISTS, copia);
}

export function borraChecklist(id: string) {
  guarda(
    KEY_CHECKLISTS,
    getChecklistsSnapshot().filter((c) => c.id !== id)
  );
}

export function guardaBorrador(slug: string, respuestas: Record<string, string>) {
  guarda(KEY_BORRADORES, { ...getBorradoresSnapshot(), [slug]: respuestas });
}

export function borraBorrador(slug: string) {
  const copia = { ...getBorradoresSnapshot() };
  delete copia[slug];
  guarda(KEY_BORRADORES, copia);
}

// ── Personalización (FR-006): qué requisitos aplican a estas respuestas ──────

export function requisitosAplicables(
  tramite: Tramite,
  respuestas: Record<string, string>
): Requisito[] {
  const elegidas = new Set(Object.values(respuestas));
  return tramite.requisitos.filter(
    (r) => !r.soloSiOpciones || r.soloSiOpciones.some((o) => elegidas.has(o))
  );
}
