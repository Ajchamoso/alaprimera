const HOSTS_LOCALES = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Un seed remoto exige una decisión explícita: nunca se deduce por el nombre del entorno. */
export function esConexionLocal(databaseUrl: string): boolean {
  try {
    return HOSTS_LOCALES.has(new URL(databaseUrl).hostname);
  } catch {
    return false;
  }
}

export function exigePermisoParaSeed(databaseUrl: string, permisoRemoto?: string): void {
  if (esConexionLocal(databaseUrl) || permisoRemoto === "si") return;

  throw new Error(
    "Seed remoto bloqueado. Revisa el destino y añade PERMITIR_SEED_REMOTO=si solo para esa ejecución."
  );
}
