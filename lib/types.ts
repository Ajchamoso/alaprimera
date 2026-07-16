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

export interface Tramite {
  slug: string;
  nombreOficial: string;
  nombreColoquial: string;
  descripcion: string;
  organismo: string;
  territorio: string;
  canales: Canal[];
  urlFuente: string;
  urlCitaPrevia?: string;
  /** null = sin verificar (se muestra el aviso). Fecha ISO si una persona la cotejó. */
  verificadaEn: string | null;
  generadaPorIa: boolean;
  alias: string[];
  preguntas: Pregunta[];
  requisitos: Requisito[];
  prerequisitos: Prerequisito[];
}
