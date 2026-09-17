import { describe, expect, it } from "vitest";
import { getCadena, type Eslabon } from "@/lib/data";
import { catalogo } from "./_catalogo";

const bySlug = (slug: string) => {
  const t = catalogo.find((x) => x.slug === slug);
  if (!t) throw new Error(`ficha de prueba ausente: ${slug}`);
  return t;
};

/** Los slugs de los eslabones que sí tienen ficha que enlazar. */
const fichas = (cadena: Eslabon[]): string[] =>
  cadena.flatMap((e) => (e.tipo === "ficha" ? [e.tramite.slug] : []));

/**
 * "Este trámite esconde otros trámites": getCadena resuelve la cadena de
 * prerrequisitos para la zona de quien lee. El caso demo del proyecto es el
 * primer DNI, que arrastra el certificado de nacimiento y el empadronamiento.
 */
describe("getCadena: prerrequisitos encadenados", () => {
  it("el primer DNI destapa el certificado de nacimiento y el empadronamiento de TU zona", () => {
    const enMadrid = getCadena(bySlug("dni-primera-vez"), catalogo, "madrid");
    expect(fichas(enMadrid)).toContain("certificado-nacimiento");
    expect(fichas(enMadrid)).toContain("empadronamiento-madrid");

    const enAragon = getCadena(bySlug("dni-primera-vez"), catalogo, "aragon");
    expect(fichas(enAragon)).toContain("certificado-nacimiento");
    expect(fichas(enAragon)).toContain("empadronamiento-zaragoza");
    expect(fichas(enAragon), "le coló el ayuntamiento de otra comunidad").not.toContain(
      "empadronamiento-madrid"
    );
  });

  it("sin ficha del territorio se nombra el trámite, pero sin enlace que engañe", () => {
    const enExtremadura = getCadena(bySlug("dni-primera-vez"), catalogo, "extremadura");
    expect(fichas(enExtremadura)).toEqual(["certificado-nacimiento"]);
    expect(enExtremadura.some((e) => e.tipo === "sin-ficha" && e.familia === "empadronamiento")).toBe(
      true
    );
  });

  it("sin zona elegida tampoco se enlaza el ayuntamiento de nadie", () => {
    const sinZona = getCadena(bySlug("dni-primera-vez"), catalogo, null);
    expect(fichas(sinZona)).not.toContain("empadronamiento-madrid");
    expect(sinZona.some((e) => e.tipo === "sin-ficha")).toBe(true);
  });

  it("un trámite sin prerrequisitos tiene cadena vacía", () => {
    expect(getCadena(bySlug("renovacion-dni"), catalogo, "madrid")).toHaveLength(0);
  });

  it("resuelve sin duplicar ni colgarse aunque haya prerrequisitos compartidos", () => {
    for (const zona of ["madrid", "aragon", "extremadura", null]) {
      for (const t of catalogo) {
        const slugs = fichas(getCadena(t, catalogo, zona));
        expect(new Set(slugs).size, `${t.slug} · cadena con duplicados (${zona})`).toBe(slugs.length);
        expect(slugs, `${t.slug} · se incluye a sí mismo (${zona})`).not.toContain(t.slug);
      }
    }
  });

  it("nunca enlaza una ficha de otra comunidad, mire quien mire", () => {
    for (const zona of ["madrid", "aragon", "extremadura"]) {
      for (const t of catalogo) {
        for (const e of getCadena(t, catalogo, zona)) {
          if (e.tipo !== "ficha" || e.tramite.nivel === "estatal") continue;
          expect(
            e.tramite.comunidad,
            `desde ${t.slug}, quien es de ${zona} ve ${e.tramite.slug} (de ${e.tramite.comunidad})`
          ).toBe(zona);
        }
      }
    }
  });
});
