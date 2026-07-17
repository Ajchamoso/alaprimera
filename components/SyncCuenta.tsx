"use client";

import { useEffect } from "react";
import { supabaseConfigurado, supabaseNavegador } from "@/lib/supabase/client";
import { activaSync, desactivaSync } from "@/lib/sync";

/**
 * Activa la sincronización de checklists cuando hay sesión (Fase 2).
 * No renderiza nada: vive en el layout y escucha los cambios de auth
 * (INITIAL_SESSION cubre la carga inicial).
 */
export function SyncCuenta() {
  useEffect(() => {
    if (!supabaseConfigurado()) return;
    const supabase = supabaseNavegador();
    const { data: subscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      if (sesion?.user) void activaSync(sesion.user.id);
      else desactivaSync();
    });
    return () => {
      subscripcion.subscription.unsubscribe();
      desactivaSync();
    };
  }, []);

  return null;
}
