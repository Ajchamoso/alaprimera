"use server";

import { randomBytes } from "node:crypto";
import { guardaInstantaneas, idUsuarioActual } from "@/lib/checklists-servidor";
import { permiteAccion } from "@/lib/limite-acciones";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  type InstantaneaChecklist,
  validaChecklist,
} from "@/lib/validacion-acciones";

/**
 * Crear un enlace de compartición (FR-014, H7).
 *
 * Necesita service role porque la checklist puede ser anónima (vive en el
 * navegador y no tiene dueño en BD), y la RLS —correctamente— no deja a un
 * anónimo escribir en `checklists`. La acción sube la instantánea conservando
 * su id: si más tarde el usuario inicia sesión, el merge (FR-012) la reconoce
 * como suya y la actualiza en vez de duplicarla.
 *
 * Con sesión, el espejo de sync mantiene el enlace vivo. Sin sesión es una
 * instantánea: volver a compartir la refresca (la UI lo dice explícitamente).
 */

export type EntradaShare = InstantaneaChecklist;

export async function creaShare(
  entrada: unknown
): Promise<{ token: string } | { error: string }> {
  const checklist = validaChecklist(entrada);
  if (!checklist) return { error: "No se pudo crear el enlace. Inténtalo de nuevo." };

  const userId = await idUsuarioActual();
  if (!(await permiteAccion(userId ? `share:${userId}` : "share:anon", 20, 3600))) {
    return { error: "No se pudo crear el enlace. Inténtalo más tarde." };
  }

  try {
    await guardaInstantaneas([checklist], userId);
    const admin = supabaseAdmin();

    // Si ya existe, se reutiliza y la instantánea de arriba lo deja al día.
    const { data: existente, error: errorLectura } = await admin
      .from("shares")
      .select("token")
      .eq("checklist_id", checklist.id)
      .limit(1)
      .maybeSingle();
    if (errorLectura) throw errorLectura;
    if (existente?.token) return { token: existente.token };

    const token = generaToken();
    const { error: errorShare } = await admin
      .from("shares")
      .insert({ token, checklist_id: checklist.id });
    if (errorShare) throw errorShare;
    return { token };
  } catch (error) {
    console.error("Share: no se pudo crear el enlace.", error);
    return { error: "No se pudo crear el enlace. Inténtalo de nuevo." };
  }
}

/** Token url-safe de 128 bits: imposible de adivinar, corto de leer. */
function generaToken(): string {
  return randomBytes(16).toString("base64url");
}
