import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  new URL("../supabase/migrations/20260819194046_peticiones_catalogo.sql", import.meta.url),
  "utf8"
);

describe("migración de peticiones del catálogo", () => {
  it("nace con RLS y sin escritura desde roles públicos", () => {
    expect(sql).toMatch(/alter table public\.peticiones_catalogo enable row level security/i);
    expect(sql).toMatch(
      /revoke all on table public\.peticiones_catalogo from anon, authenticated/i
    );
    expect(sql).not.toMatch(/grant insert[^;]+to (anon|authenticated)/i);
  });
});
