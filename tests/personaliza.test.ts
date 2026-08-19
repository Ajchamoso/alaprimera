import { describe, expect, it } from "vitest";
import { requisitosDelCanal } from "@/lib/personaliza";
import type { Requisito } from "@/lib/types";

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
