import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Contraste de color WCAG 2.1 sobre la paleta real (FR-029: el estado de una
 * ficha se distingue sin depender solo del color, y el texto tiene que leerse —
 * el público es gente mayor y el imprimible llega a una persona de 74 años).
 *
 * axe no evalúa contraste sin layout real (jsdom), así que esto lo cubre con la
 * fórmula, leyendo los tokens de globals.css para no desincronizarse del diseño.
 */

const AA_NORMAL = 4.5; // texto normal
const cssPath = fileURLToPath(new URL("../app/globals.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

const paleta: Record<string, string> = {};
for (const m of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
  paleta[m[1]] = m[2];
}

function luminanciaRelativa(hex: string): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: string, b: string): number {
  const l1 = luminanciaRelativa(a);
  const l2 = luminanciaRelativa(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// Las combinaciones texto/fondo que la UI usa de verdad (ver los usos de
// text-* sobre bg-papel / bg-hoja / bg-*-suave en components/ y app/).
const PARES: [string, string][] = [
  ["tinta", "papel"],
  ["tinta", "hoja"],
  ["tinta-media", "papel"],
  ["tinta-media", "hoja"],
  ["tinta-tenue", "papel"],
  ["tinta-tenue", "hoja"],
  ["sello", "papel"],
  ["sello", "hoja"],
  ["sello", "sello-suave"],
  ["pendiente", "papel"],
  ["pendiente", "hoja"],
  ["pendiente", "pendiente-suave"],
];

describe("contraste de la paleta (WCAG AA)", () => {
  it("todos los tokens esperados están definidos en globals.css", () => {
    for (const nombre of ["papel", "hoja", "tinta", "tinta-media", "tinta-tenue", "sello", "pendiente"]) {
      expect(paleta[nombre], `falta --color-${nombre}`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it.each(PARES)("texto %s sobre fondo %s cumple AA (4.5:1)", (texto, fondo) => {
    const ratio = contraste(paleta[texto], paleta[fondo]);
    expect(
      ratio,
      `${texto} (${paleta[texto]}) sobre ${fondo} (${paleta[fondo]}) = ${ratio.toFixed(2)}:1`
    ).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("el foco de un campo (borde sello sobre hoja) se ve: contraste de UI ≥3:1", () => {
    // Los inputs usan focus:border-sello sobre bg-hoja. El indicador de foco tiene
    // que distinguirse (WCAG 1.4.11, componentes no textuales): quien navega con
    // teclado necesita ver dónde está. Los filetes de `linea` son decorativos y no
    // entran en este umbral.
    expect(contraste(paleta["sello"], paleta["hoja"])).toBeGreaterThanOrEqual(3);
  });
});
