"use client";

import { useState } from "react";
import { reportaError } from "@/app/actions/feedback";

/** Reportar un error de contenido (FR-018): red de seguridad de la curación. */
export function ReportarError({ tramiteSlug }: { tramiteSlug: string }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"listo" | "enviando" | "enviado" | "error">("listo");

  async function envia() {
    setEstado("enviando");
    const { ok } = await reportaError(tramiteSlug, texto);
    setEstado(ok ? "enviado" : "error");
  }

  if (estado === "enviado") {
    return (
      <p className="text-sm text-tinta-tenue print:hidden">
        Gracias, lo revisaremos contra la fuente oficial. Hasta entonces la ficha no cambia.
      </p>
    );
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="text-sm text-tinta-tenue underline hover:text-tinta-media print:hidden"
      >
        ¿Ves algo mal en esta ficha? Repórtalo
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-linea bg-hoja p-4 print:hidden">
      <label className="block text-sm font-medium">¿Qué está mal?</label>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        placeholder="La tasa ya no es ese importe / falta un documento / el enlace no funciona…"
        className="mt-1 w-full rounded-lg border border-linea px-3 py-2 text-sm outline-none focus:border-sello"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={envia}
          disabled={texto.trim().length < 5 || estado === "enviando"}
          className="rounded-lg bg-tinta px-4 py-2 text-sm font-medium text-white hover:bg-sello disabled:opacity-40"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar reporte"}
        </button>
        <button
          onClick={() => setAbierto(false)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-tinta-tenue hover:bg-papel"
        >
          Cancelar
        </button>
      </div>
      {estado === "error" && (
        <p className="mt-2 text-sm text-pendiente">No se pudo enviar. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}
