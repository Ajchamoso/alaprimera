"use server";

import type { ChecklistLocal } from "@/lib/checklist-store";
import {
  guardaInstantaneas,
  idUsuarioActual,
  leeChecklistsDe,
} from "@/lib/checklists-servidor";
import { permiteAccion } from "@/lib/limite-acciones";
import { validaChecklist } from "@/lib/validacion-acciones";

export async function sincronizaChecklists(
  entrada: unknown
): Promise<{ checklists: ChecklistLocal[] } | { error: string }> {
  if (!Array.isArray(entrada) || entrada.length > 100) {
    return { error: "No se pudo sincronizar la cuenta." };
  }

  const checklists = entrada.map(validaChecklist);
  if (checklists.some((checklist) => checklist === null)) {
    return { error: "No se pudo sincronizar la cuenta." };
  }
  const validadas = checklists.filter((checklist): checklist is ChecklistLocal => checklist !== null);
  if (new Set(validadas.map((checklist) => checklist.id)).size !== validadas.length) {
    return { error: "No se pudo sincronizar la cuenta." };
  }

  const userId = await idUsuarioActual();
  if (!userId) return { error: "La sesión ya no está disponible." };
  if (!(await permiteAccion(`sincroniza:${userId}`, 30, 60))) {
    return { error: "Hay demasiados intentos. Espera un minuto." };
  }

  try {
    await guardaInstantaneas(validadas, userId);
    return { checklists: await leeChecklistsDe(userId) };
  } catch {
    return { error: "No se pudo sincronizar la cuenta." };
  }
}
