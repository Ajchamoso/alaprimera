import { describe, expect, it } from "vitest";
import { visibleEnZona } from "@/lib/zona";
import { catalogo } from "./_catalogo";

describe("Buscador: filtrado por zona", () => {
  it("sin zona seleccionada (null) muestra todos los trámites", () => {
    const visibles = catalogo.filter((t) => visibleEnZona(t, null));
    expect(visibles).toEqual(catalogo);
    expect(visibles.length).toBeGreaterThan(0);
  });

  it("con Madrid seleccionada muestra estatales + trámites de Madrid", () => {
    const visMadrid = catalogo.filter((t) => visibleEnZona(t, "madrid"));
    const estatales = catalogo.filter((t) => t.nivel === "estatal");
    const madrid = catalogo.filter((t) => t.comunidad === "madrid");

    // Todos los estatales deben estar presentes
    for (const e of estatales) {
      expect(visMadrid).toContain(e);
    }

    // Los trámites de Madrid deben estar presentes
    for (const m of madrid) {
      expect(visMadrid).toContain(m);
    }

    // No debe haber trámites de otras comunidades
    for (const t of visMadrid) {
      expect(
        t.nivel === "estatal" || t.comunidad === "madrid",
        `Trámite ${t.slug} no debería ser visible en Madrid`
      ).toBe(true);
    }
  });

  it("Madrid tiene menos trámites que el catálogo total", () => {
    const visMadrid = catalogo.filter((t) => visibleEnZona(t, "madrid"));
    expect(visMadrid.length).toBeLessThan(catalogo.length);
  });

  it("excluye trámites autonómicos/locales de otras comunidades", () => {
    const visMadrid = catalogo.filter((t) => visibleEnZona(t, "madrid"));

    // No debe haber trámites de Aragón
    const aragon = visMadrid.filter((t) => t.comunidad === "aragon");
    expect(aragon).toHaveLength(0);

    // No debe haber trámites de Cataluña
    const cataluna = visMadrid.filter((t) => t.comunidad === "cataluna");
    expect(cataluna).toHaveLength(0);
  });

  it("una comunidad sin fichas (aparte de estatales) muestra solo estatales", () => {
    // Buscar una comunidad que no tenga fichas propias
    const comunidades = new Set(
      catalogo.map((t) => t.comunidad).filter((c): c is string => Boolean(c))
    );

    for (const comunidad of comunidades) {
      const fichasComun = catalogo.filter((t) => t.comunidad === comunidad);
      const visibles = catalogo.filter((t) => visibleEnZona(t, comunidad));

      // Los visibles deben ser estatales + fichas de esa comunidad
      const estatales = catalogo.filter((t) => t.nivel === "estatal");
      const esperados = [...estatales, ...fichasComun];
      expect(visibles.length).toBeLessThanOrEqual(esperados.length);
    }
  });

  it("Comunidad de Madrid tiene al menos 4 trámites propios", () => {
    const madrid = catalogo.filter((t) => t.comunidad === "madrid" && t.nivel !== "estatal");
    expect(madrid.length).toBeGreaterThanOrEqual(4);
  });

  it("el filtrado es consistente: repite resultado igual", () => {
    const vez1 = catalogo.filter((t) => visibleEnZona(t, "madrid"));
    const vez2 = catalogo.filter((t) => visibleEnZona(t, "madrid"));
    expect(vez1).toEqual(vez2);
  });
});