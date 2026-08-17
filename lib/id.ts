/**
 * EL IDENTIFICADOR DE UNA CHECKLIST
 *
 * Un UUID v4, generado con `crypto.getRandomValues`.
 *
 * Por qué no `crypto.randomUUID()`, que sería una línea: esa función solo
 * existe en "contexto seguro", o sea en https y en localhost. Al abrir la app
 * por IP en la red local (probando desde el móvil, que es como se prueba de
 * verdad) el navegador no la expone, y la app reventaba en silencio justo al
 * crear la lista: respondías la última pregunta del asistente y no pasaba nada.
 * Su momento estrella, mudo, sin un mensaje de error.
 *
 * `getRandomValues` no tiene esa limitación y está en todos los navegadores,
 * así que hay un solo camino de código, el mismo en cualquier entorno, y se
 * ejecuta siempre. Un camino que no se recorre nunca es un camino que no se
 * prueba.
 */

/** Un identificador único para una checklist, con forma de UUID v4. */
export function nuevoId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return uuidDesdeBytes(bytes);
}

/**
 * 16 bytes al azar → UUID v4 canónico. Aparte y pura para poder probarla con
 * bytes conocidos, que es la única forma de comprobar que los bits de versión
 * y variante quedan donde manda la norma.
 */
export function uuidDesdeBytes(bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error(`Un UUID necesita 16 bytes, no ${bytes.length}`);

  const b = Uint8Array.from(bytes);
  b[6] = (b[6] & 0x0f) | 0x40; // versión 4
  b[8] = (b[8] & 0x3f) | 0x80; // variante RFC 4122

  const hex = Array.from(b, (n) => n.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}
