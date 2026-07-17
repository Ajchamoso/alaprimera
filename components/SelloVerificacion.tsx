"use client";

import { useSyncExternalStore } from "react";

const DIAS_VIGENCIA = 90;

// "Ahora" como store externo de valor único: estable durante el render (el sello
// no necesita un reloj vivo, solo el momento de la lectura). En SSR devuelve 0 →
// la caducidad solo se evalúa en el navegador.
const suscribeNada = () => () => {};
let ahoraCache = 0;
const getAhora = () => (ahoraCache ||= Date.now());
const getAhoraServidor = () => 0;

/**
 * El estado de confianza de una ficha, estampado (FR-020).
 *
 * No es un badge: es un sello. Caja girada, filete doble, condensada en caps —
 * el idioma visual de cualquier ventanilla. La caducidad se deriva en el momento
 * de la lectura: sin trabajos programados que se desincronicen.
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
      <Estampa color="pendiente" doble titulo="Sin verificar">
        {generadaPorIa ? "generada por IA · confirma en la fuente" : "confirma en la fuente oficial"}
      </Estampa>
    );
  }

  const fechaLegible = formateaFechaEs(verificadaEn);

  if (caducada) {
    return (
      <Estampa color="tenue" titulo="Puede estar desactualizada">
        verificada el {fechaLegible} · confirma en la fuente
      </Estampa>
    );
  }

  return (
    <Estampa color="sello" titulo="Verificada">
      {fechaLegible}
    </Estampa>
  );
}

function Estampa({
  color,
  doble,
  titulo,
  children,
}: {
  color: "sello" | "pendiente" | "tenue";
  doble?: boolean;
  titulo: string;
  children: React.ReactNode;
}) {
  const tinte = {
    sello: "text-sello",
    pendiente: "text-pendiente",
    tenue: "text-tinta-tenue",
  }[color];

  return (
    <span
      className={`inline-block -rotate-2 rounded-sm border-current px-3 py-1.5 font-cond font-bold uppercase tracking-widest ${tinte} ${
        doble ? "border-4 border-double" : "border-[2.5px]"
      }`}
    >
      <span className="block text-[13px] leading-tight">{titulo}</span>
      <span className="block text-[10.5px] font-semibold tracking-wide opacity-80">{children}</span>
    </span>
  );
}

/** "2026-07-16" (o ISO completo) → "16 · 07 · 2026", con aire de sello. */
function formateaFechaEs(iso: string): string {
  const [fecha] = iso.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia} · ${mes} · ${anio}`;
}
