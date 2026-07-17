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
        <h1 className="font-cond text-4xl font-bold uppercase tracking-wide">
          Termina tu trámite <span className="text-sello">a la primera</span>
        </h1>
        <p className="max-w-prose text-lg text-tinta-media">
          Dinos qué necesitas hacer y te damos la lista exacta de lo que te van a pedir. Incluidos
          los trámites escondidos dentro de tu trámite.
        </p>
      </section>

      <Buscador tramites={tramites} />
    </div>
  );
}
