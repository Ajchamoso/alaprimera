import Link from "next/link";
import type { Metadata } from "next";
import { getTramites } from "@/lib/data";
import { requisitosAplicablesDe } from "@/lib/personaliza";
import { adminConfigurado, supabaseAdmin } from "@/lib/supabase/admin";
import { SelloVerificacion } from "@/components/SelloVerificacion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checklist compartida · A la Primera",
  robots: { index: false, follow: false }, // enlaces privados: fuera de buscadores
};

const ETIQUETA_TIPO: Record<string, string> = {
  tramite_previo: "⛓️",
  doc_fisico: "📄",
  doc_digital: "💻",
  tecnico: "⚙️",
};

/** Vista de solo lectura de una checklist compartida (H7, FR-014). Sin sesión. */
export default async function PaginaCompartida({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!adminConfigurado()) return <NoDisponible />;

  const { data: share } = await supabaseAdmin()
    .from("shares")
    .select("checklist_id, checklists ( tramite_id, nombre, respuestas, marcados, canal_elegido )")
    .eq("token", token)
    .maybeSingle();

  const checklist = share?.checklists as
    | {
        tramite_id: string;
        nombre: string;
        respuestas: Record<string, string>;
        marcados: Record<string, boolean>;
        canal_elegido: string | null;
      }
    | undefined;

  if (!checklist) return <NoDisponible />;

  const tramite = (await getTramites()).find((t) => t.slug === checklist.tramite_id);
  if (!tramite) return <NoDisponible />;

  const aplicables = requisitosAplicablesDe(tramite, checklist.respuestas);
  const conseguidos = aplicables.filter((r) => checklist.marcados?.[r.id]).length;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-stone-500">Checklist compartida contigo · solo lectura</p>
        <h1 className="text-2xl font-bold tracking-tight">
          {tramite.nombreColoquial} <span className="text-stone-400">· {checklist.nombre}</span>
        </h1>
        <p className="text-stone-500">
          {tramite.nombreOficial} · {tramite.organismo}
        </p>
        <SelloVerificacion
          verificadaEn={tramite.verificadaEn}
          generadaPorIa={tramite.generadaPorIa}
        />
      </header>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm font-medium text-emerald-800">
          {conseguidos} de {aplicables.length} listo{conseguidos === 1 ? "" : "s"}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{
              width: `${aplicables.length === 0 ? 0 : Math.round((conseguidos / aplicables.length) * 100)}%`,
            }}
          />
        </div>
        <ul className="mt-4 space-y-2">
          {aplicables.map((r) => {
            const marcado = !!checklist.marcados?.[r.id];
            return (
              <li key={r.id} className="flex items-start gap-3 rounded-lg border border-stone-200 p-4">
                <span aria-hidden className="text-lg leading-none">
                  {marcado ? "☑" : "☐"}
                </span>
                <span>
                  <span className={`font-medium ${marcado ? "text-stone-400 line-through" : ""}`}>
                    {ETIQUETA_TIPO[r.tipo]} {r.titulo}
                  </span>
                  <span className="mt-0.5 block text-sm text-stone-600">{r.explicacion}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3 text-sm">
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
        <p className="rounded-lg bg-stone-100 p-4 text-stone-600">
          Esta es una copia de solo lectura: marcarla no es posible desde aquí.{" "}
          <Link href={`/tramite/${tramite.slug}`} className="font-medium text-emerald-700 underline">
            Prepara tu propia checklist de este trámite →
          </Link>
        </p>
      </section>
    </article>
  );
}

function NoDisponible() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold tracking-tight">Esta checklist ya no existe</h1>
      <p className="text-stone-600">
        El enlace no es válido o quien lo compartió la ha borrado.
      </p>
      <Link href="/" className="inline-block font-medium text-emerald-700 underline">
        Ver todos los trámites →
      </Link>
    </div>
  );
}
