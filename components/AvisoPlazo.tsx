"use client";

import { useSyncExternalStore } from "react";
import type { Plazo } from "@/lib/types";

// "Hoy" como store externo de valor único, igual que el sello: estable durante
// el render y evaluado solo en el navegador (en SSR devuelve 0).
const suscribeNada = () => () => {};
let ahoraCache = 0;
const getAhora = () => (ahoraCache ||= Date.now());
const getAhoraServidor = () => 0;

export type EstadoPlazo = "abierto" | "cerrado" | "aun-no" | "desconocido";

export function estadoDePlazo(plazo: Plazo | undefined, ahora: number): EstadoPlazo {
  if (!plazo || ahora === 0) return "desconocido";
  const inicio = new Date(`${plazo.inicio}T00:00:00`).getTime();
  const fin = new Date(`${plazo.fin}T23:59:59`).getTime();
  if (ahora < inicio) return "aun-no";
  if (ahora > fin) return "cerrado";
  return "abierto";
}

function formatea(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/**
 * Aviso de ventana de solicitud. Un trámite fuera de plazo convierte cualquier
 * checklist en una pérdida de tiempo: decirlo ANTES es literalmente la promesa
 * del producto ("que no te frene a mitad algo que no sabías").
 */
export function AvisoPlazo({ plazo }: { plazo: Plazo | undefined }) {
  const ahora = useSyncExternalStore(suscribeNada, getAhora, getAhoraServidor);
  const estado = estadoDePlazo(plazo, ahora);

  if (!plazo || estado === "desconocido" || estado === "abierto") {
    if (estado === "abierto" && plazo) {
      return (
        <p className="rounded-lg bg-sello-suave px-4 py-3 text-sm text-sello">
          <strong>Plazo abierto</strong> hasta el {formatea(plazo.fin)}.
        </p>
      );
    }
    return null;
  }

  if (estado === "aun-no") {
    return (
      <p className="rounded-lg bg-papel px-4 py-3 text-sm text-tinta-media">
        <strong>El plazo aún no ha abierto.</strong> Va del {formatea(plazo.inicio)} al{" "}
        {formatea(plazo.fin)}. Puedes ir reuniendo los papeles.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-pendiente bg-pendiente-suave px-4 py-3 text-sm text-tinta">
      <p>
        <strong>El plazo ya se ha cerrado</strong> (terminó el {formatea(plazo.fin)}). Ahora mismo
        no se puede presentar la solicitud.
      </p>
      {plazo.nota && <p className="mt-1 text-pendiente/80">{plazo.nota}</p>}
      <p className="mt-1 text-pendiente/80">
        Te dejamos igualmente la lista: si preparas los papeles ahora, la próxima convocatoria te
        pilla listo.
      </p>
    </div>
  );
}
