"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Tramite } from "@/lib/types";
import { getCadena } from "@/lib/data";
import { familias } from "@/lib/data/familias";
import { getZona, getZonaServidor, suscribeZona } from "@/lib/zona";

/**
 * "Este trámite esconde otros trámites" (H3): la cadena de trámites previos.
 *
 * Es cliente, y no server como antes, porque la cadena depende de la zona de
 * quien lee y la zona vive en su navegador. Con la cadena resuelta en servidor,
 * el primer DNI le decía "Empadronarse en Madrid" a todo el mundo, viviera donde
 * viviera (auditoría 17/09). Cuando no tenemos la ficha de su territorio se
 * nombra el trámite sin enlazarlo: existe igual, solo que no lo tenemos.
 */
export function CadenaTramites({
  tramite,
  catalogo,
}: {
  tramite: Tramite;
  catalogo: Tramite[];
}) {
  const zona = useSyncExternalStore(suscribeZona, getZona, getZonaServidor);
  const cadena = useMemo(() => getCadena(tramite, catalogo, zona), [tramite, catalogo, zona]);

  if (cadena.length === 0) return null;

  return (
    <section className="rounded-xl border border-linea bg-hoja p-5">
      <h2 className="font-cond text-lg font-bold uppercase tracking-wide">
        Este trámite esconde otros trámites
      </h2>
      <p className="mt-1 text-sm text-tinta-media">
        Antes de empezar, asegúrate de tener resueltos estos. Descubrirlo ahora es lo que evita el
        atasco a mitad.
      </p>
      <ul className="mt-3 space-y-2">
        {cadena.map((eslabon) =>
          eslabon.tipo === "ficha" ? (
            <li key={eslabon.tramite.slug} className="flex flex-wrap items-baseline gap-2">
              <Link
                href={`/tramite/${eslabon.tramite.slug}?desde=${encodeURIComponent(tramite.slug)}`}
                className="font-medium text-sello hover:underline"
              >
                {eslabon.tramite.nombreColoquial} →
              </Link>
              {eslabon.nota && <span className="text-sm text-tinta-tenue">{eslabon.nota}</span>}
            </li>
          ) : (
            <li key={eslabon.familia} className="space-y-1">
              <p className="font-medium">
                {familias[eslabon.familia]?.etiqueta ?? eslabon.familia}
                {eslabon.nota && (
                  <span className="font-normal text-tinta-tenue"> · {eslabon.nota}</span>
                )}
              </p>
              <p className="text-sm text-tinta-tenue">
                {zona === null
                  ? "Depende de tu ayuntamiento. Elige tu zona arriba y te decimos si tenemos su ficha."
                  : familias[eslabon.familia]?.sinFicha}
              </p>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
