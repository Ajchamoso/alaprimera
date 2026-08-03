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

/**
 * Antes esto era una lista de pares escrita a mano, y por eso se coló un fallo:
 * faltaba ["tinta-tenue", "sello-suave"], que es justo un requisito marcado en la
 * checklist (bg-sello-suave + text-tinta-tenue tachado) y daba 4.44. Ahora se
 * cruzan todos contra todos: cualquier combinación que la UI pueda producir queda
 * cubierta, se use hoy o se use mañana.
 */
const SUPERFICIES = ["papel", "hoja", "sello-suave", "pendiente-suave", "borrador-suave"];
const TEXTOS = ["tinta", "tinta-media", "tinta-tenue", "sello", "pendiente", "borrador"];
const DECORATIVOS = ["linea"]; // filetes y bordes: no llevan texto, no entran en AA

const PARES: [string, string][] = TEXTOS.flatMap((t) =>
  SUPERFICIES.map((s) => [t, s] as [string, string])
);

describe("contraste de la paleta (WCAG AA)", () => {
  it("todos los tokens esperados están definidos en globals.css", () => {
    for (const nombre of [...TEXTOS, ...SUPERFICIES, ...DECORATIVOS]) {
      expect(paleta[nombre], `falta --color-${nombre}`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("ningún color de la paleta se queda sin clasificar", () => {
    // El candado: si alguien añade un --color-* nuevo a globals.css y no lo declara
    // como texto, superficie o decorativo, esto falla. Sin este test, un token nuevo
    // entra sin que nadie compruebe su contraste — que es exactamente lo que pasó.
    const clasificados = new Set([...TEXTOS, ...SUPERFICIES, ...DECORATIVOS]);
    const huerfanos = Object.keys(paleta).filter((n) => !clasificados.has(n));
    expect(huerfanos, `tokens sin clasificar en el test: ${huerfanos.join(", ")}`).toEqual([]);
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
