import { describe, expect, it } from "vitest";
import { nuevoId, uuidDesdeBytes } from "@/lib/id";

/**
 * El identificador de una checklist. Parece un detalle y tumbó el momento
 * estrella de la app: se generaba con crypto.randomUUID(), que solo existe en
 * https y en localhost, así que abriendo la app por IP desde el móvil se
 * respondía la última pregunta del asistente y no pasaba nada, en silencio.
 */
const FORMA_UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("nuevoId: el identificador de una checklist", () => {
  it("tiene forma de UUID v4", () => {
    expect(nuevoId()).toMatch(FORMA_UUID_V4);
  });

  it("no repite: mil seguidos, mil distintos", () => {
    const vistos = new Set(Array.from({ length: 1000 }, () => nuevoId()));
    expect(vistos.size).toBe(1000);
  });

  it("no necesita crypto.randomUUID, que falta fuera de https y localhost", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis.crypto, "randomUUID");
    Object.defineProperty(globalThis.crypto, "randomUUID", { value: undefined, configurable: true });
    try {
      expect(nuevoId()).toMatch(FORMA_UUID_V4);
    } finally {
      if (original) Object.defineProperty(globalThis.crypto, "randomUUID", original);
    }
  });
});

describe("uuidDesdeBytes: los bits que manda la norma", () => {
  it("marca la versión 4 y la variante, pase lo que pase con los bytes", () => {
    for (const relleno of [0x00, 0xff, 0x5a]) {
      const uuid = uuidDesdeBytes(new Uint8Array(16).fill(relleno));
      expect(uuid).toMatch(FORMA_UUID_V4);
    }
  });

  it("conserva los bytes que no son de versión ni de variante", () => {
    const bytes = Uint8Array.from({ length: 16 }, (_, i) => i);
    expect(uuidDesdeBytes(bytes).startsWith("00010203-0405-4")).toBe(true);
  });

  it("no acepta un número de bytes que no sea 16", () => {
    expect(() => uuidDesdeBytes(new Uint8Array(8))).toThrow(/16 bytes/);
  });
});
