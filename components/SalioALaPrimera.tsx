"use client";

import { useState } from "react";
import { enviaFeedback } from "@/app/actions/feedback";
import type { ChecklistLocal } from "@/lib/checklist-store";

const KEY_RESPONDIDAS = "alaprimera.feedback.v1";

function yaRespondio(checklistId: string): boolean {
  try {
    const crudo = window.localStorage.getItem(KEY_RESPONDIDAS);
    return crudo ? (JSON.parse(crudo) as string[]).includes(checklistId) : false;
  } catch {
    return false;
  }
}

function marcaRespondida(checklistId: string) {
  try {
    const crudo = window.localStorage.getItem(KEY_RESPONDIDAS);
    const previas = crudo ? (JSON.parse(crudo) as string[]) : [];
    window.localStorage.setItem(KEY_RESPONDIDAS, JSON.stringify([...previas, checklistId]));
  } catch {
    // sin localStorage: como mucho se vuelve a preguntar
  }
}

/**
 * "¿Salió a la primera?" (H8, FR-017): la métrica de la hipótesis (SC-003) y la
 * fábrica de testimonios. Solo se pregunta una vez por checklist.
 */
export function SalioALaPrimera({ checklist }: { checklist: ChecklistLocal }) {
  const [fase, setFase] = useState<"preguntar" | "porque-no" | "gracias" | "oculto">(() =>
    typeof window !== "undefined" && yaRespondio(checklist.id) ? "oculto" : "preguntar"
  );
  const [queFallo, setQueFallo] = useState("");

  const entrada = {
    id: checklist.id,
    tramiteSlug: checklist.tramiteSlug,
    nombre: checklist.nombre,
    respuestas: checklist.respuestas,
    marcados: checklist.marcados,
    canal: checklist.canal,
    creadaEn: checklist.creadaEn,
  };

  async function responde(salio: boolean) {
    marcaRespondida(checklist.id);
    if (salio) {
      setFase("gracias");
      void enviaFeedback({ checklist: entrada, salioALaPrimera: true });
    } else {
      setFase("porque-no");
      void enviaFeedback({ checklist: entrada, salioALaPrimera: false });
    }
  }

  async function enviaMotivo() {
    setFase("gracias");
    void enviaFeedback({ checklist: entrada, salioALaPrimera: false, queFallo });
  }

  if (fase === "oculto") return null;

  if (fase === "gracias") {
    return (
      <section className="rounded-xl border border-linea bg-papel p-5 print:hidden">
        <p className="text-sm text-tinta-media">
          ¡Gracias! Nos ayuda a saber si de verdad estamos ahorrando viajes en balde.
        </p>
      </section>
    );
  }

  if (fase === "porque-no") {
    return (
      <section className="rounded-xl border border-pendiente bg-pendiente-suave p-5 print:hidden">
        <h2 className="font-semibold text-tinta">Vaya. ¿Qué te frenó?</h2>
        <p className="mt-1 text-sm text-pendiente/80">
          Si nos faltaba algo en la lista, lo añadimos. Es la mejor pista que podemos recibir.
        </p>
        <textarea
          value={queFallo}
          onChange={(e) => setQueFallo(e.target.value)}
          rows={3}
          placeholder="Me pidieron un justificante que no estaba en la lista…"
          className="mt-3 w-full rounded-lg border border-pendiente bg-hoja px-3 py-2 text-sm outline-none focus:border-pendiente"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={enviaMotivo}
            className="rounded-lg bg-pendiente px-4 py-2 text-sm font-medium text-white hover:bg-tinta"
          >
            Enviar
          </button>
          <button
            onClick={() => setFase("gracias")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-pendiente hover:bg-pendiente-suave"
          >
            Ahora no
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-linea bg-hoja p-5 print:hidden">
      <h2 className="font-semibold">¿Ya hiciste el trámite? ¿Salió a la primera?</h2>
      <p className="mt-1 text-sm text-tinta-media">
        Es lo único que nos dice si esto funciona de verdad. Dos segundos.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => responde(true)}
          className="rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta"
        >
          Sí, a la primera
        </button>
        <button
          onClick={() => responde(false)}
          className="rounded-lg border border-linea px-4 py-2 font-medium text-tinta-media hover:bg-papel"
        >
          No, me frenó algo
        </button>
      </div>
    </section>
  );
}
