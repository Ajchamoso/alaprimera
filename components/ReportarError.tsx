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
    try {
      const { ok } = await reportaError(tramiteSlug, texto);
      setEstado(ok ? "enviado" : "error");
    } catch {
      setEstado("error");
    }
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
        type="button"
        onClick={() => setAbierto(true)}
        className="text-sm text-tinta-tenue underline hover:text-tinta-media print:hidden"
      >
        ¿Ves algo mal en esta ficha? Repórtalo
      </button>
    );
  }

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        void envia();
      }}
      className="rounded-lg border border-linea bg-hoja p-4 print:hidden"
    >
      <label htmlFor={`reporte-${tramiteSlug}`} className="block text-sm font-medium">
        ¿Qué está mal?
      </label>
      <textarea
        id={`reporte-${tramiteSlug}`}
        aria-describedby={`reporte-ayuda-${tramiteSlug}`}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          if (estado === "error") setEstado("listo");
        }}
        rows={3}
        minLength={5}
        maxLength={2000}
        required
        placeholder="La tasa ya no es ese importe / falta un documento / el enlace no funciona…"
        className="mt-1 w-full rounded-lg border border-linea px-3 py-2 text-sm outline-none focus:border-sello focus:ring-2 focus:ring-sello-suave"
      />
      <p id={`reporte-ayuda-${tramiteSlug}`} className="mt-1 text-xs text-tinta-tenue">
        Describe el cambio con al menos 5 caracteres.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="rounded-lg bg-tinta px-4 py-2 text-sm font-medium text-white hover:bg-sello disabled:opacity-40"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar reporte"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAbierto(false);
            setEstado("listo");
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-tinta-tenue hover:bg-papel"
        >
          Cancelar
        </button>
      </div>
      {estado === "error" && (
        <p className="mt-2 text-sm text-pendiente" role="alert">
          No se pudo enviar. Comprueba tu conexión e inténtalo de nuevo.
        </p>
      )}
    </form>
  );
}
