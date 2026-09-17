import type { TramiteContenido } from "@/lib/types";
import { apoderamiento } from "./apoderamiento";
import { becaComedorAragon } from "./beca-comedor-aragon";
import { becaComedorMadrid } from "./beca-comedor-madrid";
import { carnetConducir } from "./carnet-conducir";
import { certificadoDefuncion } from "./certificado-defuncion";
import { certificadoDigitalFnmt } from "./certificado-digital-fnmt";
import { certificadoNacimiento } from "./certificado-nacimiento";
import { clave } from "./clave";
import { dniPrimeraVez } from "./dni-primera-vez";
import { empadronamientoMadrid } from "./empadronamiento-madrid";
import { empadronamientoZaragoza } from "./empadronamiento-zaragoza";
import { familiaNumerosaAragon } from "./familia-numerosa-aragon";
import { familiaNumerosaMadrid } from "./familia-numerosa-madrid";
import { inscripcionNacimiento } from "./inscripcion-nacimiento";
import { matriculacionVehiculo } from "./matriculacion-vehiculo";
import { pasaporte } from "./pasaporte";
import { renovacionDni } from "./renovacion-dni";
import { segurosFallecimiento } from "./seguros-fallecimiento";
import { tarjetaSanitariaAragon } from "./tarjeta-sanitaria-aragon";
import { tarjetaSanitariaMadrid } from "./tarjeta-sanitaria-madrid";
import { transferenciaVehiculo } from "./transferencia-vehiculo";
import { ultimasVoluntades } from "./ultimas-voluntades";

/**
 * Fichas del catálogo.
 *
 * ⚠️ REGLA DE ORO (FR-019): el contenido sale de la fuente oficial, nunca de la
 * memoria de un modelo. Cada requisito lleva su cita literal dentro de su
 * `explicacion`, precedida de "Fuente:".
 *
 * Aquí solo va CONTENIDO. Quién ha verificado cada ficha y cuándo vive en el
 * registro (`verificaciones.ts`): una ficha que no esté allí sale como "generada
 * por IA — sin verificar", que es la verdad hasta que alguien la coteje.
 *
 * Flujo de curación: se extrae de la fuente con IA (con cita obligatoria; sin
 * cita, el campo va vacío) → se vuelca a BD con `npm run db:seed` → una persona
 * revisa y sella. Ver docs/curacion.md.
 */
export const tramites: TramiteContenido[] = [
  apoderamiento,
  becaComedorAragon,
  becaComedorMadrid,
  carnetConducir,
  certificadoDefuncion,
  certificadoDigitalFnmt,
  certificadoNacimiento,
  clave,
  dniPrimeraVez,
  empadronamientoMadrid,
  empadronamientoZaragoza,
  familiaNumerosaAragon,
  familiaNumerosaMadrid,
  inscripcionNacimiento,
  matriculacionVehiculo,
  pasaporte,
  renovacionDni,
  segurosFallecimiento,
  tarjetaSanitariaAragon,
  tarjetaSanitariaMadrid,
  transferenciaVehiculo,
  ultimasVoluntades,
];
