import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { esConexionLocal, exigePermisoParaSeed } from "@/scripts/seguridad-seed";

describe("seguridad del seed", () => {
  it("permite los destinos locales habituales", () => {
    expect(esConexionLocal("postgresql://postgres:postgres@127.0.0.1:54322/postgres")).toBe(true);
    expect(esConexionLocal("postgres://postgres:postgres@localhost:5432/postgres")).toBe(true);
    expect(esConexionLocal("postgres://postgres:postgres@[::1]:5432/postgres")).toBe(true);
  });

  it("bloquea un destino remoto salvo confirmación explícita", () => {
    const remota = "postgresql://postgres:secreto@db.proyecto.supabase.co:5432/postgres";

    expect(() => exigePermisoParaSeed(remota)).toThrow(/Seed remoto bloqueado/);
    expect(() => exigePermisoParaSeed(remota, "SI")).toThrow(/Seed remoto bloqueado/);
    expect(() => exigePermisoParaSeed(remota, "si")).not.toThrow();
  });

  it("nunca borra las filas padre de tramites", () => {
    const codigo = readFileSync(new URL("../scripts/seed-db.ts", import.meta.url), "utf8");
    expect(codigo).not.toMatch(/delete\s+from\s+tramites\b/i);
  });
});
