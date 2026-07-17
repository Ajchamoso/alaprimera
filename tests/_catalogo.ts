import type { Tramite } from "@/lib/types";
import { tramites as contenido } from "@/lib/data/tramites";
import { pendientes } from "@/lib/data/pendientes";
import { generadaPorIa, verificadaEn } from "@/lib/data/verificaciones";
import { hechoVitalDeFicha } from "@/lib/data/hechos-vitales";

/**
 * El catálogo tal y como lo ensambla producción (ver `ensambla` en lib/data):
 * las fichas reales con su estado de verificación y su hecho vital, más los
 * pendientes. Los tests trabajan sobre este seed local, sin tocar la BD.
 */
export const fichasReales: Tramite[] = contenido.map((t) => ({
  ...t,
  verificadaEn: verificadaEn(t.slug),
  generadaPorIa: generadaPorIa(t.slug),
  hechoVital: hechoVitalDeFicha[t.slug],
}));

export const catalogo: Tramite[] = [...fichasReales, ...pendientes];
