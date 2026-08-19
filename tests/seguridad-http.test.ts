import { describe, expect, it } from "vitest";
import { ipDeCabeceras } from "@/lib/seguridad-http";

function cabeceras(valores: Record<string, string>): Pick<Headers, "get"> {
  return { get: (nombre) => valores[nombre] ?? null };
}

describe("identificador de cliente para límites", () => {
  it("prioriza la cabecera de Vercel y toma el primer proxy", () => {
    expect(
      ipDeCabeceras(
        cabeceras({
          "x-vercel-forwarded-for": "203.0.113.4, 10.0.0.1",
          "x-forwarded-for": "198.51.100.8",
        })
      )
    ).toBe("203.0.113.4");
  });

  it("no convierte texto arbitrario en una clave distinta", () => {
    expect(ipDeCabeceras(cabeceras({ "x-forwarded-for": "usuario-controlado" }))).toBe(
      "desconocida"
    );
  });
});
