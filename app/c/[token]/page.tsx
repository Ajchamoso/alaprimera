import Link from "next/link";
import type { Metadata } from "next";
import { getTramites } from "@/lib/data";
import { requisitosAplicablesDe } from "@/lib/personaliza";
import { adminConfigurado, supabaseAdmin } from "@/lib/supabase/admin";
import { SelloVerificacion } from "@/components/SelloVerificacion";
import { IconoRequisito, NOMBRE_TIPO } from "@/components/IconoRequisito";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checklist compartida · A la Primera",
  robots: { index: false, follow: false }, // enlaces privados: fuera de buscadores
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
        <p className="text-sm text-tinta-tenue">Checklist compartida contigo · solo lectura</p>
        <h1 className="text-2xl font-bold tracking-tight">
          {tramite.nombreColoquial} <span className="text-tinta-tenue">· {checklist.nombre}</span>
        </h1>
        <p className="text-tinta-tenue">
          {tramite.nombreOficial} · {tramite.organismo}
        </p>
        <SelloVerificacion
          verificadaEn={tramite.verificadaEn}
          generadaPorIa={tramite.generadaPorIa}
        />
      </header>

      <section className="rounded-xl border border-linea bg-hoja p-5">
        <p className="text-sm font-medium text-sello">
          {conseguidos} de {aplicables.length} listo{conseguidos === 1 ? "" : "s"}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-papel">
          <div
            className="h-full rounded-full bg-sello"
            style={{
              width: `${aplicables.length === 0 ? 0 : Math.round((conseguidos / aplicables.length) * 100)}%`,
            }}
          />
        </div>
        <ul className="mt-4 space-y-2">
          {aplicables.map((r) => {
            const marcado = !!checklist.marcados?.[r.id];
            return (
              <li key={r.id} className="flex items-start gap-3 rounded-lg border border-linea p-4">
                <span
                  aria-hidden
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-xs border-2 ${
                    marcado ? "border-sello bg-sello text-hoja" : "border-tinta-tenue"
                  }`}
                >
                  {marcado && (
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </span>
                <span>
                  <span className={`flex items-center gap-2 font-medium ${marcado ? "text-tinta-tenue line-through" : ""}`}>
                    <span className={r.tipo === "tramite_previo" ? "text-sello" : "text-tinta-tenue"}>
                      <IconoRequisito tipo={r.tipo} />
                    </span>
                    {r.titulo}
                    <span className="ml-auto shrink-0 rounded-xs border border-linea px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-tinta-tenue no-underline">
                      {NOMBRE_TIPO[r.tipo]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-tinta-media">{r.explicacion}</span>
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
            className="font-medium text-sello underline underline-offset-2"
          >
            Fuente oficial del trámite →
          </a>
        </p>
        <p className="rounded-lg bg-papel p-4 text-tinta-media">
          Esta es una copia de solo lectura: marcarla no es posible desde aquí.{" "}
          <Link href={`/tramite/${tramite.slug}`} className="font-medium text-sello underline">
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
      <p className="text-tinta-media">
        El enlace no es válido o quien lo compartió la ha borrado.
      </p>
      <Link href="/" className="inline-block font-medium text-sello underline">
        Ver todos los trámites →
      </Link>
    </div>
  );
}
