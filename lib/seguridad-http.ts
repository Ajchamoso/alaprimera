/** Obtiene una dirección estable de cabeceras de proxy conocidas y acota su tamaño. */
export function ipDeCabeceras(cabeceras: Pick<Headers, "get">): string {
  const cadena =
    cabeceras.get("x-vercel-forwarded-for") ??
    cabeceras.get("x-forwarded-for") ??
    cabeceras.get("x-real-ip") ??
    "";
  const primera = cadena.split(",", 1)[0]?.trim().slice(0, 64) ?? "";
  return primera && /^[0-9a-f:.]+$/i.test(primera) ? primera : "desconocida";
}
