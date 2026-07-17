import { describe, expect, it } from "vitest";
import { visibleEnZona } from "@/lib/zona";
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
