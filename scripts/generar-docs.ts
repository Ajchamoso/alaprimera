import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generaEstadoCatalogo } from "../lib/data/estado-catalogo";

/**
 * Escribe docs/estado-catalogo.md desde los datos.
 *   npm run docs          → (re)genera el fichero
 *   npm run docs:check    → falla si el fichero en disco no está al día (para CI)
 */

const destino = fileURLToPath(new URL("../docs/estado-catalogo.md", import.meta.url));
const generado = generaEstadoCatalogo() + "\n";
const comprobar = process.argv.includes("--check");

if (comprobar) {
  let actual = "";
  try {
    actual = readFileSync(destino, "utf8");
  } catch {
    actual = "";
  }
  if (actual !== generado) {
    console.error(
      "docs/estado-catalogo.md está desactualizado. Corre `npm run docs` y commitea el resultado."
    );
    process.exit(1);
  }
  console.log("docs/estado-catalogo.md está al día.");
} else {
  writeFileSync(destino, generado);
  console.log("docs/estado-catalogo.md regenerado.");
}
