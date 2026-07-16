import Link from "next/link";
import { notFound } from "next/navigation";
import { getCadena, getTramiteBySlug, getTramites } from "@/lib/data";
import { SelloVerificacion } from "@/components/SelloVerificacion";

export function generateStaticParams() {
  return getTramites().map((t) => ({ slug: t.slug }));
}

export default async function PaginaTramite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tramite = getTramiteBySlug(slug);
  if (!tramite) notFound();

  const cadena = getCadena(tramite);

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

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="font-semibold text-emerald-900">Prepara TU caso</h2>
        <p className="mt-1 text-sm text-emerald-900/80">
          Respondiendo {tramite.preguntas.length} preguntas te damos la checklist exacta de tu
          situación — no la genérica.
        </p>
        <p className="mt-3 text-sm text-stone-500">
          🚧 El asistente paso a paso llega en la siguiente iteración (T-008). De momento, abajo
          tienes todos los requisitos posibles del trámite.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Todo lo que puede pedirte este trámite</h2>
        <ul className="space-y-2">
          {tramite.requisitos.map((r) => (
            <li key={r.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="font-medium">
                {etiquetaTipo[r.tipo]} {r.titulo}
              </p>
              <p className="mt-1 text-sm text-stone-600">{r.explicacion}</p>
              {r.soloSiOpciones && (
                <p className="mt-1 text-xs text-stone-400">Solo en algunos casos — el asistente te dirá si te aplica.</p>
              )}
            </li>
          ))}
        </ul>
      </section>

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
