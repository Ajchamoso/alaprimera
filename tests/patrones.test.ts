import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guardias mecánicas del "sello" del diseño (AGENTS.md reglas 6-7). Lo que se
 * puede comprobar sin criterio, se comprueba aquí; el resto lo revisa la skill
 * /revisar-codigo a mano. Escanea la UI (components/ y app/) tras quitar los
 * comentarios: un emoji o un color de Tailwind en un comentario que explica por
 * qué NO se usan es correcto; en el JSX que se renderiza, no.
 */

const raiz = fileURLToPath(new URL("..", import.meta.url));

function ficherosUI(): string[] {
  const dirs = ["components", "app"];
  const out: string[] = [];
  const anda = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const p = `${dir}/${e}`;
      if (statSync(p).isDirectory()) anda(p);
      else if (/\.(tsx?|css)$/.test(e)) out.push(p);
    }
  };
  for (const d of dirs) anda(`${raiz}${d}`);
  return out;
}

/** Quita comentarios de bloque, de línea y JSX ({/* *​/}), para mirar solo lo que se renderiza. */
function sinComentarios(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

const ficheros = ficherosUI();

// Emoji y pictogramas del sistema (FR-028). A propósito NO incluye el bloque de
// flechas (←/→, U+2190–21FF): son tipográficas, se dibujan con la fuente y la UI
// las usa aposta. Sí incluye dingbats como ✓ (U+2713) y ⚠ (U+26A0).
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;

// Paletas de Tailwind prohibidas: el color va por token semántico (text-sello…).
const COLOR_PROHIBIDO = /\b(emerald|stone|amber|green|violet|slate|zinc|gray|red|blue)-\d{2,3}\b/;

describe("el sello del diseño (guardias mecánicas)", () => {
  it("cero emoji en la UI que se renderiza (FR-028)", () => {
    const infractores: string[] = [];
    for (const f of ficheros) {
      const limpio = sinComentarios(readFileSync(f, "utf8"));
      limpio.split("\n").forEach((linea, i) => {
        if (EMOJI.test(linea)) {
          infractores.push(`${f.replace(raiz, "")}:${i + 1} → ${linea.trim().slice(0, 60)}`);
        }
      });
    }
    expect(infractores, `emoji en la UI:\n${infractores.join("\n")}`).toEqual([]);
  });

  it("solo tokens de color semánticos, nunca paletas de Tailwind (regla 6)", () => {
    const infractores: string[] = [];
    for (const f of ficheros) {
      const limpio = sinComentarios(readFileSync(f, "utf8"));
      limpio.split("\n").forEach((linea, i) => {
        const m = linea.match(COLOR_PROHIBIDO);
        if (m) infractores.push(`${f.replace(raiz, "")}:${i + 1} → ${m[0]}`);
      });
    }
    expect(infractores, `colores no semánticos:\n${infractores.join("\n")}`).toEqual([]);
  });
});
