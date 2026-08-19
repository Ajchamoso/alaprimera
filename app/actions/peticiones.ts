"use server";

import { permiteAccion } from "@/lib/limite-acciones";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validaPeticionCatalogo } from "@/lib/validacion-acciones";

export async function registraPeticionCatalogo(
  consulta: unknown,
  comunidad: unknown
): Promise<{ ok: boolean }> {
  const peticion = validaPeticionCatalogo(consulta, comunidad);
  if (!peticion || !(await permiteAccion("peticion-catalogo", 5, 3600))) return { ok: false };

  try {
    const { error } = await supabaseAdmin().from("peticiones_catalogo").insert(peticion);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Petición de catálogo: no se pudo guardar.", error);
    return { ok: false };
  }
}
