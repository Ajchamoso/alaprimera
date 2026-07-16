"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Tramite } from "@/lib/types";
import {
  actualizaChecklist,
  borraBorrador,
  borraChecklist,
  creaChecklist,
  getBorradoresServidor,
  getBorradoresSnapshot,
  getChecklistsServidor,
  getChecklistsSnapshot,
  guardaBorrador,
  requisitosAplicables,
  suscribe,
} from "@/lib/checklist-store";

const ETIQUETA_TIPO: Record<string, { icono: string; nombre: string }> = {
  tramite_previo: { icono: "⛓️", nombre: "Trámite previo" },
  doc_fisico: { icono: "📄", nombre: "Documento" },
  doc_digital: { icono: "💻", nombre: "Documento digital" },
  tecnico: { icono: "⚙️", nombre: "Requisito técnico" },
};

/**
 * Wizard de personalización (FR-004..006), veredicto (FR-005) y checklist con
 * progreso anónimo (FR-010/011). Sin estado propio: todo se deriva del store
 * localStorage — en SSR los snapshots vacíos rinden el estado "cargando".
 */
export function Asistente({ tramite }: { tramite: Tramite }) {
  const checklists = useSyncExternalStore(suscribe, getChecklistsSnapshot, getChecklistsServidor);
  const borradores = useSyncExternalStore(suscribe, getBorradoresSnapshot, getBorradoresServidor);
  const montado = useSyncExternalStore(
    suscribe,
    () => true,
    () => false
  );

  const preguntas = [...tramite.preguntas].sort((a, b) => a.orden - b.orden);
  const checklist = checklists.find((c) => c.tramiteSlug === tramite.slug) ?? null;
  const respuestas = checklist?.respuestas ?? borradores[tramite.slug] ?? {};

  // Veredicto derivado: alguna respuesta elegida hace inviable la vía (FR-005).
  const veredicto = preguntas
    .map((p) => ({ pregunta: p, opcion: p.opciones.find((o) => o.id === respuestas[p.id]) }))
    .find((x) => x.opcion?.veredictoInviable);

  const pendientes = preguntas.filter((p) => !(p.id in respuestas));
  const preguntaActual = pendientes[0];

  function eligeOpcion(preguntaId: string, opcionId: string) {
    const nuevas = { ...respuestas, [preguntaId]: opcionId };
    const opcion = preguntas.find((p) => p.id === preguntaId)?.opciones.find((o) => o.id === opcionId);
    const quedan = preguntas.filter((p) => !(p.id in nuevas));

    if (opcion?.veredictoInviable || quedan.length > 0) {
      guardaBorrador(tramite.slug, nuevas);
      return;
    }
    generaChecklist(nuevas);
  }

  function generaChecklist(finales: Record<string, string>) {
    const destinatario = preguntas.find((p) => p.tipo === "destinatario");
    const nombre =
      (destinatario
        ? destinatario.opciones.find((o) => o.id === finales[destinatario.id])?.texto
        : null) ?? "Mi checklist";
    creaChecklist(tramite.slug, nombre, finales);
    borraBorrador(tramite.slug);
  }

  function cambiaRespuesta(preguntaId: string) {
    const nuevas = { ...respuestas };
    delete nuevas[preguntaId];
    guardaBorrador(tramite.slug, nuevas);
  }

  function marcaRequisito(requisitoId: string) {
    if (!checklist) return;
    actualizaChecklist(checklist.id, {
      marcados: { ...checklist.marcados, [requisitoId]: !checklist.marcados[requisitoId] },
    });
  }

  function empiezaDeNuevo() {
    if (!window.confirm("Se borrarán tus respuestas y tu progreso de este trámite. ¿Seguro?")) return;
    if (checklist) borraChecklist(checklist.id);
    borraBorrador(tramite.slug);
  }

  if (!montado) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm text-emerald-900/70">Cargando tu caso…</p>
      </section>
    );
  }

  // ── Veredicto: la vía elegida no es posible para este caso ────────────────
  if (!checklist && veredicto?.opcion) {
    return (
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="font-semibold text-amber-950">
          Esta vía no está disponible para tu caso — y te lo decimos antes de que pierdas la tarde
        </h2>
        <p className="mt-3 max-w-prose text-amber-950/90">{veredicto.opcion.textoAlternativas}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => cambiaRespuesta(veredicto.pregunta.id)}
            className="rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            ← Cambiar mi respuesta
          </button>
          <a
            href={tramite.urlFuente}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-medium text-amber-900 underline underline-offset-2"
          >
            Ver la fuente oficial
          </a>
        </div>
      </section>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  if (!checklist && preguntaActual) {
    const numActual = preguntas.length - pendientes.length + 1;
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/70">
          Prepara TU caso · pregunta {numActual} de {preguntas.length}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-emerald-950">{preguntaActual.texto}</h2>
        <div className="mt-4 grid gap-2">
          {preguntaActual.opciones.map((o) => (
            <button
              key={o.id}
              onClick={() => eligeOpcion(preguntaActual.id, o.id)}
              className="rounded-lg border border-emerald-300 bg-white px-4 py-3 text-left font-medium text-stone-800 transition hover:border-emerald-600 hover:bg-emerald-100"
            >
              {o.texto}
            </button>
          ))}
        </div>
        {Object.keys(respuestas).length > 0 && (
          <p className="mt-3 text-xs text-emerald-900/60">
            Tus respuestas anteriores están guardadas: si te vas, retomas donde lo dejaste.
          </p>
        )}
      </section>
    );
  }

  // ── Caso raro: todo respondido sin checklist (borrador antiguo) ───────────
  if (!checklist) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-emerald-950">Tenemos todas tus respuestas guardadas.</p>
        <button
          onClick={() => generaChecklist(respuestas)}
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Generar mi checklist
        </button>
      </section>
    );
  }

  // ── Checklist personalizada con progreso ──────────────────────────────────
  const aplicables = requisitosAplicables(tramite, checklist.respuestas);
  const conseguidos = aplicables.filter((r) => checklist.marcados[r.id]).length;

  return (
    <section className="rounded-xl border border-emerald-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          Tu checklist <span className="text-stone-400">· {checklist.nombre}</span>
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
          const etiqueta = ETIQUETA_TIPO[r.tipo];
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
                    {etiqueta.icono} {r.titulo}
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

      <p className="mt-4 text-xs text-stone-400">
        Tu progreso se guarda solo en este navegador.{" "}
        <button onClick={empiezaDeNuevo} className="underline hover:text-stone-600">
          Volver a empezar
        </button>
      </p>
    </section>
  );
}
