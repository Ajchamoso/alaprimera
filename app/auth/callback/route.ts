import { NextResponse } from "next/server";
import { destinoSeguro } from "@/lib/redireccion-segura";
import { supabaseServidor } from "@/lib/supabase/server";

/** Destino del enlace mágico: canjea el código por la sesión y vuelve a la app (FR-011). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const codigo = url.searchParams.get("code");
  const destino = destinoSeguro(url.searchParams.get("next"));

  if (codigo) {
    try {
      const supabase = await supabaseServidor();
      const { error } = await supabase.auth.exchangeCodeForSession(codigo);
      if (!error) return NextResponse.redirect(new URL(destino, url.origin));
    } catch (error) {
      console.error("Callback de acceso: no se pudo canjear el código.", error);
    }
  }

  return NextResponse.redirect(new URL("/cuenta?error=enlace", url.origin));
}
