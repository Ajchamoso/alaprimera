/**
 * Buzón de señales de deriva: lo que la gente de ahí fuera nos está diciendo
 * sobre el contenido.
 *
 * Dos señales, por orden de valor:
 *  1. Los "no" de "¿salió a la primera?" (FR-017) — alguien acaba de chocar con
 *     la realidad en una ventanilla y nos cuenta qué faltaba. Con el contexto de
 *     su checklist: qué trámite, qué caso, qué canal.
 *  2. Los reportes de error (FR-018) — avisos directos sobre una ficha.
 *
 * Uso: npm run buzon
 */
import { Client } from "pg";

const GRIS = "\x1b[90m";
const ROJO = "\x1b[31m";
const AMBAR = "\x1b[33m";
const VERDE = "\x1b[32m";
const NEGRITA = "\x1b[1m";
const FIN = "\x1b[0m";

function fecha(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL (está en .env.local)");
  const db = new Client({ connectionString: url });
  await db.connect();

  try {
    // ── 1. Los "no": la señal más valiosa ────────────────────────────────────
    const { rows: noes } = await db.query(`
      select f.que_fallo, f.comentario, f.creado_en,
             c.tramite_id, c.nombre, c.canal_elegido, c.respuestas
      from feedback f
      join checklists c on c.id = f.checklist_id
      where f.salio_a_la_primera = false
      order by f.creado_en desc
    `);

    console.log(`\n${NEGRITA}📮 Buzón de A la Primera${FIN}\n`);
    console.log(`${NEGRITA}${noes.length > 0 ? ROJO : VERDE}❌ No salió a la primera: ${noes.length}${FIN}`);
    if (noes.length === 0) {
      console.log(`${GRIS}   Nadie ha dicho que le frenara algo. Buena señal (o poco uso).${FIN}`);
    }
    for (const n of noes) {
      console.log(`\n   ${NEGRITA}${n.tramite_id}${FIN} ${GRIS}· «${n.nombre}» · ${n.canal_elegido ?? "sin canal"} · ${fecha(n.creado_en)}${FIN}`);
      if (n.que_fallo) console.log(`   ${ROJO}▸ Le frenó:${FIN} ${n.que_fallo}`);
      if (n.comentario) console.log(`   ${GRIS}▸ ${n.comentario}${FIN}`);
      const respuestas = Object.values(n.respuestas ?? {});
      if (respuestas.length > 0) console.log(`   ${GRIS}▸ Su caso: ${respuestas.join(" · ")}${FIN}`);
    }

    // ── 2. Reportes de error pendientes ──────────────────────────────────────
    const { rows: reportes } = await db.query(`
      select tramite_id, descripcion, creado_en
      from reportes where estado = 'pendiente'
      order by creado_en desc
    `);

    console.log(`\n${NEGRITA}${reportes.length > 0 ? AMBAR : VERDE}⚠️  Reportes de error pendientes: ${reportes.length}${FIN}`);
    if (reportes.length === 0) console.log(`${GRIS}   Ninguno.${FIN}`);
    for (const r of reportes) {
      console.log(`\n   ${NEGRITA}${r.tramite_id}${FIN} ${GRIS}· ${fecha(r.creado_en)}${FIN}`);
      console.log(`   ${AMBAR}▸${FIN} ${r.descripcion}`);
    }

    // ── 3. Estado del sello: qué fichas piden revisión ───────────────────────
    const { rows: fichas } = await db.query(`
      select id, verificada_en, generada_por_ia,
             (verificada_en is not null and now() - verificada_en > interval '90 days') as caducada
      from tramites where estado = 'publicada' order by verificada_en nulls first, id
    `);
    const sinVerificar = fichas.filter((f) => f.verificada_en === null);
    const caducadas = fichas.filter((f) => f.caducada);
    const alDia = fichas.filter((f) => f.verificada_en !== null && !f.caducada);

    console.log(`\n${NEGRITA}🏷️  Sello del catálogo${FIN} ${GRIS}(${fichas.length} fichas publicadas)${FIN}`);
    console.log(`   ${VERDE}✅ Al día: ${alDia.length}${FIN}`);
    if (caducadas.length > 0) {
      console.log(`   ${AMBAR}⚠️  Caducadas (+90 días): ${caducadas.length}${FIN} ${GRIS}${caducadas.map((f) => f.id).join(", ")}${FIN}`);
    }
    if (sinVerificar.length > 0) {
      console.log(`   ${ROJO}🤖 Sin verificar: ${sinVerificar.length}${FIN} ${GRIS}${sinVerificar.map((f) => f.id).join(", ")}${FIN}`);
    }

    // ── 4. Qué hacer ─────────────────────────────────────────────────────────
    const aRevisar = [
      ...new Set([
        ...noes.map((n) => n.tramite_id),
        ...reportes.map((r) => r.tramite_id),
        ...caducadas.map((f) => f.id),
        ...sinVerificar.map((f) => f.id),
      ]),
    ];
    if (aRevisar.length > 0) {
      console.log(`\n${NEGRITA}👉 Fichas que piden una mirada${FIN} ${GRIS}(por orden de urgencia)${FIN}`);
      for (const id of aRevisar.slice(0, 5)) {
        console.log(`   ${GRIS}/preparar-ficha revisa la ficha de${FIN} ${id}`);
      }
      if (aRevisar.length > 5) console.log(`   ${GRIS}… y ${aRevisar.length - 5} más${FIN}`);
    } else {
      console.log(`\n${VERDE}Todo en orden.${FIN}`);
    }
    console.log();
  } finally {
    await db.end();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
