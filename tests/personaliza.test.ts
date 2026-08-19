import { describe, expect, it } from "vitest";
import { requisitosDeChecklist, requisitosDelCanal } from "@/lib/personaliza";
import type { Requisito, Tramite } from "@/lib/types";

const base = {
  tipo: "doc_fisico" as const,
  explicacion: "Fuente: «ejemplo»",
};
const requisitos: Requisito[] = [
  { ...base, id: "comun", titulo: "Común", canal: "ambos" },
  { ...base, id: "web", titulo: "Online", canal: "online" },
  { ...base, id: "oficina", titulo: "Presencial", canal: "presencial" },
];

describe("requisitosDelCanal", () => {
  it("antes de elegir conserva todas las vías", () => {
    expect(requisitosDelCanal(requisitos)).toEqual(requisitos);
  });

  it("incluye los comunes y solo la vía elegida", () => {
    expect(requisitosDelCanal(requisitos, "online").map((r) => r.id)).toEqual(["comun", "web"]);
    expect(requisitosDelCanal(requisitos, "presencial").map((r) => r.id)).toEqual([
      "comun",
      "oficina",
    ]);
  });
});

describe("requisitosDeChecklist", () => {
  const tramite: Tramite = {
    slug: "prueba",
    nombreOficial: "Prueba",
    nombreColoquial: "Prueba",
    descripcion: "Prueba",
    organismo: "Organismo",
    nivel: "estatal",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://example.com",
    verificadaEn: null,
    generadaPorIa: false,
    alias: [],
    preguntas: [],
    requisitos: [
      ...requisitos,
      {
        ...base,
        id: "solo-caso",
        titulo: "Solo para este caso",
        canal: "ambos",
        soloSiOpciones: ["opcion-si"],
      },
    ],
    prerequisitos: [],
  };

  it("combina el caso personalizado con la vía de la instantánea", () => {
    expect(requisitosDeChecklist(tramite, { pregunta: "opcion-si" }, "presencial").map((r) => r.id))
      .toEqual(["comun", "oficina", "solo-caso"]);
  });
});
