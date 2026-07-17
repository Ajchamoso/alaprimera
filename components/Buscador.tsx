"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Tramite } from "@/lib/types";
import { buscaTramites } from "@/lib/data";
import { destacados } from "@/lib/data/destacados";

/**
 * Búsqueda coloquial (FR-002) y punto de entrada al catálogo.
 *
 * Sin búsqueda: primero unos pocos trámites como puerta de entrada (los cimientos,
 * ver destacados.ts), después el catálogo entero. Con búsqueda: solo resultados,
 * porque quien busca ya sabe lo que quiere.
 *
 * La búsqueda es determinista: delega en buscaTramites, sin IA en runtime.
 */
export function Buscador({ tramites }: { tramites: Tramite[] }) {
  const [consulta, setConsulta] = useState("");
  const buscando = consulta.trim().length > 0;

  const resultados = useMemo(() => buscaTramites(consulta, tramites), [consulta, tramites]);

  const { puertaDeEntrada, resto } = useMemo(() => {
    const porSlug = new Map(tramites.map((t) => [t.slug, t]));
    const puerta = destacados.map((s) => porSlug.get(s)).filter((t): t is Tramite => Boolean(t));
    const enPuerta = new Set(puerta.map((t) => t.slug));
    return { puertaDeEntrada: puerta, resto: tramites.filter((t) => !enPuerta.has(t.slug)) };
  }, [tramites]);

  return (
    <section className="space-y-6">
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

      {buscando ? (
        resultados.length === 0 ? (
          <div className="rounded-xl border border-pendiente bg-pendiente-suave p-5 text-tinta-media">
            <p className="font-medium">Aún no tenemos ese trámite.</p>
            <p className="mt-1 text-sm">
              Preferimos decírtelo claro antes que inventar una respuesta. Estamos ampliando el
              catálogo poco a poco, siempre verificando cada ficha contra la fuente oficial.
            </p>
          </div>
        ) : (
          <Lista tramites={resultados} />
        )
      ) : (
        <>
          <div className="space-y-3">
            <Rotulo>Empieza por aquí</Rotulo>
            <p className="-mt-1 text-sm text-tinta-media">
              Si no sabes por dónde tirar: estos son los que te van a pedir para casi todo lo demás.
            </p>
            <Lista tramites={puertaDeEntrada} />
          </div>

          {resto.length > 0 && (
            <div className="space-y-3 pt-2">
              <Rotulo>
                Todos los trámites{" "}
                <span className="font-mono text-xs font-normal normal-case tracking-normal text-tinta-tenue">
                  ({tramites.length})
                </span>
              </Rotulo>
              <Lista tramites={resto} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** Rótulo de sección, con su filete: el aire de un formulario oficial. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 font-cond text-sm font-bold uppercase tracking-widest text-tinta-media">
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-linea" />
    </h2>
  );
}

function Lista({ tramites }: { tramites: Tramite[] }) {
  return (
    <ul className="space-y-3">
      {tramites.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/tramite/${t.slug}`}
            className="block rounded-xl border border-linea bg-hoja p-5 shadow-sm transition hover:border-sello hover:shadow"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{t.nombreColoquial}</h3>
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
  );
}
