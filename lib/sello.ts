/**
 * La lógica del sello de verificación, aparte del componente para poder
 * probarla como función pura (FR-020). El componente solo le pasa "ahora".
 */

/** Días que una verificación se considera vigente antes de degradar el sello. */
export const DIAS_VIGENCIA = 90;

/**
 * ¿La verificación de esta ficha ha caducado? Se deriva del momento de la
 * lectura, sin trabajos programados que se desincronicen.
 *
 * - `verificadaEn` null (sin verificar) → nunca "caducada": es otro estado.
 * - `ahora` 0 (SSR, aún sin reloj de navegador) → false: la caducidad solo se
 *   evalúa en cliente, para no parpadear entre servidor y navegador.
 */
export function selloCaducado(verificadaEn: string | null, ahora: number): boolean {
  return (
    ahora > 0 &&
    verificadaEn !== null &&
    ahora - new Date(verificadaEn).getTime() > DIAS_VIGENCIA * 24 * 60 * 60 * 1000
  );
}

/** "2026-07-16" (o ISO completo) → "16 · 07 · 2026", con aire de sello. */
export function formateaFechaEs(iso: string): string {
  const [fecha] = iso.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia} · ${mes} · ${anio}`;
}
