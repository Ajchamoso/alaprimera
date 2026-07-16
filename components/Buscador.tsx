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
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          autoComplete="off"
        />
      </label>

      {resultados.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-stone-700">
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
                className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{t.nombreColoquial}</h2>
                  {t.verificadaEn === null && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      ⚠️ sin verificar
                    </span>
                  )}
                  {t.prerequisitos.length > 0 && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                      ⛓️ tiene trámites previos
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500">
                  {t.nombreOficial} · {t.organismo}
                </p>
                <p className="mt-2 text-sm text-stone-600">{t.descripcion}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
