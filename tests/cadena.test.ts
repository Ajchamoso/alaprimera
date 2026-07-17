import { describe, expect, it } from "vitest";
import { getCadena } from "@/lib/data";
import { catalogo } from "./_catalogo";

const bySlug = (slug: string) => {
  const t = catalogo.find((x) => x.slug === slug);
  if (!t) throw new Error(`ficha de prueba ausente: ${slug}`);
  return t;
};

/**
 * "Este trámite esconde otros trámites": getCadena resuelve la cadena de
 * prerrequisitos. El caso demo del proyecto es el primer DNI, que arrastra el
 * certificado de nacimiento y el empadronamiento.
 */
describe("getCadena: prerrequisitos encadenados", () => {
  it("el primer DNI destapa el certificado de nacimiento y el empadronamiento", () => {
    const cadena = getCadena(bySlug("dni-primera-vez"), catalogo).map((c) => c.tramite.slug);
    expect(cadena).toContain("certificado-nacimiento");
    expect(cadena).toContain("empadronamiento-madrid");
  });

  it("un trámite sin prerrequisitos tiene cadena vacía", () => {
    expect(getCadena(bySlug("renovacion-dni"), catalogo)).toHaveLength(0);
  });

  it("resuelve sin duplicar ni colgarse aunque haya prerrequisitos compartidos", () => {
    for (const t of catalogo) {
      const cadena = getCadena(t, catalogo);
      const slugs = cadena.map((c) => c.tramite.slug);
      expect(new Set(slugs).size, `${t.slug} · cadena con duplicados`).toBe(slugs.length);
      expect(slugs, `${t.slug} · se incluye a sí mismo`).not.toContain(t.slug);
    }
  });
});
