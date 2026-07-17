/**
 * POR DÓNDE EMPEZAR
 *
 * Los trámites que se ofrecen a quien llega sin saber qué buscar. Cuatro, en
 * orden: más de eso deja de ser un punto de entrada y vuelve a ser una lista.
 *
 * El criterio NO es "los más populares": no tenemos uso real que medir, así que
 * decirlo sería inventarnos el dato — justo lo que este producto no hace. El
 * criterio es **los cimientos**: son los trámites de los que cuelgan los demás,
 * y eso no es una opinión, está en el grafo de prerrequisitos. Si Marta no sabe
 * por dónde empezar, empieza por lo que le van a pedir de todas formas.
 *
 * Deliberadamente fuera: la beca de comedor. Es nuestra cadena estrella, pero su
 * plazo está cerrado — destacar en portada algo que hoy nadie puede solicitar
 * sería justo el "atasco a mitad" que prometemos evitar. Cuando abra la próxima
 * convocatoria, su sitio está aquí.
 *
 * Cuando haya uso real (los "sí" de "¿salió a la primera?", las búsquedas que
 * funcionan), esta lista debería salir de los datos y no de nuestro criterio.
 */
export const destacados: string[] = [
  "renovacion-dni", // lo necesita todo el mundo, y el pasaporte y el certificado cuelgan de él
  "certificado-digital-fnmt", // la puerta a todo lo que se hace por internet
  "empadronamiento-madrid", // la base de lo autonómico: sanidad, becas, familia numerosa
  "dni-primera-vez", // el caso que originó este proyecto: el primer DNI de un niño
];
