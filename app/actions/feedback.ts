"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Cierre del bucle: "¿salió a la primera?" (FR-017) y reportar error (FR-018).
 *
 * Service role por el mismo motivo que el compartir: quien responde puede ser
 * anónimo, y su checklist quizá solo exista en su navegador. La checklist se
 * sube junto al feedback para que la señal tenga contexto (qué respuestas, qué
 * requisitos) — que es justo lo que hace útil un "no".
 */

export interface EntradaFeedback {
  checklist: {
    id: string;
    tramiteSlug: string;
    nombre: string;
    respuestas: Record<string, string>;
    marcados: Record<string, boolean>;
    canal?: "online" | "presencial";
    creadaEn: string;
  };
  salioALaPrimera: boolean;
  queFallo?: string;
}

export async function enviaFeedback(entrada: EntradaFeedback): Promise<{ ok: boolean }> {
  const admin = supabaseAdmin();
  const { checklist } = entrada;

  const { error: errorChecklist } = await admin.from("checklists").upsert(
    {
      id: checklist.id,
      tramite_id: checklist.tramiteSlug,
      nombre: checklist.nombre,
      respuestas: checklist.respuestas,
      marcados: checklist.marcados,
      canal_elegido: checklist.canal ?? null,
      creada_en: checklist.creadaEn,
      actualizada_en: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: false }
  );
  if (errorChecklist) {
    console.error("Feedback: no se pudo guardar la checklist.", errorChecklist.message);
    return { ok: false };
  }

  const { error } = await admin.from("feedback").upsert(
    {
      checklist_id: checklist.id,
      salio_a_la_primera: entrada.salioALaPrimera,
      que_fallo: entrada.queFallo?.trim() || null,
    },
    { onConflict: "checklist_id" }
  );
  if (error) {
    console.error("Feedback: no se pudo guardar la respuesta.", error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function reportaError(
  tramiteSlug: string,
  descripcion: string
): Promise<{ ok: boolean }> {
  const texto = descripcion.trim();
  if (texto.length < 5) return { ok: false };

  const { error } = await supabaseAdmin()
    .from("reportes")
    .insert({ tramite_id: tramiteSlug, descripcion: texto.slice(0, 2000) });
  if (error) {
    console.error("Reporte: no se pudo registrar.", error.message);
    return { ok: false };
  }
  return { ok: true };
}
