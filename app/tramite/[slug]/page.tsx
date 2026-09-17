import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTramites } from "@/lib/data";
import { SelloVerificacion } from "@/components/SelloVerificacion";
import { Asistente } from "@/components/Asistente";
import { ReportarError } from "@/components/ReportarError";
import { AvisoPlazo } from "@/components/AvisoPlazo";
import { IconoRequisito, NOMBRE_TIPO } from "@/components/IconoRequisito";
import { VueltaTramite } from "@/components/VueltaTramite";
import { CadenaTramites } from "@/components/CadenaTramites";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTramites()).map((t) => ({ slug: t.slug }));
}

export default async function PaginaTramite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalogo = await getTramites();
  const tramite = catalogo.find((t) => t.slug === slug);
  if (!tramite) notFound();

  // Un pendiente aún no tiene ficha: no promete requisitos, solo dice que está en camino.
  if (tramite.pendiente) {
    return (
      <article className="space-y-6">
        <nav className="text-sm">
          <Link href="/" className="text-sello hover:underline">
            ← Todos los trámites
          </Link>
        </nav>
        <header className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tramite.nombreColoquial}</h1>
          <p className="text-tinta-tenue">
            {tramite.nombreOficial} · {tramite.organismo} · {tramite.territorio}
          </p>
          <span className="inline-block rounded-sm border-[2.5px] border-borrador bg-borrador-suave px-3 py-1.5 font-cond font-bold uppercase tracking-widest text-borrador">
            En preparación
          </span>
        </header>
        <p className="max-w-prose text-tinta-media">
          Este trámite está en el catálogo, pero aún no le hemos hecho la ficha. Cuando la tengamos
          extraída de la fuente oficial y verificada, aquí tendrás tu checklist personalizada: los
          papeles, los requisitos técnicos y los trámites escondidos de tu caso.
        </p>
      </article>
    );
  }

  return (
    <article className="space-y-8">
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm print:hidden">
        <Link href="/" className="text-sello hover:underline">
          ← Todos los trámites
        </Link>
        <Suspense fallback={null}>
          <VueltaTramite
            actual={tramite.slug}
            tramites={catalogo
              .filter((ficha) => !ficha.pendiente)
              .map((ficha) => ({ slug: ficha.slug, nombre: ficha.nombreColoquial }))}
          />
        </Suspense>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {tramite.nombreColoquial}
        </h1>
        <p className="text-tinta-tenue">
          {tramite.nombreOficial} · {tramite.organismo} · {tramite.territorio}
        </p>
        <SelloVerificacion verificadaEn={tramite.verificadaEn} />
        <p className="max-w-prose text-tinta-media">{tramite.descripcion}</p>
        <AvisoPlazo plazo={tramite.plazo} />
        <p>
          <a
            href={tramite.urlFuente}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sello underline underline-offset-2"
          >
            Fuente oficial del trámite →
          </a>
        </p>
      </header>

      <CadenaTramites tramite={tramite} catalogo={catalogo} />

      <Asistente tramite={tramite} catalogo={catalogo} />

      <details className="rounded-xl border border-linea bg-hoja p-5">
        <summary className="cursor-pointer font-medium text-tinta-media">
          Ver todos los requisitos posibles (sin personalizar)
        </summary>
        <ul className="mt-3 space-y-2">
          {tramite.requisitos.map((r) => (
            <li key={r.id} className="rounded-lg border border-linea bg-hoja p-4">
              {/* El dibujo del tipo va dentro de su etiqueta, y la fila envuelve:
                  en móvil, icono y etiqueta en columnas propias dejaban el título
                  en una tira estrechísima. */}
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                <span className="min-w-0">{r.titulo}</span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-xs border px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider ${
                    r.tipo === "tramite_previo"
                      ? "border-sello text-sello"
                      : "border-linea text-tinta-tenue"
                  }`}
                >
                  <IconoRequisito tipo={r.tipo} className="h-3 w-3" />
                  {NOMBRE_TIPO[r.tipo]}
                </span>
              </p>
              <p className="mt-1 text-sm text-tinta-media">{r.explicacion}</p>
              {r.soloSiOpciones && (
                <p className="mt-1 text-xs text-tinta-tenue">
                  Solo en algunos casos. El asistente te dice si te aplica.
                </p>
              )}
            </li>
          ))}
        </ul>
      </details>

      <ReportarError tramiteSlug={tramite.slug} />
    </article>
  );
}
