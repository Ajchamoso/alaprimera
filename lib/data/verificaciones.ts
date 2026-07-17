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
 * Una ficha que no está aquí sale como "generada por IA — sin verificar", que es
 * la verdad hasta que alguien abra la fuente y la coteje.
 */
export const verificaciones: Record<string, string> = {
  // "renovacion-dni": "2026-07-17",
};

/** La fecha en que una persona selló esta ficha, o null si nadie lo ha hecho aún. */
export function verificadaEn(slug: string): string | null {
  return verificaciones[slug] ?? null;
}

/**
 * Una ficha sin verificar la escribió la IA; una verificada la avala una persona.
 * Por eso el sello de "generada por IA" desaparece justo cuando aparece la firma
 * humana: son las dos caras del mismo hecho.
 */
export function generadaPorIa(slug: string): boolean {
  return !(slug in verificaciones);
}
