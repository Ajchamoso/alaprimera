const ORIGEN_INTERNO = "https://destino.interno";

/** Solo acepta rutas absolutas del propio sitio; nunca hosts o protocolos aportados por la URL. */
export function destinoSeguro(valor: string | null | undefined, defecto = "/cuenta"): string {
  if (
    !valor ||
    !valor.startsWith("/") ||
    valor.startsWith("//") ||
    valor.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(valor)
  ) {
    return defecto;
  }

  try {
    const destino = new URL(valor, ORIGEN_INTERNO);
    if (destino.origin !== ORIGEN_INTERNO) return defecto;
    return `${destino.pathname}${destino.search}${destino.hash}`;
  } catch {
    return defecto;
  }
}
