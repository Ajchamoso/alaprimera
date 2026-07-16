import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase/server";

/** Destino del enlace mágico: canjea el código por la sesión y vuelve a la app (FR-011). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const codigo = url.searchParams.get("code");
  const destino = url.searchParams.get("next") ?? "/cuenta";

  if (codigo) {
    const supabase = await supabaseServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (!error) return NextResponse.redirect(new URL(destino, url.origin));
  }

  return NextResponse.redirect(new URL("/cuenta?error=enlace", url.origin));
}
