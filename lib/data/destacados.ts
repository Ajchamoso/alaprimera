/**
 * DESTACADOS: fuera del índice, arriba del todo.
 *
 * Los trámites que casi todo el mundo necesita, para no tener que entrar en un
 * tema a buscarlos. Solo estatales a propósito: son iguales en toda España, así
 * que valen sea cual sea tu zona (la primera versión estaba cableada a Madrid y
 * se rompía para el resto). El empadronamiento, que también es de base, no entra
 * aquí porque es local y varía por municipio; vive en "Documentos base".
 *
 * Cuando haya uso real, esta lista debería salir de los datos (lo más buscado),
 * no de nuestro criterio.
 */
export const destacados: string[] = [
  "renovacion-dni", // lo necesita todo el mundo, y de él cuelgan el pasaporte y el certificado
  "certificado-digital-fnmt", // la puerta a todo lo que se hace por internet
  "dni-primera-vez", // el caso que originó este proyecto: el primer DNI de un niño
];
