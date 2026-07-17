import { describe, expect, it } from "vitest";
import { pendientes } from "@/lib/data/pendientes";

/**
 * Los pendientes son el backlog visible. Su razón de ser es NO publicar contenido:
 * aparecen agrupados para validar la taxonomía, pero no muestran requisitos —solo
 * "en preparación"—, así que no pueden violar la regla de oro (FR-019). Estos
 * tests son el candado: si un pendiente empieza a "engañar", el candado salta.
 */
describe("los pendientes no publican contenido sin verificar", () => {
  it("todos están marcados como pendientes", () => {
    for (const p of pendientes) {
      expect(p.pendiente, `${p.slug} · pendiente`).toBe(true);
    }
  });

  it("no publican requisitos, preguntas ni encadenamientos", () => {
    for (const p of pendientes) {
      expect(p.requisitos.length, `${p.slug} · requisitos`).toBe(0);
      expect(p.preguntas.length, `${p.slug} · preguntas`).toBe(0);
      expect(p.prerequisitos.length, `${p.slug} · prerequisitos`).toBe(0);
    }
  });

  it("no publican descripción ni fuente (aún no hay ficha)", () => {
    for (const p of pendientes) {
      expect(p.descripcion, `${p.slug} · descripcion`).toBe("");
      expect(p.urlFuente, `${p.slug} · urlFuente`).toBe("");
    }
  });

  it("nunca aparecen como verificados", () => {
    for (const p of pendientes) {
      expect(p.verificadaEn, `${p.slug} · verificadaEn`).toBeNull();
    }
  });

  it("conservan lo mínimo para agruparse: nombre, organismo y hecho vital", () => {
    for (const p of pendientes) {
      expect(p.nombreColoquial.trim(), `${p.slug} · nombreColoquial`).not.toBe("");
      expect(p.organismo.trim(), `${p.slug} · organismo`).not.toBe("");
      expect(p.hechoVital?.trim(), `${p.slug} · hechoVital`).toBeTruthy();
    }
  });
});
