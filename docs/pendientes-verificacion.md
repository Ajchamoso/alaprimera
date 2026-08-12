# Revisión del catálogo contra fuentes oficiales (agosto 2026)

Bitácora del rastreo de las 22 fichas del catálogo, 10 y 11 de agosto de 2026.

El listón para sellar es el de FR-020b: una ficha solo pasa a "verificada" cuando cada cita
literal se localiza en su fuente oficial y sigue diciendo lo mismo. Que la página responda o
tenga contenido no es un cotejo. Cuando el rastreo no puede resolver la comparación (acordeones,
menús internos, contenido que exige JavaScript), la ficha se queda "por verificar" y la resuelve
una persona con el navegador (FR-022).

**Fichas rastreadas:** 22 de 22 · **Selladas tras cotejo completo:** 2 · **Fuentes caídas:** 0

## Selladas: todas sus citas localizadas y coincidentes

| Ficha | Sellada | Citas cotejadas |
|-------|---------|-----------------|
| `beca-comedor-madrid` | 10/08/2026 | 8 citas: destinatarios, renta límite, alternativas (RMI, IMV, víctimas), plaza matriculada, convocatoria del 29/04 al 28/05/2026 |
| `transferencia-vehiculo` | 11/08/2026 | Plazo de 30 días, tasas 55,70 € y 27,85 €, contrato firmado |

## Cotejo casi completo

| Ficha | Estado |
|-------|--------|
| `carnet-conducir` | 4 de 5 citas localizadas (residencia en España, 90 días del psicotécnico, foto 32x26 mm, 2 años de validez del examen). Queda una por encontrar: con el navegador debería salir en minutos. |
| `matriculacion-vehiculo` | Tasas localizadas (99,77 € y 27,85 €); falta cotejar la definición. |

## El rastreo llega a la fuente, pero no a las citas

La página responde, pero las citas literales viven en acordeones o menús que el rastreo por HTTP
no despliega. Pendientes de cotejo con navegador real:

| Ficha | Dónde se esconden las citas |
|-------|------------------------------|
| `certificado-defuncion` | def-r2 (Cl@ve) y def-r3 (DNI/correo), en los acordeones "¿Qué necesito?" y "¿Cómo hacerlo?". La definición sí se localizó. |
| `ultimas-voluntades` | uv-r1 (tasa 3,86 €), uv-r2 (Cl@ve) y uv-r3 (modelo 790), en acordeones. Definición localizada. |
| `seguros-fallecimiento` | seg-r1 (tasa 3,86 €), seg-r2 (Cl@ve) y seg-r3 (modelo 790), en acordeones. Definición localizada. |
| `inscripcion-nacimiento`, `certificado-nacimiento` | mjusticia.gob.es carga los requisitos con JavaScript. |
| `certificado-digital-fnmt` | Acordeones de la sede de la FNMT. |
| `clave`, `apoderamiento` | administracion.gob.es devuelve el esqueleto de la página sin el contenido. |
| `empadronamiento-madrid`, `empadronamiento-zaragoza` | Portales municipales con el contenido repartido por secciones. |
| `tarjeta-sanitaria-madrid`, `tarjeta-sanitaria-aragon` | Citas en menús internos de los portales autonómicos. |
| `familia-numerosa-madrid`, `familia-numerosa-aragon` | Citas en menús internos de los portales autonómicos. |
| `beca-comedor-aragon` | Citas en menús internos del portal autonómico. |
| `renovacion-dni`, `dni-primera-vez`, `pasaporte` | Contenido dinámico, detectado ya en la sesión del 10/08. |

**Siguiente paso:** abrir cada fuente en el navegador, desplegar los acordeones y buscar la cita
exacta entre « ». Cada ficha resuelta se sella con `npm run verificar <slug>`.

## Notas técnicas del rastreo

- **mjusticia.gob.es**: los requisitos van en acordeones JavaScript; las definiciones sí están en
  el HTML estático.
- **sede.dgt.gob.es**: codificación ISO-8859-1 (la `á` llega como `ã´`); las búsquedas por regex
  necesitan flexibilidad.
- **madrid.es y aragon.es**: portales con navegación compleja y requisitos anidados en menús por
  secciones.
- Las citas cortas (tasas, plazos) se localizan mejor que las definiciones extensas.

## Calendario

| Acción | Fichas | Cuándo |
|--------|--------|--------|
| Cotejo con navegador y sellado | Las 20 pendientes | Antes del directo de septiembre |
| Recotejo general | Las 22 | Enero de 2027 (actualización de tasas y convocatorias) |
