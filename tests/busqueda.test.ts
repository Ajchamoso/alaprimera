import { describe, expect, it } from "vitest";
import { buscaTramites, normaliza } from "@/lib/data";
import { catalogo } from "./_catalogo";

/**
 * La búsqueda es determinista y sin IA en runtime (FR-002): las mismas palabras
 * dan siempre el mismo resultado. Eso es lo que la hace fiable y testeable.
 */
describe("buscaTramites: coloquial y determinista", () => {
  it("una consulta vacía devuelve el catálogo entero", () => {
    expect(buscaTramites("", catalogo).length).toBe(catalogo.length);
    expect(buscaTramites("   ", catalogo).length).toBe(catalogo.length);
  });

  it("encuentra por alias, no solo por el nombre oficial", () => {
    const r = buscaTramites("registrar bebe", catalogo);
    expect(r.map((t) => t.slug)).toContain("inscripcion-nacimiento");
  });

  it("encuentra por el momento vital, con las palabras de la calle", () => {
    // Se cazó usando la app en el móvil: "he tenido un hijo" no devolvía nada y
    // la app contestaba "aún no tenemos ese trámite" teniéndolo. La ficha habla
    // de "bebé" y de "recién nacido"; la palabra "hijo" solo estaba en el nombre
    // del hecho vital, que la búsqueda no miraba. Decir que no tenemos algo que
    // sí tenemos es la clase de mentira que este proyecto no se permite.
    const r = buscaTramites("he tenido un hijo", catalogo).map((t) => t.slug);
    expect(r).toContain("inscripcion-nacimiento");
  });

  it("el momento vital no arrastra fichas de otros temas", () => {
    const r = buscaTramites("he tenido un hijo", catalogo).map((t) => t.slug);
    expect(r).not.toContain("transferencia-vehiculo");
  });

  it("no cuela coincidencias a mitad de palabra", () => {
    // "tenido" vive dentro de «centros sostenidos con fondos públicos», así que
    // buscar "he tenido un hijo" sacaba la plaza del cole. Las palabras cuentan
    // desde su principio.
    const r = buscaTramites("he tenido un hijo", catalogo).map((t) => t.slug);
    expect(r).not.toContain("admision-escolar-madrid");
  });

  it("sigue encontrando por el principio de la palabra", () => {
    const porSingular = buscaTramites("beca", catalogo).map((t) => t.slug);
    expect(porSingular).toContain("beca-comedor-madrid");
  });

  it("ignora acentos y mayúsculas", () => {
    const conAcento = buscaTramites("empadronamiento", catalogo).map((t) => t.slug);
    const sinAcento = buscaTramites("EMPADRONAMIENTO", catalogo).map((t) => t.slug);
    expect(sinAcento).toEqual(conAcento);
    expect(conAcento.length).toBeGreaterThan(0);
  });

  it("es determinista: dos llamadas iguales, mismo resultado", () => {
    const a = buscaTramites("dni de mi hijo", catalogo).map((t) => t.slug);
    const b = buscaTramites("dni de mi hijo", catalogo).map((t) => t.slug);
    expect(a).toEqual(b);
  });

  it("una consulta sin coincidencias no devuelve nada", () => {
    expect(buscaTramites("zzz-trámite-que-no-existe", catalogo)).toHaveLength(0);
  });

  it("normaliza quita acentos y baja a minúsculas", () => {
    expect(normaliza("Régimen ESPAÑOL")).toBe("regimen espanol");
  });
});
