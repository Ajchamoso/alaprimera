"use server";

import { guardaInstantaneas, idUsuarioActual } from "@/lib/checklists-servidor";
import { permiteAccion } from "@/lib/limite-acciones";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  type FeedbackValidado,
  validaFeedback,
  validaReporte,
} from "@/lib/validacion-acciones";

/**
 * Cierre del bucle: "¿salió a la primera?" (FR-017) y reportar error (FR-018).
 *
 * Service role por el mismo motivo que el compartir: quien responde puede ser
 * anónimo, y su checklist quizá solo exista en su navegador. La checklist se
 * sube junto al feedback para que la señal tenga contexto (qué respuestas, qué
 * requisitos) — que es justo lo que hace útil un "no".
 */

export type EntradaFeedback = FeedbackValidado;

export async function enviaFeedback(entrada: unknown): Promise<{ ok: boolean }> {
  const validada = validaFeedback(entrada);
  if (!validada) return { ok: false };

  const userId = await idUsuarioActual();
  if (!(await permiteAccion(userId ? `feedback:${userId}` : "feedback:anon", 20, 3600))) {
    return { ok: false };
  }

  try {
    await guardaInstantaneas([validada.checklist], userId);
    const { error } = await supabaseAdmin().from("feedback").upsert(
      {
        checklist_id: validada.checklist.id,
        salio_a_la_primera: validada.salioALaPrimera,
        que_fallo: validada.queFallo ?? null,
      },
      { onConflict: "checklist_id" }
    );
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Feedback: no se pudo guardar la respuesta.", error);
    return { ok: false };
  }
}

export async function reportaError(
  tramiteSlug: unknown,
  descripcion: unknown
): Promise<{ ok: boolean }> {
  const reporte = validaReporte(tramiteSlug, descripcion);
  if (!reporte) return { ok: false };

  try {
    if (!(await permiteAccion("reporte", 10, 3600))) return { ok: false };
    const { error } = await supabaseAdmin()
      .from("reportes")
      .insert({ tramite_id: reporte.tramiteSlug, descripcion: reporte.descripcion });
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Reporte: no se pudo registrar.", error);
    return { ok: false };
  }
}
