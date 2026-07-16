import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente de servidor con las cookies de sesión (RLS aplica como el usuario). */
export async function supabaseServidor() {
  const almacenCookies = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(aEscribir) {
          try {
            for (const { name, value, options } of aEscribir) {
              almacenCookies.set(name, value, options);
            }
          } catch {
            // Llamado desde un Server Component: el middleware refresca la sesión.
          }
        },
      },
    }
  );
}
