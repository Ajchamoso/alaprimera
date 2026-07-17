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
import { IconoRequisito, NOMBRE_TIPO } from "@/components/IconoRequisito";
import { haySesion, suscribeSesion } from "@/lib/sesion";

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
      <section className="rounded-xl border border-sello bg-hoja p-5 shadow-sm print:hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">
            Tu checklist <span className="text-tinta-tenue">· {checklist.nombre}</span>{" "}
            <button
              onClick={renombra}
              className="align-middle text-sm font-normal text-tinta-tenue underline hover:text-tinta-media"
              title="Cambiar el nombre"
            >
              renombrar
            </button>
          </h2>
          <p className="text-sm font-medium text-sello">
            {conseguidos} de {aplicables.length} listo{conseguidos === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-papel">
          <div
            className="h-full rounded-full bg-sello transition-all"
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
                      ? "border-sello bg-sello-suave"
                      : "border-linea bg-hoja hover:border-linea"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => marcaRequisito(r.id)}
                    className="mt-1 h-5 w-5 accent-sello"
                  />
                  <span
                    className={`mt-0.5 shrink-0 ${
                      r.tipo === "tramite_previo" ? "text-sello" : "text-tinta-tenue"
                    }`}
                  >
                    <IconoRequisito tipo={r.tipo} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`font-medium ${marcado ? "text-tinta-tenue line-through" : ""}`}>
                      {r.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm text-tinta-media">{r.explicacion}</span>
                    {r.tipo === "tramite_previo" && r.tramitePrevioSlug && (
                      <Link
                        href={`/tramite/${r.tramitePrevioSlug}`}
                        className="mt-1 inline-block text-sm font-medium text-sello hover:underline"
                      >
                        Preparar este trámite primero →
                      </Link>
                    )}
                  </span>
                  <span
                    className={`ml-auto shrink-0 self-start rounded-xs border px-1.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-wider ${
                      r.tipo === "tramite_previo"
                        ? "border-sello text-sello"
                        : "border-linea text-tinta-tenue"
                    }`}
                  >
                    {NOMBRE_TIPO[r.tipo]}
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
    <section className="rounded-xl border border-linea bg-hoja p-5 print:hidden">
      <h2 className="text-lg font-semibold">¿Cómo lo vas a hacer?</h2>
      <p className="mt-1 text-sm text-tinta-media">Cada vía pide cosas distintas. Elige la tuya:</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => actualizaChecklist(checklist.id, { canal: "online" })}
          className="rounded-xl border border-linea p-4 text-left transition hover:border-sello hover:bg-sello-suave"
        >
          <p className="font-cond text-lg font-bold uppercase tracking-wide">Online</p>
          <p className="mt-1 text-sm text-tinta-media">Desde casa, en la sede electrónica.</p>
          {exigeOnline.length > 0 && (
            <p className="mt-2 text-xs text-tinta-tenue">
              Exige: {exigeOnline.map((r) => r.titulo).join(" · ")}
            </p>
          )}
        </button>
        <button
          onClick={() => actualizaChecklist(checklist.id, { canal: "presencial" })}
          className="rounded-xl border border-linea p-4 text-left transition hover:border-sello hover:bg-sello-suave"
        >
          <p className="font-cond text-lg font-bold uppercase tracking-wide">En persona</p>
          <p className="mt-1 text-sm text-tinta-media">Con cita previa, en la oficina.</p>
          {exigePresencial.length > 0 && (
            <p className="mt-2 text-xs text-tinta-tenue">
              Exige: {exigePresencial.map((r) => r.titulo).join(" · ")}
            </p>
          )}
        </button>
      </div>
      <p className="mt-3 text-xs text-tinta-tenue">
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
      className="rounded-xl border border-linea bg-hoja p-5 print:border-0 print:p-0 print:shadow-none"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {canal === "online" ? "Antes de empezar (online)" : "Qué llevar el día de la cita"}
        </h2>
        {puedeCambiar && (
          <button
            onClick={() => actualizaChecklist(checklist.id, { canal: undefined })}
            className="text-sm text-tinta-tenue underline hover:text-tinta-media print:hidden"
          >
            cambiar de vía
          </button>
        )}
      </div>

      {/* Cabecera solo visible al imprimir: contexto para quien recibe el papel */}
      <div className="hidden print:block">
        <p className="text-sm text-tinta-tenue">A la Primera · checklist «{checklist.nombre}»</p>
        <p className="font-semibold">{tramite.nombreOficial}</p>
      </div>

      {faltan.length > 0 && (
        <p className="mt-3 rounded-lg bg-pendiente-suave p-3 text-sm text-pendiente">
          ⚠️ Aún te falta{faltan.length === 1 ? "" : "n"} {faltan.length}:{" "}
          {faltan.map((r) => r.titulo).join(" · ")}
        </p>
      )}

      <ul className="mt-3 space-y-1.5">
        {relevantes.map((r) => (
          <li key={r.id} className="flex items-baseline gap-2">
            <span
              aria-hidden
              className={`mt-1 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-xs border-[1.5px] ${
                checklist.marcados[r.id] ? "border-tinta bg-tinta text-hoja" : "border-tinta-tenue"
              }`}
            >
              {checklist.marcados[r.id] && (
                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              )}
            </span>
            <span>
              <span className="font-medium">{r.titulo}</span>
              <span className="block text-sm text-tinta-media">{r.explicacion}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-linea pt-3 text-sm">
        {canal === "online" ? (
          <p>
            → Trámite online:{" "}
            <a
              href={tramite.urlFuente}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sello underline"
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
                className="font-medium text-sello underline"
              >
                {tramite.urlCitaPrevia}
              </a>
            </p>
          )
        )}
        <p className="text-tinta-tenue">
          Fuente oficial: {tramite.urlFuente}
          {tramite.verificadaEn === null && " · ficha sin verificar, confirma antes de ir"}
        </p>
      </div>

      {canal === "presencial" && (
        <button
          onClick={() => window.print()}
          className="mt-4 rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta print:hidden"
        >
          Imprimir esta lista
        </button>
      )}
    </section>
  );
}
