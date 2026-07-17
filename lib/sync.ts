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

/* eslint-disable @typescript-eslint/no-explicit-any */
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

function aLocal(f: any): ChecklistLocal {
  return {
    id: f.id,
    tramiteSlug: f.tramite_id,
    nombre: f.nombre,
    respuestas: f.respuestas ?? {},
    marcados: f.marcados ?? {},
    canal: f.canal_elegido ?? undefined,
    creadaEn: f.creada_en,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

let sincronizando = false;

export async function activaSync(userId: string) {
  if (sincronizando) return;
  sincronizando = true;
  const supabase = supabaseNavegador();

  try {
    const { data: remotas, error } = await supabase.from("checklists").select("*");
    if (error) {
      console.error("Sync: no se pudo leer la cuenta; seguimos en local.", error.message);
      return;
    }

    // 1) MERGE al iniciar sesión: lo anónimo local sube (FR-012), nada se pierde.
    const locales = getChecklistsSnapshot();
    if (locales.length > 0) {
      const { error: errorSubida } = await supabase
        .from("checklists")
        .upsert(locales.map((c) => aFila(c, userId)));
      if (errorSubida) {
        console.error("Sync: fallo subiendo checklists locales.", errorSubida.message);
      }
    }

    // 2) Lo remoto que no está aquí, baja (multi-dispositivo, SC-005).
    const idsLocales = new Set(locales.map((c) => c.id));
    const nuevas = (remotas ?? []).filter((f) => !idsLocales.has(f.id)).map(aLocal);
    if (nuevas.length > 0) reemplazaChecklists([...locales, ...nuevas]);

    // 3) Espejo continuo para las mutaciones que vengan.
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
  } finally {
    sincronizando = false;
  }
}

export function desactivaSync() {
  registraEspejo(null);
}
