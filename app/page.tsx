import { getTramites } from "@/lib/data";
import { Buscador } from "@/components/Buscador";

// El catálogo se sirve desde BD con caché: los cambios de curación aparecen
// sin redespliegue, y una BD caída nunca tumba la página ya generada.
export const revalidate = 300;

export default async function Home() {
  const tramites = await getTramites();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Termina tu trámite <span className="text-emerald-700">a la primera</span>
        </h1>
        <p className="max-w-prose text-lg text-stone-600">
          Dinos qué necesitas hacer, responde unas pocas preguntas sobre tu caso y llévate una
          checklist con todo lo que te puede frenar: papeles, requisitos técnicos y los trámites
          escondidos dentro de tu trámite.
        </p>
      </section>

      <Buscador tramites={tramites} />
    </div>
  );
}
