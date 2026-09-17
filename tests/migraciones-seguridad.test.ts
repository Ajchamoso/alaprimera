import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rlsFamilias = readFileSync(
  new URL(
    "../supabase/migrations/20260917190000_rls_prerequisitos_por_familia.sql",
    import.meta.url
  ),
  "utf8"
);

const migracion = readFileSync(
  new URL(
    "../supabase/migrations/20260819192051_seguridad_datos_y_rls.sql",
    import.meta.url
  ),
  "utf8"
);

describe("migración de seguridad de datos", () => {
  it("impide que borrar catálogo arrastre datos de usuario", () => {
    expect(migracion).toMatch(
      /checklists_tramite_id_fkey[\s\S]*?references public\.tramites\(id\) on delete restrict/i
    );
    expect(migracion).toMatch(
      /reportes_tramite_id_fkey[\s\S]*?references public\.tramites\(id\) on delete restrict/i
    );
  });

  it("las tablas hijas no conservan políticas de lectura universal", () => {
    expect(migracion).not.toMatch(/create policy [^;]+ for select using \(true\)/i);
    expect(migracion).toMatch(/preguntas_publicadas[\s\S]*?estado = 'publicada'/i);
    expect(migracion).toMatch(/requisitos_publicados[\s\S]*?estado = 'publicada'/i);
  });

  it("las funciones sensibles tienen search_path fijo y no son públicas", () => {
    for (const nombre of ["private.es_curadora", "public.guarda_checklists"]) {
      const inicio = migracion.indexOf(`function ${nombre}`);
      const fin = migracion.indexOf("$$;", inicio);
      const definicion = migracion.slice(inicio, fin);
      expect(inicio, nombre).toBeGreaterThanOrEqual(0);
      expect(definicion, nombre).toContain("set search_path = ''");
    }

    expect(migracion).toMatch(
      /revoke all on function public\.guarda_checklists\(uuid, jsonb\) from public, anon, authenticated/i
    );
  });
});

/**
 * Una política de lectura puede "romper" una feature sin que falle ningún test:
 * la fila simplemente no llega y la UI enseña menos de lo que debería. Pasó el
 * 17/09 con los prerrequisitos por familia, y en producción: `dni-primera-vez`
 * dejó de mostrar el empadronamiento entre sus trámites escondidos porque la
 * política exigía que `requiere_tramite_id` fuese un trámite publicado, y en un
 * destino por familia ese campo es NULL.
 */
describe("lectura de prerrequisitos por familia", () => {
  it("la política admite el destino por familia, donde no hay ficha que comprobar", () => {
    expect(rlsFamilias).toMatch(/prerequisitos\.requiere_tramite_id is null\s*\n?\s*or exists/i);
  });

  it("sigue exigiendo que la ficha destino esté publicada cuando la hay", () => {
    expect(rlsFamilias).toMatch(/requerido\.estado = 'publicada'/i);
  });

  it("sigue atada al trámite de origen publicado", () => {
    expect(rlsFamilias).toMatch(/origen\.estado = 'publicada'/i);
  });
});
