/**
 * FAMILIAS DE FICHAS
 *
 * Un mismo trámite hecho en sitios distintos: empadronarse es lo mismo en
 * Zaragoza y en Madrid, pero son dos fichas porque lo hace un ayuntamiento
 * distinto con su propia fuente.
 *
 * Sirve para enlazar trámites previos sin mentir sobre el territorio. Una ficha
 * estatal que exige el empadronamiento (el primer DNI lo exige) no puede apuntar
 * a `empadronamiento-madrid`: mandaría a media España al ayuntamiento
 * equivocado. Apunta a la familia, y el enlace se resuelve con la zona de quien
 * lee. Si de su comunidad aún no hay ficha, no se enlaza: se dice qué hace falta
 * y de quién depende.
 */
export interface Familia {
  /** Cómo se nombra el trámite cuando no hay ficha de la zona de quien lee. */
  etiqueta: string;
  /** Qué hacer mientras tanto. Sin prometer nada que no tengamos. */
  sinFicha: string;
}

export const familias: Record<string, Familia> = {
  empadronamiento: {
    etiqueta: "Empadronarte en tu ayuntamiento",
    sinFicha:
      "Lo pide el ayuntamiento donde vives, y cada uno tiene sus horarios y su papeleo. Aún no tenemos la ficha del tuyo: búscalo como «padrón» en la web de tu ayuntamiento.",
  },
};

export function etiquetaFamilia(codigo: string): string {
  return familias[codigo]?.etiqueta ?? codigo;
}
