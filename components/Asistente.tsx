"use client";

import { useState, useSyncExternalStore } from "react";
import type { Tramite } from "@/lib/types";
import {
  borraBorrador,
  borraChecklist,
  creaChecklist,
  getBorradoresServidor,
  getBorradoresSnapshot,
  getChecklistsServidor,
  getChecklistsSnapshot,
  guardaBorrador,
  suscribe,
} from "@/lib/checklist-store";
import { Checklist } from "@/components/Checklist";

/**
 * Orquesta el flujo de un trámite: wizard de personalización (FR-004..006),
 * veredicto de inviabilidad (FR-005) y checklists —varias por trámite, una por
 * familiar (FR-013)—. El estado vive en el store localStorage; aquí solo hay
 * estado de UI (cuál está activa, si se está creando otra).
 */
export function Asistente({ tramite }: { tramite: Tramite }) {
  const checklists = useSyncExternalStore(suscribe, getChecklistsSnapshot, getChecklistsServidor);
  const borradores = useSyncExternalStore(suscribe, getBorradoresSnapshot, getBorradoresServidor);
  const montado = useSyncExternalStore(
    suscribe,
    () => true,
    () => false
  );

  const [activaId, setActivaId] = useState<string | null>(null);
  const [creandoNueva, setCreandoNueva] = useState(false);

  const preguntas = [...tramite.preguntas].sort((a, b) => a.orden - b.orden);
  const delTramite = checklists.filter((c) => c.tramiteSlug === tramite.slug);
  const activa = delTramite.find((c) => c.id === activaId) ?? delTramite[0] ?? null;

  const enWizard = creandoNueva || !activa;
  const respuestas = enWizard ? (borradores[tramite.slug] ?? {}) : activa.respuestas;

  const veredicto = preguntas
    .map((p) => ({ pregunta: p, opcion: p.opciones.find((o) => o.id === respuestas[p.id]) }))
    .find((x) => x.opcion?.veredictoInviable);

  const pendientes = preguntas.filter((p) => !(p.id in respuestas));
  const preguntaActual = pendientes[0];

  function eligeOpcion(preguntaId: string, opcionId: string) {
    const nuevas = { ...respuestas, [preguntaId]: opcionId };
    const opcion = preguntas
      .find((p) => p.id === preguntaId)
      ?.opciones.find((o) => o.id === opcionId);
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
    const nueva = creaChecklist(tramite.slug, nombre, finales);
    borraBorrador(tramite.slug);
    setActivaId(nueva.id);
    setCreandoNueva(false);
  }

  function cambiaRespuesta(preguntaId: string) {
    const nuevas = { ...respuestas };
    delete nuevas[preguntaId];
    guardaBorrador(tramite.slug, nuevas);
  }

  function borraActiva() {
    if (!activa) return;
    if (!window.confirm(`Se borrará «${activa.nombre}» y su progreso. ¿Seguro?`)) return;
    borraChecklist(activa.id);
    setActivaId(null);
  }

  if (!montado) {
    return (
      <section className="rounded-xl border border-linea bg-sello-suave p-5 print:hidden">
        <p className="text-sm text-sello/70">Cargando tu caso…</p>
      </section>
    );
  }

  // Selector de checklists del trámite (FR-013: una por familiar)
  const selector = delTramite.length > 0 && (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      {delTramite.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            setActivaId(c.id);
            setCreandoNueva(false);
          }}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            !enWizard && activa?.id === c.id
              ? "bg-sello text-white"
              : "bg-papel text-tinta-media hover:bg-linea"
          }`}
        >
          {c.nombre}
        </button>
      ))}
      <button
        onClick={() => {
          borraBorrador(tramite.slug);
          setCreandoNueva(true);
        }}
        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
          enWizard ? "bg-sello text-white" : "bg-papel text-tinta-media hover:bg-linea"
        }`}
        title="Prepara el mismo trámite para otra persona"
      >
        ＋ otra persona
      </button>
      {!enWizard && activa && (
        <button
          onClick={borraActiva}
          className="ml-auto text-xs text-tinta-tenue underline hover:text-tinta-media"
        >
          borrar esta checklist
        </button>
      )}
    </div>
  );

  // ── Veredicto: la vía elegida no es posible para este caso ────────────────
  if (enWizard && veredicto?.opcion) {
    return (
      <div className="space-y-3">
        {selector}
        <section className="rounded-xl border border-pendiente bg-pendiente-suave p-5">
          <h2 className="font-semibold text-tinta">
            Esta vía no está disponible para tu caso, y te lo decimos antes de que pierdas la tarde
          </h2>
          <p className="mt-3 max-w-prose text-tinta/90">{veredicto.opcion.textoAlternativas}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => cambiaRespuesta(veredicto.pregunta.id)}
              className="rounded-lg border border-pendiente bg-hoja px-4 py-2 text-sm font-medium text-pendiente hover:bg-pendiente-suave"
            >
              ← Cambiar mi respuesta
            </button>
            <a
              href={tramite.urlFuente}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-sm font-medium text-pendiente underline underline-offset-2"
            >
              Ver la fuente oficial
            </a>
          </div>
        </section>
      </div>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  if (enWizard && preguntaActual) {
    const numActual = preguntas.length - pendientes.length + 1;
    return (
      <div className="space-y-3">
        {selector}
        <section className="rounded-xl border border-linea bg-sello-suave p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-sello/70">
            Prepara TU caso · pregunta {numActual} de {preguntas.length}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-tinta">{preguntaActual.texto}</h2>
          <div className="mt-4 grid gap-2">
            {preguntaActual.opciones.map((o) => (
              <button
                key={o.id}
                onClick={() => eligeOpcion(preguntaActual.id, o.id)}
                className="rounded-lg border border-sello bg-hoja px-4 py-3 text-left font-medium text-tinta transition hover:border-sello hover:bg-sello-suave"
              >
                {o.texto}
              </button>
            ))}
          </div>
          {Object.keys(respuestas).length > 0 && (
            <p className="mt-3 text-xs text-sello/60">
              Tus respuestas anteriores están guardadas: si te vas, retomas donde lo dejaste.
            </p>
          )}
        </section>
      </div>
    );
  }

  // ── Caso raro: todo respondido sin checklist (borrador antiguo) ───────────
  if (enWizard) {
    return (
      <div className="space-y-3">
        {selector}
        <section className="rounded-xl border border-linea bg-sello-suave p-5">
          <p className="text-tinta">Tenemos todas tus respuestas guardadas.</p>
          <button
            onClick={() => generaChecklist(respuestas)}
            className="mt-3 rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta"
          >
            Generar mi checklist
          </button>
        </section>
      </div>
    );
  }

  // ── Checklist activa ───────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {selector}
      <Checklist tramite={tramite} checklist={activa} />
    </div>
  );
}
