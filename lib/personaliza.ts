import type { Requisito, Tramite } from "@/lib/types";

/**
 * Personalización (FR-006): qué requisitos aplican a unas respuestas dadas.
 * Lógica pura y determinista, sin IA y sin dependencias de entorno: la usan
 * por igual el navegador (checklist propia) y el servidor (vista compartida).
 */
export function requisitosAplicablesDe(
  tramite: Tramite,
  respuestas: Record<string, string>
): Requisito[] {
  const elegidas = new Set(Object.values(respuestas ?? {}));
  return tramite.requisitos.filter(
    (r) => !r.soloSiOpciones || r.soloSiOpciones.some((o) => elegidas.has(o))
  );
}
