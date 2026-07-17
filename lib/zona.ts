import type { Tramite } from "@/lib/types";

/**
 * "Tu zona": la comunidad autónoma del usuario, preguntada una vez y recordada
 * en el navegador. Filtra el catálogo — los estatales los ve todo el mundo; los
 * autonómicos y locales, solo quien es de esa comunidad.
 *
 * Store externo (useSyncExternalStore) como el resto del estado local: sin
 * useState/useEffect, y se sincroniza entre pestañas por el evento `storage`.
 */

const KEY = "alaprimera.zona.v1";
const oyentes = new Set<() => void>();

export function suscribeZona(oyente: () => void): () => void {
  oyentes.add(oyente);
  if (typeof window !== "undefined") window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    if (typeof window !== "undefined") window.removeEventListener("storage", oyente);
  };
}

/** Código de comunidad, o null si el usuario aún no la ha elegido. */
export function getZona(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function getZonaServidor(): null {
  return null;
}

export function setZona(codigo: string | null) {
  if (typeof window === "undefined") return;
  if (codigo) window.localStorage.setItem(KEY, codigo);
  else window.localStorage.removeItem(KEY);
  for (const o of oyentes) o();
}

/**
 * ¿Se muestra este trámite a alguien de la zona `zona`?
 * - Estatal: siempre.
 * - Autonómico / local: solo si es de su comunidad.
 * - Sin zona elegida (null): se muestra todo, y la UI invita a elegir.
 */
export function visibleEnZona(t: Tramite, zona: string | null): boolean {
  if (t.nivel === "estatal") return true;
  if (zona === null) return true;
  return t.comunidad === zona;
}
