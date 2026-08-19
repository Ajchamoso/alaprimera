# Revisión del catálogo contra fuentes oficiales (agosto 2026)

Bitácora del rastreo y cotejo de las 22 fichas entre el 10 y el 19 de agosto de 2026.

El listón de FR-020b tiene dos comprobaciones: la cita debe seguir en una fuente oficial y
debe respaldar el requisito concreto al que está unida. Encontrar todas las cadenas en una
página no basta para sellar una ficha.

**Fichas revisadas:** 22 de 22 · **Selladas:** 13 · **Pendientes:** 9 · **Fuentes caídas:** 0

## Selladas

| Ficha | Fecha |
|---|---|
| `beca-comedor-madrid` | 10/08/2026 |
| `transferencia-vehiculo` | 11/08/2026 |
| `apoderamiento` | 19/08/2026 |
| `beca-comedor-aragon` | 19/08/2026 |
| `dni-primera-vez` | 19/08/2026 |
| `empadronamiento-zaragoza` | 19/08/2026 |
| `familia-numerosa-aragon` | 19/08/2026 |
| `familia-numerosa-madrid` | 19/08/2026 |
| `matriculacion-vehiculo` | 19/08/2026 |
| `pasaporte` | 19/08/2026 |
| `renovacion-dni` | 19/08/2026 |
| `tarjeta-sanitaria-aragon` | 19/08/2026 |
| `tarjeta-sanitaria-madrid` | 19/08/2026 |

Las once fichas del segundo lote conservan correspondencia entre el título del requisito,
la cita y la fuente. En DNI, pasaporte y DGT algunas citas están en subpáginas oficiales
enlazadas desde la ficha principal; forman parte del cotejo y no deben confundirse con el
texto de navegación.

## Pendientes

| Ficha | Qué falta |
|---|---|
| `carnet-conducir` | Las citas corregidas necesitan un nuevo cotejo humano antes de devolver el sello. |
| `certificado-nacimiento` | El contenido de Justicia se carga dentro de acordeones dinámicos. |
| `empadronamiento-madrid` | El portal municipal bloquea la descarga automática. |
| `clave` | La fuente devuelve contenido incompleto al rastreo. |
| `certificado-digital-fnmt` | Los requisitos viven en acordeones de la sede. |
| `inscripcion-nacimiento` | El contenido de Justicia necesita navegador real. |
| `certificado-defuncion` | Quedan por cotejar identificación, Cl@ve y canal por correo. |
| `ultimas-voluntades` | Quedan tasa, Cl@ve y modelo 790 en acordeones. |
| `seguros-fallecimiento` | Quedan tasa, Cl@ve y modelo 790 en acordeones. |

## Aprendizajes del rastreo

- Una respuesta HTTP 200 puede contener solo un menú o una página de error.
- Una coincidencia literal no prueba por sí sola que la cita respalde el requisito.
- Las fuentes enlazadas desde una página principal también deben conservarse en el recorrido
  de revisión cuando de ellas sale un dato, como las tasas del DNI y el pasaporte.
- `mjusticia.gob.es`, la FNMT y algunos portales municipales requieren navegador real.

## Calendario

| Acción | Fichas | Cuándo |
|---|---|---|
| Nuevo cotejo de `carnet-conducir` | 1 | Antes de volver a sellarla |
| Cotejo con navegador | Las otras 8 pendientes | Antes del directo de septiembre |
| Recotejo general | Las 22 | Enero de 2027, con tasas y convocatorias nuevas |
