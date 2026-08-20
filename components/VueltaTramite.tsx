"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function VueltaTramite({
  actual,
  tramites,
}: {
  actual: string;
  tramites: { slug: string; nombre: string }[];
}) {
  const desde = useSearchParams().get("desde");
  const origen = tramites.find((tramite) => tramite.slug === desde && tramite.slug !== actual);
  if (!origen) return null;

  return (
    <Link href={`/tramite/${origen.slug}`} className="text-sello hover:underline">
      ← Volver a {origen.nombre}
    </Link>
  );
}
