import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generaEstadoCatalogo } from "@/lib/data/estado-catalogo";

/**
 * La documentación del estado del catálogo se genera desde los datos, así que no
 * puede desincronizarse... salvo que alguien añada una ficha y olvide regenerar.
 * Este test es ese candado: si el fichero en disco no coincide con lo que sale de
 * los datos, falla y pide `npm run docs`. (Antes el recuento se llevaba a mano y
 * ya se quedó desfasado: "15" cuando ya eran 16.)
 */
describe("docs/estado-catalogo.md se mantiene al día", () => {
  const ruta = fileURLToPath(new URL("../docs/estado-catalogo.md", import.meta.url));

  it("coincide con lo generado desde los datos (si falla: npm run docs)", () => {
    const enDisco = readFileSync(ruta, "utf8");
    expect(enDisco).toBe(generaEstadoCatalogo() + "\n");
  });
});
