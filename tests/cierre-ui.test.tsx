// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const acciones = vi.hoisted(() => ({
  enviaFeedback: vi.fn(),
  reportaError: vi.fn(),
  creaShare: vi.fn(),
}));

vi.mock("@/app/actions/feedback", () => ({
  enviaFeedback: acciones.enviaFeedback,
  reportaError: acciones.reportaError,
}));
vi.mock("@/app/actions/share", () => ({ creaShare: acciones.creaShare }));

import { Compartir } from "@/components/Compartir";
import { ReportarError } from "@/components/ReportarError";
import { SalioALaPrimera } from "@/components/SalioALaPrimera";
import { feedbackRespondido } from "@/lib/feedback-store";
import type { ChecklistLocal } from "@/lib/checklist-store";

const checklist: ChecklistLocal = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  tramiteSlug: "renovacion-dni",
  nombre: "Para mí",
  respuestas: {},
  marcados: {},
  canal: "presencial",
  creadaEn: "2026-08-19T18:00:00.000Z",
};

beforeEach(() => {
  cleanup();
  const datos = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (clave: string) => datos.get(clave) ?? null,
      setItem: (clave: string, valor: string) => datos.set(clave, String(valor)),
      removeItem: (clave: string) => datos.delete(clave),
      clear: () => datos.clear(),
    },
  });
  acciones.enviaFeedback.mockReset();
  acciones.reportaError.mockReset();
  acciones.creaShare.mockReset();
});

describe("cierre de una checklist", () => {
  it("no oculta la pregunta cuando guardar el feedback falla", async () => {
    acciones.enviaFeedback.mockResolvedValue({ ok: false });
    render(<SalioALaPrimera checklist={checklist} />);

    fireEvent.click(screen.getByRole("button", { name: "Sí, a la primera" }));

    await screen.findByText("No se pudo guardar la respuesta. Inténtalo de nuevo.");
    expect(feedbackRespondido(checklist.id)).toBe(false);
  });

  it("marca como respondida solo después de guardarla", async () => {
    acciones.enviaFeedback.mockResolvedValue({ ok: true });
    render(<SalioALaPrimera checklist={checklist} />);

    fireEvent.click(screen.getByRole("button", { name: "Sí, a la primera" }));

    await screen.findByText(/Nos ayuda a saber/);
    await waitFor(() => expect(feedbackRespondido(checklist.id)).toBe(true));
  });

  it("los campos de texto tienen nombre accesible", async () => {
    const { rerender } = render(<ReportarError tramiteSlug="renovacion-dni" />);
    fireEvent.click(screen.getByRole("button", { name: /Repórtalo/ }));
    expect(screen.getByRole("textbox", { name: "¿Qué está mal?" })).toBeTruthy();

    rerender(<SalioALaPrimera checklist={checklist} />);
    fireEvent.click(screen.getByRole("button", { name: "No, me frenó algo" }));
    expect(screen.getByRole("textbox", { name: "Qué te frenó durante el trámite" })).toBeTruthy();
  });

  it("el enlace compartido se expone con nombre accesible", async () => {
    acciones.creaShare.mockResolvedValue({ token: "token-seguro" });
    render(<Compartir checklist={checklist} conSesion={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Compartir con mi familia" }));

    expect(
      await screen.findByRole("textbox", { name: "Enlace de la checklist compartida" })
    ).toBeTruthy();
  });
});
