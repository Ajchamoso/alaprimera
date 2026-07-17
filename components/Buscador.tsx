"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Tramite } from "@/lib/types";
import { buscaTramites } from "@/lib/data";

/**
 * Búsqueda coloquial en cliente sobre el catálogo (FR-002).
 * Determinista: delega en buscaTramites (lib/data), sin IA en runtime.
 */
export function Buscador({ tramites }: { tramites: Tramite[] }) {
  const [consulta, setConsulta] = useState("");

  const resultados = useMemo(() => buscaTramites(consulta, tramites), [consulta, tramites]);

  return (
    <section className="space-y-4">
      <label className="block">
        <span className="sr-only">Busca tu trámite</span>
        <input
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Escríbelo con tus palabras: «lo del carnet de mi hijo»…"
          className="w-full rounded-xl border border-linea bg-hoja px-4 py-3 text-base shadow-sm outline-none focus:border-sello focus:ring-2 focus:ring-sello-suave"
          autoComplete="off"
        />
      </label>

      {resultados.length === 0 ? (
        <div className="rounded-xl border border-pendiente bg-pendiente-suave p-5 text-tinta-media">
          <p className="font-medium">Aún no tenemos ese trámite.</p>
          <p className="mt-1 text-sm">
            Preferimos decírtelo claro antes que inventar una respuesta. Estamos ampliando el
            catálogo poco a poco, siempre verificando cada ficha contra la fuente oficial.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {resultados.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tramite/${t.slug}`}
                className="block rounded-xl border border-linea bg-hoja p-5 shadow-sm transition hover:border-sello hover:shadow"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{t.nombreColoquial}</h2>
                  {t.verificadaEn === null && (
                    <span className="rounded-xs border border-pendiente px-1.5 py-0.5 font-cond text-[10px] font-bold uppercase tracking-widest text-pendiente">
                      Sin verificar
                    </span>
                  )}
                  {t.prerequisitos.length > 0 && (
                    <span className="rounded-xs border border-linea px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-tinta-media">
                      Trámites previos
                    </span>
                  )}
                </div>
                <p className="text-sm text-tinta-tenue">
                  {t.nombreOficial} · {t.organismo}
                </p>
                <p className="mt-2 text-sm text-tinta-media">{t.descripcion}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
