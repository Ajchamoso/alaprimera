import { sincronizaChecklists } from "@/app/actions/checklists";
import { supabaseNavegador } from "@/lib/supabase/client";
import {
  ChecklistLocal,
  getChecklistsSnapshot,
  reemplazaChecklists,
  registraEspejo,
} from "@/lib/checklist-store";

/**
 * Sincronización con la cuenta (T-015/T-016, FR-012). Diseño sync-through:
 * la UI sigue leyendo el store local (instantáneo, offline-first); con sesión,
 * (1) al iniciar se hace el MERGE — lo local anónimo sube a la cuenta sin
 * perderse nada, lo remoto que no esté aquí baja (multi-dispositivo) — y
 * (2) cada mutación posterior se replica a la BD vía el espejo del store.
 *
 * Conflicto (misma checklist en ambos lados): gana la local — es lo que el
 * usuario tiene delante — y se sube.
 */

function aFila(c: ChecklistLocal, userId: string) {
  return {
    id: c.id,
    user_id: userId,
    tramite_id: c.tramiteSlug,
    nombre: c.nombre,
    respuestas: c.respuestas,
    marcados: c.marcados,
    canal_elegido: c.canal ?? null,
    creada_en: c.creadaEn,
    actualizada_en: new Date().toISOString(),
  };
}

let versionSync = 0;

export async function activaSync(userId: string) {
  const versionActual = ++versionSync;
  const supabase = supabaseNavegador();

  // 1) El servidor reclama de forma atómica lo anónimo y devuelve solo las filas del usuario.
  let remotas: ChecklistLocal[] = [];
  for (let intento = 0; intento < 3; intento += 1) {
    const enviadas = getChecklistsSnapshot();
    const resultado = await sincronizaChecklists(enviadas);
    if (versionActual !== versionSync) return;
    if ("error" in resultado) {
      console.error("Sync: no se pudo fusionar la cuenta; seguimos en local.", resultado.error);
      return;
    }
    remotas = resultado.checklists;
    if (getChecklistsSnapshot() === enviadas) break;
  }

  // 2) Lo remoto que no está aquí baja; ante conflicto sigue ganando lo que el usuario ve local.
  const locales = getChecklistsSnapshot();
  const idsLocales = new Set(locales.map((checklist) => checklist.id));
  const nuevas = remotas.filter((checklist) => !idsLocales.has(checklist.id));
  if (nuevas.length > 0) reemplazaChecklists([...locales, ...nuevas]);

  // 3) Tras la reclamación, la RLS normal protege el espejo continuo.
  registraEspejo({
    alGuardar: (c) => {
      void supabase
        .from("checklists")
        .upsert(aFila(c, userId))
        .then(({ error: e }) => {
          if (e) console.error("Sync: fallo replicando checklist.", e.message);
        });
    },
    alBorrar: (id) => {
      void supabase
        .from("checklists")
        .delete()
        .eq("id", id)
        .then(({ error: e }) => {
          if (e) console.error("Sync: fallo borrando checklist remota.", e.message);
        });
    },
  });
}

export function desactivaSync() {
  versionSync += 1;
  registraEspejo(null);
}
