"use client";

import { useState } from "react";
import { creaShare } from "@/app/actions/share";
import type { ChecklistLocal } from "@/lib/checklist-store";

/** Genera y muestra el enlace de solo lectura (H7, FR-014). */
export function Compartir({ checklist, conSesion }: { checklist: ChecklistLocal; conSesion: boolean }) {
  const [estado, setEstado] = useState<"listo" | "creando" | "creado" | "error">("listo");
  const [url, setUrl] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function comparte() {
    setEstado("creando");
    const res = await creaShare({
      id: checklist.id,
      tramiteSlug: checklist.tramiteSlug,
      nombre: checklist.nombre,
      respuestas: checklist.respuestas,
      marcados: checklist.marcados,
      canal: checklist.canal,
      creadaEn: checklist.creadaEn,
    });
    if ("error" in res) {
      setEstado("error");
      return;
    }
    setUrl(`${window.location.origin}/c/${res.token}`);
    setEstado("creado");
    setCopiado(false);
  }

  async function copia() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  if (estado === "creado") {
    return (
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 print:hidden">
        <p className="text-sm font-medium">Enlace listo para tu familia</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={copia}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {copiado ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Quien lo abra verá la lista y tu progreso, pero no podrá modificarlos.{" "}
          {conSesion
            ? "Se mantiene al día solo."
            : "Muestra el estado de ahora: si cambias algo, vuelve a pulsar Compartir para actualizarlo."}
        </p>
      </div>
    );
  }

  return (
    <div className="print:hidden">
      <button
        onClick={comparte}
        disabled={estado === "creando"}
        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
      >
        {estado === "creando" ? "Creando enlace…" : "🔗 Compartir con mi familia"}
      </button>
      {estado === "error" && (
        <p className="mt-2 text-sm text-red-700">No se pudo crear el enlace. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}
