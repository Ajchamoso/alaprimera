"use client";

import { useSyncExternalStore } from "react";
import { comunidades } from "@/lib/data/comunidades";
import { getZona, getZonaServidor, setZona, suscribeZona } from "@/lib/zona";

/**
 * "¿De qué comunidad eres?" — se elige una vez y se recuerda. Determina qué
 * trámites autonómicos y locales aparecen. Estilo de campo de formulario oficial.
 */
export function SelectorZona() {
  const zona = useSyncExternalStore(suscribeZona, getZona, getZonaServidor);
  const montado = useSyncExternalStore(
    suscribeZona,
    () => true,
    () => false
  );

  // En SSR y hasta montar, no pintamos nada: la zona vive solo en el navegador.
  if (!montado) return <div className="h-9" aria-hidden />;

  return (
    <label className="flex flex-wrap items-center gap-2 text-sm text-tinta-media">
      <span className="font-mono text-xs uppercase tracking-widest text-tinta-tenue">Tu zona</span>
      <select
        value={zona ?? ""}
        onChange={(e) => setZona(e.target.value || null)}
        className="rounded-sm border border-linea bg-hoja px-2.5 py-1.5 font-medium text-tinta outline-none focus:border-sello"
      >
        <option value="">Elige tu comunidad…</option>
        {comunidades.map((c) => (
          <option key={c.codigo} value={c.codigo}>
            {c.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}
