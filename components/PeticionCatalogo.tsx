"use client";

import { useState } from "react";
import { registraPeticionCatalogo } from "@/app/actions/peticiones";

export function PeticionCatalogo({
  consulta,
  comunidad,
}: {
  consulta: string;
  comunidad: string | null;
}) {
  const [estado, setEstado] = useState<"lista" | "enviando" | "enviada" | "error">("lista");

  async function registra() {
    setEstado("enviando");
    const { ok } = await registraPeticionCatalogo(consulta, comunidad);
    setEstado(ok ? "enviada" : "error");
  }

  if (estado === "enviada") {
    return (
      <p className="mt-3 text-sm font-medium text-tinta" role="status">
        Petición guardada. Nos ayuda a decidir qué ficha preparar después.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={registra}
        disabled={estado === "enviando"}
        className="rounded-lg border border-pendiente px-3 py-2 text-sm font-medium text-pendiente hover:bg-hoja disabled:opacity-50"
      >
        {estado === "enviando" ? "Guardando…" : "Dejar constancia de esta petición"}
      </button>
      {estado === "error" && (
        <p className="mt-2 text-sm text-pendiente" role="alert">
          No se pudo guardar. Inténtalo más tarde.
        </p>
      )}
    </div>
  );
}
