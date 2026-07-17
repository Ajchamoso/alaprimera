"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServidor } from "@/lib/supabase/server";

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

export interface EntradaShare {
  id: string;
  tramiteSlug: string;
  nombre: string;
  respuestas: Record<string, string>;
  marcados: Record<string, boolean>;
  canal?: "online" | "presencial";
  creadaEn: string;
}

export async function creaShare(
  entrada: EntradaShare
): Promise<{ token: string } | { error: string }> {
  const admin = supabaseAdmin();

  // Si hay sesión, la checklist se guarda con su dueño; si no, queda sin dueño
  // hasta que alguien la reclame al identificarse.
  let userId: string | null = null;
  try {
    const supabase = await supabaseServidor();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    // sin sesión: checklist anónima
  }

  const { error: errorChecklist } = await admin.from("checklists").upsert({
    id: entrada.id,
    user_id: userId,
    tramite_id: entrada.tramiteSlug,
    nombre: entrada.nombre,
    respuestas: entrada.respuestas,
    marcados: entrada.marcados,
    canal_elegido: entrada.canal ?? null,
    creada_en: entrada.creadaEn,
    actualizada_en: new Date().toISOString(),
  });
  if (errorChecklist) {
    console.error("Share: no se pudo guardar la checklist.", errorChecklist.message);
    return { error: "No se pudo crear el enlace. Inténtalo de nuevo." };
  }

  // Un solo enlace por checklist: si ya existe se reutiliza (y su contenido
  // acaba de refrescarse arriba).
  const { data: existente } = await admin
    .from("shares")
    .select("token")
    .eq("checklist_id", entrada.id)
    .maybeSingle();
  if (existente?.token) return { token: existente.token };

  const token = generaToken();
  const { error: errorShare } = await admin
    .from("shares")
    .insert({ token, checklist_id: entrada.id });
  if (errorShare) {
    console.error("Share: no se pudo crear el enlace.", errorShare.message);
    return { error: "No se pudo crear el enlace. Inténtalo de nuevo." };
  }
  return { token };
}

/** Token url-safe de 128 bits: imposible de adivinar, corto de leer. */
function generaToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString("base64url");
}
