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

/**
 * ¿A qué ficha lleva de verdad un trámite previo, para quien lee desde `zona`?
 *
 * Nació de un fallo real (auditoría 17/09): `dni-primera-vez` es estatal y
 * apuntaba en duro a `empadronamiento-madrid`, así que a alguien de Zaragoza le
 * decía "Empadronarse en Madrid" teniendo su ficha en el catálogo. La cita de la
 * fuente era correcta y neutral ("del Ayuntamiento donde la persona solicitante
 * tenga su domicilio"); era el enlace el que inventaba el territorio.
 *
 * Reglas, en orden:
 * - Estatal: vale para todo el mundo, se enlaza tal cual.
 * - De la comunidad de quien lee: se enlaza tal cual.
 * - De otra comunidad: se busca la hermana de su misma `familia` que sí sea de
 *   la zona. Si no existe, `null`: no se enlaza nada y la UI lo dice.
 * - Sin zona elegida (`null`): tampoco se enlaza una ficha territorial, porque
 *   no sabemos de dónde es. Se invita a elegir zona.
 */
export function resuelvePrevioEnZona(
  slug: string,
  zona: string | null,
  catalogo: Tramite[]
): Tramite | null {
  const destino = catalogo.find((t) => t.slug === slug);
  if (!destino) return null;
  if (destino.nivel === "estatal") return destino;
  if (zona !== null && destino.comunidad === zona) return destino;
  if (destino.familia === undefined) return null;
  return (
    catalogo.find(
      (t) => t.familia === destino.familia && t.comunidad === zona && !t.pendiente
    ) ?? null
  );
}
