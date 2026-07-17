import Link from "next/link";
import { notFound } from "next/navigation";
import { getCadena, getTramites } from "@/lib/data";
import { SelloVerificacion } from "@/components/SelloVerificacion";
import { Asistente } from "@/components/Asistente";

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

  const cadena = getCadena(tramite, catalogo);

  return (
    <article className="space-y-8">
      <nav className="text-sm print:hidden">
        <Link href="/" className="text-emerald-700 hover:underline">
          ← Todos los trámites
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {tramite.nombreColoquial}
        </h1>
        <p className="text-stone-500">
          {tramite.nombreOficial} · {tramite.organismo} · {tramite.territorio}
        </p>
        <SelloVerificacion verificadaEn={tramite.verificadaEn} generadaPorIa={tramite.generadaPorIa} />
        <p className="max-w-prose text-stone-600">{tramite.descripcion}</p>
        <p>
          <a
            href={tramite.urlFuente}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-2"
          >
            📖 Fuente oficial del trámite
          </a>
        </p>
      </header>

      {cadena.length > 0 && (
        <section className="rounded-xl border border-stone-300 bg-white p-5">
          <h2 className="font-semibold">⛓️ Este trámite esconde otros trámites</h2>
          <p className="mt-1 text-sm text-stone-600">
            Antes de empezar, asegúrate de tener resueltos estos. Descubrirlo ahora es lo que evita
            el atasco a mitad.
          </p>
          <ul className="mt-3 space-y-2">
            {cadena.map(({ tramite: previo, nota }) => (
              <li key={previo.slug} className="flex flex-wrap items-baseline gap-2">
                <Link
                  href={`/tramite/${previo.slug}`}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {previo.nombreColoquial} →
                </Link>
                {nota && <span className="text-sm text-stone-500">{nota}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Asistente tramite={tramite} />

      <details className="rounded-xl border border-stone-200 bg-white p-5">
        <summary className="cursor-pointer font-medium text-stone-600">
          Ver todos los requisitos posibles (sin personalizar)
        </summary>
        <ul className="mt-3 space-y-2">
          {tramite.requisitos.map((r) => (
            <li key={r.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="font-medium">
                {etiquetaTipo[r.tipo]} {r.titulo}
              </p>
              <p className="mt-1 text-sm text-stone-600">{r.explicacion}</p>
              {r.soloSiOpciones && (
                <p className="mt-1 text-xs text-stone-400">
                  Solo en algunos casos — el asistente te dice si te aplica.
                </p>
              )}
            </li>
          ))}
        </ul>
      </details>

      {tramite.urlCitaPrevia && (
        <p>
          <a
            href={tramite.urlCitaPrevia}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-2"
          >
            📅 Pedir cita previa oficial
          </a>
        </p>
      )}
    </article>
  );
}

const etiquetaTipo: Record<string, string> = {
  doc_fisico: "📄",
  doc_digital: "💻",
  tecnico: "⚙️",
  tramite_previo: "⛓️",
};
