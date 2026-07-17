import type { TipoRequisito } from "@/lib/types";

/**
 * Los cuatro tipos de requisito, en SVG.
 *
 * Antes eran emoji (📄 💻 ⚙️ ⛓️). Dos problemas: cómo se dibuja un emoji lo
 * decide el sistema del usuario —el de la cadena, que es el icono de nuestro
 * diferencial, se rompía en algunos navegadores— y encima delataba la plantilla.
 * Un SVG se ve igual en todas partes y es nuestro.
 */
export function IconoRequisito({
  tipo,
  className = "h-[18px] w-[18px]",
}: {
  tipo: TipoRequisito;
  className?: string;
}) {
  const comun = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (tipo) {
    case "doc_fisico": // una hoja con su esquina doblada
      return (
        <svg {...comun}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case "doc_digital": // una pantalla
      return (
        <svg {...comun}>
          <rect x="2" y="4" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 18v3" />
        </svg>
      );
    case "tecnico": // un engranaje
      return (
        <svg {...comun}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
      );
    case "tramite_previo": // dos eslabones: la cadena
      return (
        <svg {...comun}>
          <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
          <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
        </svg>
      );
  }
}

/** El nombre del tipo, para la etiqueta de dato. */
export const NOMBRE_TIPO: Record<TipoRequisito, string> = {
  doc_fisico: "Documento",
  doc_digital: "Archivo",
  tecnico: "Requisito técnico",
  tramite_previo: "Trámite previo",
};
