import { describe, expect, it } from "vitest";
import { DIAS_VIGENCIA, formateaFechaEs, selloCaducado } from "@/lib/sello";

const DIA = 24 * 60 * 60 * 1000;
const AHORA = Date.parse("2026-07-17T12:00:00Z");
const haceDias = (n: number) => new Date(AHORA - n * DIA).toISOString();

/**
 * El sello degrada a "puede estar desactualizada" a los 90 días (FR-020). Antes
 * la lógica vivía inline en el componente con Date.now() y no se podía probar;
 * extraída a lib/sello.ts, aquí se fija su comportamiento en los bordes.
 */
describe("selloCaducado (FR-020)", () => {
  it("una ficha sin verificar nunca 'caduca' (es otro estado)", () => {
    expect(selloCaducado(null, AHORA)).toBe(false);
  });

  it("en SSR (ahora = 0) no evalúa caducidad, para no parpadear", () => {
    expect(selloCaducado(haceDias(1000), 0)).toBe(false);
  });

  it("recién verificada no está caducada", () => {
    expect(selloCaducado(haceDias(10), AHORA)).toBe(false);
  });

  it("justo en el día 90 aún es vigente (el umbral es estricto)", () => {
    expect(selloCaducado(haceDias(DIAS_VIGENCIA), AHORA)).toBe(false);
  });

  it("pasados los 90 días, caduca", () => {
    expect(selloCaducado(haceDias(DIAS_VIGENCIA + 1), AHORA)).toBe(true);
    expect(selloCaducado(haceDias(200), AHORA)).toBe(true);
  });
});

describe("formateaFechaEs", () => {
  it("da formato de sello con separadores", () => {
    expect(formateaFechaEs("2026-07-16")).toBe("16 · 07 · 2026");
  });

  it("acepta un ISO completo con hora", () => {
    expect(formateaFechaEs("2026-01-05T09:30:00Z")).toBe("05 · 01 · 2026");
  });
});
