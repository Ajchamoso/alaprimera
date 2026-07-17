/**
 * Sella una ficha: la persona que la ha cotejado contra su fuente oficial la
 * da por buena.
 *
 * Escribe en el registro (lib/data/verificaciones.ts) y vuelca a BD. El registro
 * va a git, así que el historial de commits queda como prueba de quién selló qué
 * y cuándo — y ningún seed posterior se lo lleva por delante.
 *
 * Uso:  npm run verificar <slug>          (fecha de hoy)
 *       npm run verificar <slug> quitar   (retirar el sello)
 *
 * "quitar" va suelto, sin guiones: npm se traga los flags con guion si no le
 * pones "--" delante, y esto es lo que la gente va a teclear de verdad.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { tramites } from "../lib/data/tramites";
import { verificaciones } from "../lib/data/verificaciones";

const REGISTRO = "lib/data/verificaciones.ts";

function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function main() {
  const [slug, ...flags] = process.argv.slice(2);
  const quitar = flags.includes("quitar") || flags.includes("--quitar");

  if (!slug) {
    console.error("Uso: npm run verificar <slug> [quitar]\n");
    console.error("Fichas del catálogo:");
    for (const t of tramites) {
      const estado = verificaciones[t.slug] ? `✓ ${verificaciones[t.slug]}` : "sin verificar";
      console.error(`  ${t.slug.padEnd(28)} ${estado}`);
    }
    process.exit(1);
  }

  const ficha = tramites.find((t) => t.slug === slug);
  if (!ficha) {
    console.error(`No existe la ficha "${slug}". Lanza sin argumentos para ver el catálogo.`);
    process.exit(1);
  }

  const nuevas = { ...verificaciones };
  if (!quitar && verificaciones[slug] === hoyISO()) {
    console.log(`\n🖃 "${ficha.nombreColoquial}" ya estaba sellada hoy (${hoyISO()}). Nada que hacer.\n`);
    return;
  }
  if (quitar) {
    if (!(slug in nuevas)) {
      console.error(`"${slug}" no estaba verificada. Nada que hacer.`);
      process.exit(1);
    }
    delete nuevas[slug];
  } else {
    nuevas[slug] = hoyISO();
  }

  // Reescribe solo el objeto del registro; los comentarios y las funciones no se tocan.
  const entradas = Object.entries(nuevas)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([s, fecha]) => `  "${s}": "${fecha}",`)
    .join("\n");
  const cuerpo =
    entradas.length > 0
      ? entradas
      : '  // "renovacion-dni": "2026-07-17",';

  const original = readFileSync(REGISTRO, "utf8");
  // Ojo: comprobar si el bloque existe, NO si el texto cambió. Sellar dos veces
  // el mismo día produce un texto idéntico, y eso no es un fallo de formato.
  const bloque = /export const verificaciones: Record<string, string> = \{[\s\S]*?\n\};/;
  if (!bloque.test(original)) {
    console.error(`No encuentro el registro dentro de ${REGISTRO}: ¿cambió su formato?`);
    process.exit(1);
  }
  writeFileSync(
    REGISTRO,
    original.replace(bloque, `export const verificaciones: Record<string, string> = {\n${cuerpo}\n};`)
  );

  console.log(
    quitar
      ? `\n🔓 Sello retirado de "${ficha.nombreColoquial}". Vuelve a salir como sin verificar.`
      : `\n🖃 Sellada: "${ficha.nombreColoquial}" · verificada el ${nuevas[slug]}`
  );

  // A BD, para que se vea ya.
  if (process.env.DATABASE_URL) {
    console.log("   Volcando a la base de datos…");
    execSync("npx tsx scripts/seed-db.ts", { stdio: "pipe" });
    console.log("   Hecho: la app ya la muestra sellada.");
  } else {
    console.log("   (sin DATABASE_URL: lanza `npm run db:seed` para que la app lo refleje)");
  }

  const sinVerificar = tramites.filter((t) => !(t.slug in nuevas)).length;
  console.log(
    `\n   Catálogo: ${tramites.length - sinVerificar} de ${tramites.length} verificadas.` +
      (sinVerificar > 0 ? ` Quedan ${sinVerificar}.` : " ¡Todas! 🎉")
  );
  console.log(`   No olvides commitear ${REGISTRO}: es la prueba de quién selló qué.\n`);
}

main();
