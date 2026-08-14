// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { SelloVerificacion } from "@/components/SelloVerificacion";
import { SelectorZona } from "@/components/SelectorZona";
import { IconoRequisito, NOMBRE_TIPO } from "@/components/IconoRequisito";
import type { TipoRequisito } from "@/lib/types";

expect.extend(matchers);

// jsdom 29 no trae un localStorage funcional; el store de zona lo usa al montar.
beforeAll(() => {
  // axe intenta el contraste sobre un <canvas> que jsdom no implementa; el
  // contraste ya lo cubre contraste.test.ts. Silenciamos el ruido de getContext.
  window.HTMLCanvasElement.prototype.getContext = () => null as never;

  if (typeof window.localStorage?.getItem !== "function") {
    const store = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
        setItem: (k: string, v: string) => store.set(k, String(v)),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
      },
    });
  }
});

afterEach(cleanup);

// Reglas de landmark: aplican a la página entera, no a un componente suelto.
// Las apagamos aquí porque probamos fragmentos; la estructura de página se revisa
// a mano. El contraste de color lo cubre contraste.test.ts (axe no lo evalúa sin
// layout real en jsdom).
const OPC = { rules: { region: { enabled: false }, "landmark-one-main": { enabled: false } } };

describe("accesibilidad de los componentes (axe)", () => {
  it("SelloVerificacion · sin verificar no tiene violaciones", async () => {
    const { container } = render(
      <SelloVerificacion verificadaEn={null} />
    );
    expect(await axe(container, OPC)).toHaveNoViolations();
  });

  it("SelloVerificacion · verificada reciente no tiene violaciones", async () => {
    const { container } = render(
      <SelloVerificacion verificadaEn="2026-07-01" />
    );
    expect(await axe(container, OPC)).toHaveNoViolations();
  });

  it("SelloVerificacion · caducada (verificación vieja) no tiene violaciones", async () => {
    const { container } = render(
      <SelloVerificacion verificadaEn="2020-01-01" />
    );
    expect(await axe(container, OPC)).toHaveNoViolations();
  });

  it("SelectorZona · el desplegable tiene etiqueta accesible", async () => {
    const { container } = render(<SelectorZona />);
    expect(await axe(container, OPC)).toHaveNoViolations();
  });

  it("cada IconoRequisito es decorativo y su fila lleva texto (patrón real)", async () => {
    // El patrón real desde el 14/08: el dibujo vive dentro de la etiqueta que lo
    // nombra, no en una columna aparte. Decían lo mismo por duplicado y entre las
    // dos se llevaban 115 px del ancho de un móvil.
    const tipos = Object.keys(NOMBRE_TIPO) as TipoRequisito[];
    for (const tipo of tipos) {
      const { container } = render(
        <p>
          Documento de ejemplo{" "}
          <span>
            <IconoRequisito tipo={tipo} className="h-3 w-3" />
            {NOMBRE_TIPO[tipo]}
          </span>
        </p>
      );
      expect(await axe(container, OPC), `tipo ${tipo}`).toHaveNoViolations();
      cleanup();
    }
  });
});
