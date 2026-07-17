import Link from "next/link";
import { notFound } from "next/navigation";
import { getCadena, getTramites } from "@/lib/data";
import { SelloVerificacion } from "@/components/SelloVerificacion";
import { Asistente } from "@/components/Asistente";
import { ReportarError } from "@/components/ReportarError";
import { AvisoPlazo } from "@/components/AvisoPlazo";
import { IconoRequisito, NOMBRE_TIPO } from "@/components/IconoRequisito";

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
          <span className="inline-block rounded-sm border-[2.5px] border-tinta-tenue px-3 py-1.5 font-cond font-bold uppercase tracking-widest text-tinta-tenue">
            En preparación
          </span>
        </header>
        <p className="max-w-prose text-tinta-media">
          Este trámite está en el catálogo, pero aún no le hemos hecho la ficha. Cuando la tengamos
          extraída de la fuente oficial y verificada, aquí tendrás tu checklist personalizada: los
          papeles, los requisitos técnicos y los trámites escondidos de tu caso. No la publicamos
          antes de tenerla verificada, para no darte información sin comprobar.
        </p>
      </article>
    );
  }

  const cadena = getCadena(tramite, catalogo);

  return (
    <article className="space-y-8">
      <nav className="text-sm print:hidden">
        <Link href="/" className="text-sello hover:underline">
          ← Todos los trámites
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {tramite.nombreColoquial}
        </h1>
        <p className="text-tinta-tenue">
          {tramite.nombreOficial} · {tramite.organismo} · {tramite.territorio}
        </p>
        <SelloVerificacion verificadaEn={tramite.verificadaEn} generadaPorIa={tramite.generadaPorIa} />
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

      {cadena.length > 0 && (
        <section className="rounded-xl border border-linea bg-hoja p-5">
          <h2 className="font-cond text-lg font-bold uppercase tracking-wide">Este trámite esconde otros trámites</h2>
          <p className="mt-1 text-sm text-tinta-media">
            Antes de empezar, asegúrate de tener resueltos estos. Descubrirlo ahora es lo que evita
            el atasco a mitad.
          </p>
          <ul className="mt-3 space-y-2">
            {cadena.map(({ tramite: previo, nota }) => (
              <li key={previo.slug} className="flex flex-wrap items-baseline gap-2">
                <Link
                  href={`/tramite/${previo.slug}`}
                  className="font-medium text-sello hover:underline"
                >
                  {previo.nombreColoquial} →
                </Link>
                {nota && <span className="text-sm text-tinta-tenue">{nota}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Asistente tramite={tramite} />

      <details className="rounded-xl border border-linea bg-hoja p-5">
        <summary className="cursor-pointer font-medium text-tinta-media">
          Ver todos los requisitos posibles (sin personalizar)
        </summary>
        <ul className="mt-3 space-y-2">
          {tramite.requisitos.map((r) => (
            <li key={r.id} className="rounded-lg border border-linea bg-hoja p-4">
              <p className="flex items-center gap-2 font-medium">
                <span className={r.tipo === "tramite_previo" ? "text-sello" : "text-tinta-tenue"}>
                  <IconoRequisito tipo={r.tipo} />
                </span>
                {r.titulo}
                <span className="ml-auto shrink-0 rounded-xs border border-linea px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-tinta-tenue">
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

