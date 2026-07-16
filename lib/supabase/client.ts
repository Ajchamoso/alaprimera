import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** true si las variables de entorno de Supabase están presentes (la app degrada con elegancia si no). */
export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

let cliente: SupabaseClient | null = null;

/** Cliente de navegador (singleton). Llamar solo desde componentes cliente. */
export function supabaseNavegador(): SupabaseClient {
  if (!cliente) {
    cliente = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return cliente;
}
