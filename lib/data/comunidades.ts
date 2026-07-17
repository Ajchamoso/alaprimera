/**
 * Las 17 comunidades autónomas + Ceuta y Melilla.
 *
 * "Tu zona" (una de estas) determina qué trámites autonómicos y locales ve el
 * usuario. Los estatales los ven todos. Ahora mismo solo tenemos fichas de la
 * Comunidad de Madrid; el resto ve los estatales y un aviso honesto — y qué
 * comunidad elige la gente es, además, una señal de demanda.
 */
export interface Comunidad {
  codigo: string;
  nombre: string;
}

export const comunidades: Comunidad[] = [
  { codigo: "madrid", nombre: "Comunidad de Madrid" },
  { codigo: "andalucia", nombre: "Andalucía" },
  { codigo: "aragon", nombre: "Aragón" },
  { codigo: "asturias", nombre: "Principado de Asturias" },
  { codigo: "baleares", nombre: "Illes Balears" },
  { codigo: "canarias", nombre: "Canarias" },
  { codigo: "cantabria", nombre: "Cantabria" },
  { codigo: "castilla-la-mancha", nombre: "Castilla-La Mancha" },
  { codigo: "castilla-leon", nombre: "Castilla y León" },
  { codigo: "cataluna", nombre: "Cataluña" },
  { codigo: "valencia", nombre: "Comunitat Valenciana" },
  { codigo: "extremadura", nombre: "Extremadura" },
  { codigo: "galicia", nombre: "Galicia" },
  { codigo: "murcia", nombre: "Región de Murcia" },
  { codigo: "navarra", nombre: "Comunidad Foral de Navarra" },
  { codigo: "pais-vasco", nombre: "País Vasco" },
  { codigo: "la-rioja", nombre: "La Rioja" },
  { codigo: "ceuta", nombre: "Ceuta" },
  { codigo: "melilla", nombre: "Melilla" },
];

const porCodigo = new Map(comunidades.map((c) => [c.codigo, c]));

export function nombreComunidad(codigo: string | null): string | null {
  return codigo ? (porCodigo.get(codigo)?.nombre ?? null) : null;
}

/** ¿Tenemos ya fichas propias de esta comunidad? Hoy, Madrid y Aragón. */
const CON_FICHAS = new Set(["madrid", "aragon"]);
export function tieneFichas(codigo: string): boolean {
  return CON_FICHAS.has(codigo);
}
