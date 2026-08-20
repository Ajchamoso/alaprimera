"use client";

import { useState, useSyncExternalStore } from "react";
import { enviaFeedback } from "@/app/actions/feedback";
import type { ChecklistLocal } from "@/lib/checklist-store";
import {
  feedbackRespondido,
  marcaFeedbackRespondido,
  suscribeFeedback,
} from "@/lib/feedback-store";

/**
 * "¿Salió a la primera?" (H8, FR-017): la métrica de la hipótesis (SC-003) y la
 * fábrica de testimonios. Solo se pregunta una vez por checklist.
 */
export function SalioALaPrimera({ checklist }: { checklist: ChecklistLocal }) {
  const respondido = useSyncExternalStore(
    suscribeFeedback,
    () => feedbackRespondido(checklist.id),
    () => false
  );
  const [fase, setFase] = useState<"preguntar" | "porque-no" | "enviando" | "gracias">(
    "preguntar"
  );
  const [queFallo, setQueFallo] = useState("");
  const [error, setError] = useState(false);

  const entrada = {
    id: checklist.id,
    tramiteSlug: checklist.tramiteSlug,
    nombre: checklist.nombre,
    respuestas: checklist.respuestas,
    marcados: checklist.marcados,
    canal: checklist.canal,
    creadaEn: checklist.creadaEn,
  };

  async function envia(salio: boolean, motivo?: string) {
    const faseAnterior = salio ? "preguntar" : "porque-no";
    setError(false);
    setFase("enviando");
    const resultado = await enviaFeedback({
      checklist: entrada,
      salioALaPrimera: salio,
      queFallo: motivo,
    });
    if (resultado.ok) {
      setFase("gracias");
      marcaFeedbackRespondido(checklist.id);
    } else {
      setFase(faseAnterior);
      setError(true);
    }
  }

  if (respondido && fase === "preguntar") return null;

  if (fase === "gracias") {
    return (
      <section className="rounded-xl border border-linea bg-papel p-5 print:hidden">
        <p className="text-sm text-tinta-media">
          ¡Gracias! Nos ayuda a saber si de verdad estamos ahorrando viajes en balde.
        </p>
      </section>
    );
  }

  if (fase === "enviando") {
    return (
      <section
        className="rounded-xl border border-linea bg-papel p-5 print:hidden"
        aria-live="polite"
      >
        <p className="text-sm text-tinta-media">Guardando tu respuesta…</p>
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
        <label htmlFor={`motivo-feedback-${checklist.id}`} className="sr-only">
          Qué te frenó durante el trámite
        </label>
        <textarea
          id={`motivo-feedback-${checklist.id}`}
          value={queFallo}
          onChange={(e) => setQueFallo(e.target.value)}
          rows={3}
          placeholder="Me pidieron un justificante que no estaba en la lista…"
          className="mt-3 w-full rounded-lg border border-pendiente bg-hoja px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pendiente"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => envia(false, queFallo)}
            className="rounded-lg bg-pendiente px-4 py-2 text-sm font-medium text-white hover:bg-tinta"
          >
            Enviar
          </button>
          <button
            onClick={() => envia(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-pendiente hover:bg-pendiente-suave"
          >
            Ahora no
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-pendiente">
            No se pudo guardar la respuesta. Inténtalo de nuevo.
          </p>
        )}
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
          onClick={() => envia(true)}
          className="rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta"
        >
          Sí, a la primera
        </button>
        <button
          onClick={() => {
            setError(false);
            setFase("porque-no");
          }}
          className="rounded-lg border border-linea px-4 py-2 font-medium text-tinta-media hover:bg-papel"
        >
          No, me frenó algo
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-pendiente">
          No se pudo guardar la respuesta. Inténtalo de nuevo.
        </p>
      )}
    </section>
  );
}
