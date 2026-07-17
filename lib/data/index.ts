import { createClient } from "@supabase/supabase-js";
import type { Canal, Pregunta, Requisito, TipoRequisito, Tramite } from "@/lib/types";
import { tramites as contenidoLocal } from "./tramites";
import { generadaPorIa, verificadaEn } from "./verificaciones";

/** Contenido + registro de verificaciones = la ficha completa. */
const seedLocal: Tramite[] = contenidoLocal.map((t) => ({
  ...t,
  verificadaEn: verificadaEn(t.slug),
  generadaPorIa: generadaPorIa(t.slug),
}));

/**
 * Capa de acceso a fichas. Lee de Supabase (contenido curado en BD, FR-019);
 * si el entorno no está configurado o la BD falla, degrada al seed local para
 * que el desarrollo y el build nunca se bloqueen. La app siempre lee de BD,
 * nunca espera a un scraping (plan §3).
 */

function configurado(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function clienteAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapeaTramite(fila: any): Tramite {
  const preguntas: Pregunta[] = (fila.preguntas ?? [])
    .map((p: any) => ({
      id: p.id,
      orden: p.orden,
      texto: p.texto,
      tipo: p.tipo,
      opciones: (p.opciones ?? []).map((o: any) => ({
        id: o.id,
        texto: o.texto,
        veredictoInviable: o.veredicto_inviable || undefined,
        textoAlternativas: o.texto_alternativas ?? undefined,
      })),
    }))
    .sort((a: Pregunta, b: Pregunta) => a.orden - b.orden);

  const requisitos: Requisito[] = (fila.requisitos ?? [])
    .sort((a: any, b: any) => a.orden - b.orden)
    .map((r: any) => ({
      id: r.id,
      tipo: r.tipo as TipoRequisito,
      titulo: r.titulo,
      explicacion: r.explicacion,
      canal: r.canal,
      tramitePrevioSlug: r.tramite_previo_id ?? undefined,
      soloSiOpciones:
        r.requisito_condiciones?.length > 0
          ? r.requisito_condiciones.map((c: any) => c.opcion_id)
          : undefined,
    }));

  return {
    slug: fila.id,
    nombreOficial: fila.nombre_oficial,
    nombreColoquial: fila.nombre_coloquial,
    descripcion: fila.descripcion,
    organismo: fila.organismo,
    territorio: fila.territorio,
    canales: fila.canales as Canal[],
    urlFuente: fila.url_fuente,
    urlCitaPrevia: fila.url_cita_previa ?? undefined,
    plazo: fila.plazo_inicio
      ? { inicio: fila.plazo_inicio, fin: fila.plazo_fin, nota: fila.plazo_nota ?? undefined }
      : undefined,
    verificadaEn: fila.verificada_en,
    generadaPorIa: fila.generada_por_ia,
    alias: fila.alias ?? [],
    preguntas,
    requisitos,
    prerequisitos: (fila.prerequisitos ?? []).map((p: any) => ({
      slug: p.requiere_tramite_id,
      nota: p.nota ?? undefined,
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getTramites(): Promise<Tramite[]> {
  if (!configurado()) return seedLocal;

  const { data, error } = await clienteAnon()
    .from("tramites")
    .select(
      `id, nombre_oficial, nombre_coloquial, descripcion, organismo, territorio, canales,
       url_fuente, url_cita_previa, plazo_inicio, plazo_fin, plazo_nota,
       verificada_en, generada_por_ia, alias,
       preguntas ( id, orden, texto, tipo,
         opciones ( id, texto, veredicto_inviable, texto_alternativas ) ),
       requisitos!requisitos_tramite_id_fkey ( id, tipo, titulo, explicacion, canal, tramite_previo_id, orden,
         requisito_condiciones ( opcion_id ) ),
       prerequisitos!prerequisitos_tramite_id_fkey ( requiere_tramite_id, nota )`
    )
    .eq("estado", "publicada")
    .order("id");

  if (error || !data) {
    console.error("No se pudo leer el catálogo de la BD; sirviendo seed local.", error?.message);
    return seedLocal;
  }
  return data.map(mapeaTramite);
}

export async function getTramiteBySlug(slug: string): Promise<Tramite | undefined> {
  return (await getTramites()).find((t) => t.slug === slug);
}

/** Cadena de prerrequisitos desde un trámite (sin ciclos: lo garantiza la BD, FR-026). */
export function getCadena(
  tramite: Tramite,
  catalogo: Tramite[]
): { tramite: Tramite; nota?: string }[] {
  const cadena: { tramite: Tramite; nota?: string }[] = [];
  const vistos = new Set<string>([tramite.slug]);
  let pendientes = [...tramite.prerequisitos];
  while (pendientes.length > 0) {
    const [actual, ...resto] = pendientes;
    pendientes = resto;
    if (vistos.has(actual.slug)) continue;
    vistos.add(actual.slug);
    const previo = catalogo.find((t) => t.slug === actual.slug);
    if (previo) {
      cadena.push({ tramite: previo, nota: actual.nota });
      pendientes.push(...previo.prerequisitos);
    }
  }
  return cadena;
}

/** Quita acentos y pasa a minúsculas para comparar como escribe la gente. */
export function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Búsqueda coloquial sobre nombre, alias y descripción (FR-002). Determinista. */
export function buscaTramites(consulta: string, catalogo: Tramite[]): Tramite[] {
  const q = normaliza(consulta.trim());
  if (q.length === 0) return catalogo;
  const palabras = q
    .split(/\s+/)
    .filter((p) => (p.length > 2 && !STOPWORDS.has(p)) || PALABRAS_CORTAS_UTILES.has(p));
  return catalogo.filter((t) => {
    const pajar = normaliza(
      [t.nombreOficial, t.nombreColoquial, t.descripcion, t.organismo, ...t.alias].join(" ")
    );
    return palabras.length > 0
      ? palabras.some((p) => pajar.includes(p))
      : pajar.includes(q);
  });
}

const PALABRAS_CORTAS_UTILES = new Set(["dni", "nie", "ss", "irpf"]);

const STOPWORDS = new Set([
  "del", "los", "las", "una", "uno", "unos", "unas", "que", "como", "para",
  "por", "con", "sin", "mis", "tus", "sus", "este", "esta", "eso", "esos",
  "necesito", "quiero", "hacer", "tengo", "hay", "donde", "cual", "cuales",
]);
