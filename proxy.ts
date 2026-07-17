import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase (antes `middleware.ts`; en Next 16 la convención
 * se llama `proxy` y corre en runtime Node).
 *
 * DOS REGLAS, aprendidas rompiendo producción el 17/07:
 *
 * 1. ESTO NUNCA PUEDE LANZAR. Corre delante de cada petición: si revienta, se
 *    cae la web entera —catálogo incluido— aunque la página fuera estática. Todo
 *    va envuelto en try/catch y, ante cualquier problema, se deja pasar la
 *    petición sin sesión. Peor es no servir nada.
 *
 * 2. SOLO donde hace falta. El catálogo y las fichas son públicos y no necesitan
 *    sesión; la app es offline-first y el estado de auth lo lleva el cliente. No
 *    hay motivo para poner una llamada de red delante de una página estática.
 */
export async function proxy(request: NextRequest) {
  const respuestaLimpia = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return respuestaLimpia; // sin Supabase, la app funciona en modo anónimo local
  }

  try {
    let respuesta = respuestaLimpia;
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(aEscribir) {
            for (const { name, value } of aEscribir) {
              request.cookies.set(name, value);
            }
            respuesta = NextResponse.next({ request });
            for (const { name, value, options } of aEscribir) {
              respuesta.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    await supabase.auth.getUser();
    return respuesta;
  } catch (e) {
    // Supabase caído, credenciales raras, lo que sea: la web sigue en pie.
    console.error("Proxy: no se pudo refrescar la sesión; sigo sin ella.", e);
    return respuestaLimpia;
  }
}

// Solo las rutas que de verdad necesitan sesión de servidor: la cuenta y el
// callback del enlace mágico. El catálogo, las fichas y las checklists
// compartidas se sirven sin tocar Supabase desde aquí.
export const config = {
  matcher: ["/cuenta", "/auth/:path*"],
};
