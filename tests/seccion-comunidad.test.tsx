// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Buscador } from "@/components/Buscador";
import { nombreComunidad } from "@/lib/data/comunidades";
import { catalogo } from "./_catalogo";

/**
 * La sección "De tu zona: …" del catálogo: al elegir comunidad tiene que verse
 * un cambio (sin ella, el filtro solo quitaba cosas y parecía roto). Se prueba
 * con el catálogo real: si mañana entra otra comunidad, cubre también la suya.
 */

const KEY = "alaprimera.zona.v1";

// jsdom no trae un localStorage funcional; el store de zona lo usa al montar.
beforeAll(() => {
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

afterEach(() => {
  window.localStorage.removeItem(KEY);
  cleanup();
});

/** Las comunidades con fichas ya publicadas (los pendientes no cuentan). */
const comunidadesConFichas = [
  ...new Set(
    catalogo
      .filter((t) => !t.pendiente)
      .map((t) => t.comunidad)
      .filter((c): c is string => Boolean(c))
  ),
];

describe("Buscador: sección 'De tu zona'", () => {
  it("sin zona elegida no aparece", () => {
    render(<Buscador tramites={catalogo} />);
    expect(screen.queryByRole("heading", { name: /De tu zona/ })).toBeNull();
  });

  it("con una comunidad sin nada propio no aparece", () => {
    window.localStorage.setItem(KEY, "cataluna");
    render(<Buscador tramites={catalogo} />);
    expect(screen.queryByRole("heading", { name: /De tu zona/ })).toBeNull();
  });

  for (const comunidad of comunidadesConFichas) {
    it(`con ${comunidad} lista sus fichas publicadas bajo su título, sin pendientes ni otras comunidades`, () => {
      window.localStorage.setItem(KEY, comunidad);
      const { container } = render(<Buscador tramites={catalogo} />);

      const titulo = screen.getByRole("heading", { name: /De tu zona/ });
      expect(titulo.textContent).toContain(nombreComunidad(comunidad)!);

      const publicadas = catalogo.filter((t) => t.comunidad === comunidad && !t.pendiente);
      for (const t of publicadas) {
        expect(
          container.querySelector(`a[href="/tramite/${t.slug}"]`),
          `${t.slug} debería verse en su comunidad`
        ).not.toBeNull();
      }

      const fuera = catalogo.filter(
        (t) => t.comunidad && (t.comunidad !== comunidad || t.pendiente)
      );
      for (const t of fuera) {
        expect(
          container.querySelector(`a[href="/tramite/${t.slug}"]`),
          `${t.slug} no debería verse en la sección de ${comunidad}`
        ).toBeNull();
      }
    });
  }
});
