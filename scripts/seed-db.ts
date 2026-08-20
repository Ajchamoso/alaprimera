/**
 * Vuelca el seed local (lib/data/tramites.ts) a la base de datos.
 * Idempotente: actualiza el catálogo sin borrar sus filas padre ni los datos de usuario.
 *
 * Uso: DATABASE_URL=... npm run db:seed
 * Remoto: PERMITIR_SEED_REMOTO=si DATABASE_URL=... npm run db:seed
 */
import { Client } from "pg";
import { tramites } from "../lib/data/tramites";
import { generadaPorIa, verificadaEn } from "../lib/data/verificaciones";
import { exigePermisoParaSeed } from "./seguridad-seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL");
  exigePermisoParaSeed(url, process.env.PERMITIR_SEED_REMOTO);

  const db = new Client({ connectionString: url });
  await db.connect();

  try {
    await db.query("begin");
    await db.query("set local statement_timeout = '30s'");
    await db.query("set local lock_timeout = '5s'");

    const ids = tramites.map((t) => t.slug);

    // Las filas padre se conservan: checklists, shares, feedback y reportes las referencian.
    // Solo se actualizan los campos cuya fuente de verdad es el catálogo del repositorio.
    for (const t of tramites) {
      await db.query(
        `insert into tramites (id, nombre_oficial, nombre_coloquial, descripcion, organismo,
           nivel, comunidad, territorio, canales, url_fuente, url_cita_previa, estado,
           verificada_en, generada_por_ia, alias, plazo_inicio, plazo_fin, plazo_nota)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'publicada',$12,$13,$14,$15,$16,$17)
         on conflict (id) do update set
           nombre_oficial = excluded.nombre_oficial,
           nombre_coloquial = excluded.nombre_coloquial,
           descripcion = excluded.descripcion,
           organismo = excluded.organismo,
           nivel = excluded.nivel,
           comunidad = excluded.comunidad,
           territorio = excluded.territorio,
           canales = excluded.canales,
           url_fuente = excluded.url_fuente,
           url_cita_previa = excluded.url_cita_previa,
           estado = excluded.estado,
           verificada_en = excluded.verificada_en,
           generada_por_ia = excluded.generada_por_ia,
           alias = excluded.alias,
           plazo_inicio = excluded.plazo_inicio,
           plazo_fin = excluded.plazo_fin,
           plazo_nota = excluded.plazo_nota`,
        [
          t.slug,
          t.nombreOficial,
          t.nombreColoquial,
          t.descripcion,
          t.organismo,
          t.nivel,
          t.comunidad ?? null,
          t.territorio,
          t.canales,
          t.urlFuente,
          t.urlCitaPrevia ?? null,
          verificadaEn(t.slug),
          generadaPorIa(t.slug),
          t.alias,
          t.plazo?.inicio ?? null,
          t.plazo?.fin ?? null,
          t.plazo?.nota ?? null,
        ]
      );
    }

    // Se reemplazan únicamente los hijos que también pertenecen al catálogo.
    // Los trámites que existan solo en BD se conservan y se avisan al terminar.
    await db.query("delete from prerequisitos where tramite_id = any($1::text[])", [ids]);
    await db.query("delete from preguntas where tramite_id = any($1::text[])", [ids]);
    await db.query("delete from requisitos where tramite_id = any($1::text[])", [ids]);

    // Preguntas y opciones (solo dependen de su propio trámite).
    for (const t of tramites) {
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
    }

    // Requisitos y prerrequisitos: apuntan a OTRAS fichas, así que van cuando
    // todas existen.
    for (const t of tramites) {
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
      for (const pre of t.prerequisitos) {
        await db.query(
          "insert into prerequisitos (tramite_id, requiere_tramite_id, nota) values ($1,$2,$3)",
          [t.slug, pre.slug, pre.nota ?? null]
        );
      }
    }

    const { rows: extras } = await db.query<{ id: string }>(
      "select id from tramites where not (id = any($1::text[])) order by id",
      [ids]
    );

    const { rows } = await db.query(
      "select id, estado, cardinality(alias) as n_alias from tramites order by id"
    );
    await db.query("commit");

    console.log("Seed aplicado:", rows);
    if (extras.length > 0) {
      console.warn(
        "Trámites presentes solo en BD, conservados sin cambios:",
        extras.map((fila) => fila.id)
      );
    }
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
