/**
 * EL REGISTRO DE VERIFICACIONES
 *
 * Quién ha cotejado qué ficha contra su fuente oficial, y cuándo. Es el único
 * sitio donde vive ese dato.
 *
 * Por qué existe este fichero en vez de un `update` en la base de datos: el seed
 * borra y reinserta las fichas desde `tramites.ts`, así que una verificación
 * hecha a mano en BD se perdía en el siguiente `npm run db:seed`, en silencio.
 * Aquí no: está en git, se versiona con el contenido y el historial de commits
 * es la prueba de quién selló qué y cuándo. Un registro, como debe ser.
 *
 * NO se edita a mano (regla del reto: nada de código escrito por humanos).
 * Se usa:  npm run verificar <slug>
 *
 * Una ficha que no está aquí sale como "por verificar", que es la verdad hasta que
 * el rastreo la coteje contra su fuente (FR-020b).
 */
export const verificaciones: Record<string, string> = {
  "beca-comedor-madrid": "2026-08-10",
  "tarjeta-sanitaria-madrid": "2026-08-11",
  "transferencia-vehiculo": "2026-08-11",
  "carnet-conducir": "2026-08-11",
  "inscripcion-nacimiento": "2026-08-11",
  "certificado-nacimiento": "2026-08-11",
  "certificado-digital-fnmt": "2026-08-11",
  "clave": "2026-08-11",
  "apoderamiento": "2026-08-11",
  "empadronamiento-zaragoza": "2026-08-11",
  "familia-numerosa-aragon": "2026-08-11",
  "empadronamiento-madrid": "2026-08-11",
};

/** La fecha en que una persona selló esta ficha, o null si nadie lo ha hecho aún. */
export function verificadaEn(slug: string): string | null {
  return verificaciones[slug] ?? null;
}

/**
 * Derivado de la ausencia de verificación, no un dato propio: hoy nadie registra por
 * separado cómo se extrajo cada ficha. Ya no se enseña en el sello (03/08) porque decía
 * lo mismo que "por verificar" y encima afirmaba algo sobre la autoría que nadie ha
 * anotado. Sigue vivo porque lo consumen el seed y la columna generada_por_ia.
 */
export function generadaPorIa(slug: string): boolean {
  return !(slug in verificaciones);
}
