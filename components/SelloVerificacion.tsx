"use client";

import { useSyncExternalStore } from "react";

const DIAS_VIGENCIA = 90;

// "Ahora" como store externo de valor único: estable durante la sesión de
// render (el sello no necesita un reloj vivo, solo el momento de la lectura).
// En SSR devuelve 0 → la caducidad solo se evalúa en el navegador.
const suscribeNada = () => () => {};
let ahoraCache = 0;
const getAhora = () => (ahoraCache ||= Date.now());
const getAhoraServidor = () => 0;

/**
 * Estado de confianza de una ficha (FR-020). La caducidad se deriva en el
 * momento de la lectura: sin jobs que actualicen estados y sin congelar la
 * fecha en el build estático.
 */
export function SelloVerificacion({
  verificadaEn,
  generadaPorIa,
}: {
  verificadaEn: string | null;
  generadaPorIa: boolean;
}) {
  const ahora = useSyncExternalStore(suscribeNada, getAhora, getAhoraServidor);
  const caducada =
    ahora > 0 &&
    verificadaEn !== null &&
    ahora - new Date(verificadaEn).getTime() > DIAS_VIGENCIA * 24 * 60 * 60 * 1000;

  if (verificadaEn === null) {
    return (
      <p className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
        ⚠️ {generadaPorIa ? "Generada por IA — sin verificar" : "Ficha sin verificar"} · confirma en
        la fuente oficial
      </p>
    );
  }

  const fechaLegible = formateaFechaEs(verificadaEn);

  if (caducada) {
    return (
      <p className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
        ⚠️ Puede estar desactualizada (verificada el {fechaLegible}) · confirma en la fuente oficial
      </p>
    );
  }

  return (
    <p className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-900">
      ✅ Verificada el {fechaLegible}
    </p>
  );
}

/** "2026-07-16" (o ISO completo) → "16/07/2026", sin depender del locale del sistema. */
function formateaFechaEs(iso: string): string {
  const [fecha] = iso.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
