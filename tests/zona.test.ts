import { describe, expect, it } from "vitest";
import type { Tramite } from "@/lib/types";
import { resuelvePrevioEnZona, visibleEnZona } from "@/lib/zona";
import { familias } from "@/lib/data/familias";
import { catalogo } from "./_catalogo";

/**
 * El aislamiento territorial es una promesa de honestidad: alguien de Aragón no
 * puede ver la ficha de Madrid como si fuera la suya. Si un cambio rompe el
 * filtro, este test lo caza antes de que un usuario vea contenido que no le sirve.
 */
describe("visibleEnZona: aislamiento territorial", () => {
  const visibles = (zona: string | null) => catalogo.filter((t) => visibleEnZona(t, zona));

  it("un usuario de Aragón nunca ve fichas de otra comunidad", () => {
    const vistas = visibles("aragon");
    for (const t of vistas) {
      const ok = t.nivel === "estatal" || t.comunidad === "aragon";
      expect(ok, `${t.slug} · visible en Aragón sin ser suya (comunidad=${t.comunidad})`).toBe(true);
    }
    expect(vistas.some((t) => t.comunidad === "madrid"), "coló una de Madrid").toBe(false);
  });

  it("un usuario de Madrid nunca ve fichas de otra comunidad", () => {
    const vistas = visibles("madrid");
    for (const t of vistas) {
      const ok = t.nivel === "estatal" || t.comunidad === "madrid";
      expect(ok, `${t.slug} · visible en Madrid sin ser suya (comunidad=${t.comunidad})`).toBe(true);
    }
    expect(vistas.some((t) => t.comunidad === "aragon"), "coló una de Aragón").toBe(false);
  });

  it("las estatales las ve todo el mundo, elija la zona que elija", () => {
    const estatales = catalogo.filter((t) => t.nivel === "estatal");
    for (const zona of ["madrid", "aragon", "galicia", null]) {
      for (const t of estatales) {
        expect(visibleEnZona(t, zona), `${t.slug} · oculta en zona ${zona}`).toBe(true);
      }
    }
  });

  it("sin zona elegida (null) se muestra todo, para invitar a elegir", () => {
    expect(visibles(null).length).toBe(catalogo.length);
  });

  it("elegir una comunidad sin fichas propias deja ver solo las estatales", () => {
    const vistas = visibles("galicia"); // no tenemos fichas de Galicia
    expect(vistas.every((t) => t.nivel === "estatal"), "Galicia ve algo no estatal").toBe(true);
    expect(vistas.length, "Galicia no ve ni las estatales").toBeGreaterThan(0);
  });
});

/**
 * La invariante que faltaba, y por la que se coló el fallo de la auditoría del
 * 17/09: `visibleEnZona` filtraba bien el catálogo, pero las CADENAS de trámites
 * previos no pasaban por ningún filtro. `dni-primera-vez` (estatal, verificada)
 * enlazaba en duro a `empadronamiento-madrid`, así que a alguien de Zaragoza le
 * decía "Empadronarse en Madrid" teniendo su ficha en el catálogo.
 */
describe("los enlaces a trámites previos no cruzan territorios", () => {
  const destinos = (t: Tramite): string[] =>
    [
      ...t.prerequisitos.map((p) => p.slug),
      ...t.requisitos.map((r) => r.tramitePrevioSlug),
    ].filter((s): s is string => Boolean(s));

  it("ninguna ficha enlaza a una ficha de otra comunidad", () => {
    for (const t of catalogo) {
      for (const slug of destinos(t)) {
        const previo = catalogo.find((x) => x.slug === slug);
        if (!previo || previo.nivel === "estatal") continue;
        expect(
          previo.comunidad,
          `${t.slug} (${t.nivel}, ${t.comunidad ?? "sin comunidad"}) enlaza a ${slug}, que es de ${previo.comunidad}`
        ).toBe(t.comunidad);
      }
    }
  });

  it("toda familia nombrada como trámite previo existe en el registro", () => {
    // Sin entrada en familias.ts no hay forma de nombrarla cuando falta la ficha.
    for (const t of catalogo) {
      const usadas = [
        ...t.prerequisitos.map((p) => p.familia),
        ...t.requisitos.map((r) => r.tramitePrevioFamilia),
      ].filter((f): f is string => Boolean(f));
      for (const f of usadas) {
        expect(familias[f], `${t.slug} usa la familia "${f}", que no está en familias.ts`).
          toBeDefined();
      }
    }
  });

  it("toda familia del registro tiene al menos una ficha que la encarne", () => {
    for (const codigo of Object.keys(familias)) {
      expect(
        catalogo.some((t) => t.familia === codigo),
        `la familia "${codigo}" no la declara ninguna ficha`
      ).toBe(true);
    }
  });

  it("un prerrequisito apunta a una ficha o a una familia, nunca a las dos ni a ninguna", () => {
    for (const t of catalogo) {
      for (const p of t.prerequisitos) {
        expect(
          Boolean(p.slug) !== Boolean(p.familia),
          `${t.slug} · prerrequisito ambiguo (slug=${p.slug}, familia=${p.familia})`
        ).toBe(true);
      }
    }
  });
});

describe("resuelvePrevioEnZona: a cada quien la ficha de su tierra", () => {
  it("una estatal vale para todo el mundo, con zona o sin ella", () => {
    for (const zona of ["aragon", "madrid", "extremadura", null]) {
      const r = resuelvePrevioEnZona("certificado-nacimiento", zona, catalogo);
      expect(r?.slug).toBe("certificado-nacimiento");
    }
  });

  it("a quien es de Aragón le da la de Aragón, no la de Madrid", () => {
    const r = resuelvePrevioEnZona("empadronamiento-madrid", "aragon", catalogo);
    expect(r?.slug).toBe("empadronamiento-zaragoza");
  });

  it("a quien es de Madrid le deja la de Madrid", () => {
    const r = resuelvePrevioEnZona("empadronamiento-madrid", "madrid", catalogo);
    expect(r?.slug).toBe("empadronamiento-madrid");
  });

  it("a una comunidad sin ficha propia no le enseña la de otra: prefiere no enlazar", () => {
    expect(resuelvePrevioEnZona("empadronamiento-madrid", "extremadura", catalogo)).toBeNull();
  });

  it("sin zona elegida tampoco enlaza una ficha territorial: no sabemos de dónde es", () => {
    expect(resuelvePrevioEnZona("empadronamiento-madrid", null, catalogo)).toBeNull();
  });

  it("un slug que no existe no rompe nada", () => {
    expect(resuelvePrevioEnZona("no-existe", "madrid", catalogo)).toBeNull();
  });
});
