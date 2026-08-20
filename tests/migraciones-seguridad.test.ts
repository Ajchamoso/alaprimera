import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

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
