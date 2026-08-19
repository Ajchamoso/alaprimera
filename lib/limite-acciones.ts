import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { ipDeCabeceras } from "@/lib/seguridad-http";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Contador compartido entre instancias: si la protección falla, la escritura se cierra. */
export async function permiteAccion(
  accion: string,
  limite: number,
  ventanaSegundos: number
): Promise<boolean> {
  try {
    const ip = ipDeCabeceras(await headers());
    const claveHash = createHash("sha256").update(`${accion}|${ip}`).digest("hex");
    const { data, error } = await supabaseAdmin().rpc("consume_limite_accion", {
      p_clave_hash: claveHash,
      p_limite: limite,
      p_ventana_segundos: ventanaSegundos,
    });
    if (error) {
      console.error("Límite de acciones: no se pudo actualizar el contador.", error.message);
      return false;
    }
    return data === true;
  } catch (error) {
    console.error("Límite de acciones: protección no disponible.", error);
    return false;
  }
}
