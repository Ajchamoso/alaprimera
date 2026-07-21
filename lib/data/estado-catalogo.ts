import { tramites } from "./tramites";
import { pendientes } from "./pendientes";
import { verificadaEn } from "./verificaciones";
import { hechosVitales, hechoVitalDeFicha } from "./hechos-vitales";
import { nombreComunidad } from "./comunidades";

/**
 * Genera el estado del catálogo en Markdown a partir de los datos (fichas,
 * pendientes, registro de verificación, taxonomía). Función pura y determinista:
 * el mismo catálogo da siempre el mismo texto, SIN fecha —así un test puede
 * comparar la salida con el fichero en disco y cazar la deriva.
 *
 * Lo escribe `npm run docs`; lo vigila tests/docs.test.ts. No se edita a mano.
 */

const zonaDe = (nivel: string, comunidad?: string): string =>
  nivel === "estatal" ? "España" : (nombreComunidad(comunidad ?? "") ?? "—");

export function generaEstadoCatalogo(): string {
  const reales = [...tramites].sort((a, b) => a.slug.localeCompare(b.slug, "es"));
  const verificadas = reales.filter((t) => verificadaEn(t.slug) !== null);

  const L: string[] = [];
  L.push("# Estado del catálogo");
  L.push("");
  L.push("> Generado por `npm run docs` desde los datos. **No editar a mano**: los cambios se");
  L.push("> pierden al regenerar. Si añades o curas una ficha, corre `npm run docs` y commitea el");
  L.push("> resultado (un test lo exige). La verdad de cada sello vive en `lib/data/verificaciones.ts`.");
  L.push("");

  // ── Resumen ──
  L.push("## Resumen");
  L.push("");
  L.push(`- **Fichas**: ${reales.length} (${verificadas.length} verificadas, ${reales.length - verificadas.length} por verificar)`);
  L.push(`- **Pendientes** (backlog sin ficha): ${pendientes.length}`);
  L.push(`- **Total de entradas del catálogo**: ${reales.length + pendientes.length}`);
  L.push("");

  // ── Por hecho vital ──
  L.push("## Por hecho vital");
  L.push("");
  L.push("| Hecho vital | Fichas | Verificadas | Pendientes |");
  L.push("|---|--:|--:|--:|");
  let tf = 0, tv = 0, tp = 0;
  for (const hv of hechosVitales) {
    const fichas = reales.filter((t) => hechoVitalDeFicha[t.slug] === hv.codigo);
    const verif = fichas.filter((t) => verificadaEn(t.slug) !== null).length;
    const pend = pendientes.filter((p) => p.hechoVital === hv.codigo).length;
    tf += fichas.length; tv += verif; tp += pend;
    L.push(`| ${hv.etiqueta} | ${fichas.length} | ${verif} | ${pend} |`);
  }
  L.push(`| **Total** | **${tf}** | **${tv}** | **${tp}** |`);
  L.push("");

  // ── Detalle de fichas ──
  L.push("## Fichas");
  L.push("");
  L.push("| Slug | Trámite | Nivel | Zona | Verificada |");
  L.push("|---|---|---|---|---|");
  for (const t of reales) {
    const fecha = verificadaEn(t.slug);
    const sello = fecha ?? "— por verificar";
    L.push(`| \`${t.slug}\` | ${t.nombreColoquial} | ${t.nivel} | ${zonaDe(t.nivel, t.comunidad)} | ${sello} |`);
  }
  L.push("");

  // ── Pendientes ──
  L.push("## Pendientes (backlog)");
  L.push("");
  L.push("Cada uno existe pero aún no tiene ficha; se cura con `/preparar-ficha`. Agrupados por hecho vital:");
  L.push("");
  for (const hv of hechosVitales) {
    const pend = pendientes
      .filter((p) => p.hechoVital === hv.codigo)
      .map((p) => `\`${p.slug}\``)
      .sort((a, b) => a.localeCompare(b, "es"));
    if (pend.length > 0) L.push(`- **${hv.etiqueta}**: ${pend.join(", ")}`);
  }
  L.push("");

  return L.join("\n");
}
