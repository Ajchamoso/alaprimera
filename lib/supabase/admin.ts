import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service role: SOLO en servidor y solo para lo que la RLS no puede
 * resolver — hoy, servir una checklist compartida por token a alguien sin sesión
 * (FR-014). Nunca se importa desde componentes cliente.
 */
export function supabaseAdmin() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, clave, {
    auth: { persistSession: false },
  });
}

export function adminConfigurado(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
}
