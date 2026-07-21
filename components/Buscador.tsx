"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Tramite } from "@/lib/types";
import { buscaTramites } from "@/lib/data";
import { destacados } from "@/lib/data/destacados";
import { hechosVitales } from "@/lib/data/hechos-vitales";
import { nombreComunidad, tieneFichas } from "@/lib/data/comunidades";
import { getZona, getZonaServidor, suscribeZona, visibleEnZona } from "@/lib/zona";
import { SelectorZona } from "@/components/SelectorZona";

/**
 * Búsqueda coloquial (FR-002) y catálogo por hecho vital, en DOS niveles para
 * que la página no vaya cargada: primero el índice de temas, entras en uno y ves
 * su lista. Escribir en el buscador salta el menú y da resultados planos.
 *
 * Filtra por "tu zona": estatales para todos; autonómicos y locales solo para su
 * comunidad. La búsqueda es determinista, sin IA en runtime.
 */
export function Buscador({ tramites }: { tramites: Tramite[] }) {
  const [consulta, setConsulta] = useState("");
  const [tema, setTema] = useState<string | null>(null);
  const buscando = consulta.trim().length > 0;
  const zona = useSyncExternalStore(suscribeZona, getZona, getZonaServidor);

  // El botón de atrás del navegador vuelve al índice en vez de salir del sitio.
  useEffect(() => {
    const alVolver = (e: PopStateEvent) => setTema((e.state?.tema as string) ?? null);
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  function entraEnTema(codigo: string) {
    setTema(codigo);
    window.history.pushState({ tema: codigo }, "");
  }
  function volveAlIndice() {
    setTema(null);
    window.history.pushState({ tema: null }, "");
  }

  const deMiZona = useMemo(() => tramites.filter((t) => visibleEnZona(t, zona)), [tramites, zona]);
  const resultados = useMemo(() => buscaTramites(consulta, deMiZona), [consulta, deMiZona]);

  // Los destacados salen arriba como atajo, pero también viven en su tema
  // (a la gente que entra en "Documentos base" a buscar el DNI le cuadra ahí).
  const destacadosTramites = useMemo(() => {
    const porSlug = new Map(deMiZona.map((t) => [t.slug, t]));
    return destacados.map((s) => porSlug.get(s)).filter((t): t is Tramite => Boolean(t));
  }, [deMiZona]);

  const grupos = useMemo(
    () =>
      hechosVitales
        .map((hv) => ({ hv, items: deMiZona.filter((t) => t.hechoVital === hv.codigo) }))
        .filter((g) => g.items.length > 0),
    [deMiZona]
  );

  const grupoActivo = grupos.find((g) => g.hv.codigo === tema);
  const zonaSinFichas = zona !== null && !tieneFichas(zona);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectorZona />
        {zona === null && (
          <span className="font-mono text-xs text-tinta-tenue">elígela para ver solo lo tuyo</span>
        )}
      </div>

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

      {zonaSinFichas && (
        <div className="rounded-xl border border-pendiente bg-pendiente-suave p-5 text-tinta-media">
          <p className="font-medium text-tinta">
            De {nombreComunidad(zona)} aún no tenemos trámites propios.
          </p>
          <p className="mt-1 text-sm">
            Por ahora solo hemos preparado los de la Comunidad de Madrid y Aragón. Abajo tienes los
            estatales, iguales en toda España. Los de tu comunidad llegarán; no te los enseñamos
            hasta tenerlos verificados contra la fuente.
          </p>
        </div>
      )}

      {buscando ? (
        // ── Buscando: resultados planos, se salta el menú ──
        resultados.length === 0 ? (
          <div className="rounded-xl border border-pendiente bg-pendiente-suave p-5 text-tinta-media">
            <p className="font-medium text-tinta">Aún no tenemos ese trámite.</p>
            <p className="mt-1 text-sm">
              Preferimos decírtelo claro antes que inventar una respuesta. Estamos ampliando el
              catálogo poco a poco, siempre verificando cada ficha contra la fuente oficial.
            </p>
          </div>
        ) : (
          <Lista tramites={resultados} />
        )
      ) : grupoActivo ? (
        // ── Dentro de un tema: su lista, con vuelta al índice ──
        <div className="space-y-4">
          <button
            onClick={volveAlIndice}
            className="font-mono text-xs uppercase tracking-widest text-sello hover:underline"
          >
            ← Todos los temas
          </button>
          <Rotulo>{grupoActivo.hv.etiqueta}</Rotulo>
          <Lista tramites={grupoActivo.items} />
        </div>
      ) : (
        // ── El índice de temas, con los destacados fuera ──
        <div className="space-y-8">
          {destacadosTramites.length > 0 && (
            <div className="space-y-3">
              <Rotulo>Empieza por aquí</Rotulo>
              <ul className="space-y-2">
                {destacadosTramites.map((t) => (
                  <li key={t.slug}>
                    <TarjetaFicha t={t} compacto />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Rotulo>Según lo que estés viviendo</Rotulo>
            <p className="-mt-1 text-sm text-tinta-media">Entra en el momento que te trae por aquí:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {grupos.map(({ hv, items }) => {
              const listos = items.filter((t) => !t.pendiente).length;
              return (
                <li key={hv.codigo}>
                  <button
                    onClick={() => entraEnTema(hv.codigo)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-linea bg-hoja px-4 py-3 text-left transition hover:border-sello hover:shadow-sm"
                  >
                    <span className="font-cond text-lg font-bold uppercase tracking-wide">
                      {hv.etiqueta}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-tinta-tenue">
                      {listos > 0 ? `${listos} listo${listos === 1 ? "" : "s"}` : ""}
                      {listos > 0 && items.length > listos ? " · " : ""}
                      {items.length > listos ? `${items.length - listos} en camino` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/** Rótulo de sección con su filete: el aire de un formulario oficial. */
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
        <li key={t.slug}>{t.pendiente ? <TarjetaPendiente t={t} /> : <TarjetaFicha t={t} />}</li>
      ))}
    </ul>
  );
}

function TarjetaFicha({ t, compacto = false }: { t: Tramite; compacto?: boolean }) {
  return (
    <Link
      href={`/tramite/${t.slug}`}
      className={`block rounded-xl border border-linea bg-hoja shadow-sm transition hover:border-sello hover:shadow ${
        compacto ? "p-4" : "p-5"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={compacto ? "font-semibold" : "text-lg font-semibold"}>{t.nombreColoquial}</h3>
        {t.verificadaEn === null && (
          <span className="rounded-xs border border-pendiente px-1.5 py-0.5 font-cond text-[10px] font-bold uppercase tracking-widest text-pendiente">
            Por verificar
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
      {!compacto && t.descripcion && (
        <p className="mt-2 text-sm text-tinta-media">{t.descripcion}</p>
      )}
    </Link>
  );
}

/** Un pendiente: sin ficha aún. Atenuado, sin promesas — solo "en preparación". */
function TarjetaPendiente({ t }: { t: Tramite }) {
  return (
    <Link
      href={`/tramite/${t.slug}`}
      className="block rounded-xl border border-dashed border-linea bg-transparent p-5 transition hover:border-tinta-tenue"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-medium text-tinta-media">{t.nombreColoquial}</h3>
        <span className="rounded-xs border border-linea px-1.5 py-0.5 font-cond text-[10px] font-bold uppercase tracking-widest text-tinta-tenue">
          En preparación
        </span>
      </div>
      <p className="text-sm text-tinta-tenue">
        {t.nombreOficial} · {t.organismo}
      </p>
    </Link>
  );
}
