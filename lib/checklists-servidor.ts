import "server-only";

import type { ChecklistLocal } from "@/lib/checklist-store";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServidor } from "@/lib/supabase/server";
import {
  type InstantaneaChecklist,
  validaChecklist,
} from "@/lib/validacion-acciones";

function aFila(checklist: InstantaneaChecklist) {
  return {
    id: checklist.id,
    tramite_id: checklist.tramiteSlug,
    nombre: checklist.nombre,
    respuestas: checklist.respuestas,
    marcados: checklist.marcados,
    canal_elegido: checklist.canal ?? null,
    creada_en: checklist.creadaEn,
  };
}

export async function idUsuarioActual(): Promise<string | null> {
  try {
    const supabase = await supabaseServidor();
    const { data, error } = await supabase.auth.getUser();
    return error ? null : (data.user?.id ?? null);
  } catch {
    return null;
  }
}

export async function guardaInstantaneas(
  checklists: InstantaneaChecklist[],
  userId: string | null
): Promise<void> {
  if (checklists.length === 0) return;
  const { error } = await supabaseAdmin().rpc("guarda_checklists", {
    p_user_id: userId,
    p_checklists: checklists.map(aFila),
  });
  if (error) {
    console.error("Checklists: la escritura protegida ha fallado.", error.message);
    throw new Error("No se pudieron guardar las checklists");
  }
}

export async function leeChecklistsDe(userId: string): Promise<ChecklistLocal[]> {
  const { data, error } = await supabaseAdmin()
    .from("checklists")
    .select(
      "id, tramite_id, nombre, respuestas, marcados, canal_elegido, creada_en"
    )
    .eq("user_id", userId)
    .order("creada_en");
  if (error) {
    console.error("Checklists: no se pudo leer la cuenta.", error.message);
    throw new Error("No se pudieron leer las checklists");
  }

  return (data ?? [])
    .map((fila) =>
      validaChecklist({
        id: fila.id,
        tramiteSlug: fila.tramite_id,
        nombre: fila.nombre,
        respuestas: fila.respuestas,
        marcados: fila.marcados,
        canal: fila.canal_elegido ?? undefined,
        creadaEn: fila.creada_en,
      })
    )
    .filter((checklist): checklist is ChecklistLocal => checklist !== null);
}
