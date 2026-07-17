export type TipoRequisito = "doc_fisico" | "doc_digital" | "tecnico" | "tramite_previo";
export type Canal = "online" | "presencial";

export interface Opcion {
  id: string;
  texto: string;
  /** Si es true, elegir esta opción hace inviable la vía y se muestran alternativas. */
  veredictoInviable?: boolean;
  textoAlternativas?: string;
}

export interface Pregunta {
  id: string;
  orden: number; // 1..4; la 1 es siempre el destinatario
  texto: string;
  tipo: "destinatario" | "normal";
  opciones: Opcion[];
}

export interface Requisito {
  id: string;
  tipo: TipoRequisito;
  titulo: string;
  explicacion: string;
  canal: Canal | "ambos";
  /** Aplica solo si el usuario eligió alguna de estas opciones. Vacío/ausente = aplica siempre. */
  soloSiOpciones?: string[];
  /** Para tipo 'tramite_previo': slug del trámite encadenado, si está en el catálogo. */
  tramitePrevioSlug?: string;
}

export interface Prerequisito {
  slug: string;
  nota?: string;
}

/**
 * Ventana de solicitud (descubierto al curar las becas, 17/07): hay trámites que
 * solo se pueden pedir en unas fechas. Fuera de plazo, la checklist más perfecta
 * del mundo es inútil — y prometer lo contrario es engañar.
 */
export interface Plazo {
  inicio: string; // ISO date
  fin: string; // ISO date
  nota?: string; // p. ej. cuándo suele abrir el siguiente
}

/**
 * Los tres niveles de la administración española. Determinan si una ficha sirve
 * a todo el país o solo a una zona:
 * - `estatal`: un organismo, igual en toda España. Una ficha vale para todos.
 * - `autonomico`: cada CCAA distinto. Una ficha POR comunidad (lleva `comunidad`).
 * - `local`: cada ayuntamiento distinto. Una ficha por municipio (lleva `comunidad`
 *   y el municipio va en `territorio`).
 */
export type NivelTerritorial = "estatal" | "autonomico" | "local";

export interface Tramite {
  slug: string;
  nombreOficial: string;
  nombreColoquial: string;
  descripcion: string;
  organismo: string;
  nivel: NivelTerritorial;
  /** Código de CCAA (ver comunidades.ts). Ausente en los estatales. */
  comunidad?: string;
  territorio: string;
  canales: Canal[];
  urlFuente: string;
  urlCitaPrevia?: string;
  plazo?: Plazo;
  /** null = sin verificar (se muestra el aviso). Fecha ISO si una persona la cotejó. */
  verificadaEn: string | null;
  generadaPorIa: boolean;
  alias: string[];
  preguntas: Pregunta[];
  requisitos: Requisito[];
  prerequisitos: Prerequisito[];
}

/**
 * Lo que se escribe en `tramites.ts`: la ficha SIN su estado de verificación.
 * Quién la selló y cuándo vive en el registro (`verificaciones.ts`), no aquí:
 * el contenido y el aval son hechos distintos, y mezclarlos hacía que un seed
 * borrase verificaciones sin avisar.
 */
export type TramiteContenido = Omit<Tramite, "verificadaEn" | "generadaPorIa">;
