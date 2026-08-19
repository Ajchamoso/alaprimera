import { describe, expect, it } from "vitest";
import { tramites } from "@/lib/data/tramites";
import {
  validaChecklist,
  validaFeedback,
  validaPeticionCatalogo,
  validaReporte,
} from "@/lib/validacion-acciones";

const tramite = tramites.find((ficha) => ficha.preguntas.length > 0 && ficha.requisitos.length > 0)!;
const pregunta = tramite.preguntas[0];
const opcion = pregunta.opciones[0];
const requisito = tramite.requisitos[0];

function checklistValida() {
  return {
    id: "123e4567-e89b-42d3-a456-426614174000",
    tramiteSlug: tramite.slug,
    nombre: "  Para mí  ",
    respuestas: { [pregunta.id]: opcion.id },
    marcados: { [requisito.id]: true },
    canal: tramite.canales[0],
    creadaEn: "2026-08-19T18:00:00.000Z",
  };
}

describe("validación de Server Actions", () => {
  it("acepta una checklist del catálogo y sanea el nombre", () => {
    expect(validaChecklist(checklistValida())).toEqual({
      ...checklistValida(),
      nombre: "Para mí",
    });
  });

  it("rechaza ids, trámites y relaciones inventadas", () => {
    expect(validaChecklist({ ...checklistValida(), id: "no-es-uuid" })).toBeNull();
    expect(validaChecklist({ ...checklistValida(), tramiteSlug: "inventado" })).toBeNull();
    expect(
      validaChecklist({ ...checklistValida(), respuestas: { [pregunta.id]: "opcion-inventada" } })
    ).toBeNull();
    expect(
      validaChecklist({ ...checklistValida(), marcados: { "requisito-inventado": true } })
    ).toBeNull();
  });

  it("acota el feedback y los reportes", () => {
    expect(
      validaFeedback({ checklist: checklistValida(), salioALaPrimera: false, queFallo: "  Nada  " })
    ).toMatchObject({ queFallo: "Nada" });
    expect(
      validaFeedback({
        checklist: checklistValida(),
        salioALaPrimera: false,
        queFallo: "x".repeat(2001),
      })
    ).toBeNull();
    expect(validaReporte(tramite.slug, "  Enlace roto  ")).toEqual({
      tramiteSlug: tramite.slug,
      descripcion: "Enlace roto",
    });
    expect(validaReporte("inventado", "Enlace roto")).toBeNull();
  });

  it("registra solo peticiones acotadas y de una comunidad conocida", () => {
    expect(validaPeticionCatalogo("  licencia de pesca  ", "madrid")).toEqual({
      consulta: "licencia de pesca",
      comunidad: "madrid",
    });
    expect(validaPeticionCatalogo("x", null)).toBeNull();
    expect(validaPeticionCatalogo("licencia de pesca", "inventada")).toBeNull();
  });
});
