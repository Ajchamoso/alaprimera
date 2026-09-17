import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { tramites } from "@/lib/data/tramites";

/**
 * EL CANDADO DEL TROCEADO
 *
 * `tramites.ts` era un fichero de 2.680 líneas y se partió en uno por ficha
 * (17/09). Mover 22 fichas de sitio es mecánico, y justo por eso el fallo
 * probable no es un error de compilación: es perder una ficha, un requisito o un
 * campo por el camino sin que nada chille.
 *
 * Este test fija la huella del catálogo ANTES de mover nada. Si el troceado
 * cambió aunque sea una coma de contenido, el hash no cuadra.
 *
 * Qué hacer si falla:
 * - Estás moviendo ficheros y no debías cambiar contenido → has perdido algo.
 * - Estás curando una ficha de verdad (añadir, corregir, retirar un requisito) →
 *   entonces el cambio es legítimo: actualiza HUELLA con el valor que imprime el
 *   error, en el mismo commit que la curación, para que se vea en la revisión.
 */

/** Huella estable del catálogo: no depende del orden del array ni de las claves. */
function huella(): string {
  const normalizada = [...tramites]
    .map((t) => JSON.stringify(t, Object.keys(t).sort()))
    .sort()
    .join("\n");
  return createHash("sha256").update(normalizada).digest("hex");
}

const HUELLA = "0a1818dac8a5b1bda97ab58abdeac53c8c147079480d1da46bb45ee6400f6d16";

describe("instantánea del catálogo", () => {
  it("el contenido de las fichas no ha cambiado", () => {
    expect(huella(), `huella actual: ${huella()}`).toBe(HUELLA);
  });

  it("siguen estando todas las fichas, con el mismo recuento de partes", () => {
    const resumen = [...tramites]
      .map((t) => `${t.slug}:${t.requisitos.length}/${t.preguntas.length}/${t.prerequisitos.length}`)
      .sort();
    expect(resumen.length).toBe(22);
    expect(resumen).toMatchSnapshot();
  });
});
