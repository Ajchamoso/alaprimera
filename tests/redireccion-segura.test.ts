import { describe, expect, it } from "vitest";
import { destinoSeguro } from "@/lib/redireccion-segura";

describe("destino del callback de acceso", () => {
  it("conserva rutas internas con consulta", () => {
    expect(destinoSeguro("/cuenta?desde=correo")).toBe("/cuenta?desde=correo");
  });

  it("rechaza redirecciones externas y rutas ambiguas", () => {
    for (const destino of [
      "https://malicioso.example",
      "//malicioso.example",
      "///malicioso.example",
      "/\\malicioso.example",
      "javascript:alert(1)",
      "/cuenta\nLocation: https://malicioso.example",
    ]) {
      expect(destinoSeguro(destino), destino).toBe("/cuenta");
    }
  });
});
