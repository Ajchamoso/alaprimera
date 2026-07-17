/**
 * LA TAXONOMÍA: hechos vitales.
 *
 * El eje por el que se agrupa el catálogo — "nace un hijo", "me mudo" — en vez
 * de por el organigrama del Estado. Es la cabeza del usuario, no la de la
 * administración. Ver docs/hechos-vitales.md para el porqué.
 *
 * Sin emoji (FR-028): las secciones se rotulan con la condensada en mayúsculas,
 * como el resto del sistema. El orden es el de esta lista.
 */
export interface HechoVital {
  codigo: string;
  etiqueta: string;
}

export const hechosVitales: HechoVital[] = [
  { codigo: "cimientos", etiqueta: "Documentos base" },
  { codigo: "nacimiento", etiqueta: "Nace un hijo" },
  { codigo: "escuela", etiqueta: "Empieza el cole" },
  { codigo: "mudanza", etiqueta: "Me mudo de casa" },
  { codigo: "mayores", etiqueta: "Cuido de un mayor" },
  { codigo: "trabajo", etiqueta: "Empiezo a trabajar" },
  { codigo: "coche", etiqueta: "Conducir y el coche" },
  { codigo: "hacienda", etiqueta: "La renta y Hacienda" },
  { codigo: "fallecimiento", etiqueta: "Fallece un familiar" },
  { codigo: "matrimonio", etiqueta: "Me caso" },
  { codigo: "ayudas", etiqueta: "Pido una ayuda" },
];

/**
 * A qué hecho vital pertenece cada ficha real (las 15 curadas). Un trámite puede
 * tocar varios eventos; aquí se le da UN hogar primario para no duplicarlo. Es un
 * primer corte a validar — parte del sentido de meter los pendientes es ver si
 * esta agrupación funciona.
 *
 * Los pendientes traen su propio hecho vital (ver pendientes.ts).
 */
export const hechoVitalDeFicha: Record<string, string> = {
  // Documentos base — de estos cuelga casi todo
  "renovacion-dni": "cimientos",
  "dni-primera-vez": "cimientos",
  "pasaporte": "cimientos",
  "certificado-digital-fnmt": "cimientos",
  "clave": "cimientos",
  "empadronamiento-madrid": "cimientos",
  "empadronamiento-zaragoza": "cimientos",
  // Nace un hijo
  "certificado-nacimiento": "nacimiento",
  "inscripcion-nacimiento": "nacimiento",
  "familia-numerosa-madrid": "nacimiento",
  "familia-numerosa-aragon": "nacimiento",
  // Empieza el cole
  "beca-comedor-madrid": "escuela",
  "beca-comedor-aragon": "escuela",
  // Cuido de un mayor
  "tarjeta-sanitaria-madrid": "mayores",
  "tarjeta-sanitaria-aragon": "mayores",
  "apoderamiento": "mayores",
};
