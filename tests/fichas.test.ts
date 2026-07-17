import { describe, expect, it } from "vitest";
import { tramites as contenido } from "@/lib/data/tramites";
import type { Canal, TipoRequisito } from "@/lib/types";
import { catalogo, fichasReales } from "./_catalogo";

const TIPOS_REQUISITO: TipoRequisito[] = ["doc_fisico", "doc_digital", "tecnico", "tramite_previo"];
const CANALES: (Canal | "ambos")[] = ["online", "presencial", "ambos"];
const slugsCatalogo = new Set(catalogo.map((t) => t.slug));

describe("integridad de las fichas reales", () => {
  it("todas tienen los campos de cabecera con contenido", () => {
    for (const t of fichasReales) {
      expect(t.slug, "slug").toMatch(/^[a-z0-9-]+$/);
      expect(t.nombreOficial.trim(), `${t.slug} · nombreOficial`).not.toBe("");
      expect(t.nombreColoquial.trim(), `${t.slug} · nombreColoquial`).not.toBe("");
      expect(t.descripcion.trim(), `${t.slug} · descripcion`).not.toBe("");
      expect(t.organismo.trim(), `${t.slug} · organismo`).not.toBe("");
      expect(t.territorio.trim(), `${t.slug} · territorio`).not.toBe("");
      expect(t.canales.length, `${t.slug} · canales`).toBeGreaterThan(0);
      expect(t.alias.length, `${t.slug} · alias`).toBeGreaterThan(0);
      expect(t.alias.every((a) => a.trim() !== ""), `${t.slug} · alias vacío`).toBe(true);
    }
  });

  it("citan su fuente oficial (FR-019): urlFuente https y no vacía", () => {
    for (const t of fichasReales) {
      expect(t.urlFuente, `${t.slug} · urlFuente`).toMatch(/^https:\/\//);
    }
  });

  it("ninguna ficha real está enteramente sin citar: al menos un requisito lleva «Fuente:»", () => {
    // La regla de oro no exige cita en CADA requisito (hay pasos autoevidentes),
    // pero sí que la ficha esté anclada a su fuente y no sea contenido inventado.
    for (const t of fichasReales) {
      const conCita = t.requisitos.filter((r) => r.explicacion.includes("Fuente:")).length;
      expect(conCita, `${t.slug} · requisitos con cita`).toBeGreaterThan(0);
    }
  });

  it("la primera pregunta es siempre el destinatario (regla del wizard)", () => {
    for (const t of fichasReales) {
      expect(t.preguntas.length, `${t.slug} · sin preguntas`).toBeGreaterThan(0);
      const primera = [...t.preguntas].sort((a, b) => a.orden - b.orden)[0];
      expect(primera.orden, `${t.slug} · orden primera pregunta`).toBe(1);
      expect(primera.tipo, `${t.slug} · tipo primera pregunta`).toBe("destinatario");
    }
  });

  it("preguntas y opciones bien formadas (orden e ids únicos, textos no vacíos)", () => {
    for (const t of fichasReales) {
      const ordenes = t.preguntas.map((p) => p.orden);
      expect(new Set(ordenes).size, `${t.slug} · orden duplicado`).toBe(ordenes.length);

      const idsOpcion = t.preguntas.flatMap((p) => p.opciones.map((o) => o.id));
      expect(new Set(idsOpcion).size, `${t.slug} · id de opción duplicado`).toBe(idsOpcion.length);

      for (const p of t.preguntas) {
        expect(p.opciones.length, `${t.slug}/${p.id} · sin opciones`).toBeGreaterThan(0);
        for (const o of p.opciones) {
          expect(o.texto.trim(), `${t.slug}/${o.id} · texto opción`).not.toBe("");
          // Un caso inviable debe ofrecer alternativas, nunca dejar al usuario tirado.
          if (o.veredictoInviable) {
            expect(o.textoAlternativas?.trim(), `${t.slug}/${o.id} · alternativas`).toBeTruthy();
          }
        }
      }
    }
  });

  it("requisitos bien formados y con tipo/canal válidos", () => {
    for (const t of fichasReales) {
      const idsReq = t.requisitos.map((r) => r.id);
      expect(new Set(idsReq).size, `${t.slug} · id de requisito duplicado`).toBe(idsReq.length);
      for (const r of t.requisitos) {
        expect(TIPOS_REQUISITO, `${t.slug}/${r.id} · tipo`).toContain(r.tipo);
        expect(CANALES, `${t.slug}/${r.id} · canal`).toContain(r.canal);
        expect(r.titulo.trim(), `${t.slug}/${r.id} · titulo`).not.toBe("");
        expect(r.explicacion.trim(), `${t.slug}/${r.id} · explicacion`).not.toBe("");
      }
    }
  });

  it("cada soloSiOpciones apunta a una opción que existe en la propia ficha", () => {
    for (const t of fichasReales) {
      const idsOpcion = new Set(t.preguntas.flatMap((p) => p.opciones.map((o) => o.id)));
      for (const r of t.requisitos) {
        for (const cond of r.soloSiOpciones ?? []) {
          expect(idsOpcion, `${t.slug}/${r.id} · condición huérfana ${cond}`).toContain(cond);
        }
      }
    }
  });

  it("los slugs son únicos en todo el catálogo (fichas + pendientes)", () => {
    const slugs = catalogo.map((t) => t.slug);
    expect(new Set(slugs).size, "slugs duplicados").toBe(slugs.length);
  });

  it("las fichas reales no se pisan con TramiteContenido (mismo nº que en tramites.ts)", () => {
    expect(fichasReales.length).toBe(contenido.length);
  });
});

describe("integridad referencial de los encadenamientos", () => {
  it("cada tramitePrevioSlug apunta a un trámite del catálogo", () => {
    for (const t of catalogo) {
      for (const r of t.requisitos) {
        if (r.tramitePrevioSlug) {
          expect(slugsCatalogo, `${t.slug}/${r.id} · previo inexistente`).toContain(
            r.tramitePrevioSlug
          );
        }
      }
    }
  });

  it("cada prerequisito apunta a un trámite del catálogo", () => {
    for (const t of catalogo) {
      for (const pre of t.prerequisitos) {
        expect(slugsCatalogo, `${t.slug} · prerequisito inexistente ${pre.slug}`).toContain(
          pre.slug
        );
      }
    }
  });

  it("ningún trámite se declara prerequisito de sí mismo", () => {
    for (const t of catalogo) {
      expect(
        t.prerequisitos.some((p) => p.slug === t.slug),
        `${t.slug} · autorreferencia`
      ).toBe(false);
    }
  });
});
