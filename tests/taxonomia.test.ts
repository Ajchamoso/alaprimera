import { describe, expect, it } from "vitest";
import { hechosVitales, hechoVitalDeFicha } from "@/lib/data/hechos-vitales";
import { comunidades, nombreComunidad, tieneFichas } from "@/lib/data/comunidades";
import { pendientes } from "@/lib/data/pendientes";
import { fichasReales } from "./_catalogo";

const codigosHecho = new Set(hechosVitales.map((h) => h.codigo));

describe("taxonomía por hechos vitales", () => {
  it("cada ficha real está asignada a un hecho vital que existe", () => {
    for (const t of fichasReales) {
      const hv = hechoVitalDeFicha[t.slug];
      expect(hv, `${t.slug} · sin hecho vital en el mapa`).toBeTruthy();
      expect(codigosHecho, `${t.slug} · hecho vital desconocido "${hv}"`).toContain(hv);
    }
  });

  it("cada pendiente apunta a un hecho vital que existe", () => {
    for (const p of pendientes) {
      expect(codigosHecho, `${p.slug} · hecho vital desconocido "${p.hechoVital}"`).toContain(
        p.hechoVital
      );
    }
  });

  it("el mapa no referencia fichas que ya no existen", () => {
    const slugsReales = new Set(fichasReales.map((t) => t.slug));
    for (const slug of Object.keys(hechoVitalDeFicha)) {
      expect(slugsReales, `mapa hecho-vital apunta a ficha inexistente "${slug}"`).toContain(slug);
    }
  });

  it("los códigos de hecho vital son únicos", () => {
    expect(codigosHecho.size).toBe(hechosVitales.length);
  });
});

describe("comunidades", () => {
  it("los códigos son únicos", () => {
    const codigos = comunidades.map((c) => c.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });

  it("tieneFichas es coherente con lo que hay curado", () => {
    expect(tieneFichas("madrid"), "Madrid debería tener fichas").toBe(true);
    expect(tieneFichas("aragon"), "Aragón debería tener fichas").toBe(true);
    expect(tieneFichas("galicia"), "Galicia aún no tiene fichas").toBe(false);
  });

  it("nombreComunidad resuelve códigos y tolera lo desconocido", () => {
    expect(nombreComunidad("aragon")).toBe("Aragón");
    expect(nombreComunidad(null)).toBeNull();
    expect(nombreComunidad("atlantis")).toBeNull();
  });

  it("toda comunidad con fichas es un código real", () => {
    const codigos = new Set(comunidades.map((c) => c.codigo));
    for (const t of fichasReales) {
      if (t.comunidad) {
        expect(codigos, `${t.slug} · comunidad desconocida "${t.comunidad}"`).toContain(t.comunidad);
      }
    }
  });
});
