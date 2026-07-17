"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Requisito, Tramite } from "@/lib/types";
import {
  ChecklistLocal,
  actualizaChecklist,
  requisitosAplicables,
} from "@/lib/checklist-store";
import { Compartir } from "@/components/Compartir";
import { SalioALaPrimera } from "@/components/SalioALaPrimera";
import { haySesion, suscribeSesion } from "@/lib/sesion";

const ETIQUETA_TIPO: Record<string, string> = {
  tramite_previo: "⛓️",
  doc_fisico: "📄",
  doc_digital: "💻",
  tecnico: "⚙️",
};

/** Vista de checklist: requisitos marcables, elección de canal (H5) y preparación final con imprimible (FR-015/016). */
export function Checklist({ tramite, checklist }: { tramite: Tramite; checklist: ChecklistLocal }) {
  const conSesion = useSyncExternalStore(suscribeSesion, haySesion, () => false);
  const aplicables = requisitosAplicables(tramite, checklist.respuestas);
  const conseguidos = aplicables.filter((r) => checklist.marcados[r.id]).length;

  // Sin elección falsa (H5.6): si el trámite solo admite una vía, es la que hay.
  const canal = tramite.canales.length === 1 ? tramite.canales[0] : checklist.canal;

  function marcaRequisito(requisitoId: string) {
    actualizaChecklist(checklist.id, {
      marcados: { ...checklist.marcados, [requisitoId]: !checklist.marcados[requisitoId] },
    });
  }

  function renombra() {
    const nombre = window.prompt(
      'Nombre de esta checklist (p. ej. "DNI Hugo"):',
      checklist.nombre
    );
    if (nombre?.trim()) actualizaChecklist(checklist.id, { nombre: nombre.trim() });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-300 bg-white p-5 shadow-sm print:hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">
            Tu checklist <span className="text-stone-400">· {checklist.nombre}</span>{" "}
            <button
              onClick={renombra}
              className="align-middle text-sm font-normal text-stone-400 underline hover:text-stone-600"
              title="Cambiar el nombre"
            >
              renombrar
            </button>
          </h2>
          <p className="text-sm font-medium text-emerald-800">
            {conseguidos} de {aplicables.length} listo{conseguidos === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${aplicables.length === 0 ? 0 : Math.round((conseguidos / aplicables.length) * 100)}%`,
            }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {aplicables.map((r) => {
            const marcado = !!checklist.marcados[r.id];
            return (
              <li key={r.id}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                    marcado
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => marcaRequisito(r.id)}
                    className="mt-1 h-5 w-5 accent-emerald-600"
                  />
                  <span>
                    <span className={`font-medium ${marcado ? "text-stone-400 line-through" : ""}`}>
                      {ETIQUETA_TIPO[r.tipo]} {r.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm text-stone-600">{r.explicacion}</span>
                    {r.tipo === "tramite_previo" && r.tramitePrevioSlug && (
                      <Link
                        href={`/tramite/${r.tramitePrevioSlug}`}
                        className="mt-1 inline-block text-sm font-medium text-emerald-700 hover:underline"
                      >
                        Preparar este trámite primero →
                      </Link>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {canal === undefined ? (
        <EligeCanal tramite={tramite} checklist={checklist} aplicables={aplicables} />
      ) : (
        <>
          <Preparacion
            tramite={tramite}
            checklist={checklist}
            aplicables={aplicables}
            canal={canal}
            puedeCambiar={tramite.canales.length > 1}
          />
          <Compartir checklist={checklist} conSesion={conSesion} />
          <SalioALaPrimera checklist={checklist} />
        </>
      )}
    </div>
  );
}

/** H5.1: elegir vía viendo qué exige cada una. */
function EligeCanal({
  tramite,
  checklist,
  aplicables,
}: {
  tramite: Tramite;
  checklist: ChecklistLocal;
  aplicables: Requisito[];
}) {
  const exigeOnline = aplicables.filter((r) => r.canal === "online");
  const exigePresencial = aplicables.filter((r) => r.canal === "presencial");

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 print:hidden">
      <h2 className="text-lg font-semibold">¿Cómo lo vas a hacer?</h2>
      <p className="mt-1 text-sm text-stone-600">Cada vía pide cosas distintas — elige la tuya:</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => actualizaChecklist(checklist.id, { canal: "online" })}
          className="rounded-xl border border-stone-300 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          <p className="font-semibold">🖥️ Online</p>
          <p className="mt-1 text-sm text-stone-600">Desde casa, en la sede electrónica.</p>
          {exigeOnline.length > 0 && (
            <p className="mt-2 text-xs text-stone-500">
              Exige: {exigeOnline.map((r) => r.titulo).join(" · ")}
            </p>
          )}
        </button>
        <button
          onClick={() => actualizaChecklist(checklist.id, { canal: "presencial" })}
          className="rounded-xl border border-stone-300 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          <p className="font-semibold">🏢 En persona</p>
          <p className="mt-1 text-sm text-stone-600">Con cita previa, en la oficina.</p>
          {exigePresencial.length > 0 && (
            <p className="mt-2 text-xs text-stone-500">
              Exige: {exigePresencial.map((r) => r.titulo).join(" · ")}
            </p>
          )}
        </button>
      </div>
      <p className="mt-3 text-xs text-stone-400">
        Consulta en la{" "}
        <a href={tramite.urlFuente} target="_blank" rel="noopener noreferrer" className="underline">
          fuente oficial
        </a>{" "}
        si tu caso admite ambas vías.
      </p>
    </section>
  );
}

/** FR-015/016: preparación específica del canal, con aviso de faltantes (H5.5) e imprimible. */
function Preparacion({
  tramite,
  checklist,
  aplicables,
  canal,
  puedeCambiar,
}: {
  tramite: Tramite;
  checklist: ChecklistLocal;
  aplicables: Requisito[];
  canal: "online" | "presencial";
  puedeCambiar: boolean;
}) {
  const relevantes = aplicables.filter((r) => r.canal === canal || r.canal === "ambos");
  const faltan = aplicables.filter((r) => !checklist.marcados[r.id]);

  return (
    <section
      id="imprimible"
      className="rounded-xl border border-stone-300 bg-white p-5 print:border-0 print:p-0 print:shadow-none"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {canal === "online" ? "🖥️ Antes de empezar (online)" : "🏢 Qué llevar el día de la cita"}
        </h2>
        {puedeCambiar && (
          <button
            onClick={() => actualizaChecklist(checklist.id, { canal: undefined })}
            className="text-sm text-stone-400 underline hover:text-stone-600 print:hidden"
          >
            cambiar de vía
          </button>
        )}
      </div>

      {/* Cabecera solo visible al imprimir: contexto para quien recibe el papel */}
      <div className="hidden print:block">
        <p className="text-sm text-stone-500">A la Primera · checklist «{checklist.nombre}»</p>
        <p className="font-semibold">{tramite.nombreOficial}</p>
      </div>

      {faltan.length > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          ⚠️ Aún te falta{faltan.length === 1 ? "" : "n"} {faltan.length}:{" "}
          {faltan.map((r) => r.titulo).join(" · ")}
        </p>
      )}

      <ul className="mt-3 space-y-1.5">
        {relevantes.map((r) => (
          <li key={r.id} className="flex items-baseline gap-2">
            <span aria-hidden>{checklist.marcados[r.id] ? "☑" : "☐"}</span>
            <span>
              <span className="font-medium">{r.titulo}</span>
              <span className="block text-sm text-stone-600">{r.explicacion}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-sm">
        {canal === "online" ? (
          <p>
            → Trámite online:{" "}
            <a
              href={tramite.urlFuente}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 underline"
            >
              {tramite.urlFuente}
            </a>
          </p>
        ) : (
          tramite.urlCitaPrevia && (
            <p>
              → Cita previa oficial:{" "}
              <a
                href={tramite.urlCitaPrevia}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-700 underline"
              >
                {tramite.urlCitaPrevia}
              </a>
            </p>
          )
        )}
        <p className="text-stone-500">
          Fuente oficial: {tramite.urlFuente}
          {tramite.verificadaEn === null && " · ficha sin verificar, confirma antes de ir"}
        </p>
      </div>

      {canal === "presencial" && (
        <button
          onClick={() => window.print()}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 print:hidden"
        >
          🖨️ Imprimir esta lista
        </button>
      )}
    </section>
  );
}
