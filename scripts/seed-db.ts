/**
 * Vuelca el seed local (lib/data/tramites.ts) a la base de datos.
 * Idempotente: borra y reinserta cada trámite del seed por id.
 *
 * Uso: DATABASE_URL=... npm run db:seed
 */
import { Client } from "pg";
import { tramites } from "../lib/data/tramites";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL");
  const db = new Client({ connectionString: url });
  await db.connect();

  try {
    await db.query("begin");

    const ids = tramites.map((t) => t.slug);
    await db.query("delete from tramites where id = any($1)", [ids]);

    for (const t of tramites) {
      await db.query(
        `insert into tramites (id, nombre_oficial, nombre_coloquial, descripcion, organismo,
           territorio, canales, url_fuente, url_cita_previa, estado, verificada_en,
           generada_por_ia, alias)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'publicada',$10,$11,$12)`,
        [
          t.slug,
          t.nombreOficial,
          t.nombreColoquial,
          t.descripcion,
          t.organismo,
          t.territorio,
          t.canales,
          t.urlFuente,
          t.urlCitaPrevia ?? null,
          t.verificadaEn,
          t.generadaPorIa,
          t.alias,
        ]
      );

      for (const p of t.preguntas) {
        await db.query(
          "insert into preguntas (id, tramite_id, orden, texto, tipo) values ($1,$2,$3,$4,$5)",
          [p.id, t.slug, p.orden, p.texto, p.tipo]
        );
        for (const o of p.opciones) {
          await db.query(
            `insert into opciones (id, pregunta_id, texto, veredicto_inviable, texto_alternativas)
             values ($1,$2,$3,$4,$5)`,
            [o.id, p.id, o.texto, o.veredictoInviable ?? false, o.textoAlternativas ?? null]
          );
        }
      }

      for (const [i, r] of t.requisitos.entries()) {
        await db.query(
          `insert into requisitos (id, tramite_id, tipo, titulo, explicacion, canal, tramite_previo_id, orden)
           values ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [r.id, t.slug, r.tipo, r.titulo, r.explicacion, r.canal, r.tramitePrevioSlug ?? null, i]
        );
        for (const opcionId of r.soloSiOpciones ?? []) {
          await db.query(
            "insert into requisito_condiciones (requisito_id, opcion_id) values ($1,$2)",
            [r.id, opcionId]
          );
        }
      }
    }

    // Los prerrequisitos al final: ambos trámites deben existir ya.
    for (const t of tramites) {
      for (const pre of t.prerequisitos) {
        await db.query(
          "insert into prerequisitos (tramite_id, requiere_tramite_id, nota) values ($1,$2,$3)",
          [t.slug, pre.slug, pre.nota ?? null]
        );
      }
    }

    await db.query("commit");
    const { rows } = await db.query(
      "select id, estado, cardinality(alias) as n_alias from tramites order by id"
    );
    console.log("Seed aplicado:", rows);
  } catch (e) {
    await db.query("rollback");
    throw e;
  } finally {
    await db.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
