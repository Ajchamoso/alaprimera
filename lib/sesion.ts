import { supabaseConfigurado, supabaseNavegador } from "@/lib/supabase/client";

/**
 * "¿Hay sesión?" como store externo, para que los componentes lo lean con
 * useSyncExternalStore sin useState/useEffect y sin renders en cascada.
 */

let sesionActiva = false;
const oyentes = new Set<() => void>();

export function suscribeSesion(oyente: () => void): () => void {
  oyentes.add(oyente);

  // La suscripción real a Supabase se abre una sola vez, con el primer oyente.
  if (oyentes.size === 1 && supabaseConfigurado()) {
    desuscribeSupabase = supabaseNavegador().auth.onAuthStateChange((_e, sesion) => {
      const nueva = Boolean(sesion?.user);
      if (nueva !== sesionActiva) {
        sesionActiva = nueva;
        for (const o of oyentes) o();
      }
    }).data.subscription.unsubscribe;
  }

  return () => {
    oyentes.delete(oyente);
    if (oyentes.size === 0) {
      desuscribeSupabase?.();
      desuscribeSupabase = null;
    }
  };
}

let desuscribeSupabase: (() => void) | null = null;

export const haySesion = () => sesionActiva;
